import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Plane, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  
  Car, 
  Navigation,
  ArrowRight
} from 'lucide-react';
import { VEHICLES } from '../data/mockData';

interface AirportTaxiPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const AirportTaxiPage: React.FC<AirportTaxiPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Airport Taxi Service',
    'name': 'Bhogapuram ASI & Visakhapatnam VTZ Airport Taxi Service',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels',
    },
    'areaServed': [
      'Bhogapuram Airport ASI',
      'Visakhapatnam Airport VTZ',
      'Siripuram',
      'Gajuwaka',
      'Madhurawada',
      'Rushikonda',
      'Anakapalle',
      'Vizianagaram',
    ],
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'INR',
      'lowPrice': '650',
      'highPrice': '2800',
    },
  };

  const airportRoutes = [
    { from: 'Bhogapuram Airport (ASI)', to: 'Siripuram & Waltair Uplands', distance: '44 KM', estTime: '48 mins', sedanFare: '₹1,250', suvFare: '₹1,850' },
    { from: 'Bhogapuram Airport (ASI)', to: 'Gajuwaka & Steel Plant', distance: '62 KM', estTime: '65 mins', sedanFare: '₹1,650', suvFare: '₹2,350' },
    { from: 'Bhogapuram Airport (ASI)', to: 'Madhurawada IT SEZ', distance: '28 KM', estTime: '30 mins', sedanFare: '₹950', suvFare: '₹1,450' },
    { from: 'Bhogapuram Airport (ASI)', to: 'Rushikonda Beach / Resorts', distance: '32 KM', estTime: '35 mins', sedanFare: '₹1,050', suvFare: '₹1,550' },
    { from: 'Bhogapuram Airport (ASI)', to: 'Vizianagaram City Center', distance: '22 KM', estTime: '25 mins', sedanFare: '₹750', suvFare: '₹1,150' },
    { from: 'Bhogapuram Airport (ASI)', to: 'Srikakulam Town', distance: '68 KM', estTime: '70 mins', sedanFare: '₹1,800', suvFare: '₹2,500' },
  ];

  return (
    <>
      
      <PageLayout
        title="Airport Taxi Service (Bhogapuram ASI & VTZ)"
        subtitle="Guaranteed punctual airport pickups and drops with flight delay tracking, meet & greet terminal service, and fixed transparent fares."
        categoryBadge="Dedicated Airport Transfer"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Airport Taxi' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Airport Cab Now"
      >
        <div className="space-y-12">

          {/* Hero Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/50">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Flight Delay Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We track your flight number in real-time. Even if your flight is delayed by hours, your driver will be waiting at the arrival terminal without extra wait charges.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">45-Mins Free Waiting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take your time with baggage claim and terminal security. Every airport pickup includes 45 minutes of complimentary buffer time from flight touchdown.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-800/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">All Tolls & Taxes Included</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No surprises at the toll plaza. NH16 highway toll tax and airport parking fees are transparently outlined with proper GST invoicing.
              </p>
            </div>
          </div>

          {/* Fixed Fare Chart for Bhogapuram ASI Airport */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Bhogapuram International Airport (ASI) Fare Slabs</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Estimated one-way fares to major city centers, IT corridors, and surrounding districts.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">From</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Distance & Time</th>
                    <th className="py-3 px-4">Prime Sedan (4-Seater)</th>
                    <th className="py-3 px-4">Innova / SUV (6-7 Seater)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {airportRoutes.map((route, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-cyan-400">{route.from}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{route.to}</td>
                      <td className="py-3.5 px-4 text-slate-400">{route.distance} (~{route.estTime})</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{route.sedanFare}</td>
                      <td className="py-3.5 px-4 font-bold text-teal-400">{route.suvFare}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={onOpenBooking}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Book Ride
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Airport Pickup Procedure */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">How Our Airport Pickup Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-extrabold text-lg">01. Book Online</div>
                <p className="text-xs text-slate-400">Enter your flight number, date, and drop location. Instant confirmation via SMS.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-extrabold text-lg">02. Driver Dispatched</div>
                <p className="text-xs text-slate-400">Receive driver name, contact, vehicle number, and live tracking link 2 hours before landing.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-extrabold text-lg">03. Meet at Terminal</div>
                <p className="text-xs text-slate-400">Your driver will be waiting at the designated arrival gate / pickup bay with your name placard.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-extrabold text-lg">04. Smooth Ride</div>
                <p className="text-xs text-slate-400">Enjoy a relaxed, air-conditioned ride to your home, resort, or office with zero surge pricing.</p>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
