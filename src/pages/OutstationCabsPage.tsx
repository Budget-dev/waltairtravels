import React, { useState } from 'react';
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
  Zap,
  Users,
  Luggage,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState<'all' | 'oneway' | 'roundtrip'>('all');

  const popularRoutes = [
    {
      id: 'vizag-rajahmundry',
      from: 'Visakhapatnam',
      to: 'Rajahmundry',
      distance: '190 km',
      duration: '3.5 hrs',
      sedanPrice: 3499,
      suvPrice: 4799,
      crystaPrice: 5999,
      tag: 'Most Popular Highway Route',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      highlights: ['NH-16 Expressway corridor', 'Comfortable breakfast stops at Annavaram', 'Godavari river bridge entry']
    },
    {
      id: 'vizag-kakinada',
      from: 'Visakhapatnam',
      to: 'Kakinada Port & City',
      distance: '155 km',
      duration: '3.0 hrs',
      sedanPrice: 2999,
      suvPrice: 3999,
      crystaPrice: 4999,
      tag: 'Port & Industrial Hub',
      img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
      highlights: ['Direct industrial corridor access', 'Doorstep drop to Kakinada Deepwater Port', 'Smooth 4-lane drive']
    },
    {
      id: 'vizag-vijayawada',
      from: 'Visakhapatnam',
      to: 'Vijayawada Capital Corridor',
      distance: '350 km',
      duration: '6.5 hrs',
      sedanPrice: 6499,
      suvPrice: 8499,
      crystaPrice: 10499,
      tag: 'Long-Distance Express',
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      highlights: ['Toll-fast-tag equipped cabs', 'Experienced night/day drivers', 'Clean refreshment halt recommendations']
    },
    {
      id: 'vizag-srikakulam',
      from: 'Visakhapatnam',
      to: 'Srikakulam (Arasavalli)',
      distance: '110 km',
      duration: '2.0 hrs',
      sedanPrice: 2199,
      suvPrice: 3199,
      crystaPrice: 4199,
      tag: 'Pilgrimage & Heritage',
      img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      highlights: ['Ideal for Sun God Arasavalli temple darshan', 'Srimukhalingam temple circuit', 'Zero return surge']
    },
    {
      id: 'vizag-vizianagaram',
      from: 'Visakhapatnam',
      to: 'Vizianagaram Fort Town',
      distance: '60 km',
      duration: '1.2 hrs',
      sedanPrice: 1299,
      suvPrice: 1899,
      crystaPrice: 2499,
      tag: 'Quick Commute',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      highlights: ['Pydithalli Ammavari temple visit', 'Gajapathi Fort tour', 'Instant 20-min dispatch']
    },
    {
      id: 'vizag-berhampur',
      from: 'Visakhapatnam',
      to: 'Berhampur / Gopalpur (Odisha)',
      distance: '260 km',
      duration: '5.0 hrs',
      sedanPrice: 4999,
      suvPrice: 6799,
      crystaPrice: 8499,
      tag: 'Interstate Scenic Run',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      highlights: ['Gopalpur-on-sea beach destination', 'Full interstate commercial tax handling', 'Smooth coastal NH-16 highway']
    }
  ];

  return (
    <PageLayout
      title="Outstation Cabs & Intercity Travel"
      subtitle="Travel outside Visakhapatnam with absolute safety and comfort. Choose economical one-way drops or multi-day family round trips with verified highway chauffeurs."
      categoryBadge="Highway & Interstate"
      breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Outstation Cabs' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book Outstation Cab"
      heroImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
    >
      <div className="space-y-16">

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">One-Way Drop Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pay strictly for the distance you travel. No paying for driver return or empty kilometer markups.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Highway-Certified Fleet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All vehicles undergo pre-trip tyre, brake, and engine checks with full commercial permits and speed governors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">24x7 Roadside Assistance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time GPS tracking with a 24/7 central desk ready to provide immediate backup cab dispatch across Andhra Pradesh.
            </p>
          </div>
        </div>

        {/* Popular Intercity Routes Grid with Photography */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <span>Transparent Upfront Fares</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Popular Outstation Routes from Visakhapatnam
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero return surcharge on one-way trips. All fares include fuel, driver allowance, and GST receipt options.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0 cursor-pointer"
            >
              Custom Route Booking →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRoutes.map((route) => (
              <motion.div
                key={route.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={route.img}
                      alt={`${route.from} to ${route.to} cab`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-teal-800 text-[10px] font-bold text-white uppercase tracking-wider">
                      {route.tag}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-900">
                      {route.distance} • ~{route.duration}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">Highway Route</div>
                      <h3 className="text-lg font-black text-slate-900 mt-0.5">
                        {route.from} <span className="text-teal-700">→</span> {route.to}
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {route.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Dzire Sedan (One-Way)</span>
                        <strong className="text-teal-800 font-bold">Quote on Request</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Ertiga SUV (One-Way)</span>
                        <strong className="text-teal-800 font-bold">Quote on Request</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Innova Crysta</span>
                        <strong className="text-teal-800 font-bold">Quote on Request</strong>
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
                    <span>Book Route Now</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Highway Vehicles */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Recommended Highway Fleet</h2>
            <p className="text-xs sm:text-sm text-slate-500">Engineered for comfort and stability on national highways and ghat passes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80"
                alt="Dzire Sedan"
                className="w-full h-36 object-cover rounded-xl"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">4-Seater Economy</span>
                <h3 className="font-bold text-slate-900 text-base">Maruti Dzire / Hyundai Aura</h3>
                <p className="text-xs text-slate-500">Great mileage, smooth AC, fits up to 4 passengers with 2 large luggage bags.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80"
                alt="Ertiga SUV"
                className="w-full h-36 object-cover rounded-xl"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">6-Seater Family</span>
                <h3 className="font-bold text-slate-900 text-base">Maruti Ertiga / Kia Carens</h3>
                <p className="text-xs text-slate-500">Spacious legroom, rear AC blowers, fits 6 passengers comfortably with 3 bags.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <img
                src="https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.01%20AM%20(3).jpeg"
                alt="Innova Crysta"
                className="w-full h-36 object-cover rounded-xl"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">7-Seater Luxury</span>
                <h3 className="font-bold text-slate-900 text-base">Toyota Innova Crysta</h3>
                <p className="text-xs text-slate-500">Captain seats, unmatched highway stability, fits 7 passengers with 5 bags.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold">Travelling to a Different City or State?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              We provide all-India permit taxis for Tirupati, Hyderabad, Chennai, Bhubaneswar, and Kolkata routes.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg cursor-pointer"
          >
            Get Custom Interstate Quote
          </button>
        </div>

      </div>
    </PageLayout>
  );
};
