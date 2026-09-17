import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Compass, 
  MapPin, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Fuel, 
  Clock,
  ArrowRight,
  
} from 'lucide-react';
import { POPULAR_ROUTES, VEHICLES } from '../data/mockData';

interface OutstationCabsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const OutstationCabsPage: React.FC<OutstationCabsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Outstation Cab Rental',
    'name': 'Outstation Taxi Service Visakhapatnam',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels',
    },
    'description': 'Reliable one-way and round-trip outstation cabs from Visakhapatnam to all major cities in Andhra Pradesh, Telangana, and Odisha.',
  };

  return (
    <>
      
      <PageLayout
        title="Outstation Cabs & Intercity Travel"
        subtitle="Travel outside Visakhapatnam with total peace of mind. Choose one-way drops or multi-day family round trips with verified highway chauffeurs."
        categoryBadge="Highway & Interstate"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Outstation Cabs' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Outstation Cab"
      >
        <div className="space-y-12">

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800/50">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">One-Way Drop Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Only pay for the exact distance travelled to your destination. Zero return charges or ghost kilometer markups.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Highway Certified Fleet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All vehicles undergo strict mechanical and safety checks before long-distance highway runs, with full commercial permits.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">24x7 Highway Roadside Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated backend monitoring team with immediate backup cab dispatch across all national and state highways.
              </p>
            </div>
          </div>

          {/* Popular Routes List */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Intercity Routes from Visakhapatnam</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Fixed flat rates including fuel and toll estimate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {POPULAR_ROUTES.map((route) => (
                <div
                  key={route.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 hover:border-teal-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">{route.category}</div>
                    <h3 className="text-base font-bold text-white mt-1">{route.from} to {route.to}</h3>
                    <div className="text-xs text-slate-400 mt-1">{route.distance} • {route.duration}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Trip Type</div>
                      <div className="text-xs font-bold text-cyan-400">One-Way / Round-Trip</div>
                    </div>
                    <button
                      onClick={onOpenBooking}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Book Cab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Recommendations for Outstation */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Recommended Vehicles for Highway Journeys</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VEHICLES.filter(v => ['Sedan', 'SUV', 'Innova Crysta'].includes(v.category)).map((veh) => (
                <div key={veh.id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <img src={veh.image} alt={veh.name} className="w-full h-36 object-contain rounded-xl" />
                  <div>
                    <h3 className="text-base font-bold text-white">{veh.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{veh.modelExamples}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{veh.seats} Passengers</span>
                    <span className="font-bold text-cyan-400">AC & Commercial Permit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
