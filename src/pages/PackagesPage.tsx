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
  Compass
} from 'lucide-react';
import { TOUR_PACKAGES } from '../data/mockData';
import { TourPackage } from '../types';

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
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hills' | 'temples' | 'beaches' | 'waterfalls' | 'weekend'>('all');

  const filteredPackages = selectedFilter === 'all'
    ? TOUR_PACKAGES
    : TOUR_PACKAGES.filter((p) => p.category === selectedFilter);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    'name': 'Visakhapatnam & Araku Valley Sightseeing Tour Packages',
    'touristType': ['Family', 'Holiday Travelers', 'Couples', 'Solo Explorers'],
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels Visakhapatnam',
    },
    'description': 'Curated holiday taxi packages to Araku Valley, Borra Caves, Lambasingi, Annavaram, and Vizag coastal beaches.',
  };

  return (
    <>
      
      <PageLayout
        title="Curated Sightseeing Packages"
        subtitle="Unforgettable journeys to the Eastern Ghats, mist-covered valleys, tribal coffee plantations, and coastal heritage temples."
        categoryBadge="Holiday & Tour Specials"
        breadcrumbs={[{ label: 'Packages' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Plan Custom Tour"
      >
        <div className="space-y-10">

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'hills', label: 'Hill Stations & Valleys' },
              { id: 'temples', label: 'Sacred Temples' },
              { id: 'beaches', label: 'Coastal & Beaches' },
              { id: 'waterfalls', label: 'Waterfalls & Nature' },
              { id: 'weekend', label: 'Weekend Getaways' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group shadow-xl"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      {pkg.duration}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 text-xs font-bold bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{pkg.rating}</span>
                        <span className="text-[10px] text-slate-800">({pkg.reviewsCount})</span>
                      </div>
                      <span className="text-xs text-slate-200 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs font-medium">
                        {pkg.distance}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Highlights:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.highlights.slice(0, 3).map((hl, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                                            <span>Includes: {pkg.vehicleIncluded}</span>
                    </div>
                  </div>
                </div>

                {/* Footer and CTA */}
                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Service Type</div>
                    <div className="text-sm font-bold text-cyan-400">
                      All-Inclusive Cab
                    </div>
                  </div>

                  <button
                    onClick={() => onBookPackage(pkg)}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>Book Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Package Inclusions & Guide */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">What's Included in Every Sightseeing Package?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Doorstep Hotel / Residence Pickup & Drop</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fuel, Driver Allowance & Mountain Tolls</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clean AC Vehicle with Large Luggage Boot</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Flexible Sightseeing Halts for Photography</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Experienced Ghat-Road Certified Chauffeur</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24x7 Trip Support Desk</span>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
