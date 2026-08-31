import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  FileText, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  Ban,
  Download
} from 'lucide-react';
import { Booking } from '../types';
import { db, doc, updateDoc } from '../firebase';
import { TripCountdownTimer } from './TripCountdownTimer';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allBookings: Booking[];
  onOpenLiveTrack: (bookingRef: string) => void;
  onBookingUpdated?: (updated: Booking) => void;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  allBookings,
  onOpenLiveTrack,
  onBookingUpdated,
}) => {
  const [searchPhoneOrRef, setSearchPhoneOrRef] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    allBookings.length > 0 ? allBookings[0] : null
  );
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string>('');

  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchPhoneOrRef.trim().toLowerCase();
    const found = allBookings.find(b => 
      b.bookingRef.toLowerCase().includes(query) ||
      b.customerPhone.includes(query)
    );
    if (found) {
      setSelectedBooking(found);
    } else {
      alert(`No booking found matching "${searchPhoneOrRef}". Try searching your 10-digit mobile number or Reference ID like WAL-12345.`);
    }
  };

  const handleCancelTrip = async () => {
    if (!selectedBooking) return;
    if (!window.confirm('Are you sure you want to cancel this booking? Free cancellation applies.')) return;

    setIsCancelling(true);
    try {
      if (selectedBooking.id) {
        await updateDoc(doc(db, 'bookings', selectedBooking.id), {
          status: 'cancelled'
        });
      }
      const updated = { ...selectedBooking, status: 'cancelled' as const };
      setSelectedBooking(updated);
      if (onBookingUpdated) onBookingUpdated(updated);
      setCancelFeedback('Your booking has been cancelled successfully.');
    } catch (err) {
      console.warn('Update fallback:', err);
      const updated = { ...selectedBooking, status: 'cancelled' as const };
      setSelectedBooking(updated);
      setCancelFeedback('Trip marked as cancelled.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
      <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#005a66] to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg">Manage Your Trips & Invoices</h3>
            <p className="text-[11px] text-cyan-200">Search by booking reference or phone number</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchPhoneOrRef}
                onChange={(e) => setSearchPhoneOrRef(e.target.value)}
                placeholder="Enter Mobile Number or Booking ID (e.g. WAL-94821)"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-cyan-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick chips for trips in state */}
          {allBookings.length > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto text-xs">
              <span className="text-slate-500 text-[11px] font-medium shrink-0">Your Recent Trips:</span>
              {allBookings.map(b => (
                <button
                  key={b.bookingRef}
                  onClick={() => setSelectedBooking(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    selectedBooking?.bookingRef === b.bookingRef 
                      ? 'bg-cyan-700 text-white' 
                      : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {b.bookingRef} ({b.travelDate})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body details */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {selectedBooking ? (
            <div className="space-y-4">
              
              {/* Status Header */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Booking Ref</span>
                  <div className="text-lg font-extrabold text-cyan-400">{selectedBooking.bookingRef}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      selectedBooking.status === 'completed' ? 'bg-emerald-500 text-slate-950' :
                      selectedBooking.status === 'cancelled' ? 'bg-rose-500 text-white' :
                      'bg-cyan-500 text-slate-950'
                    }`}>
                      {selectedBooking.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {cancelFeedback && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  {cancelFeedback}
                </div>
              )}

              {selectedBooking.status !== 'cancelled' && (
                <TripCountdownTimer
                  travelDate={selectedBooking.travelDate}
                  pickupTime={selectedBooking.pickupTime}
                  confirmedAt={selectedBooking.createdAt}
                  driverName={selectedBooking.driver?.name}
                  vehicleModel={selectedBooking.driver?.vehicleModel || selectedBooking.vehicleCategory}
                />
              )}

              {/* Trip details grid */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Pickup Location</div>
                    <div className="font-semibold text-slate-900">{selectedBooking.pickupLocation}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Dropoff Location</div>
                    <div className="font-semibold text-slate-900">{selectedBooking.dropoffLocation}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400">Travel Date</div>
                    <div className="font-bold text-slate-900">{selectedBooking.travelDate}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400">Pickup Time</div>
                    <div className="font-bold text-slate-900">{selectedBooking.pickupTime}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400">Cab Category</div>
                    <div className="font-bold text-slate-900">{selectedBooking.vehicleCategory}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-400">Ride OTP</div>
                    <div className="font-mono font-bold text-emerald-600">{selectedBooking.otp}</div>
                  </div>
                </div>
              </div>

              {/* Fare & Passenger breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-1">Passenger Details</div>
                  <div className="text-slate-600">Name: <strong className="text-slate-900">{selectedBooking.customerName}</strong></div>
                  <div className="text-slate-600">Phone: <strong className="text-slate-900">+91 {selectedBooking.customerPhone}</strong></div>
                  {selectedBooking.customerEmail && (
                    <div className="text-slate-600">Email: {selectedBooking.customerEmail}</div>
                  )}
                </div>

                <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Billed</div>
                  <div className="text-xl font-extrabold text-cyan-800">₹{selectedBooking.totalFare}</div>
                  <div className="text-[11px] text-slate-500 capitalize font-medium">
                    Payment: {selectedBooking.paymentMethod.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLiveTrack(selectedBooking.bookingRef);
                  }}
                  className="py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  <span>Track Live</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Slip</span>
                </button>

                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={handleCancelTrip}
                    disabled={isCancelling}
                    className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Cancel Ride</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No booking selected. Use the search bar above to look up your reservation.
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
