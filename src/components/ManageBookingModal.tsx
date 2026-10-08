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
import { Booking, AppUser } from '../types';
import { db, doc, updateDoc } from '../firebase';
import { createBookingWhatsAppUrl, DISPLAY_PHONE_NUMBER } from '../utils/whatsapp';
import { syncFetchBookings, syncUpdateBookingStatus } from '../services/dbSync';

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allBookings?: Booking[];
  currentUser?: AppUser | null;
  onOpenLiveTrack?: (bookingRef: string) => void;
  onBookingUpdated?: (updated: Booking) => void;
  onOpenBookingFlow?: () => void;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({
  isOpen,
  onClose,
  allBookings = [],
  currentUser,
  onBookingUpdated,
  onOpenBookingFlow,
}) => {
  const [searchPhoneOrRef, setSearchPhoneOrRef] = useState<string>('');
  const [localBookings, setLocalBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'invoice'>('details');

  // Filter bookings belonging exclusively to this user
  const filterUserTrips = (list: Booking[]): Booking[] => {
    return list.filter(b => {
      if (!b || b.bookingRef === 'WAL-84920' || b.id === 'seed-wal-84920') return false;
      if (currentUser && (currentUser.email || currentUser.phone || currentUser.uid)) {
        if (currentUser.uid && b.userId === currentUser.uid) return true;
        if (currentUser.email && b.customerEmail && b.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return true;
        if (currentUser.phone && b.customerPhone && b.customerPhone.replace(/\D/g, '').endsWith(currentUser.phone.replace(/\D/g, '').slice(-10))) return true;
        // If created locally on this machine during current session
        return b.isRegistered === false;
      }
      return true;
    });
  };

  // Sync bookings from server API + local storage whenever modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      let isMounted = true;

      const loadTrips = async () => {
        try {
          const fresh = await syncFetchBookings({
            email: currentUser?.email || undefined,
            phone: currentUser?.phone || undefined,
            userId: currentUser?.uid || undefined,
          });

          if (!isMounted) return;

          const combined = filterUserTrips([...allBookings, ...fresh]);
          // Deduplicate by bookingRef
          const uniqueMap = new Map<string, Booking>();
          combined.forEach(b => {
            if (b.bookingRef) uniqueMap.set(b.bookingRef, b);
          });
          const uniqueList = Array.from(uniqueMap.values());

          setLocalBookings(uniqueList);
          if (uniqueList.length > 0) {
            setSelectedBooking(prev => {
              if (prev && uniqueList.some(u => u.bookingRef === prev.bookingRef)) {
                return uniqueList.find(u => u.bookingRef === prev.bookingRef) || uniqueList[0];
              }
              return uniqueList[0];
            });
          } else {
            setSelectedBooking(null);
          }
        } catch (e) {
          if (!isMounted) return;
          const fallback = filterUserTrips(allBookings);
          setLocalBookings(fallback);
          setSelectedBooking(fallback[0] || null);
        }
      };

      loadTrips();

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, currentUser, allBookings]);

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
                  className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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

                  {/* View Mode Toggle: Details vs Tax Invoice */}
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === 'details' ? 'bg-teal-850 bg-teal-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Trip Summary & Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('invoice')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'invoice' ? 'bg-teal-850 bg-teal-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Tax Invoice & Invoices</span>
                    </button>
                  </div>

                  {activeTab === 'details' ? (
                    <>
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
                    </>
                  ) : (
                    /* Invoice & GST Receipt Card */
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Digital Trip Invoice</div>
                          <div className="font-bold text-slate-900 text-sm font-mono">INV-{selectedBooking.bookingRef}</div>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-teal-100 text-teal-900 border border-teal-300/80 font-bold">
                          GSTIN: 37AAECW1234F1Z5
                        </span>
                      </div>

                      {/* Billed To */}
                      <div className="bg-white p-3 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Billed To</span>
                          <span className="font-bold text-slate-900">{selectedBooking.customerName}</span>
                          <div className="text-[11px] text-slate-500">+91 {selectedBooking.customerPhone}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Date of Service</span>
                          <span className="font-bold text-slate-900">{selectedBooking.travelDate} at {selectedBooking.pickupTime}</span>
                          <div className="text-[11px] text-slate-500">{selectedBooking.vehicleName || selectedBooking.vehicleCategory}</div>
                        </div>
                      </div>

                      {/* Itemized Fare Table */}
                      <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-100">
                        <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                          <span>Base Fare & Running ({selectedBooking.estimatedDistanceKm || 30} km)</span>
                          <span className="font-semibold text-slate-900">
                            ₹{(selectedBooking.baseFare || Math.round((selectedBooking.totalFare || 1000) * 0.85)).toLocaleString()}
                          </span>
                        </div>

                        {selectedBooking.tollCharges ? (
                          <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                            <span>Toll Charges & Parking</span>
                            <span className="font-semibold text-slate-900">₹{selectedBooking.tollCharges.toLocaleString()}</span>
                          </div>
                        ) : null}

                        <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                          <span>GST (5% Passenger Road Transport)</span>
                          <span className="font-semibold text-slate-900">
                            ₹{(selectedBooking.gstAmount || Math.round((selectedBooking.totalFare || 1000) * 0.05)).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 text-sm font-extrabold text-slate-900">
                          <span>Total Amount Due / Paid</span>
                          <span className="text-teal-800 font-mono text-base">₹{(selectedBooking.totalFare || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-emerald-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-xs">Payment Method:</span>
                          <span className="font-bold text-xs uppercase">{selectedBooking.paymentMethod ? selectedBooking.paymentMethod.replace(/_/g, ' ') : 'Cash to Driver'}</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700">GST Invoice Ready</span>
                      </div>
                    </div>
                  )}

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
                      <span>Print Invoice Slip</span>
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
                <div className="p-8 sm:p-10 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center mx-auto shadow-xs">
                    <Car className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base">No Bookings Found Yet</div>
                    <p className="max-w-xs mx-auto text-slate-500 text-xs mt-1">
                      {currentUser?.email || currentUser?.phone 
                        ? `No trip reservations associated with ${currentUser.email || currentUser.phone}.` 
                        : "You haven't reserved any rides yet on this device."}
                    </p>
                  </div>
                  {onOpenBookingFlow && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenBookingFlow();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-sm transition-all cursor-pointer mt-2"
                    >
                      <span>Book a Verified Cab Now</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
