import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Car, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  IndianRupee, 
  Filter, 
  RefreshCw, 
  UserCheck, 
  TrendingUp, 
  Compass, 
  Trash2, 
  Plus, 
  Users, 
  Calendar, 
  Search, 
  MessageCircle, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  AlertCircle, 
  Download, 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  User, 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet
} from 'lucide-react';
import { Booking, BookingStatus, LeadFootprint, LeadStatus, RegisteredUserProfile } from '../types';
import { 
  db, 
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs 
} from '../firebase';
import { 
  subscribeToLeads, 
  subscribeToUsers, 
  updateLeadStatus, 
  deleteLead, 
  playNotificationSound 
} from '../services/leadTrackingService';
import { createBookingWhatsAppUrl } from '../utils/whatsapp';
import { 
  syncSaveBooking, 
  syncUpdateBookingStatus, 
  syncDeleteBooking 
} from '../services/dbSync';

interface AdminPanelProps {
  isOpen?: boolean;
  onClose: () => void;
  allBookings: Booking[];
  onRefresh: () => void;
  isFullPage?: boolean;
}

export const AUTHORIZED_ADMIN_EMAIL = 'waltairtravelsandcabs@gmail.com';

type TabType = 'overview' | 'leads' | 'bookings' | 'users' | 'datewise' | 'dispatch';
type DatePreset = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen = true,
  onClose,
  allBookings,
  onRefresh,
  isFullPage = false,
}) => {
  // Strict Admin Authentication & Authorization State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'unauthenticated' | 'unauthorized' | 'authorized'>('checking');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Synchronize Firebase Auth state specifically for Admin portal
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        setCurrentUser(null);
        setAuthStatus('unauthenticated');
        return;
      }
      setCurrentUser(fbUser);
      const email = (fbUser.email || '').toLowerCase().trim();
      if (email === AUTHORIZED_ADMIN_EMAIL) {
        setAuthStatus('authorized');
      } else {
        setAuthStatus('unauthorized');
      }
    });
    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const email = (result.user?.email || '').toLowerCase().trim();
      if (email !== AUTHORIZED_ADMIN_EMAIL) {
        setAuthStatus('unauthorized');
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch {
          setLoginError('Authentication encountered an issue. Please try again or use administrator credentials.');
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both administrator email and password.');
      return;
    }
    if (loginEmail.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL) {
      setLoginError('This account is not authorized to access the administration panel.');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
    } catch {
      setLoginError('Invalid administrator credentials. Please check your password and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('waltair_user_session');
      window.dispatchEvent(new Event('waltair_auth_change'));
      setAuthStatus('unauthenticated');
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const email = (result.user?.email || '').toLowerCase().trim();
      if (email === AUTHORIZED_ADMIN_EMAIL) {
        setAuthStatus('authorized');
      } else {
        setAuthStatus('unauthorized');
      }
    } catch {
      setAuthStatus('unauthenticated');
    }
  };

  const handleAdminSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('waltair_user_session');
      window.dispatchEvent(new Event('waltair_auth_change'));
      setAuthStatus('unauthenticated');
      setCurrentUser(null);
    } catch (err) {
      console.warn('Admin logout notice:', err);
    }
  };

  // Navigation & Tabs with persistent memory across refresh
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem('waltair_admin_active_tab') as TabType;
      return saved && ['overview', 'leads', 'bookings', 'users', 'datewise', 'dispatch'].includes(saved)
        ? saved
        : 'overview';
    } catch {
      return 'overview';
    }
  });

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('waltair_admin_active_tab', tab);
    } catch {}
  };
  
  // Real-time Data States
  const [leads, setLeads] = useState<LeadFootprint[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserProfile[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [liveLeadAlert, setLiveLeadAlert] = useState<LeadFootprint | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'registered' | 'guest'>('all');

  // Date Filters
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Manual Dispatch State
  const [dispatchName, setDispatchName] = useState<string>('');
  const [dispatchPhone, setDispatchPhone] = useState<string>('');
  const [dispatchPickup, setDispatchPickup] = useState<string>('Visakhapatnam Airport (ASI / VTZ)');
  const [dispatchDropoff, setDispatchDropoff] = useState<string>('Siripuram Circle, Visakhapatnam');
  const [dispatchDate, setDispatchDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dispatchTime, setDispatchTime] = useState<string>('11:00');
  const [dispatchVehicle, setDispatchVehicle] = useState<string>('Maruti Suzuki Dzire');
  const [dispatchFare, setDispatchFare] = useState<string>('1100');
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string>('');

  // Selected Lead for Detailed Quick Dispatch
  const [selectedLeadForDispatch, setSelectedLeadForDispatch] = useState<LeadFootprint | null>(null);

  // 1. Subscribe to Live Leads & Footprints (ONLY when authenticated and authorized!)
  useEffect(() => {
    if (authStatus !== 'authorized') return;
    let previousCount = 0;
    const unsub = subscribeToLeads((freshLeads) => {
      // Check if new lead arrived
      if (freshLeads.length > previousCount && previousCount > 0) {
        const newest = freshLeads[0];
        if (soundEnabled) {
          playNotificationSound('lead');
        }
        setLiveLeadAlert(newest);
        setTimeout(() => setLiveLeadAlert(null), 6000);
      }
      previousCount = freshLeads.length;
      setLeads(freshLeads);
    });
    return () => unsub();
  }, [authStatus, soundEnabled]);

  // 2. Subscribe to Registered Users (ONLY when authenticated and authorized!)
  useEffect(() => {
    if (authStatus !== 'authorized') return;
    const unsub = subscribeToUsers((users) => {
      setRegisteredUsers(users);
    });
    return () => unsub();
  }, [authStatus]);


  // Format Helpers
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  // Check if a date string falls within selected date preset
  const isDateInRange = (dateStr?: string): boolean => {
    if (!dateStr || datePreset === 'all') return true;
    
    // Normalize dateStr (could be ISO or YYYY-MM-DD)
    const normalized = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    if (datePreset === 'today') {
      return normalized === today;
    }
    if (datePreset === 'yesterday') {
      return normalized === yesterday;
    }
    if (datePreset === 'week') {
      const now = new Date();
      const past = new Date();
      past.setDate(now.getDate() - 7);
      const target = new Date(normalized);
      return target >= past && target <= now;
    }
    if (datePreset === 'month') {
      const now = new Date();
      const past = new Date();
      past.setMonth(now.getMonth() - 1);
      const target = new Date(normalized);
      return target >= past && target <= now;
    }
    if (datePreset === 'custom') {
      if (customStartDate && normalized < customStartDate) return false;
      if (customEndDate && normalized > customEndDate) return false;
      return true;
    }
    return true;
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Date filter (check updatedAt or createdAt)
      const dateToCheck = l.updatedAt || l.createdAt;
      if (!isDateInRange(dateToCheck)) return false;

      // Status filter
      if (leadStatusFilter !== 'all' && l.status !== leadStatusFilter) return false;

      // User Type filter
      if (userTypeFilter === 'registered' && !l.isRegistered) return false;
      if (userTypeFilter === 'guest' && l.isRegistered) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const phoneMatch = l.customerPhone?.toLowerCase().includes(q) || false;
        const nameMatch = l.customerName?.toLowerCase().includes(q) || false;
        const pickupMatch = l.pickupLocation?.toLowerCase().includes(q) || false;
        const dropMatch = l.dropoffLocation?.toLowerCase().includes(q) || false;
        const refMatch = l.convertedBookingRef?.toLowerCase().includes(q) || false;
        return phoneMatch || nameMatch || pickupMatch || dropMatch || refMatch;
      }

      return true;
    });
  }, [leads, datePreset, customStartDate, customEndDate, leadStatusFilter, userTypeFilter, searchQuery]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      // Date filter (check travelDate or createdAt)
      const dateToCheck = b.travelDate || (b.createdAt?.includes('T') ? b.createdAt.split('T')[0] : b.createdAt);
      if (!isDateInRange(dateToCheck)) return false;

      // Status filter
      if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;

      // User Type filter
      if (userTypeFilter === 'registered' && !b.isRegistered) return false;
      if (userTypeFilter === 'guest' && b.isRegistered) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const refMatch = b.bookingRef?.toLowerCase().includes(q) || false;
        const nameMatch = b.customerName?.toLowerCase().includes(q) || false;
        const phoneMatch = b.customerPhone?.includes(q) || false;
        const pickupMatch = b.pickupLocation?.toLowerCase().includes(q) || false;
        const dropMatch = b.dropoffLocation?.toLowerCase().includes(q) || false;
        return refMatch || nameMatch || phoneMatch || pickupMatch || dropMatch;
      }

      return true;
    });
  }, [allBookings, datePreset, customStartDate, customEndDate, bookingStatusFilter, userTypeFilter, searchQuery]);

  // Filtered Registered Users
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const nameMatch = u.name?.toLowerCase().includes(q) || false;
      const emailMatch = u.email?.toLowerCase().includes(q) || false;
      const phoneMatch = u.phone?.includes(q) || false;
      return nameMatch || emailMatch || phoneMatch;
    });
  }, [registeredUsers, searchQuery]);

  // Aggregate Metrics (calculated with date range filter applied)
  const metrics = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const convertedLeads = filteredLeads.filter(l => l.status === 'converted').length;
    const inProgressLeads = filteredLeads.filter(l => l.status === 'filling' || l.status === 'partial').length;
    const abandonedLeads = filteredLeads.filter(l => l.status === 'abandoned').length;
    
    // Live Active typing (updated in last 10 mins)
    const tenMinsAgo = Date.now() - 10 * 60 * 1000;
    const liveTypingCount = leads.filter(l => {
      const ts = new Date(l.updatedAt || l.createdAt || 0).getTime();
      return ts > tenMinsAgo && l.status !== 'converted';
    }).length;

    const totalBookings = filteredBookings.length;
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length;
    const activeTrips = filteredBookings.filter(b => 
      b.status === 'confirmed' || b.status === 'driver_assigned' || b.status === 'on_the_way' || b.status === 'trip_started'
    ).length;
    const completedTrips = filteredBookings.filter(b => b.status === 'completed').length;
    
    const totalRevenue = filteredBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalFare || 0), 0);

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

    return {
      totalLeads,
      convertedLeads,
      inProgressLeads,
      abandonedLeads,
      liveTypingCount,
      totalBookings,
      confirmedBookings,
      activeTrips,
      completedTrips,
      totalRevenue,
      conversionRate,
      registeredCount: registeredUsers.length
    };
  }, [filteredLeads, filteredBookings, leads, registeredUsers]);

  // Date-wise Grouping Data
  const datewiseBreakdown = useMemo(() => {
    const map = new Map<string, { date: string; leadsCount: number; bookingsCount: number; revenue: number; convertedCount: number }>();

    // Process leads
    leads.forEach(l => {
      const d = (l.updatedAt || l.createdAt || '').split('T')[0] || 'Unknown';
      if (!map.has(d)) {
        map.set(d, { date: d, leadsCount: 0, bookingsCount: 0, revenue: 0, convertedCount: 0 });
      }
      const item = map.get(d)!;
      item.leadsCount += 1;
      if (l.status === 'converted') item.convertedCount += 1;
    });

    // Process bookings
    allBookings.forEach(b => {
      const d = b.travelDate || (b.createdAt ? b.createdAt.split('T')[0] : 'Unknown');
      if (!map.has(d)) {
        map.set(d, { date: d, leadsCount: 0, bookingsCount: 0, revenue: 0, convertedCount: 0 });
      }
      const item = map.get(d)!;
      item.bookingsCount += 1;
      if (b.status !== 'cancelled') {
        item.revenue += (b.totalFare || 0);
      }
    });

    return Array.from(map.values())
      .filter(item => isDateInRange(item.date))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [leads, allBookings, datePreset, customStartDate, customEndDate]);

  // Status Updater for Booking (Multi-tier: Server DB + LocalStorage + Cloud Firestore)
  const handleUpdateBookingStatus = async (bookingId: string | undefined, newStatus: BookingStatus) => {
    if (!bookingId) return;
    setIsUpdating(true);
    try {
      const targetBooking = allBookings.find(b => b.id === bookingId || b.bookingRef === bookingId);
      await syncUpdateBookingStatus(bookingId, targetBooking?.bookingRef, newStatus);
      onRefresh();
    } catch (err) {
      console.warn('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Booking (Multi-tier: Server DB + LocalStorage + Cloud Firestore)
  const handleDeleteBooking = async (bookingId: string | undefined) => {
    if (!bookingId || !window.confirm('Delete this booking record?')) return;
    try {
      const targetBooking = allBookings.find(b => b.id === bookingId || b.bookingRef === bookingId);
      await syncDeleteBooking(bookingId, targetBooking?.bookingRef);
      onRefresh();
    } catch (err) {
      console.warn('Error deleting:', err);
    }
  };

  // Status Updater for Lead
  const handleUpdateLeadStatus = async (leadId: string | undefined, newStatus: LeadStatus) => {
    if (!leadId) return;
    await updateLeadStatus(leadId, newStatus);
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string | undefined) => {
    if (!leadId || !window.confirm('Delete this lead footprint?')) return;
    await deleteLead(leadId);
  };

  // Submit Manual Dispatch (Multi-tier: Server DB + LocalStorage + Cloud Firestore)
  const handleManualDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchPhone.trim() || !dispatchPickup.trim() || !dispatchDropoff.trim()) {
      alert('Please enter Phone, Pickup, and Dropoff');
      return;
    }

    setIsDispatching(true);
    setDispatchSuccess('');
    const bookingRef = `WAL-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: Booking = {
      bookingRef,
      customerName: dispatchName.trim() || 'Passenger',
      customerPhone: dispatchPhone.replace(/\D/g, ''),
      serviceType: 'airport',
      subType: 'pickup',
      pickupLocation: dispatchPickup.trim(),
      dropoffLocation: dispatchDropoff.trim(),
      travelDate: dispatchDate,
      pickupTime: dispatchTime,
      vehicleCategory: 'Sedan',
      vehicleName: dispatchVehicle,
      estimatedDistanceKm: 35,
      totalFare: Number(dispatchFare) || 1100,
      paymentMethod: 'cash_to_driver',
      status: 'confirmed',
      specialRequests: dispatchNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      city: 'Visakhapatnam, IN',
      isRegistered: false,
    };

    try {
      // 1. Universal persistence (LocalStorage + Server DB + Firestore)
      await syncSaveBooking(newBooking);
      
      // 2. If dispatching for a lead, mark that lead as converted!
      if (selectedLeadForDispatch?.id) {
        await updateLeadStatus(selectedLeadForDispatch.id, 'converted');
      }

      setDispatchSuccess(`Booking #${bookingRef} confirmed & saved to database successfully!`);
      setDispatchName('');
      setDispatchPhone('');
      setSelectedLeadForDispatch(null);
      onRefresh();
      if (soundEnabled) playNotificationSound('booking');
    } catch (err) {
      console.error('Dispatch error:', err);
      // Fallback local save so operator never loses the booking
      setDispatchSuccess(`Booking #${bookingRef} created and cached safely.`);
      onRefresh();
    } finally {
      setIsDispatching(false);
    }
  };

  // Export CSV
  const handleExportCSV = (type: 'leads' | 'bookings') => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (type === 'leads') {
      headers = ['Lead ID', 'Customer Name', 'Phone', 'Email', 'User Type', 'Status', 'Pickup', 'Dropoff', 'Date', 'Time', 'Vehicle', 'Last Field', 'Device', 'Updated At'];
      rows = filteredLeads.map(l => [
        l.leadSessionId || l.id || '',
        `"${(l.customerName || 'Guest').replace(/"/g, '""')}"`,
        l.customerPhone || '',
        l.customerEmail || '',
        l.isRegistered ? 'Registered User' : 'Guest Visitor',
        l.status,
        `"${(l.pickupLocation || '').replace(/"/g, '""')}"`,
        `"${(l.dropoffLocation || '').replace(/"/g, '""')}"`,
        l.travelDate || '',
        l.pickupTime || '',
        l.vehicleName || '',
        `"${(l.lastFieldChanged || '').replace(/"/g, '""')}"`,
        l.device || '',
        l.updatedAt || l.createdAt || ''
      ]);
    } else {
      headers = ['Booking Ref', 'Customer Name', 'Phone', 'User Type', 'Status', 'Pickup', 'Dropoff', 'Date', 'Time', 'Vehicle', 'Fare (INR)', 'Created At'];
      rows = filteredBookings.map(b => [
        b.bookingRef,
        `"${(b.customerName || '').replace(/"/g, '""')}"`,
        b.customerPhone || '',
        b.isRegistered ? 'Registered User' : 'Guest Visitor',
        b.status,
        `"${(b.pickupLocation || '').replace(/"/g, '""')}"`,
        `"${(b.dropoffLocation || '').replace(/"/g, '""')}"`,
        b.travelDate || '',
        b.pickupTime || '',
        b.vehicleName || '',
        String(b.totalFare || 0),
        b.createdAt || ''
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `waltair_${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCleanTimeAgo = (iso?: string) => {
    if (!iso) return 'Just now';
    try {
      const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      return `${Math.floor(diffHr / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // 1. Authentication Checking State (Executive Screen)
  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500 animate-pulse" />
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-8 h-8 animate-pulse text-teal-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1">Waltair Travels & Cabs</h2>
          <p className="text-xs uppercase tracking-widest text-teal-400/90 font-semibold mb-4">Operations Administration</p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
            <span>Verifying administrator credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State -> Minimal Executive Admin Authentication Screen
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
          <div className="p-6 sm:p-8">
            {/* Header Branding */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                <Lock className="w-3 h-3 text-teal-400" />
                <span>Administration Portal</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Waltair Travels & Cabs</h1>
              <p className="text-xs text-slate-400 mt-1">Authorized Operations Personnel Only</p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Google Authentication (One-Click Executive Login) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In with Authorized Google Account'}</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-slate-900 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Or Admin Credentials
              </span>
            </div>

            {/* Password Login Form */}
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="waltairtravelsandcabs@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? 'Verifying Credentials...' : 'Sign In with Credentials'}
              </button>
            </form>
          </div>

          {/* Footer Card */}
          <div className="bg-slate-950/60 p-4 border-t border-slate-800/80 text-center flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>Restricted to waltairtravelsandcabs@gmail.com</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors text-xs font-medium cursor-pointer"
            >
              Exit to Website →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized State -> Access Denied Screen (Strictly blocks non-admin accounts)
  if (authStatus === 'unauthorized') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
        <div className="w-full max-w-md bg-slate-900 border border-rose-900/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>

          <h1 className="text-xl font-extrabold text-white tracking-tight mb-2">Admin access restricted</h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            This account is not authorized to access the administration panel.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attempted Account</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold">
                Access Denied
              </span>
            </div>
            <div className="text-sm font-mono text-slate-200 truncate">
              {currentUser?.email || 'Unknown account'}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Only <span className="text-teal-400 font-mono">waltairtravelsandcabs@gmail.com</span> is granted administrative privileges.
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span>Sign In with Authorized Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized State -> Full Operations Admin Dashboard
  const contentClass = isFullPage
    ? "min-h-screen bg-slate-100 text-slate-900 flex flex-col w-full"
    : "fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4";

  const containerClass = isFullPage
    ? "flex-1 flex flex-col w-full max-w-7xl mx-auto p-3 sm:p-6"
    : "bg-slate-50 w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 text-slate-900 overflow-hidden relative flex flex-col max-h-[94vh]";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={contentClass}>
          <motion.div 
            initial={{ opacity: 0, scale: isFullPage ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: isFullPage ? 1 : 0.97 }}
            className={containerClass}
          >
            
            {/* Live New Lead Banner Notification */}
            <AnimatePresence>
              {liveLeadAlert && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-ping" />
                    <span>🚨 LIVE FOOTPRINT:</span>
                    <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white">
                      {liveLeadAlert.customerPhone ? `+91 ${liveLeadAlert.customerPhone}` : (liveLeadAlert.customerName || 'Guest Visitor')}
                    </span>
                    <span className="text-emerald-100">{liveLeadAlert.lastFieldChanged}</span>
                    <span className="text-white/80">({liveLeadAlert.device})</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('leads');
                      setLiveLeadAlert(null);
                    }}
                    className="bg-white text-emerald-800 px-3 py-1 rounded-lg text-xs font-extrabold hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    View Lead
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Navigation Header (Classy White) */}
            <div className="p-3.5 sm:p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-slate-200 shrink-0 bg-white flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Waltair Cabs" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Waltair%20Cabs%20Coastal%20Travel%20Badge.png';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">Waltair Cabs Operations & Lead Dispatch Center</h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[10.5px] font-bold text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500 font-medium">Real-Time Footprint Capture • Instant Lead WhatsApp & Dispatch</p>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      waltairtravelsandcabs@gmail.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Audio chime toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-teal-50 border border-teal-300 text-teal-800 shadow-2xs' : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                  title={soundEnabled ? 'Lead sound alerts active' : 'Sound muted'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">{soundEnabled ? 'Chime On' : 'Muted'}</span>
                </button>

                {/* Live Sync button */}
                <button
                  type="button"
                  onClick={onRefresh}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sync Database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                {/* Secure Sign Out Button */}
                <button
                  type="button"
                  onClick={handleAdminSignOut}
                  className="p-2 sm:px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Securely Sign Out of Administration"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Return to Website"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>


            {/* Navigation Tabs Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-2 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'overview', label: 'Dashboard Overview', shortLabel: 'Overview', icon: TrendingUp, badge: null },
                { 
                  id: 'leads', 
                  label: 'Live Leads & Footprints', 
                  shortLabel: 'Live Leads',
                  icon: Zap, 
                  badge: metrics.inProgressLeads > 0 ? metrics.inProgressLeads : metrics.totalLeads, 
                  badgeColor: metrics.inProgressLeads > 0 ? 'bg-amber-600' : 'bg-teal-700' 
                },
                { id: 'bookings', label: 'All Bookings', shortLabel: 'Bookings', icon: Car, badge: metrics.totalBookings, badgeColor: 'bg-emerald-600' },
                { id: 'users', label: 'Registered Users', shortLabel: 'Users', icon: Users, badge: metrics.registeredCount, badgeColor: 'bg-sky-600' },
                { id: 'datewise', label: 'Date-wise Analytics', shortLabel: 'Analytics', icon: Calendar, badge: null },
                { id: 'dispatch', label: 'Manual Direct Dispatch', shortLabel: 'Dispatch', icon: Plus, badge: null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`admin-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-3 px-2.5 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'border-teal-700 text-teal-950 bg-white shadow-2xs font-extrabold rounded-t-lg' 
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    {tab.badge !== null && (
                      <span className={`text-[9.5px] text-white px-1.5 py-0.2 rounded-full font-mono shrink-0 ${tab.badgeColor || 'bg-slate-700'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Global Date & Search Filter Bar */}
            <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs shrink-0">
              
              {/* Date Presets Pill Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 shrink-0">
                  <Filter className="w-3 h-3 text-teal-700" />
                  Date Filter:
                </span>
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: 'week', label: 'Last 7 Days' },
                  { id: 'month', label: 'This Month' },
                  { id: 'custom', label: 'Custom Range' },
                ].map((dp) => (
                  <button
                    key={dp.id}
                    onClick={() => setDatePreset(dp.id as DatePreset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      datePreset === dp.id 
                        ? 'bg-teal-800 text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 font-medium'
                    }`}
                  >
                    {dp.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range Pickers if selected */}
              {datePreset === 'custom' && (
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-900 text-xs outline-none"
                    placeholder="From"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-900 text-xs outline-none"
                    placeholder="To"
                  />
                </div>
              )}

              {/* Search Bar & User Type Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value as any)}
                  className="bg-white border border-slate-200 text-slate-800 font-semibold text-xs px-2.5 py-1.5 rounded-xl outline-none shadow-2xs cursor-pointer"
                >
                  <option value="all">All Visitors</option>
                  <option value="registered">Registered Users Only</option>
                  <option value="guest">Guest Leads Only</option>
                </select>

                <div className="relative flex-1 md:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search phone, name, ref..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-700 shadow-2xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* TAB CONTENTS (Clean Canvas) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 bg-slate-50/70">

              {/* ----------------- TAB 1: OVERVIEW DASHBOARD ----------------- */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    
                    {/* Live Footprints */}
                    <div className="bg-white border border-amber-300 p-3.5 rounded-2xl relative overflow-hidden shadow-xs hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-1">
                        <span>Live Typing Now</span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{metrics.liveTypingCount}</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Typing within last 10m</p>
                    </div>

                    {/* Total Leads Captured */}
                    <div className="bg-white border border-teal-200 p-3.5 rounded-2xl shadow-xs hover:shadow-sm transition-all">
                      <div className="text-teal-800 text-xs font-bold mb-1 flex items-center justify-between">
                        <span>Total Leads</span>
                        <Zap className="w-3.5 h-3.5 text-teal-700" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{metrics.totalLeads}</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{metrics.inProgressLeads} partial / drop-offs</p>
                    </div>

                    {/* Confirmed Bookings */}
                    <div className="bg-white border border-emerald-200 p-3.5 rounded-2xl shadow-xs hover:shadow-sm transition-all">
                      <div className="text-emerald-800 text-xs font-bold mb-1 flex items-center justify-between">
                        <span>Bookings</span>
                        <Car className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{metrics.totalBookings}</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{metrics.activeTrips} active / dispatching</p>
                    </div>

                    {/* Registered Users */}
                    <div className="bg-white border border-sky-200 p-3.5 rounded-2xl shadow-xs hover:shadow-sm transition-all">
                      <div className="text-sky-800 text-xs font-bold mb-1 flex items-center justify-between">
                        <span>Registered Users</span>
                        <Users className="w-3.5 h-3.5 text-sky-700" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{metrics.registeredCount}</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Signed-in riders</p>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-white border border-purple-200 p-3.5 rounded-2xl shadow-xs hover:shadow-sm transition-all">
                      <div className="text-purple-800 text-xs font-bold mb-1 flex items-center justify-between">
                        <span>Conversion Rate</span>
                        <TrendingUp className="w-3.5 h-3.5 text-purple-700" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{metrics.conversionRate}%</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{metrics.convertedLeads} converted to rides</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs hover:shadow-sm transition-all">
                      <div className="text-slate-800 text-xs font-bold mb-1 flex items-center justify-between">
                        <span>Total Revenue</span>
                        <IndianRupee className="w-3.5 h-3.5 text-slate-700" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 flex items-center">
                        <span className="text-lg">₹</span>
                        {metrics.totalRevenue.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{metrics.completedTrips} completed trips</p>
                    </div>
                  </div>

                  {/* Two Column Layout: Recent Live Leads Ticker + Recent Bookings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Live Leads Footprint Stream */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <h3 className="font-extrabold text-sm text-slate-900">Latest Lead Footprints (Field Entries)</h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('leads')}
                          className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          View All ({filteredLeads.length}) <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
                        {filteredLeads.slice(0, 6).map((lead) => (
                          <div 
                            key={lead.id || lead.leadSessionId} 
                            className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-teal-500/50 hover:bg-white transition-all flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                  lead.status === 'converted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                  lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}>
                                  {lead.status.toUpperCase()}
                                </span>
                                
                                <span className="font-bold text-slate-900">
                                  {lead.customerPhone ? `+91 ${lead.customerPhone}` : (lead.customerName || 'Anonymous Visitor')}
                                </span>

                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  lead.isRegistered ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {lead.isRegistered ? 'Registered' : 'Guest'}
                                </span>

                                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                                  {lead.device === 'mobile' ? <Smartphone className="w-3 h-3 text-slate-400" /> : <Monitor className="w-3 h-3 text-slate-400" />}
                                  {getCleanTimeAgo(lead.updatedAt || lead.createdAt)}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-700 truncate font-medium">
                                {lead.lastFieldChanged}
                              </p>

                              {(lead.pickupLocation || lead.dropoffLocation) && (
                                <p className="text-[10px] text-slate-500 truncate">
                                  {lead.pickupLocation ? `From: ${lead.pickupLocation}` : ''} {lead.dropoffLocation ? `• To: ${lead.dropoffLocation}` : ''}
                                </p>
                              )}
                            </div>

                            {/* Quick Contact Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {lead.customerPhone && (
                                <>
                                  <a
                                    href={`tel:${lead.customerPhone}`}
                                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer"
                                    title="Call Customer"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={`https://wa.me/91${lead.customerPhone}?text=${encodeURIComponent(`Hi ${lead.customerName || 'there'}! Waltair Cabs customer support here. We noticed you were looking for a cab from ${lead.pickupLocation || 'Vizag'} to ${lead.dropoffLocation || 'destination'}. Would you like us to confirm a cab for you?`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                                    title="Chat on WhatsApp"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {filteredLeads.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-xs">
                            No lead footprints captured for this period yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Confirmed Bookings */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-emerald-700" />
                          <h3 className="font-extrabold text-sm text-slate-900">Recent Confirmed Bookings</h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          View All ({filteredBookings.length}) <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
                        {filteredBookings.slice(0, 6).map((b) => (
                          <div 
                            key={b.id || b.bookingRef}
                            className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-emerald-500/50 hover:bg-white transition-all flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-teal-800 text-xs">{b.bookingRef}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  b.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                  b.status === 'cancelled' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                                  'bg-teal-50 text-teal-800 border border-teal-200'
                                }`}>
                                  {b.status.replace('_', ' ')}
                                </span>
                                <span className="text-slate-500">• {b.travelDate} at {b.pickupTime}</span>
                              </div>

                              <div className="text-slate-900 font-semibold">
                                <strong>{b.customerName}</strong> (<span className="text-teal-800 font-mono font-bold">+91 {b.customerPhone}</span>)
                                <span className="text-slate-500 ml-1.5 font-normal">[{b.vehicleName}]</span>
                              </div>

                              <div className="text-[11px] text-slate-600 truncate">
                                {b.pickupLocation} ➔ {b.dropoffLocation}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="font-extrabold text-slate-900 text-sm">
                                {b.totalFare ? `₹${b.totalFare}` : 'Quote'}
                              </div>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${b.isRegistered ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                {b.isRegistered ? 'Registered User' : 'Guest'}
                              </span>
                            </div>
                          </div>
                        ))}

                        {filteredBookings.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-xs">
                            No bookings recorded for this period.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ----------------- TAB 2: LIVE LEADS & FOOTPRINTS ----------------- */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  {/* Filter Sub-bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {['all', 'filling', 'partial', 'contacted', 'converted', 'abandoned'].map(st => (
                        <button
                          key={st}
                          onClick={() => setLeadStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                            leadStatusFilter === st 
                              ? 'bg-amber-600 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleExportCSV('leads')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 self-end sm:self-auto cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Leads CSV
                    </button>
                  </div>

                  {/* Leads List */}
                  <div className="space-y-3">
                    {filteredLeads.map((lead) => {
                      const isRecent = (Date.now() - new Date(lead.updatedAt || lead.createdAt || 0).getTime()) < 15 * 60 * 1000;
                      return (
                        <div
                          key={lead.id || lead.leadSessionId}
                          className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Live indicator if modified recently */}
                              {isRecent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active Footprint
                                </span>
                              )}

                              <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                                lead.status === 'converted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                lead.status === 'abandoned' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}>
                                {lead.status}
                              </span>

                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                lead.isRegistered ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {lead.isRegistered ? 'Registered User 👤' : 'Guest Visitor 🌐'}
                              </span>

                              <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                                {lead.device === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-slate-400" /> : <Monitor className="w-3.5 h-3.5 text-slate-400" />}
                                {getCleanTimeAgo(lead.updatedAt || lead.createdAt)}
                              </span>

                              {lead.convertedBookingRef && (
                                <span className="text-purple-700 font-mono font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                                  Ref #{lead.convertedBookingRef}
                                </span>
                              )}
                            </div>

                            {/* Customer Profile & Contact */}
                            <div className="text-slate-900 text-sm">
                              <strong className="font-extrabold">{lead.customerName || 'Anonymous Visitor'}</strong>
                              {lead.customerPhone ? (
                                <span className="ml-2 font-mono text-teal-800 font-bold">
                                  +91 {lead.customerPhone}
                                </span>
                              ) : (
                                <span className="ml-2 text-slate-400 text-xs italic font-normal">(Phone not entered yet)</span>
                              )}
                              {lead.customerEmail && (
                                <span className="ml-2 text-slate-500 text-xs font-normal">({lead.customerEmail})</span>
                              )}
                            </div>

                            {/* Footprint Details */}
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                              <div className="text-amber-800 font-semibold flex items-center gap-1">
                                <span>🎯 Last Captured Action:</span>
                                <span className="text-slate-800 font-bold">{lead.lastFieldChanged}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600 pt-0.5">
                                <div>Pickup: <span className="text-slate-900 font-medium">{lead.pickupLocation || 'Not selected'}</span></div>
                                <div>Dropoff: <span className="text-slate-900 font-medium">{lead.dropoffLocation || 'Not selected'}</span></div>
                                <div>Date & Time: <span className="text-slate-900 font-medium">{lead.travelDate} at {lead.pickupTime}</span></div>
                                <div>Vehicle: <span className="text-slate-900 font-medium">{lead.vehicleName || lead.vehicleCategory || 'Any'}</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 w-full lg:w-auto">
                            {/* Row 1: Direct contact & booking */}
                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                              {lead.customerPhone && (
                                <>
                                  <a
                                    href={`tel:${lead.customerPhone}`}
                                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Call</span>
                                  </a>

                                  <a
                                    href={`https://wa.me/91${lead.customerPhone}?text=${encodeURIComponent(`Hello ${lead.customerName || 'Sir/Madam'}, Waltair Cabs Dispatch here. We saw your inquiry for a cab from ${lead.pickupLocation || 'Vizag'} to ${lead.dropoffLocation || 'destination'} on ${lead.travelDate || 'planned date'}. Our driver is ready. Would you like to confirm this trip?`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                </>
                              )}

                              {/* One-Click Direct Book */}
                              <button
                                type="button"
                                onClick={() => {
                                  setDispatchName(lead.customerName || '');
                                  setDispatchPhone(lead.customerPhone || '');
                                  if (lead.pickupLocation) setDispatchPickup(lead.pickupLocation);
                                  if (lead.dropoffLocation) setDispatchDropoff(lead.dropoffLocation);
                                  if (lead.travelDate) setDispatchDate(lead.travelDate);
                                  if (lead.pickupTime) setDispatchTime(lead.pickupTime);
                                  if (lead.vehicleName) setDispatchVehicle(lead.vehicleName);
                                  setSelectedLeadForDispatch(lead);
                                  setActiveTab('dispatch');
                                }}
                                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Direct Book</span>
                              </button>
                            </div>

                            {/* Row 2: Status selector & Delete */}
                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead.id || lead.leadSessionId, e.target.value as LeadStatus)}
                                className="flex-1 sm:flex-initial p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold outline-none cursor-pointer"
                              >
                                <option value="filling">Filling</option>
                                <option value="partial">Partial Lead</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="abandoned">Abandoned</option>
                                <option value="lost">Lost</option>
                              </select>

                              <button
                                onClick={() => handleDeleteLead(lead.id || lead.leadSessionId)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shrink-0 cursor-pointer"
                                title="Delete lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredLeads.length === 0 && (
                      <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                        No lead footprints match the current filter.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- TAB 3: CONFIRMED BOOKINGS ----------------- */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Bookings Filter Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {['all', 'confirmed', 'driver_assigned', 'on_the_way', 'completed', 'cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => setBookingStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                            bookingStatusFilter === st 
                              ? 'bg-teal-800 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleExportCSV('bookings')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 self-end sm:self-auto cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Bookings CSV
                    </button>
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-3">
                    {filteredBookings.map((b) => (
                      <div
                        key={b.id || b.bookingRef}
                        className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-teal-800 font-mono">{b.bookingRef}</span>
                            <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                              b.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              b.status === 'cancelled' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                              'bg-teal-50 text-teal-800 border border-teal-200'
                            }`}>
                              {b.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              b.isRegistered ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {b.isRegistered ? 'Registered User 👤' : 'Guest Booking 🌐'}
                            </span>
                            <span className="text-slate-500">OTP: <strong className="text-emerald-700 font-mono">{b.otp || '9241'}</strong></span>
                            <span className="text-slate-500">• {b.travelDate} at {b.pickupTime}</span>
                          </div>

                          <div className="text-slate-900 font-semibold">
                            <strong>{b.customerName}</strong> (<a href={`tel:${b.customerPhone}`} className="text-teal-800 font-mono font-bold hover:underline">+91 {b.customerPhone}</a>)
                            <span className="text-slate-500 ml-2 font-normal">[{b.vehicleCategory} - {b.vehicleName}]</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px] pt-1">
                            <div>Pickup: <span className="text-slate-900 font-medium">{b.pickupLocation}</span></div>
                            <div>Drop: <span className="text-slate-900 font-medium">{b.dropoffLocation}</span></div>
                          </div>

                          {b.driver && (
                            <div className="text-[11px] text-teal-900 bg-teal-50 p-2 rounded-xl border border-teal-200 font-medium">
                              Driver: <strong>{b.driver.name}</strong> ({b.driver.phone}) • {b.driver.vehicleModel} [{b.driver.vehicleNumber}]
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 shrink-0">
                          <div className="text-right mr-2">
                            <div className="text-base font-extrabold text-slate-900">{b.totalFare ? `₹${b.totalFare}` : 'Quote'}</div>
                            <div className="text-[10px] text-slate-500 capitalize">{b.paymentMethod ? b.paymentMethod.replace('_', ' ') : 'Cash to Driver'}</div>
                          </div>

                          {/* WhatsApp Trip Slip */}
                          <a
                            href={createBookingWhatsAppUrl(b)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                            title="Send WhatsApp Dispatch Slip"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Call Customer */}
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Status dropdown */}
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="driver_assigned">Driver Assigned</option>
                            <option value="on_the_way">On The Way</option>
                            <option value="trip_started">Trip Started</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredBookings.length === 0 && (
                      <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                        No bookings matching current filter.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- TAB 4: REGISTERED USERS ----------------- */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Registered Customer Profiles in Firebase ({filteredUsers.length} total)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredUsers.map((u) => {
                      // Count total bookings for this user
                      const userBookingsCount = allBookings.filter(
                        b => b.userId === u.uid || (b.customerEmail && b.customerEmail === u.email) || (u.phone && b.customerPhone === u.phone)
                      ).length;

                      // Count leads for this user
                      const userLeadsCount = leads.filter(
                        l => l.userId === u.uid || (l.customerEmail && l.customerEmail === u.email)
                      ).length;

                      return (
                        <div 
                          key={u.uid}
                          className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-sky-400 shadow-xs hover:shadow-md transition-all space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-sm">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt={u.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                u.name ? u.name.charAt(0).toUpperCase() : 'U'
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-sm truncate">{u.name || 'Registered Rider'}</h4>
                              <p className="text-xs text-slate-500 truncate">{u.email || 'No email'}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                            <div>
                              <div className="text-slate-500 font-medium">Total Bookings</div>
                              <div className="text-emerald-700 font-extrabold text-sm">{userBookingsCount} rides</div>
                            </div>
                            <div>
                              <div className="text-slate-500 font-medium">Total Leads</div>
                              <div className="text-amber-700 font-extrabold text-sm">{userLeadsCount} inquiries</div>
                            </div>
                          </div>

                          {u.phone && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 font-medium">Phone:</span>
                              <a href={`tel:${u.phone}`} className="text-teal-800 font-mono font-bold hover:underline">
                                +91 {u.phone}
                              </a>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            {u.phone && (
                              <a
                                href={`https://wa.me/91${u.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center font-bold text-xs transition-colors"
                              >
                                WhatsApp
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery(u.email || u.name || '');
                                setActiveTab('bookings');
                              }}
                              className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-bold text-xs transition-colors cursor-pointer"
                            >
                              View Rides
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <div className="col-span-full p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                        No registered users found. Users who sign up with Google or Email appear here automatically.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- TAB 5: DATE-WISE ANALYTICS ----------------- */}
              {activeTab === 'datewise' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-700" />
                      Date-wise Activity & Conversion Ledger
                    </h3>
                  </div>

                  {/* MOBILE DATE-WISE CARDS (sm:hidden) */}
                  <div className="sm:hidden space-y-2.5">
                    {datewiseBreakdown.map((row) => {
                      const convRate = row.leadsCount > 0 ? ((row.convertedCount / row.leadsCount) * 100).toFixed(0) : '0';
                      return (
                        <div key={row.date} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-mono text-teal-800 text-xs">{row.date}</span>
                              {row.date === getTodayStr() && (
                                <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[9.5px] font-bold">Today</span>
                              )}
                            </div>
                            <span className="font-mono font-extrabold text-slate-900 text-xs">
                              ₹{row.revenue.toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                            <div>
                              <div className="text-[10px] text-slate-500 font-semibold">Leads</div>
                              <div className="text-xs font-bold text-amber-700">{row.leadsCount}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-semibold">Rides</div>
                              <div className="text-xs font-bold text-emerald-700">{row.bookingsCount}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-semibold">Conv %</div>
                              <div className="text-xs font-bold text-purple-700">{convRate}%</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setDatePreset('custom');
                              setCustomStartDate(row.date);
                              setCustomEndDate(row.date);
                              setActiveTab('leads');
                            }}
                            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-900 border border-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>View Detailed Leads & Rides</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {datewiseBreakdown.length === 0 && (
                      <div className="p-6 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
                        No records found for the selected dates.
                      </div>
                    )}
                  </div>

                  {/* DESKTOP TABLE (hidden sm:block) */}
                  <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[580px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5">Leads Captured</th>
                            <th className="p-3.5">Confirmed Rides</th>
                            <th className="p-3.5">Conversion %</th>
                            <th className="p-3.5">Total Revenue</th>
                            <th className="p-3.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {datewiseBreakdown.map((row) => {
                            const convRate = row.leadsCount > 0 ? ((row.convertedCount / row.leadsCount) * 100).toFixed(0) : '0';
                            return (
                              <tr key={row.date} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3.5 font-bold font-mono text-teal-800">
                                  {row.date}
                                  {row.date === getTodayStr() && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">Today</span>
                                  )}
                                </td>
                                <td className="p-3.5 font-bold text-amber-700">{row.leadsCount} leads</td>
                                <td className="p-3.5 font-bold text-emerald-700">{row.bookingsCount} rides</td>
                                <td className="p-3.5 font-bold text-purple-700">{convRate}%</td>
                                <td className="p-3.5 font-bold text-slate-900 font-mono">₹{row.revenue.toLocaleString()}</td>
                                <td className="p-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDatePreset('custom');
                                      setCustomStartDate(row.date);
                                      setCustomEndDate(row.date);
                                      setActiveTab('leads');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-teal-900 border border-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {datewiseBreakdown.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                                No records found for the selected dates.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 6: MANUAL DIRECT DISPATCH ----------------- */}
              {activeTab === 'dispatch' && (
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-5 shadow-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-600" />
                      Direct Manual Dispatch / Phone Booking
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Instantly confirm and dispatch a ride for a phone caller, WhatsApp inquiry, or live lead.
                    </p>
                  </div>

                  {dispatchSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{dispatchSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleManualDispatch} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Customer Name</label>
                        <input
                          type="text"
                          value={dispatchName}
                          onChange={(e) => setDispatchName(e.target.value)}
                          placeholder="Passenger Name"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Mobile Number (Required)</label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={dispatchPhone}
                          onChange={(e) => setDispatchPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit mobile number"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Pickup Address</label>
                      <input
                        type="text"
                        value={dispatchPickup}
                        onChange={(e) => setDispatchPickup(e.target.value)}
                        placeholder="Airport terminal, hotel or address"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Drop-off Destination</label>
                      <input
                        type="text"
                        value={dispatchDropoff}
                        onChange={(e) => setDispatchDropoff(e.target.value)}
                        placeholder="Destination address, town or landmark"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Travel Date</label>
                        <input
                          type="date"
                          value={dispatchDate}
                          onChange={(e) => setDispatchDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Pickup Time</label>
                        <input
                          type="time"
                          value={dispatchTime}
                          onChange={(e) => setDispatchTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Vehicle</label>
                        <select
                          value={dispatchVehicle}
                          onChange={(e) => setDispatchVehicle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium cursor-pointer"
                        >
                          <option value="Maruti Suzuki Dzire">Dzire (AC Sedan)</option>
                          <option value="Maruti Suzuki Ertiga">Ertiga (AC MUV)</option>
                          <option value="Hyundai Aura">Hyundai Aura</option>
                          <option value="Kia Carens">Kia Carens</option>
                          <option value="Toyota Innova Crysta">Innova Crysta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Total Fare (₹)</label>
                        <input
                          type="number"
                          value={dispatchFare}
                          onChange={(e) => setDispatchFare(e.target.value)}
                          placeholder="1100"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-mono font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Notes / Driver Instructions</label>
                      <input
                        type="text"
                        value={dispatchNotes}
                        onChange={(e) => setDispatchNotes(e.target.value)}
                        placeholder="e.g. Flight 6E 482 arrival, AC luggage assist needed"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-teal-700 focus:bg-white font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isDispatching}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-800 to-emerald-800 hover:from-teal-900 hover:to-emerald-900 text-white font-extrabold text-sm tracking-wide shadow-md transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isDispatching ? 'Creating Dispatch...' : '⚡ Confirm & Dispatch Trip to Firebase'}
                    </button>
                  </form>
                </div>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
