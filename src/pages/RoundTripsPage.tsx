import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Compass, 
  MapPin, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,

  Users,
  Luggage
} from 'lucide-react';
import { VEHICLES } from '../data/mockData';

interface RoundTripsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const RoundTripsPage: React.FC<RoundTripsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Round Trip Outstation Taxi',
    'name': 'Round Trip Outstation Car Rental Visakhapatnam',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels',
    },
    'description': 'Multi-day and same-day round trip taxi rentals from Visakhapatnam. Professional chauffeur remains with you throughout the journey with unlimited local sightseeing.',
  };

  return (
    <>
      
      <PageLayout
        title="Round-Trip Outstation Cabs"
        subtitle="Enjoy seamless multi-day or same-day return trips with the same dedicated vehicle and chauffeur throughout your entire itinerary."
        categoryBadge="Family & Multi-Day Tours"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Round Trips' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Round Trip"
      >
        <div className="space-y-12">

          {/* Key Advantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-teal-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800/50">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Same Cab & Driver Throughout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No changing vehicles. The same courteous driver stays with you from your departure in Visakhapatnam until your safe return home.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/50">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Unlimited Sightseeing En Route</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take spontaneous detours to scenic viewpoints, temple darshans, roadside dhabas, and photo stops without rigid restrictions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Transparent 250 KM/Day Slabs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear minimum daily distance limits with transparent per-km billing for extra runs. Zero hidden driver food or fuel extras.
              </p>
            </div>
          </div>

          {/* Popular Round Trip Circuits */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h2 className="text-2xl font-bold text-white">Popular Round-Trip Circuits from Visakhapatnam</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/40 uppercase">2 Days / 1 Night</span>
                  <span className="text-xs text-slate-400">~380 KM Round</span>
                </div>
                <h3 className="text-lg font-bold text-white">Araku Valley & Borra Caves Circuit</h3>
                <p className="text-xs text-slate-400">Visakhapatnam → Padmapuram Gardens → Coffee Museum → Chaparai Waterfalls → Borra Caves → Return.</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sedan: <strong className="text-emerald-400">₹6,200</strong> | SUV: <strong className="text-teal-400">₹8,400</strong></span>
                  <button onClick={onOpenBooking} className="text-xs text-cyan-400 font-bold hover:underline">Book Circuit →</button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 border border-amber-800/40 uppercase">1 Day Return</span>
                  <span className="text-xs text-slate-400">~260 KM Round</span>
                </div>
                <h3 className="text-lg font-bold text-white">Annavaram Satyanarayana Swamy Darshan</h3>
                <p className="text-xs text-slate-400">Visakhapatnam → Annavaram Temple Hill → Tuni Cashew Market → Payakaraopeta → Return.</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sedan: <strong className="text-emerald-400">₹4,200</strong> | SUV: <strong className="text-teal-400">₹5,800</strong></span>
                  <button onClick={onOpenBooking} className="text-xs text-cyan-400 font-bold hover:underline">Book Circuit →</button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40 uppercase">2 Days / 1 Night</span>
                  <span className="text-xs text-slate-400">~360 KM Round</span>
                </div>
                <h3 className="text-lg font-bold text-white">Lambasingi & Kothapalli Waterfalls</h3>
                <p className="text-xs text-slate-400">Visakhapatnam → Narsipatnam → Lambasingi Apple Farms → Kothapalli Waterfalls → Return.</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sedan: <strong className="text-emerald-400">₹6,400</strong> | SUV: <strong className="text-teal-400">₹8,600</strong></span>
                  <button onClick={onOpenBooking} className="text-xs text-cyan-400 font-bold hover:underline">Book Circuit →</button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 border border-teal-800/40 uppercase">3 Days / 2 Nights</span>
                  <span className="text-xs text-slate-400">~600 KM Round</span>
                </div>
                <h3 className="text-lg font-bold text-white">Godavari Delta & Papikondalu Hub (Rajahmundry)</h3>
                <p className="text-xs text-slate-400">Visakhapatnam → Kakinada Beach → Rajahmundry Godavari Ghats → Draksharamam → Return.</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sedan: <strong className="text-emerald-400">₹9,800</strong> | SUV: <strong className="text-teal-400">₹13,200</strong></span>
                  <button onClick={onOpenBooking} className="text-xs text-cyan-400 font-bold hover:underline">Book Circuit →</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
