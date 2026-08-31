import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { ServiceCategory, TripSubType } from '../types';
import { GooglePlacesAutocompleteInput } from './GooglePlacesAutocompleteInput';

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
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCity,
  onOpenCitySelector,
  onInitiateBooking,
}) => {
  const [serviceType, setServiceType] = useState<ServiceCategory>('airport');
  const [subType, setSubType] = useState<TripSubType>('pickup');

  // Input states
  const [pickupLocation, setPickupLocation] = useState<string>(
    'Alluri Sitharama Raju International Airport ASI , Bhogapuram'
  );
  const [dropoffLocation, setDropoffLocation] = useState<string>('Siripuram Circle & Waltair Uplands, Visakhapatnam');
  
  // Format today's date YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState<string>(today);
  const [pickupTime, setPickupTime] = useState<string>('10:30');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  // Dropdown autocomplete helpers
  const [showPickupList, setShowPickupList] = useState<boolean>(false);
  const [showDropoffList, setShowDropoffList] = useState<boolean>(false);

  // Swap pickup & dropoff
  const handleSwapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(temp);
  };

  // Change Service Category
  const handleServiceChange = (category: ServiceCategory) => {
    setServiceType(category);
    if (category === 'airport') {
      setSubType('pickup');
      setPickupLocation('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
      setDropoffLocation('Siripuram Circle & Waltair Uplands, Visakhapatnam');
    } else if (category === 'outstation') {
      setSubType('oneway');
      setPickupLocation('Visakhapatnam City Center');
      setDropoffLocation('Araku Valley (Hill Station)');
    } else if (category === 'local') {
      setSubType('local_8hr');
      setPickupLocation('Visakhapatnam (Within City Limits)');
      setDropoffLocation('City Sightseeing & Full Day Rental (80 km / 8 hrs)');
    }
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
      phone: mobileNumber || '9876543210'
    });
  };

  return (
    <section id="home" className="relative min-h-[640px] bg-slate-900 overflow-hidden">
      {/* Background Hero Visual: High-resolution Modern Airport Terminal / Highway */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=2000&q=85"
          alt="Alluri Sitharama Raju International Airport Bhogapuram Terminal"
          className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-10000 hover:scale-100"
          referrerPolicy="no-referrer"
        />
        {/* Deep modern teal-tinted gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: The Floating Booking Widget Card */}
          <div className="lg:col-span-5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl border border-slate-100/90 text-slate-900 backdrop-blur-md">
              
              {/* Header inside Card */}
              <div className="mb-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-0.5">
                  <MapPin className="w-3 h-3 text-cyan-600" />
                  <span className="font-semibold text-slate-700">{currentCity}</span>
                  <span className="text-slate-300">•</span>
                  <button 
                    type="button"
                    onClick={onOpenCitySelector} 
                    className="text-cyan-700 hover:text-cyan-800 font-semibold hover:underline cursor-pointer"
                  >
                    Change city
                  </button>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Go anywhere with <span className="text-cyan-700">Waltair</span>
                </h1>
              </div>

              {/* Main Service Category Tabs - Compact & clean */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-2.5">
                <button
                  type="button"
                  id="tab-airport-taxi"
                  onClick={() => handleServiceChange('airport')}
                  className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                    serviceType === 'airport'
                      ? 'bg-white text-cyan-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Airport</span>
                </button>

                <button
                  type="button"
                  id="tab-outstation"
                  onClick={() => handleServiceChange('outstation')}
                  className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                    serviceType === 'outstation'
                      ? 'bg-white text-cyan-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Outstation</span>
                </button>

                <button
                  type="button"
                  id="tab-local-packages"
                  onClick={() => handleServiceChange('local')}
                  className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                    serviceType === 'local'
                      ? 'bg-white text-cyan-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Hourly</span>
                </button>
              </div>

              {/* Sub-Tabs Row - Flex wrap without horizontal scrollbar */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {serviceType === 'airport' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSubType('pickup');
                        setPickupLocation('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'pickup'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Airport Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubType('drop');
                        setDropoffLocation('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'drop'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Airport Drop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubType('roundtrip')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'roundtrip'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Round Trip
                    </button>
                  </>
                )}

                {serviceType === 'outstation' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSubType('oneway')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'oneway'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      One-Way
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubType('roundtrip')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'roundtrip'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Round Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubType('multicity')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'multicity'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Multi-City Tour
                    </button>
                  </>
                )}

                {serviceType === 'local' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSubType('local_4hr')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'local_4hr'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      4 hrs / 40 km
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubType('local_8hr')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'local_8hr'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      8 hrs / 80 km
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubType('local_12hr')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        subType === 'local_12hr'
                          ? 'bg-[#005a66] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      12 hrs / 120 km
                    </button>
                  </>
                )}
              </div>

              {/* Booking Inputs Form */}
              <form onSubmit={handleFormSubmit} className="space-y-2">
                
                {/* Pickup Location with Google Places Autocomplete */}
                <div className="flex items-end gap-1.5">
                  <div className="flex-1">
                    <GooglePlacesAutocompleteInput
                      id="hero-pickup-input"
                      label="Pickup Location"
                      value={pickupLocation}
                      onChange={setPickupLocation}
                      placeholder="Enter pickup address, airport, hotel..."
                      iconType="pickup"
                      cityBias={currentCity}
                      compact={true}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    id="hero-swap-locations-btn"
                    onClick={handleSwapLocations}
                    title="Swap pickup and dropoff"
                    className="p-2 mb-0.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 shadow-2xs transition-colors shrink-0 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dropoff Location with Google Places Autocomplete */}
                <div>
                  <GooglePlacesAutocompleteInput
                    id="hero-dropoff-input"
                    label="Drop-off Destination"
                    value={dropoffLocation}
                    onChange={setDropoffLocation}
                    placeholder="Enter destination, landmark or area..."
                    iconType="dropoff"
                    cityBias={currentCity}
                    compact={true}
                    required
                  />
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 hover:border-cyan-500 focus-within:border-cyan-600 focus-within:bg-white transition-all">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-0.5">
                      <Calendar className="w-2.5 h-2.5 text-slate-400" />
                      <span>Travel date</span>
                    </div>
                    <input
                      type="date"
                      id="hero-date-input"
                      min={today}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none"
                      required
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 hover:border-cyan-500 focus-within:border-cyan-600 focus-within:bg-white transition-all">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-0.5">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      <span>Pickup time</span>
                    </div>
                    <input
                      type="time"
                      id="hero-time-input"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number for Instant Booking */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 hover:border-cyan-500 focus-within:border-cyan-600 focus-within:bg-white transition-all">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mb-0.5">
                    <Phone className="w-2.5 h-2.5 text-slate-400" />
                    <span>Mobile number for instant booking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500">+91</span>
                    <input
                      type="tel"
                      id="hero-phone-input"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value.replace(/\D/g, ''));
                        setPhoneError('');
                      }}
                      placeholder="98765 43210"
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {phoneError && (
                    <div className="text-[10px] text-rose-500 font-medium mt-0.5">{phoneError}</div>
                  )}
                </div>

                {/* Submit Search & Book Taxi Button */}
                <button
                  type="submit"
                  id="hero-search-book-btn"
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-teal-900/20 hover:shadow-lg transition-all uppercase active:scale-98 cursor-pointer"
                >
                  <span>SEARCH & BOOK TAXI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Bottom Guarantee and Phone Link */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Instant Confirmation</span>
                </div>
                <a
                  href="tel:+919123456789"
                  id="hero-call-link"
                  className="text-cyan-700 hover:text-cyan-800 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Call Waltair Travels</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Hero Headline & Feature Highlights */}
          <div className="lg:col-span-7 text-white space-y-6 lg:pl-6">
            
            {/* Tagline / Airport notice */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Airport Taxi & City Cabs in Visakhapatnam</span>
            </div>

            {/* Big Headline */}
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Reliable Travel.
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Transparent Pricing.
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-cyan-400">
                Every Journey.
              </h2>
            </div>

            {/* Paragraph Subtext */}
            <p className="text-slate-200 text-base sm:text-lg max-w-xl leading-relaxed">
              Transparent pricing, safe travel with professional drivers, and 24x7 support. Booking with Waltair is seamless and reliable.
            </p>

            {/* Feature Badges Grid (4 items from screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-100">
                <Headphones className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>24x7 Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-100">
                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Professional Drivers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-100">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Safe & Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-100">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Live Tracking</span>
              </div>
            </div>

            {/* Airport Terminal Badge */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-cyan-300">
                Direct Airport Terminal Service:
              </span>
              <span>Alluri Sitharama Raju International Airport (ASI), Bhogapuram & VTZ Airport</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
