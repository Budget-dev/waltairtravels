import React, { useState } from 'react';
import { 
  Users, 
  Luggage, 
  Wind, 
  Check, 
  IndianRupee, 
  ShieldCheck, 
  
  ArrowRight, 
  Car 
} from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { Vehicle, ServiceCategory, TripSubType } from '../types';

interface FleetSectionProps {
  onBookVehicle: (vehicleId: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onBookVehicle }) => {
  const { vehicles, loading } = useVehicles();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredVehicles = filterCategory === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.category === filterCategory);

  return (
    <section id="fleet" className="py-14 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
                            <span>Premium Sanitized Fleet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Transparent Fares for Every Group Size
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-xl">
              From solo airport transfers to 17-seater luxury family excursions, every vehicle is commercially insured and sanitized.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 bg-slate-100 p-1 rounded-2xl shrink-0 scrollbar-none">
            {['all', 'Hatchback', 'Sedan', 'SUV', 'Innova Crysta', 'Tempo Traveller'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white text-cyan-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Cabs' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-600 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Car className="w-3 h-3 text-cyan-400" />
                  <span>{vehicle.category}</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-extrabold px-3 py-1 rounded-xl shadow-md flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 text-cyan-700" />
                  <span className="text-base">{vehicle.ratePerKm}</span>
                  <span className="text-[10px] text-slate-500 font-normal ml-0.5">/km</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {vehicle.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {vehicle.modelExamples}
                  </p>

                  {/* Specs row */}
                  <div className="grid grid-cols-3 gap-2 my-4 py-2.5 px-3 rounded-2xl bg-slate-50 text-slate-700 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="font-semibold">{vehicle.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Luggage className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="font-semibold">{vehicle.luggageCount} Bags</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="font-semibold">AC Chilled</span>
                    </div>
                  </div>

                  {/* Features checklist */}
                  <ul className="space-y-1.5 mb-5 text-xs text-slate-600">
                    {vehicle.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Starting From</span>
                    <div className="text-base font-extrabold text-slate-900 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-600" />
                      <span>{vehicle.baseFare}</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-1">({vehicle.baseKm}km inc.)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id={`book-vehicle-${vehicle.id}-btn`}
                    onClick={() => onBookVehicle(vehicle.id)}
                    className="px-4 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-900/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
