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
  ArrowRight,
  Zap,
  Luggage,
  Users,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { VEHICLES } from '../data/mockData';
import { motion } from 'framer-motion';

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
  const airportRoutes = [
    { 
      from: 'Bhogapuram Airport (ASI)', 
      to: 'Siripuram Circle & Beach Road', 
      distance: '42 KM', 
      estTime: '45 mins', 
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      tag: 'Most Popular City Drop'
    },
    { 
      from: 'Bhogapuram Airport (ASI)', 
      to: 'Rushikonda Beach & IT SEZ', 
      distance: '28 KM', 
      estTime: '32 mins', 
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80',
      tag: 'IT Corridor & Resorts'
    },
    { 
      from: 'Bhogapuram Airport (ASI)', 
      to: 'Gajuwaka & Steel Plant', 
      distance: '58 KM', 
      estTime: '60 mins', 
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      tag: 'Industrial Hub'
    },
    { 
      from: 'Bhogapuram Airport (ASI)', 
      to: 'Vizianagaram Fort Town', 
      distance: '22 KM', 
      estTime: '25 mins', 
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      tag: 'Fast Regional Link'
    },
    { 
      from: 'Bhogapuram Airport (ASI)', 
      to: 'Srikakulam Town', 
      distance: '65 KM', 
      estTime: '70 mins', 
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      tag: 'North Coastal Express'
    },
    { 
      from: 'Visakhapatnam Airport (VTZ)', 
      to: 'Siripuram / MVP Colony', 
      distance: '14 KM', 
      estTime: '25 mins', 
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
      tag: 'VTZ Inner City'
    },
  ];

  return (
    <PageLayout
      title="Airport Taxi Service (Bhogapuram ASI & VTZ)"
      subtitle="Guaranteed punctual airport pickups and drops with flight delay tracking, meet & greet terminal service, and fixed transparent fares."
      categoryBadge="Dedicated Airport Transfer"
      breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Airport Taxi' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book Airport Cab Now"
      heroImage="/hero-banner.png"
    >
      <div className="space-y-16">

        {/* 3 Core Airport Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-teal-200/80 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Flight Delay Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We monitor your flight arrival via real-time radar. Even if your flight is delayed by hours, your chauffeur will be waiting at the arrival terminal without penalty fees.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-emerald-200/80 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">45-Mins Free Waiting Time</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Take your time collecting baggage and navigating the terminal. Every airport pickup includes 45 minutes of free buffer time from the moment the aircraft touches down.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">NH16 Tolls & Parking Included</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Zero surprises at highway toll plazas or terminal parking gates. All government taxes, highway cess, and airport entry slips are transparently accounted for.
            </p>
          </div>
        </div>

        {/* Airport Route Cards with Photography */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Navigation className="w-3.5 h-3.5" />
                <span>Express Airport Corridors</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular Airport Routes & Fixed Tariffs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero surge pricing 24/7. Choose your route and book instantly with verified chauffeurs.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer self-start md:self-auto"
            >
              Custom Route Booking
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airportRoutes.map((route, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img 
                      src={route.image} 
                      alt={route.to} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 font-bold text-[10px] border border-teal-400/30">
                      {route.tag}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] text-teal-300 font-semibold">{route.from}</div>
                      <div className="text-base font-extrabold leading-tight">{route.to}</div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 font-medium">
                      <span>Distance: <strong className="text-slate-800">{route.distance}</strong></span>
                      <span>Est. Time: <strong className="text-slate-800">{route.estTime}</strong></span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Sedan (Dzire)</span>
                        <span className="text-xs font-bold text-teal-800">Quote on Request</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">SUV / Ertiga</span>
                        <span className="text-xs font-bold text-teal-800">Quote on Request</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-teal-950/20 cursor-pointer transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>⚡ Book This Airport Cab</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Airport Fleet Preview */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/40">
              Airport Ready Fleet
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2">Spacious Boots for Heavy Flight Baggage</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              All vehicles equipped with roof carriers, large trunk capacity, and child safety seating on request.
            </p>
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
                    <span className="flex items-center gap-1"><Luggage className="w-3.5 h-3.5" /> {veh.luggageCount} Suitcases</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{veh.popularFor}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300">Fare on Request</span>
                  <button
                    onClick={onOpenBooking}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                  >
                    Select Cab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Airport Pickup Procedure */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">How Airport Pickup Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-sm">01</div>
              <h4 className="font-bold text-sm text-slate-900">Book in 10 Seconds</h4>
              <p className="text-xs text-slate-500 font-medium">Enter your flight number, date, and drop location. Instant confirmation via WhatsApp & SMS.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-sm">02</div>
              <h4 className="font-bold text-sm text-slate-900">Live Radar Tracking</h4>
              <p className="text-xs text-slate-500 font-medium">Receive driver name, contact, vehicle number, and live GPS tracking link 2 hours before landing.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-sm">03</div>
              <h4 className="font-bold text-sm text-slate-900">Placard Meet & Greet</h4>
              <p className="text-xs text-slate-500 font-medium">Your driver will be waiting at the designated arrival gate / pickup bay holding your name placard.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-sm">04</div>
              <h4 className="font-bold text-sm text-slate-900">Relaxed AC Journey</h4>
              <p className="text-xs text-slate-500 font-medium">Enjoy a relaxed, chilled air-conditioned ride to your home, resort, or office with zero surge pricing.</p>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
};
