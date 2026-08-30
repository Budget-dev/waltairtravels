import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FirestoreBookingService, 
  BookingQueryParams, 
  PaginatedResult, 
  BookingAggregateStats 
} from '../services/firestoreBookings';
import { Booking, BookingStatus } from '../types';
import { type QueryDocumentSnapshot, type DocumentData } from '../firebase';

export function usePaginatedBookings(initialPageSize: number = 10) {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);

  // Filter & Query States
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterServiceType, setFilterServiceType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'createdAt' | 'travelDate' | 'totalFare'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  // Aggregation Metrics
  const [aggregateStats, setAggregateStats] = useState<BookingAggregateStats>({
    totalRevenue: 0,
    activeCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    airportCount: 0,
    outstationCount: 0,
    localCount: 0,
  });

  // Telemetry & Performance Optimization Metrics
  const [queryLatencyMs, setQueryLatencyMs] = useState<number>(0);
  const [readsConsumed, setReadsConsumed] = useState<number>(0);
  const [readsSaved, setReadsSaved] = useState<number>(0);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [totalSessionReadsSaved, setTotalSessionReadsSaved] = useState<number>(0);

  // Cursor Stack for O(1) forward and backward pagination
  const cursorStackRef = useRef<Map<number, { first: QueryDocumentSnapshot<DocumentData> | null; last: QueryDocumentSnapshot<DocumentData> | null }>>(
    new Map()
  );

  const fetchStats = useCallback(async () => {
    try {
      const stats = await FirestoreBookingService.fetchAggregateStats();
      setAggregateStats(stats);
    } catch (e) {
      console.warn('Failed to fetch aggregate stats:', e);
    }
  }, []);

  const executeQuery = useCallback(
    async (
      targetPage: number,
      direction: 'next' | 'prev' | 'exact' = 'exact'
    ) => {
      setLoading(true);
      setError(null);

      const params: BookingQueryParams = {
        status: filterStatus,
        serviceType: filterServiceType,
        searchQuery,
        sortField,
        sortDirection,
        pageSize,
      };

      let cursorDoc: QueryDocumentSnapshot<DocumentData> | null = null;
      if (direction === 'next') {
        const prevCursors = cursorStackRef.current.get(targetPage - 1);
        cursorDoc = prevCursors?.last || null;
      } else if (direction === 'prev') {
        const nextCursors = cursorStackRef.current.get(targetPage + 1);
        cursorDoc = nextCursors?.first || null;
      }

      try {
        const result = await FirestoreBookingService.fetchPaginatedBookings(
          params,
          targetPage,
          cursorDoc,
          direction
        );

        setData(result.data);
        setCurrentPage(result.currentPage);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setHasNextPage(result.hasNextPage);
        setHasPrevPage(result.hasPrevPage);
        setQueryLatencyMs(result.queryLatencyMs);
        setReadsConsumed(result.readsConsumed);
        setReadsSaved(result.readsSaved);
        setIsCached(result.isCached);
        setTotalSessionReadsSaved((prev) => prev + result.readsSaved);

        // Store cursors for this page
        cursorStackRef.current.set(targetPage, {
          first: result.firstVisibleDoc,
          last: result.lastVisibleDoc,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to query bookings');
      } finally {
        setLoading(false);
      }
    },
    [filterStatus, filterServiceType, searchQuery, sortField, sortDirection, pageSize]
  );

  // Trigger re-query whenever filters change, resetting to page 1
  useEffect(() => {
    cursorStackRef.current.clear();
    setCurrentPage(1);
    executeQuery(1, 'exact');
    fetchStats();
  }, [filterStatus, filterServiceType, searchQuery, sortField, sortDirection, pageSize, executeQuery, fetchStats]);

  const nextPage = () => {
    if (hasNextPage) {
      executeQuery(currentPage + 1, 'next');
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      executeQuery(currentPage - 1, 'prev');
    }
  };

  const refresh = () => {
    FirestoreBookingService.clearCache();
    cursorStackRef.current.clear();
    executeQuery(currentPage, 'exact');
    fetchStats();
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await FirestoreBookingService.updateBookingStatus(bookingId, newStatus);
      // Optimistically update local state
      setData((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      await FirestoreBookingService.deleteBooking(bookingId);
      setData((prev) => prev.filter((b) => b.id !== bookingId));
      fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to delete booking');
    }
  };

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    filterStatus,
    filterServiceType,
    searchQuery,
    sortField,
    sortDirection,
    aggregateStats,
    queryLatencyMs,
    readsConsumed,
    readsSaved,
    isCached,
    totalSessionReadsSaved,
    nextPage,
    prevPage,
    setPageSize,
    setFilterStatus,
    setFilterServiceType,
    setSearchQuery,
    setSortField,
    setSortDirection,
    refresh,
    updateBookingStatus,
    deleteBooking,
  };
}
