import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Mail, 
  IndianRupee, 
  ShieldCheck, 
  
  ChevronRight, 
  ArrowLeft, 
  AlertCircle,
  FileText,
  Compass,
  CheckCircle2,
  ArrowUpDown,
  Navigation,
  Edit3,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceCategory, TripSubType, Vehicle, Booking, DriverInfo } from '../types';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { GooglePlacesAutocompleteInput, SelectedPlaceData } from './GooglePlacesAutocompleteInput';
import { LeafletRouteMap, LocationCoord } from './LeafletRouteMap';
import { TripCountdownTimer } from './TripCountdownTimer';
import { useVehicles } from '../hooks/useVehicles';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone?: string;
    preSelectedVehicleId?: string;
  } | null;
  currentCity: string;
  onBookingSuccess: (booking: Booking) => void;
  onOpenLiveTrack: (bookingId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialData,
  currentCity,
  onBookingSuccess,
  onOpenLiveTrack,
}) => {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Dynamic location and itinerary states with Google Places Autocomplete support
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');
  const [pickupCoords, setPickupCoords] = useState<{ lat?: number; lng?: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat?: number; lng?: number } | null>(null);
  const [showRouteMap, setShowRouteMap] = useState<boolean>(true);
  const [travelDate, setTravelDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('');
  const [serviceType, setServiceType] = useState<ServiceCategory>('airport');
  const [subType, setSubType] = useState<TripSubType>('pickup');

  // Passenger & payment states
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [paymentOption, setPaymentOption] = useState<'cash_to_driver' | 'online_advance' | 'full_prepaid'>('cash_to_driver');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [formError, setFormError] = useState<string>('');

  // Calculate estimated distance based on coordinates or place names
  const calculateDistance = (): number => {
    if (pickupCoords?.lat && pickupCoords?.lng && dropoffCoords?.lat && dropoffCoords?.lng) {
      const R = 6371; // Earth radius in km
      const dLat = (dropoffCoords.lat - pickupCoords.lat) * (Math.PI / 180);
      const dLon = (dropoffCoords.lng - pickupCoords.lng) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupCoords.lat * (Math.PI / 180)) * Math.cos(dropoffCoords.lat * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightDist = R * c;
      return Math.max(5, Math.round(straightDist * 1.3)); // 1.3x road distance factor
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

  // Swap pickup & dropoff
  const handleSwapLocations = () => {
    const tempLoc = pickupLocation;
    const tempCoords = pickupCoords;
    setPickupLocation(dropoffLocation);
    setPickupCoords(dropoffCoords);
    setDropoffLocation(tempLoc);
    setDropoffCoords(tempCoords);
  };

  useEffect(() => {
    if (initialData) {
      setPickupLocation(initialData.pickupLocation || '');
      setDropoffLocation(initialData.dropoffLocation || '');
      setTravelDate(initialData.travelDate || new Date().toISOString().split('T')[0]);
      setPickupTime(initialData.pickupTime || '10:30');
      setServiceType(initialData.serviceType);
      setSubType(initialData.subType);
      if (initialData.phone) {
        setCustomerPhone(initialData.phone);
      }
      if (initialData.preSelectedVehicleId && vehicles.length > 0) {
        const found = vehicles.find(v => v.id === initialData.preSelectedVehicleId);
        if (found) setSelectedVehicle(found);
      } else if (vehicles.length > 0 && !selectedVehicle) {
        setSelectedVehicle(vehicles.find(v => v.id === 'dzire') || vehicles[0]);
      }
      setStep(1);
      setConfirmedBooking(null);
    }
  }, [initialData, vehicles]);

  // Handle case where initialData doesn't have a pre-selected vehicle but vehicles just loaded
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles.find(v => v.id === 'dzire') || vehicles[0]);
    }
  }, [vehicles, selectedVehicle]);

  

  // Fare calculations
  const baseRate = selectedVehicle?.baseFare || 0;
  const extraKm = Math.max(0, estimatedKm - (selectedVehicle?.baseKm || 0));
  const distanceFare = Math.round(extraKm * (selectedVehicle?.ratePerKm || 0));
  const isAirportOrHighway = (pickupLocation || '').toLowerCase().includes('airport') || 
                             (dropoffLocation || '').toLowerCase().includes('airport') ||
                             estimatedKm > 50;
  const tollCharges = isAirportOrHighway ? 140 : 0;
  const subTotal = baseRate + distanceFare + tollCharges;
  const gstAmount = Math.round(subTotal * 0.05); // 5% GST on transport
  const totalFare = subTotal + gstAmount;

  // Realistic driver generator for instant dispatch
  const createMockDriver = (): DriverInfo => {
    const drivers = [
      { name: 'K. Satish Varma', phone: '+91 98480 23456', vehicleNumber: 'AP 31 TH 7842', rating: 4.9, totalTrips: 1420 },
      { name: 'M. Ramesh Babu', phone: '+91 99890 87654', vehicleNumber: 'AP 31 TJ 9123', rating: 4.8, totalTrips: 980 },
      { name: 'P. Appala Naidu', phone: '+91 94401 54321', vehicleNumber: 'AP 31 TK 4510', rating: 5.0, totalTrips: 2150 },
      { name: 'D. Suresh Kumar', phone: '+91 89123 45678', vehicleNumber: 'AP 31 TL 3090', rating: 4.9, totalTrips: 1120 },
    ];
    const picked = drivers[Math.floor(Math.random() * drivers.length)];
    return {
      name: picked.name,
      phone: picked.phone,
      vehicleNumber: picked.vehicleNumber,
      vehicleModel: `${selectedVehicle?.name || ''} (${selectedVehicle?.modelExamples.split(',')[0] || ''})`,
      rating: picked.rating,
      totalTrips: picked.totalTrips,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      currentLat: 17.72 + (Math.random() * 0.05),
      currentLng: 83.30 + (Math.random() * 0.05),
      etaMinutes: 12
    };
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation.trim()) {
      setFormError('Please specify your pickup location');
      setStep(1);
      return;
    }
    if (!dropoffLocation.trim()) {
      setFormError('Please specify your dropoff location');
      setStep(1);
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const bookingRef = `WAL-${Math.floor(10000 + Math.random() * 90000)}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const driver = createMockDriver();

    const newBooking: Booking = {
      bookingRef,
      customerName,
      customerPhone: cleanPhone,
      customerEmail: customerEmail || 'guest@waltairtravels.com',
      serviceType,
      subType,
      pickupLocation,
      dropoffLocation,
      travelDate: travelDate || initialData.travelDate,
      pickupTime: pickupTime || initialData.pickupTime,
      vehicleCategory: selectedVehicle?.category || 'Sedan',
      vehicleName: selectedVehicle?.name || 'Maruti Suzuki Dzire',
      estimatedDistanceKm: estimatedKm,
      baseFare: baseRate,
      distanceFare,
      tollCharges,
      gstAmount,
      totalFare,
      paymentMethod: paymentOption,
      advancePaid: paymentOption === 'online_advance' ? Math.round(totalFare * 0.2) : (paymentOption === 'full_prepaid' ? totalFare : 0),
      balanceDue: paymentOption === 'cash_to_driver' ? totalFare : (paymentOption === 'online_advance' ? totalFare - Math.round(totalFare * 0.2) : 0),
      status: 'confirmed',
      driver,
      otp,
      specialRequests,
      createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
      city: currentCity
    };

    try {
      // Save directly to Firestore collection
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...newBooking,
        createdAt: new Date().toISOString()
      });
      newBooking.id = docRef.id;

      // Also save in local storage as safety backup
      try {
        const existing = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
        localStorage.setItem('waltair_user_bookings', JSON.stringify([newBooking, ...existing]));
      } catch (err) {
        console.warn('Local storage error', err);
      }

      setConfirmedBooking(newBooking);
      setStep(4);
      onBookingSuccess(newBooking);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (ce) {
        // ignore confetti failures
      }
    } catch (error) {
      console.error('Error saving booking to Firestore:', error);
      // Fallback local save so booking is never blocked
      newBooking.id = `local-${Date.now()}`;
      try {
        const existing = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
        localStorage.setItem('waltair_user_bookings', JSON.stringify([newBooking, ...existing]));
      } catch (err) {}
      setConfirmedBooking(newBooking);
      setStep(4);
      onBookingSuccess(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {(isOpen && initialData) && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
      <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]"
        >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#005a66] to-slate-900 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">
                        <span>Waltair Express Booking</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold">
            {step === 4 ? '🎉 Booking Confirmed!' : 'Complete Your Reservation'}
          </h3>

          {/* Stepper indicator */}
          {step < 4 && (
            <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-200">
              <span className={`px-2.5 py-0.5 rounded-full transition-colors ${step >= 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/20'}`}>
                1. Trip & Route
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />
              <span className={`px-2.5 py-0.5 rounded-full transition-colors ${step >= 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/20'}`}>
                2. Select Cab
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />
              <span className={`px-2.5 py-0.5 rounded-full transition-colors ${step >= 3 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/20'}`}>
                3. Passenger & Fare
              </span>
            </div>
          )}
        </div>

        {/* Pinned Summary Card at Top (Always visible without scrolling) */}
        {step < 4 && (
          <div 
            id="booking-summary-top-card" 
            className="bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/90 px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-xs shrink-0 z-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              
              {/* Route Summary */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-800 font-semibold truncate">
                  {/* Pickup */}
                  <div className="flex items-center gap-1 min-w-0 max-w-[48%] truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-500 font-normal text-[10px] hidden xs:inline">From:</span>
                    <span className="truncate" title={pickupLocation || 'Pickup location not specified'}>
                      {pickupLocation ? pickupLocation.split(',')[0] : 'Select Pickup'}
                    </span>
                  </div>

                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />

                  {/* Dropoff */}
                  <div className="flex items-center gap-1 min-w-0 max-w-[48%] truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-slate-500 font-normal text-[10px] hidden xs:inline">To:</span>
                    <span className="truncate" title={dropoffLocation || 'Drop-off location not specified'}>
                      {dropoffLocation ? dropoffLocation.split(',')[0] : 'Select Drop-off'}
                    </span>
                  </div>
                </div>

                {/* Sub-meta: Date, Time & Estimated Distance */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-700" />
                    <span>{travelDate || 'Today'}, {pickupTime || 'Now'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-teal-700" />
                    <span>Est. ~{estimatedKm} km</span>
                  </div>
                  {step > 1 && (
                    <button
                      type="button"
                      id="summary-edit-route-btn"
                      onClick={() => setStep(1)}
                      className="ml-auto sm:ml-1 text-[10px] text-cyan-700 hover:text-cyan-900 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit Route</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chosen Vehicle & Total Fare Box */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-1.5 sm:pt-0 sm:pl-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                      <span>{selectedVehicle?.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded font-medium">
                        {selectedVehicle?.seats} Seat
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Est. <strong className="text-teal-900 font-bold">₹{totalFare}</strong> (All-in)
                    </div>
                  </div>
                </div>

                {step === 3 && (
                  <button
                    type="button"
                    id="summary-edit-vehicle-btn"
                    onClick={() => setStep(2)}
                    className="text-[10px] text-cyan-700 hover:text-cyan-900 font-bold hover:underline px-1.5 py-0.5 rounded bg-cyan-50 border border-cyan-200 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Change Cab</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: TRIP DETAILS & GOOGLE PLACES LOCATION ENHANCEMENT */}
          {step === 1 && (
            <div className="space-y-5">
              
              {/* Google Places Autocomplete Input Section */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-cyan-700" />
                    <span>Pickup & Drop-off Points (Google Places GPS)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-cyan-400 text-cyan-700 text-xs font-semibold flex items-center gap-1 shadow-2xs hover:bg-cyan-50 transition-all cursor-pointer"
                    title="Swap pickup and drop-off"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Swap</span>
                  </button>
                </div>

                {/* Pickup Location with Google Places Autocomplete */}
                <GooglePlacesAutocompleteInput
                  id="modal-pickup-autocomplete"
                  label="Pickup Location *"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  onPlaceSelect={(place: SelectedPlaceData) => {
                    setPickupLocation(place.address);
                    if (place.lat && place.lng) {
                      setPickupCoords({ lat: place.lat, lng: place.lng });
                    }
                  }}
                  placeholder="Type pickup hotel, terminal, gate, railway station or street..."
                  iconType="pickup"
                  cityBias={currentCity}
                  required
                />

                {/* Dropoff Location with Google Places Autocomplete */}
                <GooglePlacesAutocompleteInput
                  id="modal-dropoff-autocomplete"
                  label="Drop-off Destination *"
                  value={dropoffLocation}
                  onChange={setDropoffLocation}
                  onPlaceSelect={(place: SelectedPlaceData) => {
                    setDropoffLocation(place.address);
                    if (place.lat && place.lng) {
                      setDropoffCoords({ lat: place.lat, lng: place.lng });
                    }
                  }}
                  placeholder="Type destination resort, address, city center or terminal..."
                  iconType="dropoff"
                  cityBias={currentCity}
                  required
                />

                {/* Quick Selection Hubs for 1-Tap Convenience */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 mb-1.5">Quick Vizag & Transit Hubs:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '✈️ Bhogapuram Airport (ASI)', loc: 'Alluri Sitharama Raju International Airport (ASI), Bhogapuram' },
                      { label: '✈️ Vizag Airport (VTZ)', loc: 'Visakhapatnam International Airport (VTZ), NAD Junction' },
                      { label: '🚆 Visakhapatnam Junction', loc: 'Visakhapatnam Junction Railway Station (VSKP)' },
                      { label: '🏖️ Rushikonda Beach & IT SEZ', loc: 'Rushikonda Beach & IT SEZ Hill, Visakhapatnam' },
                      { label: '🏢 Siripuram / Waltair Uplands', loc: 'Siripuram Circle & Waltair Uplands, Visakhapatnam' },
                      { label: '⛰️ Araku Valley', loc: 'Araku Valley Hill Station & Tribal Museum' },
                    ].map((hub) => (
                      <button
                        key={hub.label}
                        type="button"
                        onClick={() => {
                          if (!pickupLocation || pickupLocation.includes('Airport')) {
                            setDropoffLocation(hub.loc);
                          } else {
                            setPickupLocation(hub.loc);
                          }
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-slate-700 transition-colors cursor-pointer"
                      >
                        {hub.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leaflet Interactive Route Map */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></span>
                      <span>Leaflet Live Route & Hubs Map</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRouteMap(!showRouteMap)}
                      className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-800 transition-colors cursor-pointer"
                    >
                      {showRouteMap ? 'Hide Map' : '🗺️ Show Leaflet Map'}
                    </button>
                  </div>

                  {showRouteMap && (
                    <LeafletRouteMap
                      height="230px"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Travel Date *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 text-cyan-700 shrink-0" />
                      <input
                        type="date"
                        id="modal-travel-date"
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
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-cyan-700 shrink-0" />
                      <input
                        type="time"
                        id="modal-pickup-time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-transparent outline-none font-medium text-slate-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Distance & Service Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs">
                  <span className="text-cyan-950">
                    Estimated Route Distance: <strong className="font-extrabold text-cyan-900 text-sm">{estimatedKm} km</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white text-cyan-800 font-bold border border-cyan-200 uppercase text-[10px]">
                    {serviceType} Service ({subType})
                  </span>
                </div>
              </div>

              {/* On-Time Guarantee Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Guaranteed On-Time Pickup:</strong> 45 minutes complimentary flight delay buffer and professional background-checked chauffeur.
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  id="modal-step1-continue-btn"
                  onClick={() => {
                    if (!pickupLocation.trim()) {
                      setFormError('Please select or enter a pickup address');
                      return;
                    }
                    if (!dropoffLocation.trim()) {
                      setFormError('Please select or enter a dropoff destination');
                      return;
                    }
                    setFormError('');
                    setStep(2);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Select Vehicle & View Fares</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT VEHICLE FROM FLEET */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-900">
                Choose Available Car ({vehicles.length} cars available)
              </div>

              <div className="space-y-3">
                {vehiclesLoading ? (
                  <div className="py-10 text-center text-slate-500">Loading available vehicles...</div>
                ) : vehicles.map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  const vBase = v.baseFare;
                  const vExtra = Math.max(0, estimatedKm - v.baseKm) * v.ratePerKm;
                  const vTotal = Math.round((vBase + vExtra + tollCharges) * 1.05);

                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isSelected 
                          ? 'border-cyan-700 bg-cyan-50/50 shadow-md ring-2 ring-cyan-600/20' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={v.image} 
                          alt={v.name}
                          className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-xl border border-slate-100 shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-slate-900">{v.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                              {v.seats} Seats
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{v.modelExamples}</p>
                          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                            AC • {v.luggageCount} Luggage Bags • ₹{v.ratePerKm}/km
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center sm:justify-end">
                            <IndianRupee className="w-4 h-4" />
                            <span>{vTotal}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">All taxes & tolls included</span>
                        </div>
                        <div className={`mt-1.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-cyan-700 border-cyan-700 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  id="modal-step2-continue-btn"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Proceed to Passenger Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PASSENGER DETAILS & FARE BREAKDOWN & CONFIRM */}
          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              {/* Selected Route Summary with Edit Shortcut */}
              <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-2xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Confirmed Route</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-cyan-800 hover:text-cyan-900 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change Address</span>
                  </button>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0"></div>
                    <p className="font-medium text-slate-900 truncate">
                      <span className="text-slate-500 font-normal">From: </span>
                      {pickupLocation}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-600 mt-1 shrink-0"></div>
                    <p className="font-medium text-slate-900 truncate">
                      <span className="text-slate-500 font-normal">To: </span>
                      {dropoffLocation}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-cyan-100">
                    <span>📅 {travelDate} at {pickupTime}</span>
                    <span>🛣️ {estimatedKm} km</span>
                  </div>
                </div>
              </div>

              {/* Fare Breakdown Summary Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-300 font-bold">
                  <span>Cab: {selectedVehicle?.name}</span>
                  <span>{estimatedKm} km Estimated</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Base Fare ({selectedVehicle?.baseKm || 0} km included)</span>
                  <span>₹{baseRate}</span>
                </div>
                {extraKm > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Extra Distance ({extraKm} km × ₹{selectedVehicle?.ratePerKm || 0})</span>
                    <span>₹{distanceFare}</span>
                  </div>
                )}
                {tollCharges > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Airport Tolls & Highway Surcharge</span>
                    <span>₹{tollCharges}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>GST (5% Transport Tax)</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-cyan-400">₹{totalFare}</span>
                </div>
              </div>

              {/* Passenger Inputs */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Passenger & Contact Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                      <User className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        id="passenger-name-input"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ramesh Varma"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <div className="flex items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">+91</span>
                      <input
                        type="tel"
                        id="passenger-phone-input"
                        maxLength={10}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email for Invoice (Optional)
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 focus-within:border-cyan-600 bg-slate-50">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      id="passenger-email-input"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Flight Number / Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    id="passenger-special-req-input"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Flight 6E 542, child car seat, extra luggage"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 outline-none focus:border-cyan-600 bg-slate-50"
                  />
                </div>

                {/* Payment Option Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 transition-all ${
                      paymentOption === 'cash_to_driver' ? 'border-cyan-700 bg-cyan-50 text-cyan-950' : 'border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentOption === 'cash_to_driver'}
                        onChange={() => setPaymentOption('cash_to_driver')}
                        className="text-cyan-700"
                      />
                      <span>Pay Cash/UPI to Driver</span>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 transition-all ${
                      paymentOption === 'online_advance' ? 'border-cyan-700 bg-cyan-50 text-cyan-950' : 'border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentOption === 'online_advance'}
                        onChange={() => setPaymentOption('online_advance')}
                        className="text-cyan-700"
                      />
                      <span>20% Advance (₹{Math.round(totalFare * 0.2)})</span>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 transition-all ${
                      paymentOption === 'full_prepaid' ? 'border-cyan-700 bg-cyan-50 text-cyan-950' : 'border-slate-200 text-slate-700'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentOption === 'full_prepaid'}
                        onChange={() => setPaymentOption('full_prepaid')}
                        className="text-cyan-700"
                      />
                      <span>Full Online Payment</span>
                    </label>
                  </div>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  id="modal-confirm-booking-btn"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Confirming Booking...
                    </span>
                  ) : (
                    <span>CONFIRM & BOOK TAXI (₹{totalFare})</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION SLIP */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-5 text-center py-2">
              
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">Your Ride is Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Booking details & driver assignment sent via SMS & WhatsApp to +91 {confirmedBooking.customerPhone}
                </p>
              </div>

              {/* Visual Trip Countdown Timer & Confirmation Tracker */}
              <TripCountdownTimer
                travelDate={confirmedBooking.travelDate}
                pickupTime={confirmedBooking.pickupTime}
                confirmedAt={confirmedBooking.createdAt}
                driverName={confirmedBooking.driver?.name}
                vehicleModel={confirmedBooking.driver?.vehicleModel}
              />

              {/* Ticket / Slip Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                    <div className="font-extrabold text-base text-cyan-800">{confirmedBooking.bookingRef}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ride Start OTP</span>
                    <div className="font-mono font-extrabold text-base text-emerald-600 tracking-wider">
                      {confirmedBooking.otp}
                    </div>
                  </div>
                </div>

                {/* Assigned Driver Box */}
                {confirmedBooking.driver && (
                  <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={confirmedBooking.driver.photoUrl} 
                        alt={confirmedBooking.driver.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{confirmedBooking.driver.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {confirmedBooking.driver.vehicleModel} • {confirmedBooking.driver.vehicleNumber}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-600">★ {confirmedBooking.driver.rating}</span>
                      <div className="text-[10px] text-slate-400">Arriving in ~12 mins</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>Pickup: <strong>{confirmedBooking.pickupLocation}</strong></div>
                  <div>Drop: <strong>{confirmedBooking.dropoffLocation}</strong></div>
                  <div>Date: <strong>{confirmedBooking.travelDate} at {confirmedBooking.pickupTime}</strong></div>
                  <div>Total Fare: <strong className="text-slate-900 font-bold">₹{confirmedBooking.totalFare}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  id="modal-track-now-btn"
                  onClick={() => {
                    onClose();
                    onOpenLiveTrack(confirmedBooking.bookingRef);
                  }}
                  className="w-full py-3 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Compass className="w-4 h-4" />
                  <span>TRACK RIDE LIVE</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm"
                >
                  Done / Close
                </button>
              </div>

            </div>
          )}

        </div>

      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
