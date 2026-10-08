import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Car, 
  MapPin, 
  Calendar, 
  Phone, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ServiceCategory, TripSubType, Booking } from '../types';
import { GooglePlacesAutocompleteInput } from './GooglePlacesAutocompleteInput';
import { db, collection, addDoc } from '../firebase';
import { createBookingWhatsAppUrl } from '../utils/whatsapp';
import confetti from 'canvas-confetti';
import { trackFieldFootprint, markLeadConverted, getOrCreateLeadSessionId } from '../services/leadTrackingService';
import { trackBookingStart, trackBookingSubmit, trackLeadGenerated, trackWhatsAppClick } from '../services/analyticsService';
import { syncSaveBooking } from '../services/dbSync';

interface FastBookingBarProps {
  currentCity: string;
  onInitiateBooking: (bookingData: {
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone: string;
    preSelectedVehicleId?: string;
  }) => void;
  onBookingSuccess?: (booking: Booking) => void;
  hideOnPages?: string[];
  currentPage?: string;
}

export const FastBookingBar: React.FC<FastBookingBarProps> = ({
  currentCity,
  onInitiateBooking,
  onBookingSuccess,
  currentPage = 'home'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickup, setPickup] = useState('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
  const [dropoff, setDropoff] = useState('Siripuram Circle, Visakhapatnam');
  const [selectedVehicle, setSelectedVehicle] = useState<'dzire' | 'ertiga' | 'crysta'>('dzire');
  const [mobile, setMobile] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('10:30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);

  // If on booking page, hide the floating bar to avoid redundant CTA
  if (currentPage === 'booking') return null;

  const vehicleOptions = {
    dzire: { name: 'Maruti Dzire (AC Sedan)', capacity: '4 Seats' },
    ertiga: { name: 'Maruti Ertiga (AC MUV)', capacity: '6-7 Seats' },
    crysta: { name: 'Innova Crysta (Premium)', capacity: '7 Seats' },
  };

  const syncFootprint = (overrides?: {
    field?: string;
    phone?: string;
    name?: string;
    pickup?: string;
    dropoff?: string;
    vehicle?: string;
  }) => {
    trackFieldFootprint({
      source: 'fast_bar',
      serviceType: 'airport',
      subType: 'pickup',
      customerPhone: overrides?.phone !== undefined ? overrides.phone : mobile,
      customerName: overrides?.name !== undefined ? overrides.name : passengerName,
      pickupLocation: overrides?.pickup !== undefined ? overrides.pickup : pickup,
      dropoffLocation: overrides?.dropoff !== undefined ? overrides.dropoff : dropoff,
      travelDate,
      pickupTime,
      vehicleCategory: selectedVehicle === 'dzire' ? 'Sedan' : 'SUV',
      vehicleName: vehicleOptions[selectedVehicle].name,
      lastFieldChanged: overrides?.field || 'Fast booking interaction',
    });
  };

  const handleQuickBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !dropoff.trim()) return;
    const cleanPhone = mobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for booking confirmation');
      return;
    }

    setIsSubmitting(true);
    const bookingRef = `WAL-${Math.floor(10000 + Math.random() * 90000)}`;

    const userSession = (() => {
      try {
        const u = localStorage.getItem('waltair_user_session');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    const activeLeadId = getOrCreateLeadSessionId();

    const newBooking: Booking = {
      bookingRef,
      customerName: passengerName.trim() || 'Valued Passenger',
      customerPhone: cleanPhone,
      serviceType: 'airport',
      subType: 'pickup',
      pickupLocation: pickup.trim(),
      dropoffLocation: dropoff.trim(),
      travelDate,
      pickupTime,
      vehicleCategory: selectedVehicle === 'dzire' ? 'Sedan' : 'SUV',
      vehicleName: vehicleOptions[selectedVehicle].name,
      estimatedDistanceKm: 42,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      city: currentCity,
      isRegistered: Boolean(userSession),
      userId: userSession?.uid,
      leadId: activeLeadId
    };

    try {
      const saved = await syncSaveBooking(newBooking);
      newBooking.id = saved.id;

      // Mark lead converted in real time
      markLeadConverted(bookingRef, activeLeadId);
      trackBookingSubmit(bookingRef, 'airport');
      trackLeadGenerated('fast_booking_bar', cleanPhone);

      try {
        localStorage.setItem('waltair_last_booking', JSON.stringify(newBooking));
      } catch {}

      setBookingConfirmed(newBooking);
      if (onBookingSuccess) onBookingSuccess(newBooking);

      try {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error(e);
      setBookingConfirmed(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. Global Floating Pill Bar (Hidden on Mobile, Visible on Desktop/Tablet) */}
      <aside aria-label="Express Quick Booking" className="hidden md:block fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28, delay: 0.4 }}
          className="bg-slate-950/95 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-slate-950/70 flex items-center justify-between gap-2.5 text-white"
        >
          {/* Status info */}
          <div className="flex items-center gap-2.5 pl-2 overflow-hidden">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </div>
            <div className="text-left truncate">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                <span className="text-teal-300">18 Cabs Available</span>
                <span className="text-slate-400 hidden xs:inline">•</span>
                <span className="text-emerald-400 font-semibold text-[11px] hidden xs:inline">Avg 6 min pickup</span>
              </div>
              <div className="text-[10px] text-slate-300 truncate">
                Bhogapuram Airport & Visakhapatnam City
              </div>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="https://wa.me/919110510236?text=Hi%20Waltair%20Travels,%20I%20want%20to%20express%20book%20a%20cab%20now."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('fast_bar')}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
              title="Chat & Book on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setIsOpen(true);
                trackBookingStart('fast_bar');
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-1.5 shadow-lg shadow-teal-500/25 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚡ Fast Book (10s)</span>
            </motion.button>
          </div>
        </motion.div>
      </aside>

      {/* 2. Instant 10-Second Express Booking Modal / Bottom-Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden max-h-[92vh] flex flex-col text-slate-900"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                    <Zap className="w-4 h-4 fill-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-1.5">
                      <span>Express 10-Second Booking</span>
                      <span className="text-[10px] uppercase tracking-wider bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full font-black">Fast-Track</span>
                    </h3>
                    <p className="text-[11px] text-teal-200/80">No waiting. Instant confirmed chauffeur assignment.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setBookingConfirmed(null);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-4">
                {bookingConfirmed ? (
                  /* Confirmed View */
                  <div className="text-center py-4 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-900">Ride Confirmed!</h4>
                      <p className="text-xs text-slate-600 mt-1">Booking Reference: <span className="font-bold text-teal-800">{bookingConfirmed.bookingRef}</span></p>
                      <p className="text-xs text-slate-500 mt-0.5">Your driver will arrive at {bookingConfirmed.pickupLocation.slice(0, 30)}... on {bookingConfirmed.travelDate} at {bookingConfirmed.pickupTime}.</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Vehicle:</span>
                        <span className="text-slate-900">{bookingConfirmed.vehicleName}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Pricing:</span>
                        <span className="text-teal-700 font-bold">Custom Quote on Request</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Next Step:</span>
                        <span className="text-slate-900">Send to WhatsApp to confirm trip</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={createBookingWhatsAppUrl(bookingConfirmed)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackWhatsAppClick('fast_bar_confirmed')}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send Details to WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setBookingConfirmed(null);
                        }}
                        className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Express Booking Form */
                  <form onSubmit={handleQuickBookSubmit} className="space-y-4">
                    
                    {/* Fast Route selection */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Pickup Location
                        </label>
                        <GooglePlacesAutocompleteInput
                          id="fast-pickup"
                          label=""
                          value={pickup}
                          onChange={(val) => {
                            setPickup(val);
                            syncFootprint({ pickup: val, field: `FastBar pickup: ${val}` });
                          }}
                          placeholder="Pickup address, terminal or hotel"
                          iconType="pickup"
                          cityBias={currentCity}
                          compact={true}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Drop-off Destination
                        </label>
                        <GooglePlacesAutocompleteInput
                          id="fast-dropoff"
                          label=""
                          value={dropoff}
                          onChange={(val) => {
                            setDropoff(val);
                            syncFootprint({ dropoff: val, field: `FastBar dropoff: ${val}` });
                          }}
                          placeholder="Destination address or landmark"
                          iconType="dropoff"
                          cityBias={currentCity}
                          compact={true}
                          required
                        />
                      </div>

                      {/* Fast Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick:</span>
                        {[
                          { label: '✈️ Bhogapuram (ASI)', loc: 'Alluri Sitharama Raju International Airport (ASI), Bhogapuram' },
                          { label: '✈️ Vizag VTZ', loc: 'Visakhapatnam International Airport (VTZ), NAD Junction' },
                          { label: '🏖️ Rushikonda', loc: 'Rushikonda Beach & IT SEZ, Visakhapatnam' },
                          { label: '⛰️ Araku Valley', loc: 'Araku Valley Hill Station & Tribal Museum' },
                        ].map((chip) => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => {
                              setDropoff(chip.loc);
                              syncFootprint({ dropoff: chip.loc, field: `FastBar quick chip: ${chip.label}` });
                            }}
                            className="text-[10px] px-2 py-1 rounded-full bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 font-medium whitespace-nowrap transition-colors"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vehicle Quick Choice Grid */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Select Cab Class (Guaranteed AC)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'dzire', name: 'Dzire Sedan', seat: '4 Seater' },
                          { id: 'ertiga', name: 'Ertiga MUV', seat: '6 Seater' },
                          { id: 'crysta', name: 'Innova Crysta', seat: '7 Seater' },
                        ].map((v) => {
                          const isSel = selectedVehicle === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                setSelectedVehicle(v.id as any);
                                syncFootprint({ vehicle: v.name, field: `FastBar cab class: ${v.name}` });
                              }}
                              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                isSel 
                                  ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20 shadow-xs' 
                                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <Car className={`w-4 h-4 ${isSel ? 'text-teal-700' : 'text-slate-500'}`} />
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isSel ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                  {isSel ? 'Selected' : 'Available'}
                                </span>
                              </div>
                              <div className="font-bold text-xs text-slate-900 leading-tight">{v.name}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{v.seat}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Date</label>
                        <input
                          type="date"
                          value={travelDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            setTravelDate(e.target.value);
                            syncFootprint({ field: `FastBar date: ${e.target.value}` });
                          }}
                          className="w-full text-base sm:text-xs font-semibold bg-transparent outline-none cursor-pointer"
                          required
                        />
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Time</label>
                        <input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => {
                            setPickupTime(e.target.value);
                            syncFootprint({ field: `FastBar time: ${e.target.value}` });
                          }}
                          className="w-full text-base sm:text-xs font-semibold bg-transparent outline-none cursor-pointer"
                          required
                        />
                      </div>
                    </div>

                    {/* Passenger details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Passenger Name</label>
                        <input
                          type="text"
                          value={passengerName}
                          onChange={(e) => {
                            setPassengerName(e.target.value);
                            syncFootprint({ name: e.target.value, field: `FastBar name: ${e.target.value}` });
                          }}
                          placeholder="Your Name"
                          className="w-full text-base sm:text-xs font-semibold bg-transparent outline-none placeholder:text-slate-400"
                          required
                        />
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Mobile (10 digits)</label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">+91</span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setMobile(val);
                              syncFootprint({ phone: val, field: val ? `FastBar phone: +91 ${val}` : 'Cleared phone' });
                            }}
                            placeholder="98765 43210"
                            className="w-full text-base sm:text-xs font-semibold bg-transparent outline-none placeholder:text-slate-400"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Booking...</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white" />
                          <span>⚡ Instant Confirm & Request Booking</span>
                        </>
                      )}
                    </motion.button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Zero Cancellation Charge</span>
                      </span>
                      <span>Pay after trip completion</span>
                    </div>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
