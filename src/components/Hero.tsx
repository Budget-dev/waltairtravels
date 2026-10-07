import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Send, 
  Car, 
  ArrowUpDown, 
  Calendar, 
  Clock, 
  Phone, 
  Headphones, 
  UserCheck, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { ServiceCategory, TripSubType } from '../types';
import { GooglePlacesAutocompleteInput } from './GooglePlacesAutocompleteInput';
import { trackFieldFootprint } from '../services/leadTrackingService';

interface HeroProps {
  currentCity: string;
  onOpenCitySelector: () => void;
  onInitiateBooking: (bookingData: {
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone: string;
    pickupCoords?: { lat?: number; lng?: number } | null;
    dropoffCoords?: { lat?: number; lng?: number } | null;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCity,
  onOpenCitySelector,
  onInitiateBooking,
}) => {
  const [serviceType, setServiceType] = useState<ServiceCategory>('airport');
  const [subType, setSubType] = useState<TripSubType>('pickup');

  // Input states with precise coordinates support
  const [pickupLocation, setPickupLocation] = useState<string>(
    'Alluri Sitharama Raju International Airport ASI , Bhogapuram'
  );
  const [pickupCoords, setPickupCoords] = useState<{ lat?: number; lng?: number } | null>({
    lat: 18.0267,
    lng: 83.4984,
  });

  const [dropoffLocation, setDropoffLocation] = useState<string>('Siripuram Circle & Waltair Uplands, Visakhapatnam');
  const [dropoffCoords, setDropoffCoords] = useState<{ lat?: number; lng?: number } | null>({
    lat: 17.7217,
    lng: 83.3150,
  });
  
  // Format today's date YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState<string>(today);
  const [pickupTime, setPickupTime] = useState<string>('10:30');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const syncFootprint = (overrides?: {
    field?: string;
    phone?: string;
    pickup?: string;
    dropoff?: string;
    date?: string;
    time?: string;
    service?: ServiceCategory;
    sub?: TripSubType;
  }) => {
    trackFieldFootprint({
      source: 'hero',
      customerPhone: overrides?.phone !== undefined ? overrides.phone : mobileNumber,
      pickupLocation: overrides?.pickup !== undefined ? overrides.pickup : pickupLocation,
      dropoffLocation: overrides?.dropoff !== undefined ? overrides.dropoff : dropoffLocation,
      travelDate: overrides?.date !== undefined ? overrides.date : travelDate,
      pickupTime: overrides?.time !== undefined ? overrides.time : pickupTime,
      serviceType: overrides?.service !== undefined ? overrides.service : serviceType,
      subType: overrides?.sub !== undefined ? overrides.sub : subType,
      lastFieldChanged: overrides?.field || 'Hero form interaction',
    });
  };

  // Swap pickup & dropoff
  const handleSwapLocations = () => {
    const tempLoc = pickupLocation;
    const tempCoords = pickupCoords;
    setPickupLocation(dropoffLocation);
    setPickupCoords(dropoffCoords);
    setDropoffLocation(tempLoc);
    setDropoffCoords(tempCoords);
    syncFootprint({ field: 'Swapped pickup and dropoff locations', pickup: dropoffLocation, dropoff: tempLoc });
  };

  // Change Service Category
  const handleServiceChange = (category: ServiceCategory) => {
    setServiceType(category);
    let newPickup = pickupLocation;
    let newDropoff = dropoffLocation;
    let newSub: TripSubType = subType;
    if (category === 'airport') {
      newSub = 'pickup';
      newPickup = 'Alluri Sitharama Raju International Airport ASI , Bhogapuram';
      setSubType('pickup');
      setPickupLocation(newPickup);
      setPickupCoords({ lat: 18.0267, lng: 83.4984 });
      newDropoff = 'Siripuram Circle & Waltair Uplands, Visakhapatnam';
      setDropoffLocation(newDropoff);
      setDropoffCoords({ lat: 17.7217, lng: 83.3150 });
    } else if (category === 'outstation') {
      newSub = 'oneway';
      newPickup = 'Visakhapatnam City Center';
      setSubType('oneway');
      setPickupLocation(newPickup);
      setPickupCoords({ lat: 17.7217, lng: 83.2929 });
      newDropoff = 'Araku Valley (Hill Station)';
      setDropoffLocation(newDropoff);
      setDropoffCoords({ lat: 18.3273, lng: 82.8775 });
    } else if (category === 'local') {
      newSub = 'local_8hr';
      newPickup = 'Visakhapatnam (Within City Limits)';
      setSubType('local_8hr');
      setPickupLocation(newPickup);
      setPickupCoords({ lat: 17.7217, lng: 83.2929 });
      newDropoff = 'City Sightseeing & Full Day Rental (80 km / 8 hrs)';
      setDropoffLocation(newDropoff);
      setDropoffCoords({ lat: 17.7819, lng: 83.3853 });
    }
    syncFootprint({ field: `Selected ${category.toUpperCase()} service`, service: category, sub: newSub, pickup: newPickup, dropoff: newDropoff });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber && mobileNumber.replace(/\D/g, '').length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    onInitiateBooking({
      serviceType,
      subType,
      pickupLocation: pickupLocation || 'Visakhapatnam Airport (ASI / VTZ)',
      dropoffLocation: dropoffLocation || 'Visakhapatnam City',
      travelDate: travelDate || today,
      pickupTime: pickupTime || '10:30',
      phone: mobileNumber || '9876543210',
      pickupCoords,
      dropoffCoords,
    });
  };

  return (
    <section id="home" className="relative min-h-[660px] lg:min-h-[720px] bg-slate-950 overflow-hidden flex items-center">
      {/* Background Hero Visual: Golden-Hour Airport Taxi Arrival Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-banner.png"
          alt="Waltair Travels Golden-Hour Airport Taxi Arrival"
          className="w-full h-full object-cover object-center scale-100"
          onError={(e) => {
            e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Golden-Hour%20Airport%20Taxi%20Arrival%20(1).png';
          }}
        />
        {/* Balanced contrast overlays: deep slate vignette on left for booking card, bright clear view of taxi & coastline */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: The Floating Booking Widget Card */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 w-full max-w-full"
          >
            <div className="bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-[1.75rem] p-3.5 sm:p-6 shadow-2xl shadow-slate-950/40 border border-white/80 ring-1 ring-slate-900/5 text-slate-900 w-full max-w-full box-border">
              
              {/* Card Header: Location indicator + Change + Verified Fleet Badge */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 w-full">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 min-w-0">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="font-bold text-slate-800 truncate">{currentCity || 'Visakhapatnam (Vizag), IN'}</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-[10.5px] sm:text-[11px] font-bold text-teal-800 whitespace-nowrap shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                  <span className="whitespace-nowrap">Verified Fleet</span>
                </div>
              </div>

              {/* Service Category Segmented Control with Framer Motion Active Indicator */}
              <div className="relative grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl sm:rounded-2xl mb-3 w-full">
                {[
                  { id: 'airport', label: 'Airport', icon: Plane },
                  { id: 'outstation', label: 'Outstation', icon: Send },
                  { id: 'local', label: 'Hourly', icon: Car },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = serviceType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`tab-${item.id}`}
                      onClick={() => handleServiceChange(item.id as ServiceCategory)}
                      className={`relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[11px] xs:text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer min-h-[38px] sm:min-h-[42px] ${
                        isActive ? 'text-teal-950' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeServiceTab"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          className="absolute inset-0 bg-white rounded-lg sm:rounded-xl shadow-xs -z-10"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tabs Row with Clean Pill Design */}
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mb-3.5 w-full">
                {serviceType === 'airport' && (
                  <>
                    {[
                      { id: 'pickup', label: 'Airport Pickup' },
                      { id: 'drop', label: 'Airport Drop' },
                      { id: 'roundtrip', label: 'Round Trip' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setSubType(tab.id as TripSubType);
                          if (tab.id === 'pickup') {
                            setPickupLocation('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
                            setDropoffLocation('Siripuram Circle & Waltair Uplands, Visakhapatnam');
                          } else if (tab.id === 'drop') {
                            setPickupLocation('Siripuram Circle & Waltair Uplands, Visakhapatnam');
                            setDropoffLocation('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
                          }
                        }}
                        className={`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-semibold text-center transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center min-h-[32px] sm:min-h-[36px] ${
                          subType === tab.id
                            ? 'bg-teal-800 text-white shadow-xs font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                  </>
                )}

                {serviceType === 'outstation' && (
                  <>
                    {[
                      { id: 'oneway', label: 'One-Way' },
                      { id: 'roundtrip', label: 'Round Trip' },
                      { id: 'multicity', label: 'Multi-City Tour' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSubType(tab.id as TripSubType)}
                        className={`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-semibold text-center transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center min-h-[32px] sm:min-h-[36px] ${
                          subType === tab.id
                            ? 'bg-teal-800 text-white shadow-xs font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                  </>
                )}

                {serviceType === 'local' && (
                  <>
                    {[
                      { id: 'local_4hr', label: '4 hrs / 40 km' },
                      { id: 'local_8hr', label: '8 hrs / 80 km' },
                      { id: 'local_12hr', label: '12 hrs / 120 km' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSubType(tab.id as TripSubType)}
                        className={`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-semibold text-center transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center min-h-[32px] sm:min-h-[36px] ${
                          subType === tab.id
                            ? 'bg-teal-800 text-white shadow-xs font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Booking Inputs Form */}
              <form onSubmit={handleFormSubmit} className="space-y-2.5">
                
                {/* Pickup and Dropoff Container */}
                <div className="relative rounded-2xl bg-slate-50/90 p-2.5 sm:p-3 border border-slate-200/90 space-y-2.5">
                  {/* Pickup Location */}
                  <div className="w-full">
                    <GooglePlacesAutocompleteInput
                      id="hero-pickup-input"
                      label="Pickup Location"
                      value={pickupLocation}
                      onChange={(val) => {
                        setPickupLocation(val);
                        syncFootprint({ pickup: val, field: `Typed pickup location: ${val}` });
                      }}
                      onPlaceSelect={(place) => {
                        setPickupLocation(place.address);
                        if (place.lat && place.lng) {
                          setPickupCoords({ lat: place.lat, lng: place.lng });
                        }
                        syncFootprint({ pickup: place.address, field: `Selected pickup: ${place.address}` });
                      }}
                      placeholder="Enter pickup address, airport or hotel..."
                      iconType="pickup"
                      cityBias={currentCity}
                      compact={true}
                      required
                    />
                  </div>

                  {/* Inter-location Divider & Swap Button */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="w-full border-t border-slate-200" />
                    <button
                      type="button"
                      id="hero-swap-locations-btn"
                      onClick={handleSwapLocations}
                      title="Swap pickup and drop-off locations"
                      aria-label="Swap pickup and drop-off locations"
                      className="absolute p-1.5 rounded-full bg-white border border-slate-200 hover:border-teal-500 text-slate-600 hover:text-teal-700 shadow-xs transition-transform active:rotate-180 active:scale-95 cursor-pointer z-10"
                    >
                      <ArrowUpDown className="w-3 h-3 text-teal-700" />
                    </button>
                  </div>

                  {/* Drop-off Location */}
                  <div className="w-full">
                    <GooglePlacesAutocompleteInput
                      id="hero-dropoff-input"
                      label="Drop-off Destination"
                      value={dropoffLocation}
                      onChange={(val) => {
                        setDropoffLocation(val);
                        syncFootprint({ dropoff: val, field: `Typed drop-off destination: ${val}` });
                      }}
                      onPlaceSelect={(place) => {
                        setDropoffLocation(place.address);
                        if (place.lat && place.lng) {
                          setDropoffCoords({ lat: place.lat, lng: place.lng });
                        }
                        syncFootprint({ dropoff: place.address, field: `Selected drop-off: ${place.address}` });
                      }}
                      placeholder="Enter destination, landmark or village..."
                      iconType="dropoff"
                      cityBias={currentCity}
                      compact={true}
                      required
                    />
                  </div>

                  {/* Quick Hub Pills on Mobile for Instant Precise Locations */}
                  <div className="pt-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                      POPULAR:
                    </span>
                    {[
                      { name: '✈️ Bhogapuram ASI', loc: 'Alluri Sitharama Raju International Airport (ASI), Bhogapuram', coords: { lat: 18.0267, lng: 83.4984 } },
                      { name: '✈️ Vizag VTZ', loc: 'Visakhapatnam International Airport (VTZ), NAD Junction', coords: { lat: 17.7215, lng: 83.2245 } },
                      { name: '🚆 VSKP Station', loc: 'Visakhapatnam Junction Railway Station (VSKP)', coords: { lat: 17.7217, lng: 83.2929 } },
                      { name: '🏖️ Rushikonda', loc: 'Rushikonda Beach & IT SEZ, Visakhapatnam', coords: { lat: 17.7819, lng: 83.3853 } },
                      { name: '⛰️ Araku Valley', loc: 'Araku Valley Hill Station & Tribal Museum', coords: { lat: 18.3273, lng: 82.8775 } },
                    ].map((hub) => (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => {
                          if (!pickupLocation || pickupLocation.includes('Airport')) {
                            setDropoffLocation(hub.loc);
                            setDropoffCoords(hub.coords);
                            syncFootprint({ dropoff: hub.loc, field: `Selected popular hub: ${hub.name}` });
                          } else {
                            setPickupLocation(hub.loc);
                            setPickupCoords(hub.coords);
                            syncFootprint({ pickup: hub.loc, field: `Selected popular hub: ${hub.name}` });
                          }
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs font-medium active:scale-95"
                      >
                        {hub.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time Row - 50%/50% balanced columns */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2 sm:p-2.5 hover:border-teal-500 focus-within:border-teal-600 focus-within:bg-white transition-all min-h-[54px] min-w-0">
                    <label htmlFor="hero-date-input" className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold text-slate-500 mb-0.5 cursor-pointer truncate">
                      <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>Travel Date</span>
                    </label>
                    <input
                      type="date"
                      id="hero-date-input"
                      min={today}
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        syncFootprint({ date: e.target.value, field: `Selected travel date: ${e.target.value}` });
                      }}
                      className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer"
                      required
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2 sm:p-2.5 hover:border-teal-500 focus-within:border-teal-600 focus-within:bg-white transition-all min-h-[54px] min-w-0">
                    <label htmlFor="hero-time-input" className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold text-slate-500 mb-0.5 cursor-pointer truncate">
                      <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>Pickup Time</span>
                    </label>
                    <input
                      type="time"
                      id="hero-time-input"
                      value={pickupTime}
                      onChange={(e) => {
                        setPickupTime(e.target.value);
                        syncFootprint({ time: e.target.value, field: `Selected pickup time: ${e.target.value}` });
                      }}
                      className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2 sm:p-2.5 hover:border-teal-500 focus-within:border-teal-600 focus-within:bg-white transition-all w-full min-h-[54px]">
                  <label htmlFor="hero-phone-input" className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold text-slate-500 mb-0.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>Mobile number for instant dispatch</span>
                  </label>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded-md shrink-0 select-none">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      id="hero-phone-input"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setMobileNumber(val);
                        setPhoneError('');
                        syncFootprint({ phone: val, field: val ? `Entered phone: +91 ${val}` : 'Cleared phone' });
                      }}
                      placeholder="98765 43210"
                      className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">{phoneError}</p>
                  )}
                </div>

                {/* Real-time Availability & Transparency Badge */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50/90 border border-teal-200/90 flex items-center justify-between gap-2 text-xs w-full shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] sm:text-xs truncate">
                      ⚡ 12 Cabs Nearby • 4 Min Arrival
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 shrink-0 whitespace-nowrap">
                    Zero Surge
                  </span>
                </div>

                {/* Submit Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    id="hero-search-book-btn"
                    className="w-full py-3.5 sm:py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-teal-950/20 transition-all cursor-pointer group min-h-[46px]"
                  >
                    <span>Search & Customize</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFormSubmit(e);
                    }}
                    id="hero-fast-book-btn"
                    className="hidden sm:flex w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
                  >
                    <span>⚡ Book in 10s</span>
                  </motion.button>
                </div>
              </form>

              {/* Bottom Guarantee */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 w-full gap-2">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium min-w-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">No cancellation fee • Guaranteed pickup</span>
                </div>
                <a
                  href="tel:+919110510236"
                  id="hero-call-link"
                  className="text-teal-800 hover:text-teal-950 font-semibold flex items-center gap-0.5 hover:underline shrink-0 text-[11px] sm:text-xs"
                >
                  <span>+91 91105 10236</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                </a>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Editorial Headline & Value Pillars */}
          <div className="lg:col-span-6 xl:col-span-7 text-white space-y-6 lg:pl-4">
            
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-teal-400/40 text-teal-300 text-xs font-semibold shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
              <span>Official Airport & Intercity Taxi Partner in Visakhapatnam</span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.35rem] font-extrabold tracking-tight leading-[1.12] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                Airport cabs you can trust. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-100 to-emerald-200">
                  Fixed fares. On-time pickups.
                </span>
              </h1>
              <p className="text-slate-100 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed pt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-medium">
                Experience seamless rides across Visakhapatnam, express transfers to Bhogapuram International Airport (ASI), and serene tours to Araku Valley with vetted professional chauffeurs.
              </p>
            </motion.div>

            {/* Value Proposition Cards - 4 items in clean responsive grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
            >
              {[
                { label: '24/7 Helpline', desc: 'Direct Control Desk', icon: Headphones },
                { label: 'Verified Drivers', desc: 'Commercial Licensed', icon: UserCheck },
                { label: 'Sanitized Cabs', desc: 'Dual AC Cooling', icon: ShieldCheck },
                { label: 'Live GPS', desc: 'Real-time Updates', icon: MapPin },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="bg-slate-900/80 backdrop-blur-md border border-white/20 p-3 sm:p-3.5 rounded-2xl text-left shadow-xl hover:border-teal-400/50 hover:bg-slate-900/90 transition-all"
                  >
                    <Icon className="w-5 h-5 text-teal-300 mb-1.5" />
                    <div className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-sm">{item.label}</div>
                    <div className="text-[11px] text-slate-200 mt-0.5">{item.desc}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Airport Terminal Status Pill */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-100"
            >
              <span className="font-semibold text-teal-200 uppercase tracking-wider text-[11px] bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-500/50 shadow-md">
                Direct Airport Gate:
              </span>
              <span className="drop-shadow-sm font-medium">Bhogapuram International Airport (ASI) & VTZ Terminal Cabs on Standby</span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
