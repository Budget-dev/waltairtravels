import { Booking, BookingStatus } from '../types';
import { db, auth, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from '../firebase';

const LOCAL_BOOKINGS_KEY = 'waltair_user_bookings';

// Helper to get admin auth header if signed in
async function getAdminAuthHeaders(): Promise<Record<string, string>> {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    console.debug('[dbSync] Auth token read note:', e);
  }
  return {};
}

// Helper to read local bookings safely
export function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    const list: Booking[] = raw ? JSON.parse(raw) : [];
    // Filter out legacy mock seed data so user only sees their real trips
    return list.filter(b => b.id !== 'seed-wal-84920' && b.bookingRef !== 'WAL-84920');
  } catch (err) {
    console.warn('[dbSync] Local storage read error:', err);
    return [];
  }
}

// Helper to write local bookings safely
export function setLocalBookings(bookings: Booking[]) {
  try {
    // Ensure mock data is never persisted
    const clean = bookings.filter(b => b.id !== 'seed-wal-84920' && b.bookingRef !== 'WAL-84920');
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(clean));
  } catch (err) {
    console.warn('[dbSync] Local storage write error:', err);
  }
}

/**
 * Universal multi-tier fetch:
 * 1. Reads instant local cache (0ms latency, works offline)
 * 2. Fetches from Server Persistent FileDatabase (/api/bookings with user filter or admin auth)
 * 3. Safely queries Cloud Firestore (with permission-denied / offline error handling)
 * 4. Combines, deduplicates, and saves back to local storage
 */
export async function syncFetchBookings(userFilter?: { email?: string; phone?: string; userId?: string }): Promise<Booking[]> {
  const localList = getLocalBookings();
  const bookingsMap = new Map<string, Booking>();

  // Populate local real bookings first
  localList.forEach(b => {
    const key = b.bookingRef || b.id || '';
    if (key && key !== 'WAL-84920') bookingsMap.set(key, b);
  });

  // 1. Fetch from Express Backend API (with user query or admin auth header)
  try {
    const authHeaders = await getAdminAuthHeaders();
    let url = '/api/bookings';
    const params = new URLSearchParams();

    // Determine query filter for current user
    let email = userFilter?.email;
    let phone = userFilter?.phone;
    let userId = userFilter?.userId;

    if (!email && !phone && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('waltair_user_session');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.email) email = parsed.email;
          if (parsed.phone) phone = parsed.phone;
          if (parsed.uid) userId = parsed.uid;
        }
      } catch {}
    }

    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    if (userId) params.set('userId', userId);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: authHeaders
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.bookings)) {
        json.bookings.forEach((serverB: Booking) => {
          const key = serverB.bookingRef || serverB.id || '';
          if (!key || key === 'WAL-84920') return;
          const existing = bookingsMap.get(key);
          if (!existing) {
            bookingsMap.set(key, serverB);
          } else {
            // Merge: preserve local status if locally updated recently
            const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
            const serverTime = new Date(serverB.updatedAt || serverB.createdAt || 0).getTime();
            if (serverTime >= localTime) {
              bookingsMap.set(key, { ...existing, ...serverB });
            }
          }
        });
      }
    }
  } catch (apiErr) {
    console.debug('[dbSync] Server bookings API note (offline/connecting):', apiErr);
  }

  // 2. Fetch from Firebase Firestore (Graceful try/catch for disabled Cloud Firestore API)
  try {
    const q = collection(db, 'bookings');
    const snapshot = await getDocs(q);
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as Booking;
      const remoteB: Booking = { id: docSnap.id, ...data };
      const key = remoteB.bookingRef || remoteB.id || '';
      if (!key || key === 'WAL-84920') return;
      const existing = bookingsMap.get(key);
      if (!existing) {
        bookingsMap.set(key, remoteB);
      } else {
        const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
        const remoteTime = new Date(remoteB.updatedAt || remoteB.createdAt || 0).getTime();
        if (remoteTime >= localTime) {
          bookingsMap.set(key, { ...existing, ...remoteB, id: docSnap.id });
        }
      }
    });
  } catch (fsErr) {
    // Cloud Firestore disabled or offline - local storage + server DB seamlessly handles it!
    console.debug('[dbSync] Cloud Firestore fetch note (resilient fallback active):', fsErr);
  }

  const combinedList = Array.from(bookingsMap.values()).sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Keep local storage updated with real bookings only
  setLocalBookings(combinedList);
  return combinedList;
}

/**
 * Universal save: writes to Local Storage, Server DB, and Firestore
 */
export async function syncSaveBooking(booking: Booking): Promise<Booking> {
  const prepared: Booking = {
    ...booking,
    id: booking.id || `local-${Date.now()}`,
    bookingRef: booking.bookingRef || `WAL-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: booking.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Immediately store into LocalStorage
  const local = getLocalBookings();
  const existingIdx = local.findIndex(
    b => b.bookingRef === prepared.bookingRef || (b.id && b.id === prepared.id)
  );
  if (existingIdx >= 0) {
    local[existingIdx] = prepared;
  } else {
    local.unshift(prepared);
  }
  setLocalBookings(local);

  // 2. Dispatch instant reactive event across all open tabs/views
  try {
    window.dispatchEvent(new CustomEvent('waltair_bookings_changed', { detail: prepared }));
  } catch {}

  // 3. Persist to Backend API in parallel
  fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prepared),
  }).catch(err => {
    console.debug('[dbSync] Server DB POST note:', err);
  });

  // 4. Persist to Cloud Firestore in parallel (non-blocking, safe catch)
  addDoc(collection(db, 'bookings'), prepared)
    .then(docRef => {
      prepared.id = docRef.id;
    })
    .catch(err => {
      console.debug('[dbSync] Cloud Firestore addDoc note (local/server store secured):', err);
    });

  return prepared;
}

/**
 * Universal status update: updates Local Storage, Server DB, and Firestore
 */
export async function syncUpdateBookingStatus(
  bookingId: string | undefined,
  bookingRef: string | undefined,
  newStatus: BookingStatus,
  note?: string
): Promise<void> {
  const targetKey = bookingRef || bookingId;
  if (!targetKey) return;

  // 1. Update LocalStorage immediately
  const local = getLocalBookings();
  const updatedLocal = local.map(b => {
    if (b.bookingRef === targetKey || b.id === targetKey) {
      return {
        ...b,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    }
    return b;
  });
  setLocalBookings(updatedLocal);

  // 2. Dispatch reactive event
  try {
    window.dispatchEvent(
      new CustomEvent('waltair_bookings_changed', {
        detail: { bookingId, bookingRef, newStatus }
      })
    );
  } catch {}

  // 3. Call backend PATCH API
  getAdminAuthHeaders().then(authHeaders => {
    fetch(`/api/bookings/${encodeURIComponent(targetKey)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({ status: newStatus, note }),
    }).catch(err => {
      console.debug('[dbSync] Server DB PATCH note:', err);
    });
  });

  // 4. Update Firestore in background if document exists
  if (bookingId && !bookingId.startsWith('local-') && !bookingId.startsWith('seed-')) {
    updateDoc(doc(db, 'bookings', bookingId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }).catch(err => {
      console.debug('[dbSync] Cloud Firestore updateDoc note:', err);
    });
  }
}

/**
 * Universal delete: removes from Local Storage, Server DB, and Firestore
 */
export async function syncDeleteBooking(
  bookingId: string | undefined,
  bookingRef: string | undefined
): Promise<void> {
  const targetKey = bookingRef || bookingId;
  if (!targetKey) return;

  // 1. Remove from LocalStorage
  const local = getLocalBookings();
  const filtered = local.filter(b => b.bookingRef !== targetKey && b.id !== targetKey);
  setLocalBookings(filtered);

  // 2. Dispatch reactive event
  try {
    window.dispatchEvent(
      new CustomEvent('waltair_bookings_changed', {
        detail: { deleted: true, bookingId, bookingRef }
      })
    );
  } catch {}

  // 3. Call backend DELETE API
  getAdminAuthHeaders().then(authHeaders => {
    fetch(`/api/bookings/${encodeURIComponent(targetKey)}`, {
      method: 'DELETE',
      headers: authHeaders
    }).catch(err => {
      console.debug('[dbSync] Server DB DELETE note:', err);
    });
  });

  // 4. Delete from Firestore in background
  if (bookingId && !bookingId.startsWith('local-') && !bookingId.startsWith('seed-')) {
    deleteDoc(doc(db, 'bookings', bookingId)).catch(err => {
      console.debug('[dbSync] Cloud Firestore deleteDoc note:', err);
    });
  }
}

