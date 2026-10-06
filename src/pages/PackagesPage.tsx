import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Palmtree, 
  MapPin, 
  Clock, 
  Star, 
  Check, 
  ArrowRight,
  Mountain,
  Landmark,
  Compass,
  Zap,
  CheckCircle2,
  Calendar,
  Car,
  ChevronDown,
  ChevronUp,
  Camera
} from 'lucide-react';
import { TOUR_PACKAGES } from '../data/mockData';
import { TourPackage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PackagesPageProps {
  onNavigateHome: () => void;
  onBookPackage: (pkg: TourPackage) => void;
  onOpenBooking: () => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  onNavigateHome,
  onBookPackage,
  onOpenBooking,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hills' | 'temples' | 'beaches'>('all');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  const filteredPackages = selectedFilter === 'all'
    ? TOUR_PACKAGES
    : TOUR_PACKAGES.filter((p) => p.category === selectedFilter);

  const gallerySpots = [
    { name: 'Million-Year-Old Borra Caves', loc: 'Araku Ghats', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rishikonda Blue Flag Beach', loc: 'Visakhapatnam', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Misty Lambasingi Apple Woods', loc: 'Eastern Ghats', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sacred Ratnagiri Hill Temple', loc: 'Annavaram', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <PageLayout
      title="Curated Sightseeing Packages"
      subtitle="Unforgettable journeys to the Eastern Ghats, mist-covered valleys, tribal coffee plantations, and coastal heritage temples."
      categoryBadge="Holiday & Tour Specials"
      breadcrumbs={[{ label: 'Packages' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Plan Custom Tour"
      heroImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
    >
      <div className="space-y-16">

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Packages (4)' },
            { id: 'hills', label: '⛰️ Hill Stations & Valleys' },
            { id: 'beaches', label: '🏖️ Coastal Heritage & Beaches' },
            { id: 'temples', label: '🛕 Sacred Temple Circuits' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-teal-800 text-white shadow-md shadow-teal-950/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => {
            const isExpanded = expandedPackageId === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image container with high contrast text */}
                  <div className="relative h-60 sm:h-68 overflow-hidden bg-slate-950">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-teal-400/40 text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                        {pkg.duration}
                      </span>

                      <div className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold shadow-lg">
                        Quote on Request
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{pkg.rating}</span>
                        <span className="text-[10px] text-slate-800">({pkg.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-xs text-slate-200 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg font-semibold border border-white/20">
                        {pkg.distance}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-teal-800 transition-colors">
                        {pkg.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Tour Highlights:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.highlights.map((hl, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200/70 font-semibold"
                          >
                            ✓ {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 pt-1">
                      <Car className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>Vehicle: <strong>{pkg.vehicleIncluded}</strong></span>
                    </div>

                    {/* Expandable Itinerary Accordion */}
                    {pkg.itinerary && pkg.itinerary.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                          className="w-full flex items-center justify-between text-xs font-bold text-teal-800 hover:text-teal-900 py-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Day Itinerary' : 'View Complete Day Itinerary'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200 mt-2"
                            >
                              {pkg.itinerary.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-1.5 shrink-0" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and CTA */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Tour Fare</div>
                    <div className="text-base font-extrabold text-teal-800">
                      Quote on Request
                    </div>
                  </div>

                  <button
                    onClick={() => onBookPackage(pkg)}
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-teal-800 to-emerald-700 hover:from-teal-900 hover:to-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-teal-950/20 cursor-pointer transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>⚡ Book Package</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tourist Photo Gallery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Traveler Gallery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">Breathtaking Eastern Ghats Destinations</h3>
            </div>
            <button
              onClick={onOpenBooking}
              className="text-xs font-bold text-teal-800 hover:underline cursor-pointer"
            >
              Plan Custom Route →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallerySpots.map((spot, i) => (
              <div key={i} className="group relative h-48 rounded-2xl overflow-hidden shadow-md bg-slate-950">
                <img src={spot.img} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] text-teal-300 font-semibold">{spot.loc}</div>
                  <div className="font-extrabold text-xs leading-snug line-clamp-1">{spot.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-lg">
          <h3 className="text-lg font-black text-slate-900">What's Included in Every Tour Package?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Doorstep Hotel / Residence Pickup & Drop</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fuel, Driver Allowance & Mountain Tolls Included</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Clean Sanitized AC Cab with Large Luggage Boot</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Flexible Sightseeing Halts for Photography</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Experienced Mountain Ghat-Certified Chauffeur</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>24x7 Trip Coordination & Emergency Support</span>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
};
