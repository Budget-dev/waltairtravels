import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Car, 
  IndianRupee, 
  ArrowRight, 
  ShieldCheck,

  Info
} from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/mockData';
import { Vehicle } from '../types';
import { useVehicles } from '../hooks/useVehicles';

interface FareCalculatorProps {
  onQuickBook: (data: {
    pickup: string;
    dropoff: string;
    vehicleId: string;
    distance: number;
    estimatedFare: number;
  }) => void;
}

export const FareCalculatorSection: React.FC<FareCalculatorProps> = ({ onQuickBook }) => {
  const { vehicles, loading } = useVehicles();
  const [pickup, setPickup] = useState<string>('Alluri Sitharama Raju International Airport ASI , Bhogapuram');
  const [dropoff, setDropoff] = useState<string>('Visakhapatnam Railway Station (Central)');
  const [distanceKm, setDistanceKm] = useState<number>(42);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [includeAirportToll, setIncludeAirportToll] = useState<boolean>(true);

  // Set default vehicle when vehicles load
  React.useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles.find(v => v.id === 'sedan') || vehicles[0]);
    }
  }, [vehicles, selectedVehicle]);

  // Dynamic distance estimation when user picks locations
  const handleLocationChange = (p: string, d: string) => {
    setPickup(p);
    setDropoff(d);
    const text = `${p} ${d}`.toLowerCase();
    if (text.includes('araku')) setDistanceKm(115);
    else if (text.includes('vijayawada')) setDistanceKm(350);
    else if (text.includes('rajahmundry')) setDistanceKm(190);
    else if (text.includes('kakinada')) setDistanceKm(155);
    else if (text.includes('srikakulam')) setDistanceKm(105);
    else if (text.includes('bhogapuram')) setDistanceKm(42);
    else if (text.includes('vtz') || text.includes('airport')) setDistanceKm(32);
    else setDistanceKm(25);
  };

  // Calculations
  const basePrice = selectedVehicle?.baseFare || 0;
  const extraKm = Math.max(0, distanceKm - (selectedVehicle?.baseKm || 0));
  const distanceFare = Math.round(extraKm * (selectedVehicle?.ratePerKm || 0));
  const toll = includeAirportToll ? 140 : 0;
  const subTotal = basePrice + distanceFare + toll;
  const gst = Math.round(subTotal * 0.05);
  const total = subTotal + gst;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#004751] rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden relative">
          
          {/* Subtle background graphics */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Calculator Controls */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>Transparent Fare Estimator</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Calculate Exact Taxi Fare Before Booking
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Zero hidden charges. Complete breakdown of base rate, per-km charges, toll estimations, and 5% GST.
              </p>

              {/* Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pickup Location
                  </label>
                  <select
                    value={pickup}
                    onChange={(e) => handleLocationChange(e.target.value, dropoff)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {POPULAR_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dropoff Location
                  </label>
                  <select
                    value={dropoff}
                    onChange={(e) => handleLocationChange(pickup, e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {POPULAR_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Estimated Route Distance:</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="400"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>5 km (Short City)</span>
                  <span>100 km (Bhogapuram / Srikakulam)</span>
                  <span>400 km (Vijayawada)</span>
                </div>
              </div>

              {/* Vehicle Selection Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Cab Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {loading ? (
                    <div className="col-span-5 text-center text-xs text-slate-400 py-4">Loading vehicles...</div>
                  ) : vehicles.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        selectedVehicle?.id === v.id
                          ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg'
                          : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold truncate">{v.name.split(' ')[0]}</div>
                      <div className="text-[10px] opacity-80">₹{v.ratePerKm}/km</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Fare Breakdown Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-5 sm:p-6 text-slate-900 shadow-xl border border-slate-100 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Selected Vehicle</span>
                    <h4 className="font-bold text-base text-slate-900">{selectedVehicle?.name || '...'}</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 font-bold">
                    {selectedVehicle?.seats || 4} Seater AC
                  </span>
                </div>

                {/* Line Items */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare (incl. first {selectedVehicle?.baseKm || 0} km)</span>
                    <span className="font-semibold text-slate-900">₹{basePrice}</span>
                  </div>

                  {extraKm > 0 && (
                    <div className="flex justify-between">
                      <span>Extra Distance ({extraKm} km × ₹{selectedVehicle?.ratePerKm || 0})</span>
                      <span className="font-semibold text-slate-900">₹{distanceFare}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={includeAirportToll}
                        onChange={(e) => setIncludeAirportToll(e.target.checked)}
                        className="rounded text-cyan-700"
                      />
                      <span>Airport Toll & Highway Pass</span>
                    </label>
                    <span className="font-semibold text-slate-900">₹{toll}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5% Transport Tax)</span>
                    <span className="font-semibold text-slate-900">₹{gst}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Total</span>
                    <div className="text-2xl font-extrabold text-slate-900 flex items-center">
                      <IndianRupee className="w-5 h-5 text-cyan-700" />
                      <span>{total}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickBook({
                      pickup,
                      dropoff,
                      vehicleId: selectedVehicle?.id || 'sedan',
                      distance: distanceKm,
                      estimatedFare: total
                    })}
                    className="px-5 py-3 rounded-2xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-900/10 hover:shadow-xl transition-all cursor-pointer"
                  >
                    <span>Book For ₹{total}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Price Lock Guarantee: No surge pricing during peak hours.</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
