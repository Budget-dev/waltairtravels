import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Check, 
  ChevronRight,
  Send,
  Plane
} from 'lucide-react';
import { POPULAR_ROUTES, TOUR_PACKAGES } from '../data/mockData';
import { TourPackage, PopularRoute } from '../types';

interface PopularRoutesAndPackagesProps {
  onBookRoute: (from: string, to: string) => void;
  onBookPackage: (pkg: TourPackage) => void;
}

export const PopularRoutesAndPackages: React.FC<PopularRoutesAndPackagesProps> = ({
  onBookRoute,
  onBookPackage,
}) => {
  const [activeTab, setActiveTab] = useState<'routes' | 'packages'>('routes');
  const [selectedPackageForDetail, setSelectedPackageForDetail] = useState<TourPackage | null>(null);

  return (
    <section id="routes" className="py-14 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Fixed Fares & Sightseeing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Outstation Routes & Holiday Tours
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-xl">
              Transparent fixed fares with zero return-fare penalty for one-way trips, plus customized Vizag & Araku sightseeing tours.
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'routes'
                  ? 'bg-white text-cyan-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-4 h-4 text-cyan-600" />
              <span>Outstation Routes ({POPULAR_ROUTES.length})</span>
            </button>

            <button
              id="tab-packages-btn"
              onClick={() => setActiveTab('packages')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'packages'
                  ? 'bg-white text-cyan-800 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-4 h-4 text-cyan-600" />
              <span>Sightseeing Packages ({TOUR_PACKAGES.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Outstation Popular Routes Grid */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_ROUTES.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-600 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-cyan-900/90 text-cyan-200 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">
                    {route.category}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white font-bold text-base flex items-center gap-1.5">
                    <span>{route.from}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    <span>{route.to}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-2.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                        {route.distance}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        {route.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {route.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">All-Inclusive One-Way</span>
                      <div className="text-lg font-extrabold text-slate-900 flex items-center">
                        <IndianRupee className="w-4 h-4 text-cyan-700" />
                        <span>{route.startingPrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookRoute(route.from, route.to)}
                      className="px-4 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Book Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Sightseeing Packages Grid */}
        {activeTab === 'packages' && (
          <div id="packages" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOUR_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-600 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{pkg.rating} ({pkg.reviewsCount})</span>
                  </div>
                </div>

                <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md">
                      {pkg.duration} • {pkg.distance}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 mb-1 group-hover:text-cyan-700 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {pkg.subtitle}
                    </p>

                    <div className="space-y-1 mb-4 text-xs text-slate-600">
                      {pkg.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Package Fare</span>
                      <div className="text-lg font-extrabold text-slate-900 flex items-center">
                        <IndianRupee className="w-4 h-4 text-cyan-700" />
                        <span>{pkg.price}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1">/cab</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPackageForDetail(pkg)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        Itinerary
                      </button>
                      <button
                        type="button"
                        onClick={() => onBookPackage(pkg)}
                        className="px-4 py-2 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <span>Book Tour</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Itinerary Modal */}
        {selectedPackageForDetail && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-slate-900 to-[#005a66] text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base sm:text-lg">{selectedPackageForDetail.title}</h4>
                  <p className="text-xs text-cyan-200">{selectedPackageForDetail.duration} • {selectedPackageForDetail.distance}</p>
                </div>
                <button
                  onClick={() => setSelectedPackageForDetail(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-2">Day Itinerary Timeline</div>
                  <div className="space-y-2.5 border-l-2 border-cyan-500 pl-3">
                    {selectedPackageForDetail.itinerary.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-700 border-2 border-white"></div>
                        <div className="text-slate-800 font-medium">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-100">
                  <div className="font-bold text-cyan-950 mb-1">Package Inclusions</div>
                  <ul className="text-slate-700 space-y-1">
                    <li>✓ Chauffeur driven AC Cab for full duration</li>
                    <li>✓ Tolls, parking fees & state transport tax included</li>
                    <li>✓ Doorstep hotel/home pickup & return drop</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-base font-extrabold text-slate-900">
                  ₹{selectedPackageForDetail.price} All-Inclusive
                </div>
                <button
                  onClick={() => {
                    const p = selectedPackageForDetail;
                    setSelectedPackageForDetail(null);
                    onBookPackage(p);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Book This Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
