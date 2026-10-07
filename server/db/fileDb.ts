import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial seed booking for realistic immediate data
function getInitialBookings() {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'seed-wal-84920',
      bookingRef: 'WAL-84920',
      customerName: 'Suresh Varma',
      customerPhone: '9848012345',
      customerEmail: 'suresh.varma@example.com',
      serviceType: 'airport',
      subType: 'pickup',
      pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
      dropoffLocation: 'Siripuram Circle & Waltair Uplands, Visakhapatnam',
      travelDate: today,
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
        currentLat: 17.729,
        currentLng: 83.310,
        etaMinutes: 8
      },
      otp: '4821',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      city: 'Visakhapatnam, IN',
      isRegistered: false
    },
    {
      id: 'seed-wal-92841',
      bookingRef: 'WAL-92841',
      customerName: 'Ravi Teja Naidu',
      customerPhone: '9440187654',
      customerEmail: 'ravi.naidu@gmail.com',
      serviceType: 'airport',
      subType: 'dropoff',
      pickupLocation: 'Rushikonda Beach Road, Visakhapatnam',
      dropoffLocation: 'Visakhapatnam Airport (VTZ)',
      travelDate: today,
      pickupTime: '15:30',
      vehicleCategory: 'SUV',
      vehicleName: 'Toyota Innova Crysta',
      estimatedDistanceKm: 28,
      baseFare: 750,
      distanceFare: 700,
      tollCharges: 80,
      gstAmount: 76,
      totalFare: 1606,
      paymentMethod: 'cash_to_driver',
      status: 'confirmed',
      otp: '6192',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      city: 'Visakhapatnam, IN',
      isRegistered: true
    }
  ];
}

// Initial seed leads
function getInitialLeads() {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'lead-seed-1',
      leadSessionId: 'lead-seed-1',
      customerName: 'Kiran Kumar',
      customerPhone: '9849054321',
      customerEmail: 'kiran.k@outlook.com',
      isRegistered: false,
      serviceType: 'airport',
      subType: 'pickup',
      pickupLocation: 'Visakhapatnam Airport (ASI / VTZ)',
      dropoffLocation: 'Dwaraka Nagar, Visakhapatnam',
      travelDate: today,
      pickupTime: '12:00',
      vehicleCategory: 'Sedan',
      vehicleName: 'Maruti Suzuki Dzire',
      estimatedDistanceKm: 14,
      estimatedFare: 650,
      lastFieldChanged: 'dropoff',
      filledFields: ['phone', 'name', 'pickup', 'dropoff', 'date', 'time'],
      status: 'contacted',
      source: 'hero',
      device: 'mobile',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      notes: 'Customer inquired for airport pickup; driver allocated.'
    },
    {
      id: 'lead-seed-2',
      leadSessionId: 'lead-seed-2',
      customerName: 'Ananya Sharma',
      customerPhone: '9123456780',
      customerEmail: 'ananya.sharma@yahoo.com',
      isRegistered: true,
      serviceType: 'outstation',
      subType: 'round_trip',
      pickupLocation: 'Siripuram, Vizag',
      dropoffLocation: 'Araku Valley Sightseeing, Vizag',
      travelDate: today,
      pickupTime: '06:30',
      vehicleCategory: 'SUV',
      vehicleName: 'Toyota Innova Crysta',
      estimatedDistanceKm: 230,
      estimatedFare: 4200,
      lastFieldChanged: 'vehicle',
      filledFields: ['phone', 'name', 'pickup', 'dropoff', 'date', 'time', 'vehicle'],
      status: 'converted',
      source: 'booking_confirmed',
      device: 'desktop',
      convertedBookingRef: 'WAL-84920',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString()
    }
  ];
}

// Initial registered users
function getInitialUsers() {
  return [
    {
      uid: 'usr_admin_waltair',
      name: 'Waltair Operations Dispatch',
      email: 'admin@waltaircabs.in',
      phone: '9848012345',
      totalBookings: 14,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
  ];
}

// Generic file reading with fallback and seed
function readJsonFile<T>(filePath: string, defaultFactory: () => T[]): T[] {
  ensureDataDir();
  try {
    if (!fs.existsSync(filePath)) {
      const initial = defaultFactory();
      fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultFactory();
  } catch (err) {
    console.warn(`[FileDb] Error reading ${filePath}, re-initializing default:`, err);
    const initial = defaultFactory();
    try {
      fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf-8');
    } catch {}
    return initial;
  }
}

// Generic file writing
function writeJsonFile<T>(filePath: string, data: T[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[FileDb] Error writing to ${filePath}:`, err);
    return false;
  }
}

export class FileDatabase {
  // ---- BOOKINGS ----
  public static getAllBookings(): any[] {
    return readJsonFile(BOOKINGS_FILE, getInitialBookings);
  }

  public static saveBooking(booking: any): any {
    const list = this.getAllBookings();
    const id = booking.id || `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const ref = booking.bookingRef || `WAL-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const record = {
      ...booking,
      id,
      bookingRef: ref,
      updatedAt: new Date().toISOString(),
      createdAt: booking.createdAt || new Date().toISOString()
    };

    const existingIndex = list.findIndex(
      (b: any) => (b.bookingRef && b.bookingRef === ref) || (b.id && b.id === id)
    );

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...record };
    } else {
      list.unshift(record);
    }

    writeJsonFile(BOOKINGS_FILE, list);
    return record;
  }

  public static updateBookingStatus(idOrRef: string, status: string, note?: string): any | null {
    const list = this.getAllBookings();
    const target = list.find((b: any) => b.id === idOrRef || b.bookingRef === idOrRef);
    if (!target) return null;

    target.status = status;
    target.updatedAt = new Date().toISOString();
    if (note) {
      if (!target.notes) target.notes = [];
      if (Array.isArray(target.notes)) {
        target.notes.push({ text: note, at: new Date().toISOString() });
      }
    }

    writeJsonFile(BOOKINGS_FILE, list);
    return target;
  }

  public static deleteBooking(idOrRef: string): boolean {
    const list = this.getAllBookings();
    const filtered = list.filter((b: any) => b.id !== idOrRef && b.bookingRef !== idOrRef);
    if (filtered.length !== list.length) {
      writeJsonFile(BOOKINGS_FILE, filtered);
      return true;
    }
    return false;
  }

  // ---- LEADS ----
  public static getAllLeads(): any[] {
    return readJsonFile(LEADS_FILE, getInitialLeads);
  }

  public static saveLead(lead: any): any {
    const list = this.getAllLeads();
    const id = lead.id || lead.leadSessionId || `lead_${Date.now()}`;
    const sessionId = lead.leadSessionId || id;

    const record = {
      ...lead,
      id,
      leadSessionId: sessionId,
      updatedAt: new Date().toISOString(),
      createdAt: lead.createdAt || new Date().toISOString()
    };

    const existingIndex = list.findIndex(
      (l: any) => (l.leadSessionId && l.leadSessionId === sessionId) || (l.id && l.id === id)
    );

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...record };
    } else {
      list.unshift(record);
    }

    writeJsonFile(LEADS_FILE, list);
    return record;
  }

  public static updateLeadStatus(idOrSessionId: string, status: string, notes?: string): any | null {
    const list = this.getAllLeads();
    const target = list.find((l: any) => l.id === idOrSessionId || l.leadSessionId === idOrSessionId);
    if (!target) return null;

    target.status = status;
    if (notes !== undefined) {
      target.notes = notes;
    }
    target.updatedAt = new Date().toISOString();

    writeJsonFile(LEADS_FILE, list);
    return target;
  }

  public static deleteLead(idOrSessionId: string): boolean {
    const list = this.getAllLeads();
    const filtered = list.filter((l: any) => l.id !== idOrSessionId && l.leadSessionId !== idOrSessionId);
    if (filtered.length !== list.length) {
      writeJsonFile(LEADS_FILE, filtered);
      return true;
    }
    return false;
  }

  // ---- USERS ----
  public static getAllUsers(): any[] {
    return readJsonFile(USERS_FILE, getInitialUsers);
  }

  public static saveUser(user: any): any {
    const list = this.getAllUsers();
    const uid = user.uid || `usr_${Date.now()}`;
    const record = {
      ...user,
      uid,
      lastActive: new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString()
    };

    const existingIndex = list.findIndex((u: any) => u.uid === uid || (u.email && u.email === user.email));
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...record };
    } else {
      list.unshift(record);
    }

    writeJsonFile(USERS_FILE, list);
    return record;
  }
}
