import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Compass, 
  MapPin, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Fuel,
  Calendar,
  AlertCircle,
  Zap,
  Users,
  Luggage
} from 'lucide-react';
import { POPULAR_ROUTES, VEHICLES } from '../data/mockData';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';

interface OutstationPageProps {
  onNavigateHome: () => void;
  onBookRoute: (from: string, to: string) => void;
  onOpenBooking: () => void;
}

export const OutstationPage: React.FC<OutstationPageProps> = ({
  onNavigateHome,
  onBookRoute,
  onOpenBooking,
}) => {
  return (
    <PageLayout
      title="Outstation Taxi & Intercity Cabs"
      subtitle="Hassle-free intercity journeys across Andhra Pradesh, Odisha, and Telangana. Choose one-way drops or multi-day family round trips with verified highway chauffeurs."
      categoryBadge="Intercity & Highway Travel"
      breadcrumbs={[{ label: 'Outstation' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book Outstation Cab"
      heroImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
    >
      <SEOHead
        title="Outstation Cabs from Vizag | One-Way & Round Trip Taxis | Waltair Cabs"
        description="Book reliable outstation cabs from Visakhapatnam to Vijayawada, Rajahmundry, Kakinada, Srikakulam, Jagdalpur & Bhubaneswar. AC sedans, Ertiga & Crysta with expert drivers."
        canonicalUrl="/outstation"
        keywords={["outstation cab vizag", "outstation taxi visakhapatnam", "vizag outstation car rental", "one way outstation cab", "intercity taxi vizag"]}
      />
      <div className="space-y-16">

        {/* 3 Core Value Pillars */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-teal-500/30 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">One-Way Billing Only</h3>
                <p className="text-xs text-slate-300 mt-0.5">Never pay return journey km on single outstation drops.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Highway-Vetted Chauffeurs</h3>
                <p className="text-xs text-slate-300 mt-0.5">Experienced drivers familiar with NH16 & hill ghat roads.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Fuel className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">All-Inclusive Tariffs</h3>
                <p className="text-xs text-slate-300 mt-0.5">Includes fuel, driver batta, and GST with zero hidden fees.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Outstation Corridors List with Photography */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Intercity Corridors</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular Outstation Routes from Visakhapatnam
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Instant online booking with guaranteed commercial vehicle confirmation.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer self-start sm:self-auto"
            >
              Custom City Drop
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_ROUTES.map((route) => (
              <motion.div
                key={route.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 font-bold uppercase tracking-wider border border-teal-400/30">
                        {route.category}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-teal-600 text-white font-bold shadow-md">
                        Quote on Request
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] text-teal-300 font-medium">{route.from} to</div>
                      <div className="text-lg font-black leading-tight drop-shadow-sm">{route.to}</div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 font-semibold">
                      <span>Distance: <strong className="text-slate-800">{route.distance}</strong></span>
                      <span>Duration: <strong className="text-slate-800">{route.duration}</strong></span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {route.description}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between font-medium">
                      <span>Available Fleet:</span>
                      <strong className="text-teal-800">Sedan • Ertiga • Innova</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => onBookRoute(route.from, route.to)}
                    className="w-full py-3 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-teal-950/20 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>⚡ Book This Route</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fleet Comparison for Outstation */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/40">
                Highway Fleet Options
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2">Spacious & Smooth Highway Riding</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Every vehicle is serviced prior to long highway journeys with high ground clearance and dual air conditioning.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer self-start md:self-auto"
            >
              Book Cab
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VEHICLES.filter(v => ['dzire', 'ertiga', 'crysta'].includes(v.id)).map((veh) => (
              <div key={veh.id} className="bg-slate-800/90 rounded-2xl p-4 border border-white/10 flex flex-col justify-between group hover:border-teal-400/60 transition-all">
                <div>
                  <div className="h-40 rounded-xl overflow-hidden mb-3 bg-slate-950">
                    <img src={veh.image} alt={veh.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-extrabold text-base text-white">{veh.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-teal-300 mt-1 font-semibold">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {veh.seats} Seats</span>
                    <span className="flex items-center gap-1"><Luggage className="w-3.5 h-3.5" /> {veh.luggageCount} Bags</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{veh.popularFor}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300">Quote on Request</span>
                  <button
                    onClick={() => onBookRoute('Visakhapatnam', 'Araku Valley')}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                  >
                    Select Cab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
};
