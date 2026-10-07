import { Booking, BookingStatus } from '../types';
import { db, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from '../firebase';

const LOCAL_BOOKINGS_KEY = 'waltair_user_bookings';

// Helper to read local bookings safely
export function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[dbSync] Local storage read error:', err);
    return [];
  }
}

// Helper to write local bookings safely
export function setLocalBookings(bookings: Booking[]) {
  try {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.warn('[dbSync] Local storage write error:', err);
  }
}

/**
 * Universal multi-tier fetch:
 * 1. Reads instant local cache (0ms latency, works offline)
 * 2. Fetches from Server Persistent FileDatabase (/api/bookings)
 * 3. Safely queries Cloud Firestore (with permission-denied / offline error handling)
 * 4. Combines, deduplicates, and saves back to local storage
 */
export async function syncFetchBookings(): Promise<Booking[]> {
  const localList = getLocalBookings();
  const bookingsMap = new Map<string, Booking>();

  // Populate local bookings first
  localList.forEach(b => {
    const key = b.bookingRef || b.id || '';
    if (key) bookingsMap.set(key, b);
  });

  // 1. Fetch from Express Backend API
  try {
    const res = await fetch('/api/bookings', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.bookings)) {
        json.bookings.forEach((serverB: Booking) => {
          const key = serverB.bookingRef || serverB.id || '';
          if (!key) return;
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
      if (!key) return;
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

  // 3. If completely empty (first time install), provide initial seed
  if (bookingsMap.size === 0) {
    const seedToday = new Date().toISOString().split('T')[0];
    const initialBooking: Booking = {
      id: 'seed-wal-84920',
      bookingRef: 'WAL-84920',
      customerName: 'Suresh Varma',
      customerPhone: '9848012345',
      customerEmail: 'suresh.varma@example.com',
      serviceType: 'airport',
      subType: 'pickup',
      pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
      dropoffLocation: 'Siripuram Circle & Waltair Uplands, Visakhapatnam',
      travelDate: seedToday,
      pickupTime: '11:00',
      vehicleCategory: 'Sedan',
      vehicleName: 'Maruti Suzuki Dzire',
      estimatedDistanceKm: 42,
      baseFare: 550,
      distanceFare: 351,
      tollCharges: 140,
      gstAmount: 52,
      totalFare: 1093,
      paymentMethod: 'cash_to_driver',
      status: 'on_the_way',
      driver: {
        name: 'K. Satish Varma',
        phone: '+91 98480 23456',
        vehicleNumber: 'AP 31 TH 7842',
        vehicleModel: 'Maruti Suzuki Dzire (White)',
        rating: 4.9,
        totalTrips: 1420,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        currentLat: 17.729,
        currentLng: 83.310,
        etaMinutes: 8
      },
      otp: '4821',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      city: 'Visakhapatnam, IN',
      isRegistered: false
    };
    bookingsMap.set(initialBooking.bookingRef, initialBooking);
  }

  const combinedList = Array.from(bookingsMap.values()).sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Keep local storage updated
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
  fetch(`/api/bookings/${encodeURIComponent(targetKey)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus, note }),
  }).catch(err => {
    console.debug('[dbSync] Server DB PATCH note:', err);
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
  fetch(`/api/bookings/${encodeURIComponent(targetKey)}`, {
    method: 'DELETE',
  }).catch(err => {
    console.debug('[dbSync] Server DB DELETE note:', err);
  });

  // 4. Delete from Firestore in background
  if (bookingId && !bookingId.startsWith('local-') && !bookingId.startsWith('seed-')) {
    deleteDoc(doc(db, 'bookings', bookingId)).catch(err => {
      console.debug('[dbSync] Cloud Firestore deleteDoc note:', err);
    });
  }
}
