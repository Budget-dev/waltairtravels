export type ServiceCategory = 'airport' | 'outstation' | 'local' | 'packages';

export type TripSubType = 
  | 'pickup' 
  | 'drop' 
  | 'roundtrip' 
  | 'oneway' 
  | 'local_4hr' 
  | 'local_8hr' 
  | 'local_12hr' 
  | 'multicity'
  | 'package';

export type BookingStatus = 
  | 'pending'
  | 'confirmed' 
  | 'driver_assigned' 
  | 'on_the_way' 
  | 'arrived'
  | 'trip_started' 
  | 'completed' 
  | 'cancelled';

export interface DriverInfo {
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleModel: string;
  rating: number;
  totalTrips: number;
  photoUrl: string;
  currentLat?: number;
  currentLng?: number;
  etaMinutes?: number;
}

export interface Booking {
  id?: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  passengers?: string[];
  serviceType: ServiceCategory;
  subType: TripSubType;
  pickupLocation: string;
  dropoffLocation: string;
  travelDate: string;
  pickupTime: string;
  vehicleCategory: string;
  vehicleName: string;
  estimatedDistanceKm: number;
  baseFare?: number;
  distanceFare?: number;
  tollCharges?: number;
  gstAmount?: number;
  totalFare?: number;
  paymentMethod?: 'cash_to_driver' | 'online_advance' | 'full_prepaid';
  advancePaid?: number;
  balanceDue?: number;
  status: BookingStatus;
  driver?: DriverInfo;
  otp?: string;
  specialRequests?: string;
  createdAt: any;
  updatedAt?: any;
  city: string;
  isRegistered?: boolean;
  userId?: string;
  leadId?: string;
}

export type LeadStatus = 'filling' | 'partial' | 'abandoned' | 'converted' | 'contacted' | 'lost';

export interface LeadFootprint {
  id?: string;
  leadSessionId: string;
  customerPhone?: string;
  customerName?: string;
  customerEmail?: string;
  isRegistered: boolean;
  userId?: string;
  serviceType?: ServiceCategory;
  subType?: TripSubType;
  pickupLocation?: string;
  dropoffLocation?: string;
  travelDate?: string;
  pickupTime?: string;
  vehicleCategory?: string;
  vehicleName?: string;
  estimatedDistanceKm?: number;
  estimatedFare?: number;
  lastFieldChanged?: string;
  filledFields: string[];
  status: LeadStatus;
  source: 'hero' | 'fast_bar' | 'booking_page' | 'booking_modal' | 'booking_confirmed';
  device: 'mobile' | 'desktop' | 'tablet';
  createdAt: string;
  updatedAt: string;
  convertedBookingRef?: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  modelExamples: string;
  category: string;
  image: string;
  seats: number;
  luggageCount: number;
  ac: boolean;
  ratePerKm: number;
  baseFare: number;
  baseKm: number;
  extraKmRate: number;
  popularFor: string;
  features: string[];
}

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  distance: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  highlights: string[];
  itinerary: string[];
  vehicleIncluded: string;
  category: 'hills' | 'temples' | 'beaches' | 'waterfalls' | 'weekend';
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  startingPrice: number;
  category: 'airport' | 'outstation' | 'popular';
  description: string;
  image: string;
}

export interface CustomerReview {
  id?: string;
  name: string;
  rating: number;
  location: string;
  serviceUsed: string;
  date: string;
  comment: string;
  verified: boolean;
  avatar?: string;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: any;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  serviceType?: string;
  createdAt?: any;
}

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  date: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  coverImage?: string;
  tags?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string | null;
  phone?: string;
  photoURL?: string | null;
  isLoggedIn: boolean;
}

export interface RegisteredUserProfile {
  uid: string;
  name: string;
  email: string | null;
  phone?: string;
  photoURL?: string | null;
  role?: string;
  createdAt?: any;
  lastLoginAt?: any;
  totalBookings?: number;
  totalLeads?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'offer' | 'alert';
}
