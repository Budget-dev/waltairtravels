import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Share2, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Car, 
  Search, 
  Sparkles,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { Booking } from '../types';
import { db, collection, getDocs } from '../firebase';

interface LiveTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRefQuery?: string;
  allBookings: Booking[];
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  isOpen,
  onClose,
  bookingRefQuery = '',
  allBookings,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(bookingRefQuery || '');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [driverProgress, setDriverProgress] = useState<number>(35); // percentage along route
  const [etaMinutes, setEtaMinutes] = useState<number>(8);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Search or select booking
  useEffect(() => {
    if (bookingRefQuery) {
      setSearchQuery(bookingRefQuery);
      const found = allBookings.find(b => 
        b.bookingRef.toLowerCase() === bookingRefQuery.toLowerCase() ||
        b.customerPhone.includes(bookingRefQuery)
      );
      if (found) {
        setActiveBooking(found);
      }
    } else if (allBookings.length > 0 && !activeBooking) {
      setActiveBooking(allBookings[0]);
    }
  }, [bookingRefQuery, allBookings]);

  // Live driver movement animation simulation
  useEffect(() => {
    if (!isOpen || !activeBooking) return;
    const interval = setInterval(() => {
      setDriverProgress(prev => {
        if (prev >= 95) return 20;
        return prev + 2;
      });
      setEtaMinutes(prev => Math.max(1, prev > 1 ? prev - (Math.random() > 0.7 ? 1 : 0) : 8));
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, activeBooking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryClean = searchQuery.trim().toLowerCase();
    const found = allBookings.find(b => 
      b.bookingRef.toLowerCase().includes(queryClean) ||
      b.customerPhone.includes(queryClean)
    );
    if (found) {
      setActiveBooking(found);
    } else {
      alert(`No active trip found for "${searchQuery}". Please check your booking reference or phone number.`);
    }
  };

  const handleShareTrip = () => {
    if (!activeBooking) return;
    const shareText = `Live Tracking: My Waltair Travels taxi (${activeBooking.driver?.vehicleNumber || 'AP31'}) is en route. Booking Ref: ${activeBooking.bookingRef}. Track live at: ${window.location.origin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
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
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#005a66] to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-700/80 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Live Ride GPS Tracking</h3>
              <p className="text-[11px] text-cyan-200">Real-time driver location & route telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar for Booking Reference */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Booking Ref (e.g. WAL-94821) or Mobile"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-cyan-600 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold transition-colors"
            >
              Track
            </button>
          </form>

          {allBookings.length > 1 && (
            <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto overflow-x-auto">
              <span className="font-medium shrink-0">Recent Trips:</span>
              {allBookings.slice(0, 3).map(b => (
                <button
                  key={b.bookingRef}
                  onClick={() => setActiveBooking(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    activeBooking?.bookingRef === b.bookingRef 
                      ? 'bg-cyan-700 text-white' 
                      : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {b.bookingRef}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content: Map & Ride status */}
        {activeBooking ? (
          <div className="p-4 sm:p-6 space-y-5">
            
            {/* Interactive Vector Map Simulator */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner">
              
              {/* Map grid lines / styling */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Visakhapatnam Road Network Overlay lines */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 600 300">
                {/* Coastal Highway Route */}
                <path
                  d="M 60 220 Q 200 190 300 130 T 540 80"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 220 Q 200 190 300 130 T 540 80"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />

                {/* City Center Branch */}
                <path
                  d="M 220 280 L 300 130 L 380 40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="6"
                />

                {/* Pickup Marker */}
                <g transform="translate(60, 220)">
                  <circle r="14" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                  <circle r="8" fill="#10b981" />
                  <text x="12" y="4" fill="#10b981" fontSize="11" fontWeight="bold">Pickup: {activeBooking.pickupLocation.slice(0, 18)}...</text>
                </g>

                {/* Dropoff Marker */}
                <g transform="translate(540, 80)">
                  <circle r="14" fill="#06b6d4" fillOpacity="0.3" />
                  <circle r="8" fill="#06b6d4" />
                  <text x="-160" y="4" fill="#38bdf8" fontSize="11" fontWeight="bold">Drop: {activeBooking.dropoffLocation.slice(0, 18)}...</text>
                </g>
              </svg>

              {/* Animated Moving Cab Icon along percentage */}
              <div 
                className="absolute transition-all duration-1000 ease-linear flex flex-col items-center pointer-events-none z-20"
                style={{
                  left: `${Math.min(88, Math.max(12, 10 + (driverProgress * 0.78)))}%`,
                  top: `${Math.max(15, 75 - (driverProgress * 0.55))}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="bg-slate-900 text-cyan-400 border border-cyan-500/50 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg whitespace-nowrap mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {activeBooking.driver?.name?.split(' ')[0] || 'Driver'} (~{etaMinutes}m ETA)
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-700 text-white flex items-center justify-center shadow-xl ring-4 ring-cyan-500/30">
                  <Car className="w-5 h-5" />
                </div>
              </div>

              {/* Floating Speed & Telemetry Widget */}
              <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-white text-xs flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Speed</span>
                  <div className="font-mono font-bold text-cyan-400">48 km/h</div>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Live Traffic</span>
                  <div className="text-emerald-400 font-bold">Fast / Green</div>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                  <div className="text-cyan-300 font-bold uppercase">{activeBooking.status.replace('_', ' ')}</div>
                </div>
              </div>

              {/* Refresh live link */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GPS Active
                </span>
              </div>

            </div>

            {/* Driver Profile & Vehicle Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Driver Box */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeBooking.driver?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                    alt="Driver"
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-600 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">{activeBooking.driver?.name || 'K. Satish Varma'}</h4>
                      <span className="text-xs bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">
                        ★ {activeBooking.driver?.rating || 4.9}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {activeBooking.driver?.vehicleModel || activeBooking.vehicleName}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-cyan-800">
                      {activeBooking.driver?.vehicleNumber || 'AP 31 TH 7842'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeBooking.driver?.phone || '+919123456789'}`}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Call Driver"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                </div>
              </div>

              {/* Ride Start OTP Card */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] uppercase font-bold text-cyan-900 tracking-wider">
                  Ride Start OTP
                </span>
                <span className="text-2xl font-mono font-extrabold text-cyan-950 tracking-widest my-0.5">
                  {activeBooking.otp || '4821'}
                </span>
                <span className="text-[10px] text-slate-500">Share with chauffeur when entering</span>
              </div>

            </div>

            {/* Trip Details Checklist */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Pickup</span>
                <div className="font-semibold text-slate-900 truncate">{activeBooking.pickupLocation}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Destination</span>
                <div className="font-semibold text-slate-900 truncate">{activeBooking.dropoffLocation}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Schedule</span>
                <div className="font-semibold text-slate-900">{activeBooking.travelDate} at {activeBooking.pickupTime}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Fare & Status</span>
                <div className="font-bold text-cyan-800">₹{activeBooking.totalFare} ({activeBooking.paymentMethod.replace('_', ' ')})</div>
              </div>
            </div>

            {/* Action Bar: SOS, Share Trip, Support */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSosActive(!sosActive)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    sosActive 
                      ? 'bg-rose-600 text-white animate-bounce' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{sosActive ? '🚨 SOS Alert Dispatched to Police & Waltair HQ' : 'Emergency SOS'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareTrip}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Tracking Link Copied!' : 'Share Trip with Family'}</span>
                </button>
              </div>

              <a
                href="tel:+919123456789"
                className="text-xs text-cyan-700 hover:underline font-semibold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                24x7 Control Room: +91 91234 56789
              </a>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800">No active ride selected</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please enter your Booking Reference (e.g. WAL-10293) or the 10-digit mobile number used while booking.
            </p>
          </div>
        )}

      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
