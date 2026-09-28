import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Luggage, 
  Wind, 
  Check, 
  ArrowRight, 
  Car,
  Fuel,
  Sparkles
} from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';

interface FleetSectionProps {
  onBookVehicle: (vehicleId: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onBookVehicle }) => {
  const { vehicles } = useVehicles();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: 'All Fleet' },
    { id: 'dzire', label: 'Maruti Dzire' },
    { id: 'ertiga', label: 'Ertiga (7-Seater)' },
    { id: 'aura', label: 'Hyundai Aura' },
    { id: 'carens', label: 'Kia Carens' },
    { id: 'fronx', label: 'Maruti Fronx' },
    { id: 'crysta', label: 'Innova Crysta' },
  ];

  const filteredVehicles = filterCategory === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.id === filterCategory);

  return (
    <section id="fleet" className="py-14 sm:py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Modern Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-2.5">
              <Car className="w-3.5 h-3.5 text-teal-600" />
              <span>Commercial Permitted Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified & Sanitized Fleet
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Every cab is equipped with chilled air conditioning, verified commercial insurance, GPS live telemetry, and courteous chauffeurs.
            </p>
          </div>

          {/* Filter Pills with Horizontal Scroll on Mobile & Animated Pill */}
          <div className="relative flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 bg-slate-200/70 p-1 rounded-2xl shrink-0 no-scrollbar">
            {filterOptions.map((opt) => {
              const isActive = filterCategory === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFilterCategory(opt.id)}
                  className={`relative z-10 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-teal-950 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFleetTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fleet Cards Grid with AnimatePresence */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-900/5 hover:border-teal-400/80 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Preserved Vehicle Image */}
                <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Car className="w-3 h-3 text-teal-400" />
                    <span>{vehicle.category}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-white/50">
                    {vehicle.modelExamples}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {vehicle.name}
                    </h3>

                    {/* Specs Row - Clean 3-item grid that never overflows */}
                    <div className="grid grid-cols-3 gap-2 my-3.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="font-semibold">{vehicle.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="font-semibold">{vehicle.luggageCount} Bags</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="font-semibold">Dual AC</span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Included Amenities
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {vehicle.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-slate-700 truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom CTA Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      id={`book-vehicle-${vehicle.id}-btn`}
                      onClick={() => onBookVehicle(vehicle.id)}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <span>Book {vehicle.name}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
