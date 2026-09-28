import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  Calendar, 
  Check, 
  ChevronRight,
  Send,
  Plane,
  ShieldCheck,
  X
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
    <section id="routes" className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Segmented Tab Control */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Direct Highways & Sightseeing Tours</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Intercity Routes & Holiday Tours
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Transparent one-way tariffs with zero return charges, plus all-inclusive holiday packages for Araku Valley and Lambasingi.
            </p>
          </div>

          {/* Toggle Tab with Motion Pill */}
          <div className="relative flex items-center p-1 bg-slate-100 rounded-2xl shrink-0 self-start md:self-auto border border-slate-200/60">
            <button
              onClick={() => setActiveTab('routes')}
              className={`relative z-10 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'routes' ? 'text-teal-950 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-teal-700" />
              <span>Outstation Routes ({POPULAR_ROUTES.length})</span>
              {activeTab === 'routes' && (
                <motion.div
                  layoutId="routesActiveTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                />
              )}
            </button>

            <button
              id="tab-packages-btn"
              onClick={() => setActiveTab('packages')}
              className={`relative z-10 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'packages' ? 'text-teal-950 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-teal-700" />
              <span>Tour Packages ({TOUR_PACKAGES.length})</span>
              {activeTab === 'packages' && (
                <motion.div
                  layoutId="routesActiveTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Outstation Popular Routes Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'routes' && (
            <motion.div 
              key="routes-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {POPULAR_ROUTES.map((route) => (
                <motion.div
                  key={route.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-900/5 hover:border-teal-400/80 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-teal-900/90 text-teal-200 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border border-teal-700/50 backdrop-blur-xs">
                      {route.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-base sm:text-lg flex items-center gap-2">
                      <span className="truncate">{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-teal-300 shrink-0" />
                      <span className="truncate">{route.to}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-teal-700" />
                          {route.distance}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-teal-700" />
                          {route.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                        {route.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-0.5">
                          One-Way / Roundtrip
                        </span>
                        <div className="text-[11px] text-slate-500">Tolls & GST available upfront</div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => onBookRoute(route.from, route.to)}
                        className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer group/btn"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Tab 2: Sightseeing Packages Grid */}
          {activeTab === 'packages' && (
            <motion.div 
              key="packages-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
            >
              {TOUR_PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-900/5 hover:border-teal-400/80 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
                >
                  <div className="sm:w-2/5 relative h-52 sm:h-auto overflow-hidden bg-slate-100">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{pkg.rating} ({pkg.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="sm:w-3/5 p-5 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md mb-1.5">
                        <Clock className="w-3 h-3 text-teal-700" />
                        <span>{pkg.duration} • {pkg.distance}</span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-1">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {pkg.subtitle}
                      </p>

                      <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                        {pkg.highlights.slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate text-slate-700">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">Doorstep Hotel / Home Pickup</div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPackageForDetail(pkg)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Itinerary
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={() => onBookPackage(pkg)}
                          className="px-3.5 sm:px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer group/pbtn"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/pbtn:translate-x-0.5 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Itinerary Modal */}
        <AnimatePresence>
          {selectedPackageForDetail && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">{selectedPackageForDetail.title}</h4>
                    <p className="text-xs text-teal-200 mt-0.5">{selectedPackageForDetail.duration} • {selectedPackageForDetail.distance}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPackageForDetail(null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-2.5">Sightseeing Itinerary Timeline</div>
                    <div className="space-y-3 border-l-2 border-teal-600 pl-3 ml-2">
                      {selectedPackageForDetail.itinerary.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-teal-700 border-2 border-white" />
                          <div className="text-slate-800 font-medium leading-relaxed">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-100">
                    <div className="font-bold text-teal-950 mb-1">Package Inclusions</div>
                    <ul className="text-slate-700 space-y-1">
                      <li>✓ Chauffeur driven AC Cab for full tour duration</li>
                      <li>✓ All highway tolls, parking tickets & state permit tax included</li>
                      <li>✓ Doorstep hotel/home pickup & return drop</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-600">
                    All-Inclusive Cab Service
                  </div>
                  <button
                    onClick={() => {
                      const p = selectedPackageForDetail;
                      setSelectedPackageForDetail(null);
                      onBookPackage(p);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>Book This Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
