import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Car, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Mail, 
  Plus,
  Trash2,
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  AlertCircle,
  Compass, 
  CheckCircle2, 
  ArrowUpDown, 
  Navigation, 
  Edit3, 
  ArrowRight, 
  Copy, 
  Share2,
  Users,
  MessageCircle,
  FileText,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ServiceCategory, TripSubType, Vehicle, Booking } from '../types';
import { db, collection, addDoc } from '../firebase';
import { GooglePlacesAutocompleteInput, SelectedPlaceData } from '../components/GooglePlacesAutocompleteInput';
import { LeafletRouteMap } from '../components/LeafletRouteMap';
import { useVehicles } from '../hooks/useVehicles';
import { CURATED_AP_LOCATIONS } from '../utils/placesService';
import { createBookingWhatsAppUrl, DISPLAY_PHONE_NUMBER, WHATSAPP_PHONE_NUMBER } from '../utils/whatsapp';
import { trackFieldFootprint, markLeadConverted, getOrCreateLeadSessionId } from '../services/leadTrackingService';
import { syncSaveBooking } from '../services/dbSync';
import { SEOHead } from '../components/SEOHead';

interface BookingPageProps {
  onNavigateHome: () => void;
  initialData: {
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone?: string;
    preSelectedVehicleId?: string;
    pickupCoords?: { lat?: number; lng?: number } | null;
    dropoffCoords?: { lat?: number; lng?: number } | null;
  } | null;
  currentCity: string;
  onBookingSuccess: (booking: Booking) => void;
  onOpenBookingHistory?: () => void;
  onOpenLiveTrack?: (bookingId: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onNavigateHome,
  initialData,
  currentCity,
  onBookingSuccess,
  onOpenBookingHistory,
}) => {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bookingMode, setBookingMode] = useState<'express' | 'customizer'>('express');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Try loading saved draft from localStorage so refresh NEVER wipes out data
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem('waltair_booking_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const draft = getSavedDraft();

  // Location and itinerary states
  const [pickupLocation, setPickupLocation] = useState<string>(() => initialData?.pickupLocation || draft?.pickupLocation || '');
  const [dropoffLocation, setDropoffLocation] = useState<string>(() => initialData?.dropoffLocation || draft?.dropoffLocation || '');
  const [pickupCoords, setPickupCoords] = useState<{ lat?: number; lng?: number } | null>(() => initialData?.pickupCoords || draft?.pickupCoords || null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat?: number; lng?: number } | null>(() => initialData?.dropoffCoords || draft?.dropoffCoords || null);
  const [showRouteMap, setShowRouteMap] = useState<boolean>(true);
  const [travelDate, setTravelDate] = useState<string>(() => initialData?.travelDate || draft?.travelDate || new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState<string>(() => initialData?.pickupTime || draft?.pickupTime || '10:30');
  const [serviceType, setServiceType] = useState<ServiceCategory>(() => initialData?.serviceType || draft?.serviceType || 'airport');
  const [subType, setSubType] = useState<TripSubType>(() => initialData?.subType || draft?.subType || 'pickup');

  // Passenger details
  const [customerName, setCustomerName] = useState<string>(() => draft?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState<string>(() => initialData?.phone || draft?.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(() => draft?.customerEmail || '');
  const [additionalPassengers, setAdditionalPassengers] = useState<string[]>(() => draft?.additionalPassengers || []);
  const [specialRequests, setSpecialRequests] = useState<string>(() => draft?.specialRequests || '');

  // Submission & Confirmation states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(() => {
    try {
      const last = localStorage.getItem('waltair_last_booking');
      return last ? JSON.parse(last) : null;
    } catch {
      return null;
    }
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [activeExpressSection, setActiveExpressSection] = useState<'pickup' | 'cab' | 'passenger'>('pickup');

  // Track active section on mobile in Express Fast Book mode
  useEffect(() => {
    if (bookingMode !== 'express' || step >= 4) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'express-pickup-card') {
              setActiveExpressSection('pickup');
            } else if (entry.target.id === 'vehicle-selection-section') {
              setActiveExpressSection('cab');
            } else if (entry.target.id === 'passenger-info-section') {
              setActiveExpressSection('passenger');
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    const el1 = document.getElementById('express-pickup-card');
    const el2 = document.getElementById('vehicle-selection-section');
    const el3 = document.getElementById('passenger-info-section');

    if (el1) observer.observe(el1);
    if (el2) observer.observe(el2);
    if (el3) observer.observe(el3);

    return () => observer.disconnect();
  }, [bookingMode, step]);

  // Calculate estimated road distance
  const calculateDistance = (): number => {
    if (pickupCoords?.lat && pickupCoords?.lng && dropoffCoords?.lat && dropoffCoords?.lng) {
      const R = 6371; // Earth radius km
      const dLat = (dropoffCoords.lat - pickupCoords.lat) * (Math.PI / 180);
      const dLon = (dropoffCoords.lng - pickupCoords.lng) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupCoords.lat * (Math.PI / 180)) * Math.cos(dropoffCoords.lat * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.max(5, Math.round(R * c * 1.3));
    }

    const p = (pickupLocation || '').toLowerCase();
    const d = (dropoffLocation || '').toLowerCase();

    if (p.includes('araku') || d.includes('araku')) return 115;
    if (p.includes('vijayawada') || d.includes('vijayawada')) return 350;
    if (p.includes('rajahmundry') || d.includes('rajahmundry')) return 190;
    if (p.includes('kakinada') || d.includes('kakinada')) return 155;
    if (p.includes('srikakulam') || d.includes('srikakulam')) return 105;
    if (p.includes('annavaram') || d.includes('annavaram')) return 125;
    if (p.includes('bhogapuram') || d.includes('bhogapuram')) return 42;
    if (p.includes('rushikonda') || d.includes('rushikonda')) return 24;
    if (p.includes('gajuwaka') || d.includes('gajuwaka')) return 22;
    if (p.includes('airport') || d.includes('airport')) return 32;
    if (serviceType === 'local') {
      if (subType === 'local_4hr') return 40;
      if (subType === 'local_8hr') return 80;
      if (subType === 'local_12hr') return 120;
    }
    return 28;
  };

  const estimatedKm = calculateDistance();

  // Persist draft to localStorage on any field change so refreshing never loses entered data
  useEffect(() => {
    try {
      const currentDraft = {
        pickupLocation,
        dropoffLocation,
        pickupCoords,
        dropoffCoords,
        travelDate,
        pickupTime,
        serviceType,
        subType,
        customerName,
        customerPhone,
        customerEmail,
        additionalPassengers,
        specialRequests,
        selectedVehicleId: selectedVehicle?.id
      };
      localStorage.setItem('waltair_booking_draft', JSON.stringify(currentDraft));

      // Real-time Footprint Tracking - captures partial field entries as live leads
      if (pickupLocation || dropoffLocation || customerPhone || customerName || customerEmail) {
        trackFieldFootprint({
          source: 'booking_page',
          pickupLocation,
          dropoffLocation,
          travelDate,
          pickupTime,
          serviceType,
          subType,
          customerName,
          customerPhone,
          customerEmail,
          vehicleName: selectedVehicle?.name,
          vehicleCategory: selectedVehicle?.category,
          estimatedDistanceKm: estimatedKm,
          lastFieldChanged: customerPhone ? `Phone: +91 ${customerPhone}` : (customerName ? `Name: ${customerName}` : `Location: ${pickupLocation || dropoffLocation}`),
        });
      }
    } catch (e) {
      // ignore
    }
  }, [
    pickupLocation, dropoffLocation, pickupCoords, dropoffCoords,
    travelDate, pickupTime, serviceType, subType,
    customerName, customerPhone, customerEmail, additionalPassengers,
    specialRequests, selectedVehicle, estimatedKm
  ]);

  // Sync initialData changes from parent
  useEffect(() => {
    if (initialData) {
      if (initialData.pickupLocation) setPickupLocation(initialData.pickupLocation);
      if (initialData.dropoffLocation) setDropoffLocation(initialData.dropoffLocation);
      if (initialData.travelDate) setTravelDate(initialData.travelDate);
      if (initialData.pickupTime) setPickupTime(initialData.pickupTime);
      if (initialData.serviceType) setServiceType(initialData.serviceType);
      if (initialData.subType) setSubType(initialData.subType);
      if (initialData.phone) setCustomerPhone(initialData.phone);
      if (initialData.pickupCoords) setPickupCoords(initialData.pickupCoords);
      if (initialData.dropoffCoords) setDropoffCoords(initialData.dropoffCoords);

      if (initialData.preSelectedVehicleId && vehicles.length > 0) {
        const found = vehicles.find(v => v.id === initialData.preSelectedVehicleId);
        if (found) setSelectedVehicle(found);
      }
    }
  }, [initialData, vehicles]);

  // Select default vehicle if none selected
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      const preferredId = initialData?.preSelectedVehicleId || draft?.selectedVehicleId || 'dzire';
      const found = vehicles.find(v => v.id === preferredId) || vehicles[0];
      setSelectedVehicle(found);
    }
  }, [vehicles, selectedVehicle]);

  // Swap pickup & dropoff
  const handleSwapLocations = () => {
    const tempLoc = pickupLocation;
    const tempCoords = pickupCoords;
    setPickupLocation(dropoffLocation);
    setPickupCoords(dropoffCoords);
    setDropoffLocation(tempLoc);
    setDropoffCoords(tempCoords);
  };

  // Add & remove passengers
  const handleAddPassenger = () => {
    setAdditionalPassengers(prev => [...prev, '']);
  };

  const handleUpdatePassenger = (index: number, val: string) => {
    setAdditionalPassengers(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemovePassenger = (index: number) => {
    setAdditionalPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopyBookingRef = (refText: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(refText);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Confirm booking & create WhatsApp dispatch link
  const handleConfirmBooking = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!pickupLocation.trim()) {
      setFormError('Please specify your pickup location');
      setStep(1);
      const el = document.getElementById('express-pickup') || document.getElementById('pickup-autocomplete');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!dropoffLocation.trim()) {
      setFormError('Please specify your dropoff location');
      setStep(1);
      const el = document.getElementById('express-dropoff') || document.getElementById('dropoff-autocomplete');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter the primary passenger full name');
      const el = document.getElementById('passenger-info-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      const el = document.getElementById('passenger-info-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const bookingRef = `WAL-${Math.floor(10000 + Math.random() * 90000)}`;
    const filteredPassengers = additionalPassengers.map(p => p.trim()).filter(Boolean);

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
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerEmail: customerEmail.trim() || undefined,
      passengers: filteredPassengers,
      serviceType,
      subType,
      pickupLocation: pickupLocation.trim(),
      dropoffLocation: dropoffLocation.trim(),
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      pickupTime: pickupTime || '10:30',
      vehicleCategory: selectedVehicle?.category || 'Sedan',
      vehicleName: selectedVehicle?.name || 'Standard Cab',
      estimatedDistanceKm: estimatedKm,
      status: 'confirmed',
      specialRequests: specialRequests.trim() || undefined,
      createdAt: new Date().toISOString(),
      city: currentCity,
      isRegistered: Boolean(userSession),
      userId: userSession?.uid,
      leadId: activeLeadId
    };

    try {
      // 1. Universal persistence (LocalStorage + Server DB + Cloud Firestore)
      const savedBooking = await syncSaveBooking(newBooking);
      newBooking.id = savedBooking.id;

      // Convert lead in real-time with full customer and route details
      markLeadConverted(bookingRef, activeLeadId, {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        pickupLocation: pickupLocation.trim(),
        dropoffLocation: dropoffLocation.trim(),
        travelDate: travelDate || new Date().toISOString().split('T')[0],
        pickupTime: pickupTime || '10:30',
        vehicleName: selectedVehicle?.name || 'Standard Cab',
        vehicleCategory: selectedVehicle?.category || 'Sedan',
        isRegistered: Boolean(userSession),
        userId: userSession?.uid,
        lastFieldChanged: 'Booking Confirmed'
      });

      try {
        localStorage.setItem('waltair_last_booking', JSON.stringify(newBooking));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      setConfirmedBooking(newBooking);
      setStep(4);
      setShowSuccessPopup(true);
      onBookingSuccess(newBooking);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      // Automatically open WhatsApp in a new tab with the booking details
      try {
        const whatsappUrl = createBookingWhatsAppUrl(newBooking);
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // popup blockers may prevent, fallback is the big button
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setConfirmedBooking(newBooking);
      setStep(4);
      setShowSuccessPopup(true);
      onBookingSuccess(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile Sticky Bottom Action Helpers
  const getMobileStickyButtonText = () => {
    if (bookingMode === 'customizer') {
      if (step === 1) return 'Select Cab & Continue';
      if (step === 2) return 'Continue to Passenger';
      return 'Confirm & Book Cab';
    } else {
      if (activeExpressSection === 'pickup') return 'Select Cab & Continue';
      if (activeExpressSection === 'cab') return 'Continue to Passenger';
      return 'Confirm & Book Cab';
    }
  };

  const handleMobileStickyAction = (e: React.MouseEvent) => {
    if (bookingMode === 'customizer') {
      if (step === 1) {
        if (!pickupLocation.trim()) {
          setFormError('Please enter pickup location');
          document.getElementById('pickup-autocomplete')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (!dropoffLocation.trim()) {
          setFormError('Please enter dropoff location');
          document.getElementById('dropoff-autocomplete')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        setFormError('');
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step === 2) {
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step === 3) {
        handleConfirmBooking(e);
      }
    } else {
      // Express Fast Book mode
      if (activeExpressSection === 'pickup') {
        if (!pickupLocation.trim()) {
          setFormError('Please specify your pickup location');
          document.getElementById('express-pickup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (!dropoffLocation.trim()) {
          setFormError('Please specify your dropoff location');
          document.getElementById('express-dropoff')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        setFormError('');
        const cabSection = document.getElementById('vehicle-selection-section');
        cabSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveExpressSection('cab');
      } else if (activeExpressSection === 'cab') {
        const passSection = document.getElementById('passenger-info-section');
        passSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveExpressSection('passenger');
      } else {
        handleConfirmBooking(e);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-200 bg-slate-50 min-h-screen pb-36 sm:pb-20">
      <SEOHead
        title="Book Cab Online in Vizag | Airport Taxi, Outstation & Sightseeing | Waltair Cabs"
        description="Book verified cabs in Visakhapatnam online: Bhogapuram airport drops, Araku Valley packages, outstation one-way taxis and hourly rentals with zero advance payment."
        canonicalUrl="/booking"
        keywords={["book cab vizag", "online taxi booking visakhapatnam", "vizag airport cab booking", "waltair cabs booking"]}
      />
      {/* Top Header Banner: Compact on Mobile (46-50px), Spacious Hero on Desktop */}
      <div className="relative overflow-hidden bg-slate-950 text-white border-b border-teal-900/60">
        <div className="hidden sm:block absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="/hero-banner.png" 
            alt="Waltair Cabs Golden-Hour Airport Taxi Arrival" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Golden-Hour%20Airport%20Taxi%20Arrival%20(1).png';
            }}
          />
        </div>
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-teal-950/70" />

        {/* 1. MOBILE ONLY COMPACT BOOKING HEADER (approx 46-50px tall - NO duplicate logo) */}
        <div className="sm:hidden px-3.5 py-2 flex items-center justify-between min-h-[46px] bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950">
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-white leading-tight truncate">
              {step === 4 ? '🎉 Booking Received!' : 'Book Your Cab'}
            </h1>
            <div className="text-[10px] text-teal-200/90 leading-none mt-0.5 truncate">
              Complete your booking in 3 simple steps
            </div>
          </div>
          {step < 4 ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 shrink-0">
              Step {step} of 3
            </span>
          ) : (
            onOpenBookingHistory && (
              <button
                type="button"
                onClick={onOpenBookingHistory}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-teal-800 text-white shrink-0"
              >
                Bookings
              </button>
            )
          )}
        </div>

        {/* 2. MOBILE ONLY COMPACT 3-STEP PROGRESS INDICATOR */}
        {step < 4 && (
          <div className="sm:hidden bg-slate-900/95 border-t border-slate-800/80 px-3.5 py-2">
            <div className="flex items-center justify-between gap-1 text-[11px]">
              
              {/* Step 1: Trip & Route */}
              <button
                type="button"
                onClick={() => {
                  if (bookingMode === 'customizer') setStep(1);
                  const el = document.getElementById('express-pickup') || document.getElementById('pickup-autocomplete');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  step === 1
                    ? 'text-teal-400 font-bold'
                    : step > 1
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9.5px] font-bold shrink-0 ${
                    step === 1
                      ? 'bg-teal-500 text-slate-950 shadow-xs ring-2 ring-teal-400/40'
                      : step > 1
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > 1 ? '✓' : '1'}
                </span>
                <span className="whitespace-nowrap">Trip & Route</span>
              </button>

              {/* Connector */}
              <span className={`text-xs px-0.5 ${step >= 2 ? 'text-teal-400' : 'text-slate-600'}`}>→</span>

              {/* Step 2: Select Cab */}
              <button
                type="button"
                onClick={() => {
                  if (bookingMode === 'customizer') {
                    if (step > 2) setStep(2);
                  } else {
                    const el = document.getElementById('vehicle-selection-section');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  step === 2
                    ? 'text-teal-400 font-bold'
                    : step > 2
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9.5px] font-bold shrink-0 ${
                    step === 2
                      ? 'bg-teal-500 text-slate-950 shadow-xs ring-2 ring-teal-400/40'
                      : step > 2
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > 2 ? '✓' : '2'}
                </span>
                <span className="whitespace-nowrap">Select Cab</span>
              </button>

              {/* Connector */}
              <span className={`text-xs px-0.5 ${step >= 3 ? 'text-teal-400' : 'text-slate-600'}`}>→</span>

              {/* Step 3: Passenger */}
              <button
                type="button"
                onClick={() => {
                  if (bookingMode === 'express') {
                    const el = document.getElementById('passenger-info-section');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  step === 3
                    ? 'text-teal-400 font-bold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9.5px] font-bold shrink-0 ${
                    step === 3
                      ? 'bg-teal-500 text-slate-950 shadow-xs ring-2 ring-teal-400/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  3
                </span>
                <span className="whitespace-nowrap">Passenger</span>
              </button>

            </div>
          </div>
        )}

        {/* DESKTOP ONLY HEADER (sm and above - 100% UNCHANGED) */}
        <div className="hidden sm:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md border border-teal-400/30 shrink-0 bg-slate-900 flex items-center justify-center">
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
                <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                  <span>Waltair Cabs Booking Desk</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-white">
                  {step === 4 ? '🎉 Booking Received!' : 'Book Your Cab'}
                </h1>
              </div>
            </div>
            
            {/* Desktop Stepper */}
            {step < 4 ? (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
                <span className={`px-3 py-1.5 rounded-lg transition-colors ${step >= 1 ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' : ''}`}>
                  1. Trip & Route
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className={`px-3 py-1.5 rounded-lg transition-colors ${step >= 2 ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' : ''}`}>
                  2. Select Cab
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className={`px-3 py-1.5 rounded-lg transition-colors ${step >= 3 ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' : ''}`}>
                  3. Passenger Details
                </span>
              </div>
            ) : (
              onOpenBookingHistory && (
                <button
                  type="button"
                  onClick={onOpenBookingHistory}
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View All My Bookings</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-2.5 sm:gap-6">
            
            {/* Mobile Pinned Route Summary (Compact & Subordinate) */}
            {step < 4 && (
              <div className="bg-white shadow-xs border border-slate-200/90 rounded-xl px-3 py-2 lg:hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-800 font-bold truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate max-w-[44%]">{pickupLocation || 'Select Pickup'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="truncate max-w-[44%]">{dropoffLocation || 'Select Drop-off'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-medium truncate">
                      <span>📅 {travelDate || 'Today'} • {pickupTime || '10:30'}</span>
                      <span>•</span>
                      <span className="text-teal-800 font-semibold truncate">🚗 {selectedVehicle?.name || 'Cab Selection'}</span>
                    </div>
                  </div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] text-teal-800 font-bold hover:bg-teal-100/70 shrink-0 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Compact Booking Mode Switcher (44px) */}
            {step < 4 && (
              <div className="sm:hidden grid grid-cols-2 p-1 bg-slate-100 rounded-xl h-11 border border-slate-200/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => setBookingMode('express')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    bookingMode === 'express'
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${bookingMode === 'express' ? 'fill-amber-300 text-amber-300' : 'text-slate-400'}`} />
                  <span>Express 1-Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingMode('customizer')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    bookingMode === 'customizer'
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Step-by-Step</span>
                </button>
              </div>
            )}

            {/* Mobile Guarantee Reassurance Strip (34px) */}
            {step < 4 && (
              <div className="sm:hidden flex items-center justify-between text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 h-[34px] px-3 rounded-lg border border-emerald-200/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Guaranteed AC Cab • Pay Post-Ride</span>
                </span>
                <span className="text-[10px] text-teal-900 font-bold bg-emerald-200/70 px-1.5 py-0.5 rounded">
                  Zero Surge
                </span>
              </div>
            )}

            {/* Desktop Booking Mode Selector (Unchanged for sm/md/lg) */}
            {step < 4 && (
              <div className="hidden sm:flex bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-xs items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBookingMode('express')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      bookingMode === 'express'
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Zap className={`w-4 h-4 ${bookingMode === 'express' ? 'fill-amber-300 text-amber-300' : 'text-slate-400'}`} />
                    <span>⚡ Express 10s Fast Book</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingMode('customizer')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      bookingMode === 'customizer'
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Detailed Steps</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Guaranteed AC Cab • Pay Post-Ride</span>
                </div>
              </div>
            )}

            {/* EXPRESS 10-SECOND FAST BOOKING VIEW */}
            {bookingMode === 'express' && step < 4 && (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                {/* 1. Trip Route Selection */}
                <div id="express-pickup-card" className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        01
                      </span>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-teal-700" />
                        <span>Pickup & Destination</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-teal-400 text-teal-800 text-xs font-semibold flex items-center gap-1 hover:bg-teal-50 transition-all cursor-pointer"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span className="text-[11px] sm:text-xs">Swap</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <GooglePlacesAutocompleteInput
                      id="express-pickup"
                      label="Pickup Location *"
                      value={pickupLocation}
                      onChange={setPickupLocation}
                      onPlaceSelect={(place) => {
                        setPickupLocation(place.address);
                        if (place.lat && place.lng) setPickupCoords({ lat: place.lat, lng: place.lng });
                      }}
                      placeholder="Airport terminal, hotel, station, or address..."
                      iconType="pickup"
                      cityBias={currentCity}
                      required
                    />

                    <GooglePlacesAutocompleteInput
                      id="express-dropoff"
                      label="Drop-off Destination *"
                      value={dropoffLocation}
                      onChange={setDropoffLocation}
                      onPlaceSelect={(place) => {
                        setDropoffLocation(place.address);
                        if (place.lat && place.lng) setDropoffCoords({ lat: place.lat, lng: place.lng });
                      }}
                      placeholder="Destination hotel, city center, airport or area..."
                      iconType="dropoff"
                      cityBias={currentCity}
                      required
                    />
                  </div>

                  {/* Quick Vizag Hubs */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Popular Quick Stops:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '✈️ Bhogapuram Airport (ASI)', loc: 'Alluri Sitharama Raju International Airport (ASI), Bhogapuram', coords: { lat: 18.0267, lng: 83.4984 } },
                        { label: '✈️ Vizag Airport (VTZ)', loc: 'Visakhapatnam International Airport (VTZ), NAD Junction', coords: { lat: 17.7215, lng: 83.2245 } },
                        { label: '🚆 Vizag Railway Station', loc: 'Visakhapatnam Junction Railway Station (VSKP)', coords: { lat: 17.7217, lng: 83.2929 } },
                        { label: '🏖️ Rushikonda Beach & IT SEZ', loc: 'Rushikonda Beach & IT SEZ Hill, Visakhapatnam', coords: { lat: 17.7819, lng: 83.3853 } },
                        { label: '🏢 Siripuram Circle', loc: 'Siripuram Circle & Waltair Uplands, Visakhapatnam', coords: { lat: 17.7217, lng: 83.3150 } },
                        { label: '⛰️ Araku Valley', loc: 'Araku Valley Hill Station & Tribal Museum', coords: { lat: 18.3273, lng: 82.8775 } },
                      ].map((hub) => (
                        <button
                          key={hub.label}
                          type="button"
                          onClick={() => {
                            if (!pickupLocation || pickupLocation.includes('Airport')) {
                              setDropoffLocation(hub.loc);
                              setDropoffCoords(hub.coords);
                            } else {
                              setPickupLocation(hub.loc);
                              setPickupCoords(hub.coords);
                            }
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 font-medium transition-colors cursor-pointer"
                        >
                          {hub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Choose Vehicle Class */}
                <div id="vehicle-selection-section" className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        02
                      </span>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-teal-700" />
                        <span>Select Cab (All AC)</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Click to select</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {vehicles.map((v) => {
                      const isSelected = selectedVehicle?.id === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setSelectedVehicle(v);
                            setActiveExpressSection('cab');
                            trackFieldFootprint({
                              vehicleName: v.name,
                              vehicleCategory: v.category,
                              lastFieldChanged: `Selected cab: ${v.name}`
                            });
                          }}
                          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative group ${
                            isSelected 
                              ? 'border-teal-700 bg-teal-50/70 ring-2 ring-teal-600/20 shadow-md' 
                              : 'border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/50'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-3 right-3 z-10 bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              ✓ Selected
                            </span>
                          )}

                          {/* Full Prominent Car Photo */}
                          <div className="relative w-full h-44 sm:h-40 rounded-xl overflow-hidden border border-slate-100 bg-slate-100 shadow-inner mb-3">
                            <img 
                              src={v.image} 
                              alt={v.name} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                            />
                            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>👥</span> {v.seats} Seats • AC
                            </div>
                            <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>🧳</span> {v.luggageCount} Bags
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                                {v.name}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800 font-bold shrink-0">
                                {v.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {v.popularFor || 'Commercial verified fleet with professional chauffeur & clean AC interior'}
                            </p>
                          </div>

                          {/* WhatsApp Quote & 1-Tap Select Action - ZERO PRICES SHOWN */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Quote on WhatsApp</span>
                            </div>

                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected 
                                ? 'bg-teal-700 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-900'
                            }`}>
                              {isSelected ? '✓ Picked' : 'Select Cab'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Date, Time & Passenger Info */}
                <div id="passenger-info-section" className="bg-white rounded-2xl p-3.5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        03
                      </span>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-4 h-4 text-teal-700" />
                        <span>Passenger & Schedule</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 24/7 Live Fleet
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Travel Date with Quick Chips */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Travel Date *</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date().toISOString().split('T')[0];
                              setTravelDate(d);
                              trackFieldFootprint({ travelDate: d, lastFieldChanged: 'Quick date: Today' });
                            }}
                            className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                              travelDate === new Date().toISOString().split('T')[0]
                                ? 'bg-teal-700 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-teal-100'
                            }`}
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const tm = new Date();
                              tm.setDate(tm.getDate() + 1);
                              const d = tm.toISOString().split('T')[0];
                              setTravelDate(d);
                              trackFieldFootprint({ travelDate: d, lastFieldChanged: 'Quick date: Tomorrow' });
                            }}
                            className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-slate-200 text-slate-700 hover:bg-teal-100 transition-colors cursor-pointer"
                          >
                            Tomorrow
                          </button>
                        </div>
                      </div>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full text-base sm:text-sm font-semibold text-slate-900 bg-transparent outline-none cursor-pointer"
                        required
                      />
                    </div>

                    {/* Pickup Time with Quick Chips */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Pickup Time *</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const now = new Date();
                              const hh = String(now.getHours()).padStart(2, '0');
                              const mm = String(Math.min(55, Math.ceil(now.getMinutes() / 5) * 5)).padStart(2, '0');
                              const t = `${hh}:${mm}`;
                              setPickupTime(t);
                              trackFieldFootprint({ pickupTime: t, lastFieldChanged: 'Quick time: Now' });
                            }}
                            className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-slate-200 text-slate-700 hover:bg-teal-100 transition-colors cursor-pointer"
                          >
                            Now
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPickupTime('06:00');
                              trackFieldFootprint({ pickupTime: '06:00', lastFieldChanged: 'Quick time: 06:00 AM' });
                            }}
                            className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-slate-200 text-slate-700 hover:bg-teal-100 transition-colors cursor-pointer"
                          >
                            06:00 AM
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPickupTime('18:00');
                              trackFieldFootprint({ pickupTime: '18:00', lastFieldChanged: 'Quick time: 06:00 PM' });
                            }}
                            className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-slate-200 text-slate-700 hover:bg-teal-100 transition-colors cursor-pointer"
                          >
                            06:00 PM
                          </button>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full text-base sm:text-sm font-semibold text-slate-900 bg-transparent outline-none cursor-pointer"
                        required
                      />
                    </div>

                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Primary Passenger Name *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomerName(val);
                          trackFieldFootprint({
                            customerName: val,
                            customerPhone,
                            pickupLocation,
                            dropoffLocation,
                            travelDate,
                            pickupTime,
                            vehicleName: selectedVehicle?.name,
                            vehicleCategory: selectedVehicle?.category,
                            lastFieldChanged: 'Primary passenger name updated'
                          });
                        }}
                        placeholder="Full Name (e.g. Rajesh Kumar)"
                        className="w-full text-base sm:text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Mobile Number (10 Digits) *</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={customerPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setCustomerPhone(val);
                            trackFieldFootprint({
                              customerPhone: val,
                              customerName,
                              pickupLocation,
                              dropoffLocation,
                              travelDate,
                              pickupTime,
                              vehicleName: selectedVehicle?.name,
                              vehicleCategory: selectedVehicle?.category,
                              lastFieldChanged: 'Mobile number entered'
                            });
                          }}
                          placeholder="98765 43210"
                          className="w-full text-base sm:text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Co-Passengers Section with '+' Plus Icon */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-teal-700" />
                          <span>Additional Passengers ({1 + additionalPassengers.length} Total)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tap to add more travelers accompanying you
                        </p>
                      </div>

                      <button
                        type="button"
                        id="add-passenger-btn-express"
                        onClick={handleAddPassenger}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-4 h-4 text-teal-700" />
                        <span>Add Passenger</span>
                      </button>
                    </div>

                    {additionalPassengers.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {additionalPassengers.map((pName, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/90 focus-within:border-teal-600 focus-within:bg-white transition-all">
                              <User className="w-4 h-4 text-slate-400 shrink-0" />
                              <input
                                type="text"
                                value={pName}
                                onChange={(e) => handleUpdatePassenger(idx, e.target.value)}
                                placeholder={`Passenger ${idx + 2} Full Name`}
                                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none font-medium placeholder:text-slate-400"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePassenger(idx)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/70 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
                              aria-label={`Remove passenger ${idx + 2}`}
                              title="Remove passenger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-950/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Confirming Reservation...</span>
                        </span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white text-white" />
                          <span>Confirm Booking & Dispatch Chauffeur</span>
                        </>
                      )}
                    </motion.button>

                    <a
                      href={`https://wa.me/919110510236?text=${encodeURIComponent(
                        `Hi Waltair Cabs, I want to book a ${selectedVehicle?.name || 'Cab'}.\nPickup: ${pickupLocation}\nDrop: ${dropoffLocation}\nDate: ${travelDate} at ${pickupTime}\nName: ${customerName || 'Passenger'}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Fast-Book</span>
                    </a>
                  </div>

                  <div className="flex flex-col xs:flex-row items-center justify-between text-[11px] text-slate-500 pt-1 gap-1.5 text-center xs:text-left">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>No prepayment • Guaranteed on-time pickup</span>
                    </span>
                    <span className="text-slate-500 font-medium">Fare quoted on request via WhatsApp</span>
                  </div>
                </div>
              </form>
            )}

            {/* STEP-BY-STEP CUSTOMIZER */}
            {bookingMode === 'customizer' && step === 1 && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        01
                      </span>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-teal-700" />
                        <span>Pickup & Drop-off Locations</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-teal-400 text-teal-800 text-xs font-semibold flex items-center gap-1 hover:bg-teal-50 transition-all cursor-pointer"
                      title="Swap pickup and drop-off"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span className="text-[11px] sm:text-xs">Swap</span>
                    </button>
                  </div>

                  {/* Pickup Autocomplete */}
                  <GooglePlacesAutocompleteInput
                    id="pickup-autocomplete"
                    label="Pickup Location *"
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    onPlaceSelect={(place: SelectedPlaceData) => {
                      setPickupLocation(place.address);
                      if (place.lat && place.lng) {
                        setPickupCoords({ lat: place.lat, lng: place.lng });
                      }
                    }}
                    placeholder="Enter pickup hotel, address, airport gate, station or area..."
                    iconType="pickup"
                    cityBias={currentCity}
                    required
                  />

                  {/* Drop-off Autocomplete */}
                  <GooglePlacesAutocompleteInput
                    id="dropoff-autocomplete"
                    label="Drop-off Destination *"
                    value={dropoffLocation}
                    onChange={setDropoffLocation}
                    onPlaceSelect={(place: SelectedPlaceData) => {
                      setDropoffLocation(place.address);
                      if (place.lat && place.lng) {
                        setDropoffCoords({ lat: place.lat, lng: place.lng });
                      }
                    }}
                    placeholder="Enter drop destination, resort, city center, airport or address..."
                    iconType="dropoff"
                    cityBias={currentCity}
                    required
                  />

                  {/* Quick Transit Hub Buttons */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 mb-1.5">Quick Vizag Hubs:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '✈️ Bhogapuram Airport (ASI)', loc: 'Alluri Sitharama Raju International Airport (ASI), Bhogapuram', coords: { lat: 18.0267, lng: 83.4984 } },
                        { label: '✈️ Vizag Airport (VTZ)', loc: 'Visakhapatnam International Airport (VTZ), NAD Junction', coords: { lat: 17.7215, lng: 83.2245 } },
                        { label: '🚆 Vizag Railway Station', loc: 'Visakhapatnam Junction Railway Station (VSKP)', coords: { lat: 17.7217, lng: 83.2929 } },
                        { label: '🏖️ Rushikonda Beach & IT SEZ', loc: 'Rushikonda Beach & IT SEZ Hill, Visakhapatnam', coords: { lat: 17.7819, lng: 83.3853 } },
                        { label: '🏢 Siripuram / Waltair Uplands', loc: 'Siripuram Circle & Waltair Uplands, Visakhapatnam', coords: { lat: 17.7217, lng: 83.3150 } },
                        { label: '⛰️ Araku Valley', loc: 'Araku Valley Hill Station & Tribal Museum', coords: { lat: 18.3273, lng: 82.8775 } },
                      ].map((hub) => (
                        <button
                          key={hub.label}
                          type="button"
                          onClick={() => {
                            if (!pickupLocation || pickupLocation.includes('Airport')) {
                              setDropoffLocation(hub.loc);
                              setDropoffCoords(hub.coords);
                            } else {
                              setPickupLocation(hub.loc);
                              setPickupCoords(hub.coords);
                            }
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 transition-colors cursor-pointer"
                        >
                          {hub.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leaflet Map Preview */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                        <span>Interactive Route Map</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRouteMap(!showRouteMap)}
                        className="text-[11px] font-semibold text-teal-800 hover:underline cursor-pointer"
                      >
                        {showRouteMap ? 'Hide Map' : 'Show Map'}
                      </button>
                    </div>

                    {showRouteMap && (
                      <LeafletRouteMap
                        height="240px"
                        pickup={pickupCoords?.lat && pickupCoords?.lng ? { lat: pickupCoords.lat, lng: pickupCoords.lng, label: pickupLocation } : null}
                        dropoff={dropoffCoords?.lat && dropoffCoords?.lng ? { lat: dropoffCoords.lat, lng: dropoffCoords.lng, label: dropoffLocation } : null}
                        onSelectPickup={(coord) => {
                          setPickupCoords({ lat: coord.lat, lng: coord.lng });
                          setPickupLocation(coord.label || coord.name || `${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`);
                        }}
                        onSelectDropoff={(coord) => {
                          setDropoffCoords({ lat: coord.lat, lng: coord.lng });
                          setDropoffLocation(coord.label || coord.name || `${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`);
                        }}
                        interactiveSelection={true}
                        showTransitHubs={true}
                      />
                    )}
                  </div>

                  {/* Date & Time Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Travel Date *
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
                        <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                        <input
                          type="date"
                          value={travelDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="w-full bg-transparent outline-none font-medium text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pickup Time *
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
                        <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                        <input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full bg-transparent outline-none font-medium text-slate-900"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Quality Notice */}
                <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-950 text-xs flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <strong>Punctual & Reliable:</strong> Doorstep pickup with verified, courteous chauffeurs and sanitised vehicles.
                  </div>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!pickupLocation.trim()) {
                        setFormError('Please enter or select a pickup address');
                        return;
                      }
                      if (!dropoffLocation.trim()) {
                        setFormError('Please enter or select a dropoff destination');
                        return;
                      }
                      setFormError('');
                      setStep(2);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Select Cab & Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT CAB (NO FARES SHOWN) */}
            {bookingMode === 'customizer' && step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-teal-700" />
                      <span>Select Available Cab ({vehicles.length} Options)</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                    Fare quoted on request • WhatsApp
                  </div>
                </div>

                <div className="space-y-3">
                  {vehiclesLoading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">Loading available fleet...</div>
                  ) : vehicles.map((v) => {
                    const isSelected = selectedVehicle?.id === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-teal-700 bg-teal-50/50 shadow-sm ring-2 ring-teal-600/20' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={v.image} 
                            alt={v.name}
                            className="w-20 h-14 object-cover rounded-xl border border-slate-100 shrink-0 bg-slate-50" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-slate-900">{v.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                                {v.seats} Seats
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{v.modelExamples}</p>
                            <div className="text-[11px] text-teal-800 font-semibold mt-1">
                              AC Cab • Luggage: {v.luggageCount} Bags • Sanitized & Clean
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-teal-700 text-white shadow-xs' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}>
                            {isSelected ? '✓ Selected' : 'Choose Cab'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Passenger Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PASSENGER DETAILS & CONFIRMATION (NO FARES, NO FLIGHT FIELDS) */}
            {bookingMode === 'customizer' && step === 3 && (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Trip Route Card */}
                <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-teal-200/60 pb-2">
                    <span className="font-bold text-teal-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-teal-700" />
                      <span>Trip Summary</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] font-bold text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Route</span>
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <p className="font-medium text-slate-900 truncate">
                        <span className="text-slate-500 font-normal">Pickup: </span>
                        {pickupLocation}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-600 mt-1 shrink-0" />
                      <p className="font-medium text-slate-900 truncate">
                        <span className="text-slate-500 font-normal">Drop: </span>
                        {dropoffLocation}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1 border-t border-teal-100">
                      <span>📅 {travelDate} at {pickupTime}</span>
                      <span>•</span>
                      <span>🚗 {selectedVehicle?.name} ({selectedVehicle?.seats} Seats)</span>
                    </div>
                  </div>
                </div>

                {/* Passenger Inputs Card */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        03
                      </span>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-teal-700" />
                        <span>Passenger & Contact Information</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Passenger Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Primary Passenger Name *
                      </label>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Ramesh Varma"
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        10-Digit Mobile Number *
                      </label>
                      <div className="flex items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-500">+91</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-teal-600 bg-slate-50">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Additional Passengers with '+' symbol */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          Additional Passengers
                        </label>
                        <p className="text-[11px] text-slate-500">Add names of other travelers accompanying you</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPassenger}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Passenger</span>
                      </button>
                    </div>

                    {additionalPassengers.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {additionalPassengers.map((pName, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-600">
                              <User className="w-4 h-4 text-slate-400 shrink-0" />
                              <input
                                type="text"
                                value={pName}
                                onChange={(e) => handleUpdatePassenger(idx, e.target.value)}
                                placeholder={`Passenger ${idx + 2} Full Name`}
                                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none font-medium"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePassenger(idx)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove passenger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Special Requests (Trip Notes, NO flight number) */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Requests / Trip Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Need child seat, carrying extra luggage, prefer non-smoking cab"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 outline-none focus:border-teal-600 bg-slate-50"
                    />
                  </div>

                  {/* Payment Info Note */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>No online advance needed. Fare is quoted upon request and discussed directly with Waltair Cabs via WhatsApp.</span>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}
                </div>

                {/* Step 3 Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Booking...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>CONFIRM & BOOK CAB</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION & WHATSAPP SHARING */}
            {step === 4 && confirmedBooking && (
              <div className="space-y-5 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Booking is Received!</h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Reference ID: <strong className="text-slate-800 font-mono">{confirmedBooking.bookingRef}</strong>. Our 24/7 team has logged your reservation.
                  </p>
                </div>

                {/* PRIMARY WHATSAPP ACTION BUTTON TO 9110510236 */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                    <span>Send Booking to WhatsApp for Priority Confirmation</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Tap the button below to send your trip details directly to our dispatch desk at <strong className="text-slate-900">{DISPLAY_PHONE_NUMBER}</strong>:
                  </p>

                  <a
                    href={createBookingWhatsAppUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Open WhatsApp & Send Details ({WHATSAPP_PHONE_NUMBER})</span>
                  </a>
                </div>

                {/* Details Slip (NO FAKE DRIVER, NO LIVE TRACKING, NO FARES) */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 text-left space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src="/logo.png" 
                        alt="Waltair Cabs" 
                        className="w-10 h-10 rounded-xl border border-teal-500/30 object-cover shrink-0" 
                        onError={(e) => {
                          e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Waltair%20Cabs%20Coastal%20Travel%20Badge.png';
                        }}
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                        <div className="font-extrabold text-base text-teal-900 font-mono">{confirmedBooking.bookingRef}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyBookingRef(confirmedBooking.bookingRef)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRef ? (
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Route & Schedule */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] uppercase font-bold text-emerald-700">Pickup Location</div>
                      <div className="font-semibold text-slate-900 mt-0.5">{confirmedBooking.pickupLocation}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] uppercase font-bold text-rose-700">Drop-off Destination</div>
                      <div className="font-semibold text-slate-900 mt-0.5">{confirmedBooking.dropoffLocation}</div>
                    </div>
                  </div>

                  {/* Travelers & Cab */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400">Travel Date</span>
                        <div className="font-bold text-slate-900">{confirmedBooking.travelDate}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Pickup Time</span>
                        <div className="font-bold text-slate-900">{confirmedBooking.pickupTime}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Cab Requested</span>
                        <div className="font-bold text-slate-900">{confirmedBooking.vehicleName}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Passengers:</span>
                      <div className="font-medium text-slate-800 mt-0.5">
                        {confirmedBooking.customerName} (+91 {confirmedBooking.customerPhone})
                        {confirmedBooking.passengers && confirmedBooking.passengers.length > 0 && (
                          <span>, {confirmedBooking.passengers.join(', ')}</span>
                        )}
                      </div>
                    </div>

                    {confirmedBooking.specialRequests && (
                      <div className="pt-2 border-t border-slate-200/80 text-slate-600 text-[11px]">
                        <strong>Special Requests:</strong> {confirmedBooking.specialRequests}
                      </div>
                    )}
                  </div>

                  {/* Dispatch Notice */}
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/70 text-teal-950 text-xs">
                    <strong>Vehicle & Reservation Coordination:</strong> Waltair Cabs operations team will confirm your booking via WhatsApp, provide your customized fare quote on request, and coordinate vehicle dispatch.
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Return to Home</span>
                  </button>

                  {onOpenBookingHistory && (
                    <button
                      type="button"
                      onClick={onOpenBookingHistory}
                      className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileText className="w-4 h-4 text-teal-700" />
                      <span>View Booking History</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Desktop Sidebar Summary (NO FARES SHOWN) */}
          <div className="lg:col-span-4 hidden lg:block">
            {step < 4 && (
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sticky top-24 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Booking Summary</span>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-teal-800 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Route */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Pickup Location</span>
                    <div className="font-semibold text-slate-900 mt-0.5 truncate" title={pickupLocation}>
                      {pickupLocation || 'Not specified'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-700">Drop-off Destination</span>
                    <div className="font-semibold text-slate-900 mt-0.5 truncate" title={dropoffLocation}>
                      {dropoffLocation || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Schedule & Distance */}
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{travelDate || 'Today'}, {pickupTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>Est. Distance: ~{estimatedKm} km</span>
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {selectedVehicle?.name || 'Cab Selection'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {selectedVehicle ? `${selectedVehicle.seats} Seater AC` : 'Choose on Step 2'}
                        </div>
                      </div>
                    </div>

                    {step === 3 && (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[10px] text-teal-800 font-bold hover:underline px-2 py-0.5 rounded bg-teal-50 border border-teal-200 cursor-pointer"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>

                {/* 24/7 Helpline */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Need help? WhatsApp/Call: </span>
                  <a href={`tel:${WHATSAPP_PHONE_NUMBER}`} className="font-bold text-teal-800 hover:underline">
                    {DISPLAY_PHONE_NUMBER}
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SUCCESS POPUP MODAL (NO FAKE DRIVER, NO TRACKING, NO FARES) */}
      {showSuccessPopup && confirmedBooking && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col relative animate-in slide-in-from-bottom-6 duration-300">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-6 pt-7 text-center shrink-0">
              <button
                type="button"
                onClick={() => setShowSuccessPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg mb-3">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>Booking Confirmed</span>
              </div>

              <h3 className="text-xl font-black text-white">Your Cab Request is Received!</h3>
              <p className="text-xs text-teal-100/90 mt-1 max-w-sm mx-auto">
                Reference ID: <span className="font-mono font-bold text-white">{confirmedBooking.bookingRef}</span>
              </p>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* WhatsApp Share Button */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2">
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Send to WhatsApp ({WHATSAPP_PHONE_NUMBER})</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Tap to open WhatsApp with your booking details already formatted for instant confirmation:
                </p>
                <a
                  href={createBookingWhatsAppUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open WhatsApp & Send Details</span>
                </a>
              </div>

              {/* Trip Details */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs text-left">
                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Pickup</span>
                    <div className="font-semibold text-slate-900">{confirmedBooking.pickupLocation}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Drop-off</span>
                    <div className="font-semibold text-slate-900">{confirmedBooking.dropoffLocation}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Travel Date:</span>{' '}
                    <strong className="text-slate-800">{confirmedBooking.travelDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Time:</span>{' '}
                    <strong className="text-slate-800">{confirmedBooking.pickupTime}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Cab:</span>{' '}
                    <strong className="text-slate-800">{confirmedBooking.vehicleName}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">Traveler:</span>{' '}
                    <strong className="text-slate-800">{confirmedBooking.customerName} (+91 {confirmedBooking.customerPhone})</strong>
                  </div>
                  {confirmedBooking.passengers && confirmedBooking.passengers.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-slate-400">Co-passengers:</span>{' '}
                      <span className="text-slate-800 font-medium">{confirmedBooking.passengers.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessPopup(false);
                  onNavigateHome();
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Return to Home
              </button>
              {onOpenBookingHistory && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessPopup(false);
                    onOpenBookingHistory();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs cursor-pointer"
                >
                  My Bookings
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM ACTION BAR (sm:hidden) */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3.5 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] sm:hidden flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 pr-1">
            <div className="text-[12px] font-extrabold text-slate-900 truncate leading-tight flex items-center gap-1.5">
              <span className="text-teal-700">🚗</span>
              <span className="truncate">{selectedVehicle?.name || 'Selected Cab'}</span>
            </div>
            <div className="text-[10px] font-semibold text-emerald-700 leading-none mt-0.5 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>AC Cab • Fare on WhatsApp</span>
            </div>
          </div>

          <button
            type="button"
            id="mobile-sticky-continue-btn"
            onClick={handleMobileStickyAction}
            disabled={isSubmitting}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] active:scale-[0.98] text-white font-extrabold text-xs shadow-md shadow-teal-950/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 min-h-[42px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming...</span>
              </span>
            ) : (
              <>
                <span>{getMobileStickyButtonText()}</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
};
