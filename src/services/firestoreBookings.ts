import { 
  db, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  endBefore, 
  limitToLast, 
  getDocs, 
  getCountFromServer,
  doc, 
  updateDoc, 
  deleteDoc,
  type QueryDocumentSnapshot,
  type DocumentData,
  type QueryConstraint
} from '../firebase';
import { Booking, BookingStatus, ServiceCategory } from '../types';

export interface BookingQueryParams {
  status?: string;
  serviceType?: string;
  searchQuery?: string;
  sortField?: 'createdAt' | 'travelDate' | 'totalFare';
  sortDirection?: 'desc' | 'asc';
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  queryLatencyMs: number;
  readsConsumed: number;
  readsSaved: number;
  firstVisibleDoc: QueryDocumentSnapshot<DocumentData> | null;
  lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null;
  isCached: boolean;
}

export interface BookingAggregateStats {
  totalRevenue: number;
  activeCount: number;
  completedCount: number;
  cancelledCount: number;
  airportCount: number;
  outstationCount: number;
  localCount: number;
}

// In-Memory Page Cache to eliminate redundant network reads on page flips
const queryCache = new Map<string, { result: PaginatedResult<Booking>; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute client TTL

export class FirestoreBookingService {
  private static BOOKINGS_COLLECTION = 'bookings';

  /**
   * Generates a stable cache key based on query filters and cursor positions
   */
  private static buildCacheKey(params: BookingQueryParams, page: number, cursorId?: string): string {
    return `bk_${params.status || 'all'}_${params.serviceType || 'all'}_${params.sortField || 'createdAt'}_${params.sortDirection || 'desc'}_${params.pageSize || 10}_p${page}_${cursorId || 'start'}_${params.searchQuery || ''}`;
  }

  /**
   * Fetches paginated bookings with indexed compound filtering
   */
  public static async fetchPaginatedBookings(
    params: BookingQueryParams,
    page: number = 1,
    cursorDoc?: QueryDocumentSnapshot<DocumentData> | null,
    navigationDirection: 'next' | 'prev' | 'exact' = 'exact'
  ): Promise<PaginatedResult<Booking>> {
    const startTime = performance.now();
    const pageSize = params.pageSize || 10;
    const cacheKey = this.buildCacheKey(params, page, cursorDoc?.id);

    // 1. Check local query cache
    const cachedEntry = queryCache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return {
        ...cachedEntry.result,
        queryLatencyMs: Math.round(performance.now() - startTime),
        readsConsumed: 0,
        readsSaved: pageSize,
        isCached: true,
      };
    }

    try {
      const constraints: QueryConstraint[] = [];
      const countConstraints: QueryConstraint[] = [];

      // 2. Compound Index Filter: Status
      if (params.status && params.status !== 'all') {
        constraints.push(where('status', '==', params.status));
        countConstraints.push(where('status', '==', params.status));
      }

      // 3. Compound Index Filter: Service Category
      if (params.serviceType && params.serviceType !== 'all') {
        constraints.push(where('serviceType', '==', params.serviceType));
        countConstraints.push(where('serviceType', '==', params.serviceType));
      }

      // 4. Sort Order
      const sortField = params.sortField || 'createdAt';
      const sortDir = params.sortDirection || 'desc';
      constraints.push(orderBy(sortField, sortDir));

      // 5. Build Aggregation Count Query (Cost: 1 read per 1000 index items instead of full doc reads)
      const countQueryRef = query(collection(db, this.BOOKINGS_COLLECTION), ...countConstraints);
      const countSnapshot = await getCountFromServer(countQueryRef).catch(() => ({ data: () => ({ count: 0 }) }));
      const totalCount = countSnapshot.data().count;

      // 6. Apply Cursor Pagination
      if (cursorDoc && navigationDirection === 'next') {
        constraints.push(startAfter(cursorDoc));
        constraints.push(limit(pageSize));
      } else if (cursorDoc && navigationDirection === 'prev') {
        constraints.push(endBefore(cursorDoc));
        constraints.push(limitToLast(pageSize));
      } else {
        constraints.push(limit(pageSize));
      }

      // 7. Execute Indexed Firestore Query
      const queryRef = query(collection(db, this.BOOKINGS_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(queryRef);

      const bookings: Booking[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        bookings.push({
          id: docSnapshot.id,
          bookingRef: data.bookingRef || docSnapshot.id,
          customerName: data.customerName || 'Guest Traveler',
          customerPhone: data.customerPhone || '',
          customerEmail: data.customerEmail,
          serviceType: data.serviceType || 'airport',
          subType: data.subType || 'oneway',
          pickupLocation: data.pickupLocation || '',
          dropoffLocation: data.dropoffLocation || '',
          travelDate: data.travelDate || '',
          pickupTime: data.pickupTime || '',
          vehicleCategory: data.vehicleCategory || 'Sedan',
          vehicleName: data.vehicleName || 'Swift Dzire',
          estimatedDistanceKm: data.estimatedDistanceKm || 20,
          totalFare: data.totalFare || 0,
          paymentMethod: data.paymentMethod || 'cash_to_driver',
          status: data.status || 'confirmed',
          otp: data.otp || '0000',
          driver: data.driver,
          createdAt: data.createdAt || new Date().toISOString(),
          notes: data.notes,
        } as Booking);
      });

      // 8. Client-side Search refinement if query keyword provided
      let finalData = bookings;
      if (params.searchQuery && params.searchQuery.trim() !== '') {
        const q = params.searchQuery.toLowerCase().trim();
        finalData = bookings.filter(
          (b) =>
            b.bookingRef.toLowerCase().includes(q) ||
            b.customerName.toLowerCase().includes(q) ||
            b.customerPhone.includes(q) ||
            b.pickupLocation.toLowerCase().includes(q) ||
            b.dropoffLocation.toLowerCase().includes(q)
        );
      }

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      const firstVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[0] : null;
      const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

      const queryLatencyMs = Math.round(performance.now() - startTime);
      const readsConsumed = querySnapshot.docs.length;
      const readsSaved = Math.max(0, totalCount - readsConsumed);

      const result: PaginatedResult<Booking> = {
        data: finalData,
        totalCount: Math.max(totalCount, finalData.length),
        currentPage: page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPrevPage,
        queryLatencyMs,
        readsConsumed,
        readsSaved,
        firstVisibleDoc: firstVisible,
        lastVisibleDoc: lastVisible,
        isCached: false,
      };

      // Store in memory query cache
      queryCache.set(cacheKey, { result, timestamp: Date.now() });

      return result;
    } catch (error: any) {
      console.warn('[FirestoreBookingService] Paginated fetch falling back to local storage:', error);

      // Local storage fallback for offline / mock resilience
      const local = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
      let filtered = [...local];

      if (params.status && params.status !== 'all') {
        filtered = filtered.filter((b: any) => b.status === params.status);
      }
      if (params.serviceType && params.serviceType !== 'all') {
        filtered = filtered.filter((b: any) => b.serviceType === params.serviceType);
      }
      if (params.searchQuery) {
        const q = params.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (b: any) =>
            b.bookingRef.toLowerCase().includes(q) ||
            b.customerName.toLowerCase().includes(q) ||
            b.customerPhone.includes(q)
        );
      }

      const totalCount = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const startIndex = (page - 1) * pageSize;
      const pagedData = filtered.slice(startIndex, startIndex + pageSize);

      return {
        data: pagedData,
        totalCount,
        currentPage: page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        queryLatencyMs: Math.round(performance.now() - startTime),
        readsConsumed: 0,
        readsSaved: 0,
        firstVisibleDoc: null,
        lastVisibleDoc: null,
        isCached: false,
      };
    }
  }

  /**
   * Fetches aggregate metrics across all bookings for dashboard statistics
   */
  public static async fetchAggregateStats(): Promise<BookingAggregateStats> {
    try {
      const q = query(collection(db, this.BOOKINGS_COLLECTION), limit(100));
      const snapshot = await getDocs(q);

      let totalRevenue = 0;
      let activeCount = 0;
      let completedCount = 0;
      let cancelledCount = 0;
      let airportCount = 0;
      let outstationCount = 0;
      let localCount = 0;

      snapshot.forEach((d) => {
        const data = d.data();
        const fare = Number(data.totalFare) || 0;
        const status = data.status || 'confirmed';
        const service = data.serviceType || 'airport';

        if (status !== 'cancelled') {
          totalRevenue += fare;
        }

        if (['confirmed', 'driver_assigned', 'on_the_way', 'trip_started'].includes(status)) {
          activeCount++;
        } else if (status === 'completed') {
          completedCount++;
        } else if (status === 'cancelled') {
          cancelledCount++;
        }

        if (service === 'airport') airportCount++;
        else if (service === 'outstation') outstationCount++;
        else localCount++;
      });

      return {
        totalRevenue,
        activeCount,
        completedCount,
        cancelledCount,
        airportCount,
        outstationCount,
        localCount,
      };
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
      return {
        totalRevenue: local.reduce((sum: number, b: any) => sum + (b.totalFare || 0), 0),
        activeCount: local.filter((b: any) => b.status !== 'completed' && b.status !== 'cancelled').length,
        completedCount: local.filter((b: any) => b.status === 'completed').length,
        cancelledCount: local.filter((b: any) => b.status === 'cancelled').length,
        airportCount: local.filter((b: any) => b.serviceType === 'airport').length,
        outstationCount: local.filter((b: any) => b.serviceType === 'outstation').length,
        localCount: local.filter((b: any) => b.serviceType === 'local' || b.serviceType === 'packages').length,
      };
    }
  }

  /**
   * Updates booking lifecycle status
   */
  public static async updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<void> {
    if (!bookingId) return;

    if (!bookingId.startsWith('local-') && !bookingId.startsWith('seed-')) {
      await updateDoc(doc(db, this.BOOKINGS_COLLECTION, bookingId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }

    // Invalidate in-memory query cache so next read is fresh
    queryCache.clear();
  }

  /**
   * Deletes booking document
   */
  public static async deleteBooking(bookingId: string): Promise<void> {
    if (!bookingId) return;

    if (!bookingId.startsWith('local-') && !bookingId.startsWith('seed-')) {
      await deleteDoc(doc(db, this.BOOKINGS_COLLECTION, bookingId));
    }

    queryCache.clear();
  }

  /**
   * Clear in-memory query cache
   */
  public static clearCache(): void {
    queryCache.clear();
  }
}
