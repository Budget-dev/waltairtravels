import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from '../firebase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  allBookings: Booking[];
  onRefresh: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  allBookings,
  onRefresh,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchKey, setSearchKey] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  

  const totalRevenue = allBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalFare || 0), 0);

  const activeRides = allBookings.filter(b => 
    b.status === 'confirmed' || b.status === 'driver_assigned' || b.status === 'on_the_way' || b.status === 'trip_started'
  ).length;

  const completedCount = allBookings.filter(b => b.status === 'completed').length;

  const handleUpdateStatus = async (bookingId: string | undefined, newStatus: BookingStatus) => {
    if (!bookingId) return;
    setIsUpdating(true);
    try {
      if (!bookingId.startsWith('local-')) {
        await updateDoc(doc(db, 'bookings', bookingId), {
          status: newStatus
        });
      }
      onRefresh();
    } catch (err) {
      console.warn('Error updating status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (bookingId: string | undefined) => {
    if (!bookingId || !window.confirm('Delete this booking record?')) return;
    try {
      if (!bookingId.startsWith('local-')) {
        await deleteDoc(doc(db, 'bookings', bookingId));
      }
      onRefresh();
    } catch (err) {
      console.warn('Error deleting:', err);
    }
  };

  const filtered = allBookings.filter(b => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch = b.bookingRef.toLowerCase().includes(searchKey.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchKey.toLowerCase()) ||
      b.customerPhone.includes(searchKey);
    return matchStatus && matchSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
      <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-800 text-white overflow-hidden relative flex flex-col max-h-[90vh]"
        >
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-cyan-500/30 shrink-0 bg-slate-900 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Waltair Travels" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Glossy%20WT%20Road%20Trip%20App%20Icon.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Waltair Fleet Operations & Dispatch Console</h3>
              <p className="text-xs text-cyan-400">Live Firebase Firestore Synchronization</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Sync Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Live</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700">
            <div className="text-xs text-slate-400">Total Bookings</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">{allBookings.length}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700">
            <div className="text-xs text-slate-400">Active Live Trips</div>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 mt-1">{activeRides}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700">
            <div className="text-xs text-slate-400">Completed Trips</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">{completedCount}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700">
            <div className="text-xs text-slate-400">Total Revenue</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1 flex items-center">
              <IndianRupee className="w-4 h-4" />
              <span>{totalRevenue}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'driver_assigned', 'on_the_way', 'completed', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  filterStatus === st 
                    ? 'bg-cyan-700 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Filter by ref, phone or name..."
            className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Bookings Table / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length > 0 ? (
            filtered.map((b) => (
              <div
                key={b.id || b.bookingRef}
                className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 hover:border-cyan-500 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-cyan-400 font-mono">{b.bookingRef}</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      b.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400">OTP: <strong className="text-emerald-400 font-mono">{b.otp}</strong></span>
                    <span className="text-slate-400">• {b.travelDate} at {b.pickupTime}</span>
                  </div>

                  <div className="text-slate-200">
                    <strong>{b.customerName}</strong> (<a href={`tel:${b.customerPhone}`} className="text-cyan-400 hover:underline">+91 {b.customerPhone}</a>)
                    <span className="text-slate-400 ml-2">[{b.vehicleCategory} - {b.vehicleName}]</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px] pt-1">
                    <div>Pickup: <span className="text-slate-100">{b.pickupLocation}</span></div>
                    <div>Drop: <span className="text-slate-100">{b.dropoffLocation}</span></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-700 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-white">{b.totalFare ? `₹${b.totalFare}` : 'Quote on Request'}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{b.paymentMethod ? b.paymentMethod.replace('_', ' ') : 'WhatsApp Dispatch'}</div>
                  </div>

                  {/* Status update quick dropdown */}
                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-600 text-white text-xs font-semibold focus:outline-none"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="driver_assigned">Driver Assigned</option>
                    <option value="on_the_way">On The Way</option>
                    <option value="trip_started">Trip Started</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No bookings matching the current filter.
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
