import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Car, 
  ShieldCheck, 
  BadgePercent, 
  Coins,
  Zap,
  Clock,
  Check,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';
import { trackBookingStart } from '../services/analyticsService';

interface OneWayTripsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const OneWayTripsPage: React.FC<OneWayTripsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const oneWayFaqs = [
    {
      question: 'What is a one-way cab service from Visakhapatnam?',
      answer: 'A one-way cab allows you to travel from Visakhapatnam to any destination (such as Rajahmundry, Kakinada, Vijayawada, or Srikakulam) and pay only for the distance traveled in that single direction. You do not pay for the driver’s return journey.'
    },
    {
      question: 'Are there hidden toll or driver charges on one-way trips?',
      answer: 'No. All one-way fare quotes are transparent and clearly state toll inclusions and driver batta so you never experience unexpected costs.'
    },
    {
      question: 'How soon can I get a one-way cab dispatched in Vizag?',
      answer: 'We recommend booking 2 to 3 hours ahead for guaranteed preferred vehicle allocation, though urgent bookings can often be dispatched within 30 to 45 minutes.'
    }
  ];
  const oneWayRoutes = [
    { 
      from: 'Visakhapatnam', 
      to: 'Rajahmundry', 
      distance: '190 KM', 
      time: '3.5 hrs', 
      saves: 'Best Value',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: 'Doorstep pickup in Vizag, direct drop to Rajahmundry railway station, airport, or hotel.'
    },
    { 
      from: 'Visakhapatnam', 
      to: 'Kakinada Port', 
      distance: '155 KM', 
      time: '3.0 hrs', 
      saves: 'Popular Drop',
      img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
      description: 'Direct commute to Kakinada smart city, port terminals, and fertilizers industrial hub.'
    },
    { 
      from: 'Visakhapatnam', 
      to: 'Vijayawada', 
      distance: '350 KM', 
      time: '6.5 hrs', 
      saves: 'Highway Express',
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      description: 'Capital city transit without paying return taxi charges. FASTag toll equipped.'
    },
    { 
      from: 'Visakhapatnam', 
      to: 'Srikakulam', 
      distance: '110 KM', 
      time: '2.0 hrs', 
      saves: 'Quick Transit',
      img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      description: 'Swift transit to Srikakulam town, Arasavalli Sun temple, and industrial areas.'
    },
    { 
      from: 'Visakhapatnam', 
      to: 'Vizianagaram', 
      distance: '60 KM', 
      time: '1.2 hrs', 
      saves: 'Daily Shuttle',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      description: 'Affordable one-way intercity cab for college students, hospital visits, and business.'
    },
    { 
      from: 'Visakhapatnam', 
      to: 'Berhampur (Odisha)', 
      distance: '260 KM', 
      time: '5.0 hrs', 
      saves: 'Interstate Direct',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: 'Cross-state border drop with all permit papers handled in advance by chauffeur.'
    },
  ];

  return (
    <>
      <SEOHead
        title="One-Way Outstation Cabs from Visakhapatnam | Zero Return Fare | Waltair Cabs"
        description="Book one-way cabs from Visakhapatnam to Rajahmundry, Kakinada, Vijayawada, Srikakulam, and Vizianagaram. Pay only for the distance traveled with zero return kilometer charges."
        canonicalPath="/one-way-trips"
        keywords={[
          'one way cab vizag',
          'one way outstation cab visakhapatnam',
          'vizag to rajahmundry one way cab',
          'vizag to kakinada one way taxi',
          'vizag to vijayawada one way cab'
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'One-Way Trips', item: '/one-way-trips' }
        ]}
        faqs={oneWayFaqs}
      />
      <PageLayout
        title="One-Way Intercity Cab Drops"
        subtitle="Why pay double when you're only travelling one way? Save up to 50% with our guaranteed single-sided outstation fares from Visakhapatnam."
        categoryBadge="One-Way Economy"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'One-Way Trips' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={() => {
          trackBookingStart('outstation', 'oneway_hero');
          onOpenBooking();
        }}
        ctaText="Book One-Way Cab"
        heroImage="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
      >
      <div className="space-y-16">

        {/* The One-Way Advantage Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              <BadgePercent className="w-4 h-4" />
              <span>Smart Highway Commute</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Pay Only for the Kilometers You Actually Ride
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Traditional offline operators and taxi stands charge round-trip fare even when you are relocating or staying at your destination. With Waltair Cabs One-Way Drops, you pay strictly for the single journey.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="text-2xl font-black text-emerald-700">Up to 50%</div>
                <div className="text-xs text-slate-500 font-medium">Direct Savings on Fare</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="text-2xl font-black text-teal-700">0 Hidden</div>
                <div className="text-xs text-slate-500 font-medium">No Return Km Charges</div>
              </div>
            </div>
          </div>

          {/* Comparison Card */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Traditional Cabs vs Waltair One-Way</h3>
              
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-700">
                    <X className="w-4 h-4" />
                    <span>Traditional Offline / App Taxis:</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6">
                    Bill double distance (return km) + charge overnight driver allowances even if you leave the car at destination.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Check className="w-4 h-4" />
                    <span>Waltair Cabs Guaranteed One-Way:</span>
                  </div>
                  <p className="text-xs text-slate-700 pl-6">
                    Fixed flat rate based only on one-way distance. Doorstep pickup in Vizag, direct drop to exact address, tolls & driver included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photographic Route Cards Grid */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <span>Featured Highway Drops</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Popular One-Way Fares & Destinations</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Available 24 hours daily with instant dispatch confirmation.</p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0 cursor-pointer"
            >
              Book Custom One-Way →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {oneWayRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={route.img}
                      alt={`${route.from} to ${route.to}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      {route.saves}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-900">
                      {route.distance} • ~{route.time}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">One-Way Route</div>
                      <h3 className="text-lg font-black text-slate-900 mt-0.5">
                        {route.from} <span className="text-teal-700">→</span> {route.to}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {route.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-600 font-medium">Sedan (Dzire / Aura)</span>
                        <strong className="text-xs font-bold text-teal-800">Quote on Request</strong>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-600 font-medium">SUV (Ertiga / Carens)</span>
                        <strong className="text-xs font-bold text-teal-800">Quote on Request</strong>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-600 font-medium">Innova Crysta</span>
                        <strong className="text-xs font-bold text-teal-800">Quote on Request</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Book One-Way Drop</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fares Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Fare Summary & Route Schedule</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fixed tariffs with zero surge multipliers. All rides include door-to-door transit.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">From</th>
                  <th className="py-3.5 px-4">To Destination</th>
                  <th className="py-3.5 px-4">Distance & Time</th>
                  <th className="py-3.5 px-4">Sedan One-Way</th>
                  <th className="py-3.5 px-4">SUV One-Way</th>
                  <th className="py-3.5 px-4 text-right">Quick Book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {oneWayRoutes.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-500">{r.from}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.to}</td>
                    <td className="py-3.5 px-4 text-slate-500">{r.distance} (~{r.time})</td>
                    <td className="py-3.5 px-4 font-bold text-teal-800">Quote on Request</td>
                    <td className="py-3.5 px-4 font-bold text-teal-800">Quote on Request</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={onOpenBooking}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">One-Way Travel Guidance</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-200/80 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            {oneWayFaqs.map((faq, i) => (
              <div key={i} className="p-5 sm:p-6 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-teal-600 font-black">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
    </>
  );
};
