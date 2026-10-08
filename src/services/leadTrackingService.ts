import { 
  db, 
  auth,
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from '../firebase';
import { LeadFootprint, LeadStatus, RegisteredUserProfile } from '../types';

const LEAD_SESSION_KEY = 'waltair_lead_session_id';
const LOCAL_LEADS_KEY = 'waltair_local_leads';

async function getAdminAuthHeaders(): Promise<Record<string, string>> {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    console.debug('[leadTracking] Auth token read note:', e);
  }
  return {};
}


/**
 * Retrieve or create persistent session ID for the active booking attempt.
 */
export function getOrCreateLeadSessionId(): string {
  try {
    let id = sessionStorage.getItem(LEAD_SESSION_KEY);
    if (!id) {
      id = `lead-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      sessionStorage.setItem(LEAD_SESSION_KEY, id);
    }
    return id;
  } catch {
    return `lead-${Date.now()}`;
  }
}

/**
 * Reset lead session ID after a successful booking to start a clean footprint for future rides.
 */
export function resetLeadSessionId(): string {
  try {
    const newId = `lead-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    sessionStorage.setItem(LEAD_SESSION_KEY, newId);
    return newId;
  } catch {
    return `lead-${Date.now()}`;
  }
}

// Local helper to read logged in user
function getLoggedInUser() {
  try {
    const raw = localStorage.getItem('waltair_user_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// In-memory debounce timers map
const debounceTimers: Record<string, any> = {};

/**
 * Real-time Footprint & Lead Capture:
 * Triggers as soon as a user (guest or registered) fills or changes ANY field!
 */
export function trackFieldFootprint(partialData: Partial<LeadFootprint>) {
  const sessionId = partialData.leadSessionId || getOrCreateLeadSessionId();
  const loggedInUser = getLoggedInUser();

  // Detect device
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const deviceType: 'mobile' | 'desktop' | 'tablet' = isMobile ? 'mobile' : 'desktop';

  // Build list of non-empty fields
  const filledFields: string[] = [];
  if (partialData.customerPhone) filledFields.push('phone');
  if (partialData.customerName) filledFields.push('name');
  if (partialData.customerEmail) filledFields.push('email');
  if (partialData.pickupLocation) filledFields.push('pickup');
  if (partialData.dropoffLocation) filledFields.push('dropoff');
  if (partialData.travelDate) filledFields.push('date');
  if (partialData.pickupTime) filledFields.push('time');
  if (partialData.serviceType) filledFields.push('service');
  if (partialData.vehicleName || partialData.vehicleCategory) filledFields.push('vehicle');

  // Determine current status
  const currentStatus: LeadStatus = partialData.status || (filledFields.length >= 3 ? 'partial' : 'filling');

  // Merge with previously stored lead data if any
  let localLeads: LeadFootprint[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    localLeads = raw ? JSON.parse(raw) : [];
  } catch {
    localLeads = [];
  }

  const existingLead = localLeads.find(l => l.leadSessionId === sessionId);

  const fullLead: LeadFootprint = {
    id: sessionId,
    leadSessionId: sessionId,
    customerPhone: partialData.customerPhone || existingLead?.customerPhone || loggedInUser?.phone || '',
    customerName: partialData.customerName || existingLead?.customerName || loggedInUser?.name || '',
    customerEmail: partialData.customerEmail || existingLead?.customerEmail || loggedInUser?.email || '',
    isRegistered: partialData.isRegistered ?? (loggedInUser ? true : existingLead?.isRegistered ?? false),
    userId: partialData.userId || loggedInUser?.uid || existingLead?.userId,
    serviceType: partialData.serviceType || existingLead?.serviceType || 'airport',
    subType: partialData.subType || existingLead?.subType || 'pickup',
    pickupLocation: partialData.pickupLocation || existingLead?.pickupLocation || '',
    dropoffLocation: partialData.dropoffLocation || existingLead?.dropoffLocation || '',
    travelDate: partialData.travelDate || existingLead?.travelDate || new Date().toISOString().split('T')[0],
    pickupTime: partialData.pickupTime || existingLead?.pickupTime || '10:30',
    vehicleCategory: partialData.vehicleCategory || existingLead?.vehicleCategory || '',
    vehicleName: partialData.vehicleName || existingLead?.vehicleName || '',
    estimatedDistanceKm: partialData.estimatedDistanceKm || existingLead?.estimatedDistanceKm || 0,
    estimatedFare: partialData.estimatedFare || existingLead?.estimatedFare || 0,
    lastFieldChanged: partialData.lastFieldChanged || existingLead?.lastFieldChanged || 'Field modified',
    filledFields: Array.from(new Set([...(existingLead?.filledFields || []), ...filledFields])),
    status: existingLead?.status === 'converted' ? 'converted' : currentStatus,
    source: partialData.source || existingLead?.source || 'hero',
    device: deviceType,
    createdAt: existingLead?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    convertedBookingRef: existingLead?.convertedBookingRef,
    notes: existingLead?.notes
  };

  // 1. Immediately store in LocalStorage for instantaneous UI reflection & offline backup
  try {
    const updatedLocal = [fullLead, ...localLeads.filter(l => l.leadSessionId !== sessionId)];
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updatedLocal));
  } catch (err) {
    console.warn('LocalStorage lead save note:', err);
  }

  // 2. Dispatch custom in-browser event for open admin views
  try {
    window.dispatchEvent(new CustomEvent('waltair_lead_captured', { detail: fullLead }));
  } catch {
    // ignore
  }

  // 3. Debounced save to Server DB and Cloud Firestore (700ms debounce to prevent high write volume on fast typing)
  if (debounceTimers[sessionId]) {
    clearTimeout(debounceTimers[sessionId]);
  }

  debounceTimers[sessionId] = setTimeout(async () => {
    // A. Backend Persistent Server DB
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullLead)
      }).catch(() => {});
    } catch {}

    // B. Cloud Firestore (non-blocking, resilient)
    try {
      await setDoc(doc(db, 'leads', sessionId), fullLead, { merge: true });
    } catch (err) {
      console.debug('Firestore lead sync note (offline/cache resilient):', err);
    }
  }, 700);
}

export async function markLeadConverted(
  bookingRef: string, 
  sessionId?: string,
  bookingDetails?: Partial<LeadFootprint>
) {
  const currentSessionId = sessionId || getOrCreateLeadSessionId();

  try {
    const updatePayload: Partial<LeadFootprint> = {
      status: 'converted' as LeadStatus,
      convertedBookingRef: bookingRef,
      updatedAt: new Date().toISOString(),
      ...(bookingDetails?.customerName ? { customerName: bookingDetails.customerName } : {}),
      ...(bookingDetails?.customerPhone ? { customerPhone: bookingDetails.customerPhone } : {}),
      ...(bookingDetails?.customerEmail ? { customerEmail: bookingDetails.customerEmail } : {}),
      ...(bookingDetails?.pickupLocation ? { pickupLocation: bookingDetails.pickupLocation } : {}),
      ...(bookingDetails?.dropoffLocation ? { dropoffLocation: bookingDetails.dropoffLocation } : {}),
      ...(bookingDetails?.travelDate ? { travelDate: bookingDetails.travelDate } : {}),
      ...(bookingDetails?.pickupTime ? { pickupTime: bookingDetails.pickupTime } : {}),
      ...(bookingDetails?.vehicleName ? { vehicleName: bookingDetails.vehicleName } : {}),
      ...(bookingDetails?.vehicleCategory ? { vehicleCategory: bookingDetails.vehicleCategory } : {}),
      ...(bookingDetails?.lastFieldChanged ? { lastFieldChanged: bookingDetails.lastFieldChanged } : { lastFieldChanged: 'Booking Confirmed' })
    };

    // Update local storage
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    const localLeads: LeadFootprint[] = raw ? JSON.parse(raw) : [];
    const existing = localLeads.find(l => l.leadSessionId === currentSessionId);
    
    if (existing) {
      const updated = localLeads.map(l => {
        if (l.leadSessionId === currentSessionId) {
          return {
            ...l,
            ...updatePayload
          };
        }
        return l;
      });
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
    } else {
      const newConvertedLead: LeadFootprint = {
        id: currentSessionId,
        leadSessionId: currentSessionId,
        customerPhone: bookingDetails?.customerPhone || '',
        customerName: bookingDetails?.customerName || '',
        customerEmail: bookingDetails?.customerEmail || '',
        isRegistered: bookingDetails?.isRegistered ?? false,
        serviceType: bookingDetails?.serviceType || 'airport',
        subType: bookingDetails?.subType || 'pickup',
        pickupLocation: bookingDetails?.pickupLocation || '',
        dropoffLocation: bookingDetails?.dropoffLocation || '',
        travelDate: bookingDetails?.travelDate || new Date().toISOString().split('T')[0],
        pickupTime: bookingDetails?.pickupTime || '10:30',
        vehicleName: bookingDetails?.vehicleName || '',
        vehicleCategory: bookingDetails?.vehicleCategory || '',
        estimatedDistanceKm: bookingDetails?.estimatedDistanceKm || 0,
        estimatedFare: bookingDetails?.estimatedFare || 0,
        lastFieldChanged: 'Booking Confirmed',
        filledFields: ['phone', 'name', 'pickup', 'dropoff', 'date', 'time', 'vehicle'],
        status: 'converted',
        source: 'booking_confirmed',
        device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
        convertedBookingRef: bookingRef,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify([newConvertedLead, ...localLeads]));
    }

    // Update Firestore
    await setDoc(doc(db, 'leads', currentSessionId), updatePayload, { merge: true });

    // Reset session ID so subsequent actions start a fresh lead
    resetLeadSessionId();
  } catch (err) {
    console.warn('Mark lead converted note:', err);
  }
}

/**
 * Update lead status by Admin (e.g. mark as Contacted, Converted, Lost)
 */
export async function updateLeadStatus(leadId: string, newStatus: LeadStatus, notes?: string) {
  let updatedRecord: LeadFootprint | null = null;
  try {
    // 1. Local storage update
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    if (raw) {
      const localLeads: LeadFootprint[] = JSON.parse(raw);
      const updated = localLeads.map(l => {
        if (l.leadSessionId === leadId || l.id === leadId) {
          updatedRecord = {
            ...l,
            status: newStatus,
            notes: notes !== undefined ? notes : l.notes,
            updatedAt: new Date().toISOString()
          };
          return updatedRecord;
        }
        return l;
      });
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
    }

    // 2. Dispatch local notification
    if (updatedRecord) {
      window.dispatchEvent(new CustomEvent('waltair_lead_captured', { detail: updatedRecord }));
    }

    // 3. Backend Persistent Server DB
    getAdminAuthHeaders().then(authHeaders => {
      fetch(`/api/leads/${encodeURIComponent(leadId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status: newStatus, notes })
      }).catch(() => {});
    });

    // 4. Cloud Firestore update (safe catch)
    await updateDoc(doc(db, 'leads', leadId), {
      status: newStatus,
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.debug('Update lead status note:', err);
  }
}

/**
 * Delete a lead
 */
export async function deleteLead(leadId: string) {
  try {
    // 1. Local storage delete
    const raw = localStorage.getItem(LOCAL_LEADS_KEY);
    if (raw) {
      const localLeads: LeadFootprint[] = JSON.parse(raw);
      const updated = localLeads.filter(l => l.leadSessionId !== leadId && l.id !== leadId);
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
    }

    // 2. Dispatch event
    window.dispatchEvent(new CustomEvent('waltair_lead_captured', { detail: { id: leadId, deleted: true } }));

    // 3. Backend Persistent Server DB
    getAdminAuthHeaders().then(authHeaders => {
      fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
        headers: authHeaders
      }).catch(() => {});
    });

    // 4. Cloud Firestore delete (safe catch)
    await deleteDoc(doc(db, 'leads', leadId));
  } catch (err) {
    console.debug('Delete lead note:', err);
  }
}

/**
 * Real-time listener for all leads
 */
export function subscribeToLeads(callback: (leads: LeadFootprint[]) => void): () => void {
  // Read local leads first
  const getLocalLeads = (): LeadFootprint[] => {
    try {
      const raw = localStorage.getItem(LOCAL_LEADS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  callback(getLocalLeads());

  // 1. Fetch from Persistent Server DB
  getAdminAuthHeaders().then(authHeaders => {
    fetch('/api/leads', { cache: 'no-store', headers: authHeaders })
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json.leads)) {
          const local = getLocalLeads();
          const mergedMap = new Map<string, LeadFootprint>();
          local.forEach(l => mergedMap.set(l.leadSessionId || l.id || '', l));
          json.leads.forEach((serverLead: LeadFootprint) => {
            const key = serverLead.leadSessionId || serverLead.id || '';
            if (!key) return;
            const existing = mergedMap.get(key);
            if (!existing) {
              mergedMap.set(key, serverLead);
            } else {
              const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
              const serverTime = new Date(serverLead.updatedAt || serverLead.createdAt || 0).getTime();
              if (serverTime >= localTime) {
                mergedMap.set(key, serverLead);
              }
            }
          });

          const combined = Array.from(mergedMap.values()).sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(combined));
          callback(combined);
        }
      })
      .catch(() => {});
  });
  let unsubscribeFirestore = () => {};

  try {
    unsubscribeFirestore = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const remoteLeads: LeadFootprint[] = [];
      snapshot.forEach(docSnap => {
        remoteLeads.push({ id: docSnap.id, ...docSnap.data() } as LeadFootprint);
      });

      const local = getLocalLeads();
      const mergedMap = new Map<string, LeadFootprint>();
      local.forEach(l => mergedMap.set(l.leadSessionId || l.id || '', l));
      remoteLeads.forEach(r => {
        const key = r.leadSessionId || r.id || '';
        if (!key) return;
        const existing = mergedMap.get(key);
        if (!existing) {
          mergedMap.set(key, r);
        } else {
          const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
          const remoteTime = new Date(r.updatedAt || r.createdAt || 0).getTime();
          if (remoteTime >= localTime) {
            mergedMap.set(key, r);
          }
        }
      });

      const combined = Array.from(mergedMap.values()).sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(combined));
      callback(combined);
    }, (err) => {
      console.debug('Leads snapshot listener note:', err);
      callback(getLocalLeads());
    });
  } catch (err) {
    console.debug('Leads subscription error:', err);
  }

  // Also listen to window event for local instant updates
  const handleLocalEvent = (e: any) => {
    const lead = e.detail;
    const local = getLocalLeads();
    let updatedList: LeadFootprint[];

    if (lead?.deleted && lead?.id) {
      updatedList = local.filter(l => l.id !== lead.id && l.leadSessionId !== lead.id);
    } else if (lead?.leadSessionId || lead?.id) {
      const map = new Map<string, LeadFootprint>();
      local.forEach(l => map.set(l.leadSessionId || l.id || '', l));
      map.set(lead.leadSessionId || lead.id || '', lead as LeadFootprint);
      updatedList = Array.from(map.values());
    } else {
      updatedList = local;
    }

    const combined = updatedList.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    callback(combined);
  };

  window.addEventListener('waltair_lead_captured', handleLocalEvent);

  return () => {
    unsubscribeFirestore();
    window.removeEventListener('waltair_lead_captured', handleLocalEvent);
  };
}

/**
 * Real-time listener for registered users
 */
export function subscribeToUsers(callback: (users: RegisteredUserProfile[]) => void): () => void {
  // 1. Fetch from persistent backend with admin auth header
  getAdminAuthHeaders().then(authHeaders => {
    fetch('/api/users', { cache: 'no-store', headers: authHeaders })
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json?.users) && json.users.length > 0) {
          callback(json.users);
        }
      })
      .catch(() => {});
  });

  try {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList: RegisteredUserProfile[] = [];
      snapshot.forEach(docSnap => {
        userList.push({ uid: docSnap.id, ...docSnap.data() } as RegisteredUserProfile);
      });
      if (userList.length > 0) {
        callback(userList);
      }
    }, (err) => {
      console.warn('Users snapshot listener note:', err);
      // Fallback: check current user in local storage
      const saved = getLoggedInUser();
      if (saved) {
        callback([saved]);
      } else {
        callback([]);
      }
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Users subscribe error:', err);
    return () => {};
  }
}


/**
 * Web Audio API synthesizer chime to notify Admin when a new lead or booking is detected!
 */
export function playNotificationSound(type: 'lead' | 'booking' = 'lead') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'lead') {
      // Pleasant two-pitch notification chime (587Hz -> 880Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.12);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.45);
    } else {
      // Celebratory triad for confirmed booking (523Hz -> 659Hz -> 783Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.38);
      });
    }
  } catch (e) {
    // Audio autoplay restrictions or unsupported
  }
}
