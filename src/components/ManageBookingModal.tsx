import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Ban,
  Download,
  Share2,
  Users,
  Copy
} from 'lucide-react';
import { Booking } from '../types';
import { db, doc, updateDoc } from '../firebase';
import { createBookingWhatsAppUrl, DISPLAY_PHONE_NUMBER } from '../utils/whatsapp';
import { syncUpdateBookingStatus } from '../services/dbSync';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allBookings: Booking[];
  onOpenLiveTrack?: (bookingRef: string) => void;
  onBookingUpdated?: (updated: Booking) => void;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  allBookings = [],
  onBookingUpdated,
}) => {
  const [searchPhoneOrRef, setSearchPhoneOrRef] = useState<string>('');
  const [localBookings, setLocalBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Sync bookings from localStorage + props whenever modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
        const combined = [...stored];
        allBookings.forEach(ab => {
          if (!combined.some(c => c.bookingRef === ab.bookingRef)) {
            combined.push(ab);
          }
        });
        setLocalBookings(combined);
        if (combined.length > 0 && !selectedBooking) {
          setSelectedBooking(combined[0]);
        } else if (combined.length > 0 && selectedBooking) {
          const match = combined.find(c => c.bookingRef === selectedBooking.bookingRef);
          if (match) setSelectedBooking(match);
        }
      } catch (e) {
        setLocalBookings(allBookings);
      }
    }
  }, [isOpen, allBookings]);

  const displayedList = localBookings.filter(b => {
    if (!searchPhoneOrRef.trim()) return true;
    const q = searchPhoneOrRef.trim().toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(q) ||
      (b.customerPhone && b.customerPhone.includes(q)) ||
      (b.customerName && b.customerName.toLowerCase().includes(q))
    );
  });

  const handleCopyRef = (ref: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(ref);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleCancelTrip = async () => {
    if (!selectedBooking) return;
    if (!window.confirm('Are you sure you want to cancel this booking? Free cancellation applies.')) return;

    setIsCancelling(true);
    try {
      await syncUpdateBookingStatus(
        selectedBooking.id,
        selectedBooking.bookingRef,
        'cancelled',
        'Customer cancelled booking via Manage Booking'
      );
      const updated = { ...selectedBooking, status: 'cancelled' as const };
      setSelectedBooking(updated);

      const updatedList = localBookings.map(b => b.bookingRef === updated.bookingRef ? updated : b);
      setLocalBookings(updatedList);

      if (onBookingUpdated) onBookingUpdated(updated);
      setCancelFeedback('Your booking has been marked as cancelled.');
    } catch (err) {
      console.warn('Trip cancel note:', err);
      const updated = { ...selectedBooking, status: 'cancelled' as const };
      setSelectedBooking(updated);
      setCancelFeedback('Your booking has been marked as cancelled.');
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
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-cyan-400/30 shrink-0 bg-slate-900 flex items-center justify-center">
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
                  <h3 className="font-bold text-base sm:text-lg">Booking History & My Bookings</h3>
                  <p className="text-[11px] text-teal-200">
                    Saved bookings on your device • Instant WhatsApp share to {DISPLAY_PHONE_NUMBER}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="relative">
                <input
                  type="text"
                  value={searchPhoneOrRef}
                  onChange={(e) => setSearchPhoneOrRef(e.target.value)}
                  placeholder="Filter by Mobile Number, Passenger Name or Booking ID (e.g. WAL-12345)..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
              </div>

              {/* Trip selector tabs */}
              {displayedList.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 overflow-x-auto text-xs pb-1">
                  <span className="text-slate-500 text-[11px] font-medium shrink-0">Your Bookings:</span>
                  {displayedList.map(b => (
                    <button
                      key={b.bookingRef}
                      type="button"
                      onClick={() => setSelectedBooking(b)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                        selectedBooking?.bookingRef === b.bookingRef 
                          ? 'bg-teal-700 text-white shadow-xs' 
                          : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.bookingRef} ({b.travelDate})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 max-h-[68vh] overflow-y-auto space-y-4">
              {selectedBooking ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-lg font-extrabold text-teal-400 font-mono">{selectedBooking.bookingRef}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRef(selectedBooking.bookingRef)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs"
                          title="Copy ID"
                        >
                          {copiedRef ? <span className="text-emerald-400 text-[10px]">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                      <div className="mt-0.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          selectedBooking.status === 'completed' ? 'bg-emerald-500 text-slate-950' :
                          selectedBooking.status === 'cancelled' ? 'bg-rose-500 text-white' :
                          'bg-teal-400 text-slate-950'
                        }`}>
                          {selectedBooking.status === 'confirmed' ? 'Booking Received' : selectedBooking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {cancelFeedback && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      {cancelFeedback}
                    </div>
                  )}

                  {/* Route & Schedule Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] uppercase font-bold text-emerald-700">Pickup Location</div>
                        <div className="font-semibold text-slate-900 mt-0.5">{selectedBooking.pickupLocation}</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] uppercase font-bold text-rose-700">Drop-off Destination</div>
                        <div className="font-semibold text-slate-900 mt-0.5">{selectedBooking.dropoffLocation}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-medium">Travel Date</div>
                        <div className="font-bold text-slate-900 mt-0.5">{selectedBooking.travelDate}</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-medium">Pickup Time</div>
                        <div className="font-bold text-slate-900 mt-0.5">{selectedBooking.pickupTime}</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-slate-400 font-medium">Cab Requested</div>
                        <div className="font-bold text-slate-900 mt-0.5">{selectedBooking.vehicleName || selectedBooking.vehicleCategory}</div>
                      </div>
                    </div>
                  </div>

                  {/* Passenger Information */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-teal-700" />
                        <span>Passenger & Contact Information</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-slate-500">Primary Contact:</span>{' '}
                        <strong className="text-slate-900 font-semibold">{selectedBooking.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Phone:</span>{' '}
                        <strong className="text-slate-900 font-semibold">+91 {selectedBooking.customerPhone}</strong>
                      </div>
                      {selectedBooking.customerEmail && (
                        <div className="col-span-1 sm:col-span-2">
                          <span className="text-slate-500">Email:</span>{' '}
                          <span className="text-slate-800">{selectedBooking.customerEmail}</span>
                        </div>
                      )}
                    </div>

                    {selectedBooking.passengers && selectedBooking.passengers.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500">All Passengers:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {[selectedBooking.customerName, ...selectedBooking.passengers].map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-200 font-medium text-[11px]">
                              {idx + 1}. {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedBooking.specialRequests && (
                      <div className="pt-2 border-t border-slate-100 text-slate-600">
                        <span className="font-semibold text-slate-700">Special Notes:</span> {selectedBooking.specialRequests}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: WhatsApp Send Button (Primary) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <a
                      href={createBookingWhatsAppUrl(selectedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:col-span-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Booking to WhatsApp (9110510236)</span>
                    </a>

                    <button
                      type="button"
                      onClick={handlePrintSlip}
                      className="py-3 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Slip</span>
                    </button>

                    {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={handleCancelTrip}
                        disabled={isCancelling}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer sm:col-span-3"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-10 text-center text-slate-500 text-xs space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Car className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-700 text-sm">No Bookings Found</div>
                  <p className="max-w-xs mx-auto text-slate-500">
                    You haven't made any bookings yet on this browser, or matching your search.
                  </p>
                </div>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
