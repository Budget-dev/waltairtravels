import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { 
  
  Send, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  CheckCircle2, 
  X, 
  Loader2, 
  Compass, 
  IndianRupee, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

interface AiTripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanAndBook: (destination: string, vehicleType: string, estimatedFare: number) => void;
}

export const AiTripPlannerModal: React.FC<AiTripPlannerModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanAndBook,
}) => {
  const [destination, setDestination] = useState<string>('Araku Valley');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [travelGroup, setTravelGroup] = useState<string>('family');
  const [budgetTier, setBudgetTier] = useState<string>('comfortable');
  const [preferences, setPreferences] = useState<string>('Scenic viewpoints, Borra caves, coffee plantations, waterfalls');

  const [loading, setLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.planAiTrip({
        destination,
        durationDays,
        travelGroup,
        budgetTier,
        preferences: preferences.split(',').map((s) => s.trim()),
      });
      if (res.success && res.plan) {
        setPlanResult(res.plan);
      } else {
        throw new Error(res.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to AI planner service');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md"
        >
      <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col text-slate-900 shadow-2xl overflow-hidden border border-slate-200"
        >
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-cyan-900 to-[#005a66] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-200">
                          </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">AI Travel Concierge & Trip Planner</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-400 text-cyan-950 uppercase">
                  Server Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-cyan-100/90">Instant personalized road trip itinerary, routes, and cab estimation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Planner Form */}
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination from Vizag</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-700 absolute left-3 top-3" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  <option value="Araku Valley">Araku Valley & Borra Caves</option>
                  <option value="Lambasingi">Lambasingi (Fog Valley)</option>
                  <option value="Bhogapuram Airport">Bhogapuram International Airport</option>
                  <option value="Visakhapatnam City Tour">Visakhapatnam Coastal City Tour</option>
                  <option value="Annavaram">Annavaram Temple & Kakinada</option>
                  <option value="Srikakulam Arasavalli">Srikakulam Sun Temple</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trip Duration</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-cyan-700 absolute left-3 top-3" />
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  <option value={1}>1 Day (Same-Day Round Trip)</option>
                  <option value={2}>2 Days (Weekend Getaway)</option>
                  <option value={3}>3 Days (Extended Sightseeing)</option>
                  <option value={4}>4 Days (Comprehensive Tour)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Travel Group Type</label>
              <div className="relative">
                <Users className="w-4 h-4 text-cyan-700 absolute left-3 top-3" />
                <select
                  value={travelGroup}
                  onChange={(e) => setTravelGroup(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  <option value="family">Family with Kids & Elders</option>
                  <option value="couple">Couple / Honeymoon</option>
                  <option value="friends">Group of Friends</option>
                  <option value="corporate">Corporate / Business</option>
                  <option value="solo">Solo Traveler</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Comfort & Vehicle Class</label>
              <div className="relative">
                <Car className="w-4 h-4 text-cyan-700 absolute left-3 top-3" />
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                >
                  <option value="comfortable">Comfortable (Ertiga / Kia Carens / Fronx)</option>
                  <option value="budget">Economy (Maruti Dzire / Hyundai Aura)</option>
                  <option value="luxury">Premium Luxury (Toyota Innova Crysta)</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferences & Highlights</label>
              <input
                type="text"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Waterfalls, ghat viewpoints, local tribal food, temple stops"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-900/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Planning Your Trip with AI...</span>
                  </>
                ) : (
                  <>
                                        <span>Generate AI Itinerary & Quote</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Plan Result */}
          {planResult && (
            <div className="bg-cyan-50/50 border border-cyan-100 rounded-2xl p-5 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                    Recommended Itinerary
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {durationDays}-Day {destination} Custom Road Trip
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-teal-700 font-bold uppercase block">Fare & Chauffeur</span>
                    <span className="text-xs font-extrabold text-slate-800">
                      Quote on Request
                    </span>
                  </div>
                </div>
              </div>

              {/* Itinerary Description */}
              <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
                {planResult.answer}
              </div>

              {/* Key Attractions Grid */}
              {planResult.recommendedPlaces && planResult.recommendedPlaces.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-700" />
                    Key Sightseeing Stops
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {planResult.recommendedPlaces.map((place: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-cyan-200 text-slate-800 text-xs font-medium shadow-2xs"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Vehicle & Pro Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Recommended Vehicle</span>
                  <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-cyan-700 shrink-0" />
                    <span>{planResult.recommendedVehicle}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Expert Road Tips</span>
                  <ul className="text-[11px] text-slate-600 space-y-1">
                    {planResult.proTips?.slice(0, 2).map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instant Booking Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPlanAndBook(
                      destination,
                      planResult.recommendedVehicle || 'Innova Crysta',
                      planResult.estimatedBudgetInr || 4500
                    );
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Book This Trip with Waltair Chauffeur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
