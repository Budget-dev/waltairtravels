import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Clock, 
  MapPin, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  ShoppingBag,
  ArrowRight,
  Zap,
  Info,
  Calendar,
  Compass,
  Star,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocalRentalsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const LocalRentalsPage: React.FC<LocalRentalsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<'4hr' | '8hr' | '12hr'>('8hr');
  const [activeCarType, setActiveCarType] = useState<'sedan' | 'suv' | 'crysta'>('sedan');

  const rentalPackages = [
    {
      id: '4hr',
      hours: '4 Hours',
      km: '40 KM',
      badge: 'City Errands & Business',
      tag: 'Best for Quick Trips',
      description: 'Ideal for doctor visits in Maharanipeta, bank appointments in Siripuram, railway station drops, or quick shopping sprees at Jagadamba Center.',
      highlights: ['Unlimited stops within 40 km', 'Chauffeur waits at every venue', 'AC on at all times', 'Doorstep pickup anywhere in Vizag'],
      img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: '8hr',
      hours: '8 Hours',
      km: '80 KM',
      badge: 'Most Popular / Full-Day Tour',
      tag: 'Best Value for Families',
      description: 'Explore the City of Destiny at your pace: Submarine Museum, Kailasagiri Ropeway, Rushikonda Beach, Simhachalam temple darshan, and coastal dining.',
      highlights: ['Full day dedicated chauffeur', 'Flexible itinerary', 'Luggage safe inside car', 'Zero surge pricing guaranteed'],
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: '12hr',
      hours: '12 Hours',
      km: '120 KM',
      badge: 'Extended Day / Industrial SEZ',
      tag: 'Complete Freedom',
      description: 'Perfect for visits to Parawada Jawaharlal Nehru Pharma City, Atchutapuram SEZ, multi-venue weddings, or day-long coastal photography trails.',
      highlights: ['Covers all Vizag districts & SEZ', '12 hours chauffeur availability', 'Fuel & AC completely included', 'Toll receipt reimbursement'],
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=80'
    },
  ];

  const cityAttractions = [
    {
      name: 'INS Kursura Submarine & TU-142 Aircraft',
      zone: 'RK Beach Road',
      img: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=600&q=80',
      timing: '2 - 3 Hours',
      desc: 'Step inside real naval warfare history along the scenic Ramakrishna Beach promenade.'
    },
    {
      name: 'Kailasagiri Hilltop Park & Ropeway',
      zone: 'Bay of Bengal Crest',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      timing: '1.5 - 2 Hours',
      desc: 'Panoramic views of the coastline, toy train, ropeway cable car, and majestic Shiva-Parvathi statues.'
    },
    {
      name: 'Rushikonda Blue Flag Beach',
      zone: 'Bheemili Highway',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      timing: '2 - 4 Hours',
      desc: 'AP’s premier eco-certified beach featuring golden sands, surfing, jet ski rides, and sea shacks.'
    },
    {
      name: 'Simhachalam Varaha Lakshmi Narasimha Temple',
      zone: 'Simhachalam Hills',
      img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      timing: '2 - 3 Hours',
      desc: 'Historic 11th-century architectural marvel, sacred sandalwood deity darshan, and peaceful hill vibe.'
    },
    {
      name: 'Yarada Beach & Dolphin’s Nose Lighthouse',
      zone: 'South Coast Peninsula',
      img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
      timing: '3 Hours',
      desc: 'Private, secluded cove bordered by deep blue sea on three sides and lush green hills on the fourth.'
    },
    {
      name: 'Tenneti Park & VMRDA Sea View Drive',
      zone: 'Jodugullapalem',
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      timing: '1 Hour',
      desc: 'Natural beach cove popular for sunset vistas, ocean breeze, and scenic coastal road photography.'
    }
  ];

  const currentPkg = rentalPackages.find(p => p.id === selectedDuration) || rentalPackages[1];

  return (
    <PageLayout
      title="Hourly Local Car Rentals with Chauffeur"
      subtitle="Keep a dedicated private car and veteran chauffeur at your command. Make unlimited stops across Visakhapatnam with zero surge pricing."
      categoryBadge="Local City Rentals"
      breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Local Rentals' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book Hourly Rental"
      heroImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
    >
      <div className="space-y-16">

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Flexible Hours</div>
              <div className="text-xs text-slate-500">4, 8 & 12 hr slabs</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Unlimited Stops</div>
              <div className="text-xs text-slate-500">Shop & wait freely</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-200">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Dedicated Vehicle</div>
              <div className="text-xs text-slate-500">Keep bags safe</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Zero Surge Price</div>
              <div className="text-xs text-slate-500">Transparent flat rates</div>
            </div>
          </div>
        </div>

        {/* Interactive Package Selector Showcase */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
                <span>Instant Package Configurator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Choose Your Rental Package</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Select the duration that matches your daily schedule in Visakhapatnam.</p>
            </div>

            {/* Duration Selector Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {rentalPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedDuration(pkg.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedDuration === pkg.id
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pkg.hours} ({pkg.km})
                </button>
              ))}
            </div>
          </div>

          {/* Active Package Hero Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {currentPkg.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• {currentPkg.tag}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900">
                  {currentPkg.hours} / {currentPkg.km} Dedicated Rental
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentPkg.description}
                </p>
              </div>

              {/* Vehicle Options for this package */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Vehicle Category:</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'sedan', name: 'Sedan (Dzire / Aura)', capacity: '4 Seats' },
                    { id: 'suv', name: 'SUV (Ertiga / Carens)', capacity: '6-7 Seats' },
                    { id: 'crysta', name: 'Innova Crysta Luxury', capacity: '7 Seats' },
                  ].map((car) => (
                    <button
                      key={car.id}
                      onClick={() => setActiveCarType(car.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        activeCarType === car.id
                          ? 'border-teal-700 bg-teal-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 truncate">{car.name}</div>
                      <div className="text-[11px] text-slate-500">{car.capacity}</div>
                      <div className="text-xs font-bold text-teal-700 mt-1">Quote on Request</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra KM / Extra Hour transparent policies */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-teal-700" />
                  <span className="text-slate-600">Extra Kilometers / Hours: <strong className="text-slate-900">Quote on Request</strong></span>
                </div>
                <div className="text-emerald-700 font-bold">
                  ✓ Fuel & Chauffeur Included
                </div>
              </div>

              {/* Package Inclusions Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentPkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Book Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-950/20 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Book {currentPkg.hours} Rental Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Photo Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
                <img
                  src={currentPkg.img}
                  alt={`${currentPkg.hours} Hourly Rental in Visakhapatnam`}
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-teal-700">Clean Commercial Fleet</div>
                      <div className="text-xs font-bold text-slate-900">GPS Tracked & Chauffeur Driven</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Available Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Package Comparison Cards */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Side-by-Side Rental Comparison</h2>
            <p className="text-xs sm:text-sm text-slate-500">Pick the ideal plan for meetings, sight-seeing, or full day engagements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rentalPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-3xl bg-white border p-6 flex flex-col justify-between shadow-lg ${
                  selectedDuration === pkg.id ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-md bg-teal-50 text-teal-800 font-bold border border-teal-200">
                      {pkg.hours}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{pkg.km} included</span>
                  </div>

                  <div>
                    <div className="text-xl font-black text-teal-800">Quote on Request</div>
                    <div className="text-[11px] text-slate-500">Custom quote upon WhatsApp booking</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Sedan (Dzire/Aura)</span>
                      <strong className="text-teal-800 font-bold">Quote on Request</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">SUV (Ertiga/Carens)</span>
                      <strong className="text-teal-800 font-bold">Quote on Request</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Innova Crysta</span>
                      <strong className="text-teal-800 font-bold">Quote on Request</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDuration(pkg.id as any);
                    onOpenBooking();
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Book {pkg.hours}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visual Guide: Top Visakhapatnam Spots to Cover with Hourly Rental */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>Local Itinerary Ideas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What You Can Cover in an 8-Hour Rental</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Our chauffeurs know every shortcut, scenic coastal viewpoint, and parking spot.</p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors shrink-0"
            >
              Custom Itinerary Booking →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityAttractions.map((spot, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={spot.img}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-900">
                      {spot.zone}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-xs text-[10px] font-bold text-teal-300">
                      {spot.timing}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {spot.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Include in Tour</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Hourly Rentals Beat Point-to-Point */}
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">
            Why Hourly Rentals Beat App-Based Ride Hailing in Vizag
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Leave Luggage & Shopping in Car</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No dragging heavy bags between meetings or beach visits. Your dedicated chauffeur stays with the vehicle while you enjoy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Executive Corporate Hospitality</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Host VIP clients and visiting business partners with an impeccably cleaned, air-conditioned sedan or Innova Crysta ready outside every meeting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Zero Surge & Zero Cancellation Fears</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Avoid app surge pricing during monsoon rains or evening peak hours on Beach Road. Your ride is locked in for the entire duration.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">Need a Custom Hourly Schedule?</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              We accommodate wedding shuttles, film crew logistics, and specialized industrial tours.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg cursor-pointer"
          >
            Speak to Rental Coordinator
          </button>
        </div>

      </div>
    </PageLayout>
  );
};
