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
  AlertCircle
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockData';

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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Outstation Cab Service Visakhapatnam',
    'name': 'Waltair Travels Intercity & Outstation Cabs',
    'description': 'One-way and round-trip outstation taxi service from Visakhapatnam to Rajahmundry, Vijayawada, Hyderabad, Kakinada, Srikakulam, and Berhampur.',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels',
    },
  };

  return (
    <>
      
      <PageLayout
        title="Outstation Taxi Services"
        subtitle="Hassle-free intercity journeys across South India. Choose one-way drops or multi-day family round trips with verified highway chauffeurs."
        categoryBadge="Intercity & Highway Travel"
        breadcrumbs={[{ label: 'Outstation' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Outstation Cab"
      >
        <div className="space-y-12">

          {/* Value Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-900 border border-teal-800/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-900/60 text-teal-400 flex items-center justify-center shrink-0 border border-teal-700/50">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">One-Way Billing Only</h3>
                  <p className="text-xs text-slate-400">Never pay return journey km on single outstation drops.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-900/60 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-700/50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Highway-Trained Chauffeurs</h3>
                  <p className="text-xs text-slate-400">Experienced drivers familiar with NH16 & hill ghat roads.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-700/50">
                  <Fuel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Transparent Fuel & Tolls</h3>
                  <p className="text-xs text-slate-400">All prices include driver batta, fuel, and GST options.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Outstation Corridors List */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular Outstation Corridors from Visakhapatnam</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Instant online booking with guaranteed vehicle confirmation.</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 font-bold self-start sm:self-auto">
                Flat Rates Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {POPULAR_ROUTES.map((route) => (
                <div
                  key={route.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-teal-500/40 transition-all group shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 font-bold uppercase tracking-wider border border-teal-800/40">
                        {route.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-slate-500" />
                        {route.distance} • {route.duration}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400 font-semibold">{route.from} to</div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {route.to}
                      </h3>
                    </div>

                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-800/80">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Starting From</div>
                        <div className="text-xl font-extrabold text-cyan-400">₹{route.startingPrice.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400">
                        Sedan / Ertiga / SUV
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookRoute(route.from, route.to)}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Book Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Outstation Pricing FAQ & Guidelines */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white">Outstation Travel Slabs & Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400">Round-Trip Distance Calculation</h4>
                <p className="text-slate-400 leading-relaxed">
                  Round trips are subject to a minimum average run of 250 KM per calendar day. Any additional kilometers driven beyond the package limit are billed at standard per-km rates.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400">Driver Night Allowance (Batta)</h4>
                <p className="text-slate-400 leading-relaxed">
                  For trips extending past 10:00 PM or multi-day stays, a standard driver night allowance of ₹350 per night is applied for driver accommodation and meals.
                </p>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
