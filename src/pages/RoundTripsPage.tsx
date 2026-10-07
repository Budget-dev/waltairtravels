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
  Luggage,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';
import { trackBookingStart } from '../services/analyticsService';

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
  const roundTripFaqs = [
    {
      question: 'How do multi-day round-trip cab rentals work from Visakhapatnam?',
      answer: 'When you book a round-trip outstation cab, the vehicle and assigned commercial chauffeur stay with you throughout the duration of your trip. There is no need to switch cabs or drivers at intermediate destinations.'
    },
    {
      question: 'What are the popular round-trip circuits from Vizag?',
      answer: 'Top round-trip circuits include the 2-Day Araku Valley & Borra Caves circuit, 1-Day Annavaram & Pithapuram pilgrimage, 1-Day Srikakulam Arasavalli temple tour, and coastal Bheemili beach drives.'
    },
    {
      question: 'Are night driver halt charges included for multi-day trips?',
      answer: 'Night driver allowances (batta) for trips extending past 10:00 PM or multi-day stays are transparently quoted upfront so you know the full cost before booking.'
    }
  ];
  const roundTripCircuits = [
    {
      id: 'araku-circuit',
      title: 'Araku Valley & Borra Caves Circuit',
      badge: '2 Days / 1 Night',
      km: '~380 KM Round',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      description: 'Visakhapatnam → Padmapuram Gardens → Coffee Museum → Chaparai Waterfalls → Borra Caves → Return.',
      highlights: ['Chauffeur stays with you overnight', 'Unlimited stops at ghat viewpoints', 'Hairpin curve veteran drivers']
    },
    {
      id: 'annavaram-circuit',
      title: 'Annavaram Satyanarayana Swamy Darshan',
      badge: '1 Day Return',
      km: '~260 KM Round',
      img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      description: 'Visakhapatnam → Annavaram Temple Hill → Tuni Cashew Market → Payakaraopeta → Return.',
      highlights: ['Hilltop temple parking included', 'Pooja prasad waiting time included', 'Fast return drop by evening']
    },
    {
      id: 'lambasingi-circuit',
      title: 'Lambasingi & Kothapalli Waterfalls',
      badge: '2 Days / 1 Night',
      km: '~360 KM Round',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
      description: 'Visakhapatnam → Narsipatnam → Lambasingi Apple Farms → Kothapalli Waterfalls → Return.',
      highlights: ['Early morning winter mist sunrise', 'Strawberry & apple farm stops', 'Bonfire and resort transfers']
    },
    {
      id: 'godavari-circuit',
      title: 'Godavari Delta & Papikondalu Hub (Rajahmundry)',
      badge: '3 Days / 2 Nights',
      km: '~600 KM Round',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: 'Visakhapatnam → Kakinada Beach → Rajahmundry Godavari Ghats → Draksharamam → Return.',
      highlights: ['Godavari boat launch coordination', 'Draksharamam Pancharama temple visit', 'Complete family leisure tour']
    },
    {
      id: 'srikakulam-circuit',
      title: 'Arasavalli & Srimukhalingam Temple Circuit',
      badge: '1 Day Return',
      km: '~280 KM Round',
      img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
      description: 'Visakhapatnam → Arasavalli Sun Temple → Srikakulam Town → Srimukhalingam Shivalayam → Return.',
      highlights: ['Spiritual heritage circuit', 'Temple darshan waiting time covered', 'Family dining halt at clean dhabas']
    },
    {
      id: 'coastal-circuit',
      title: 'Bheemili Beach & Mangamaripeta Heritage Trail',
      badge: 'Half Day / Full Day',
      km: '~140 KM Round',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: 'Visakhapatnam → Rushikonda → Thotlakonda Buddhist Complex → Bheemili Dutch Cemetery → Return.',
      highlights: ['Scenic coastal expressway drive', 'Historical Buddhist monastery ruins', 'Sunset seafood shacks']
    }
  ];

  return (
    <>
      <SEOHead
        title="Round-Trip Outstation Cabs from Visakhapatnam | Waltair Cabs"
        description="Book round-trip cabs from Visakhapatnam for Araku Valley, Annavaram, and coastal circuits. Same verified chauffeur and dedicated vehicle throughout your entire family vacation."
        canonicalPath="/round-trips"
        keywords={[
          'round trip cabs vizag',
          'outstation round trip visakhapatnam',
          'araku 2 day round trip cab',
          'vizag car rental for round trip'
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Round Trips', item: '/round-trips' }
        ]}
        faqs={roundTripFaqs}
      />
      <PageLayout
        title="Round-Trip Outstation Cabs"
        subtitle="Enjoy seamless multi-day or same-day return trips with the same dedicated vehicle and chauffeur throughout your entire journey. Explore Andhra Pradesh at your own leisure."
        categoryBadge="Family & Multi-Day Tours"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Round Trips' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={() => {
          trackBookingStart('outstation', 'roundtrip_hero');
          onOpenBooking();
        }}
        ctaText="Book Round Trip"
        heroImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
      >
      <div className="space-y-16">

        {/* Key Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Same Vehicle & Chauffeur Throughout</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No shifting luggage or re-booking midway. The same trusted, veteran driver stays with your family across every destination.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Spontaneous En-Route Stops</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pull over whenever you like for roadside hot tea, scenic viewpoint photography, or temple visits without rigid per-stop penalties.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Transparent 250 KM/Day Slabs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard daily allowance with clear per-km billing for extra distances. Zero hidden driver food or phantom fuel charges.
            </p>
          </div>
        </div>

        {/* Circuits Showcase Grid with Photography */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <span>Curated Holiday Itineraries</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Popular Round-Trip Circuits from Visakhapatnam
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fixed round-trip packages with all highway toll estimates, driver allowances, and fuel covered.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0 cursor-pointer"
            >
              Custom Circuit Planner →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roundTripCircuits.map((circuit) => (
              <motion.div
                key={circuit.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={circuit.img}
                      alt={circuit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-teal-800 text-[10px] font-bold text-white uppercase tracking-wider">
                      {circuit.badge}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-900">
                      {circuit.km}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                        {circuit.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {circuit.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {circuit.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Sedan (Dzire / Aura)</span>
                        <strong className="text-teal-800 font-bold">Quote on Request</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">SUV (Ertiga / Carens)</span>
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
                    <span>Book Round Trip Circuit</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">Planning a Multi-Day Custom Family Vacation?</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              Our travel specialists will design custom itineraries with hotel recommendations and verified chauffeurs.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-teal-50 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg cursor-pointer"
          >
            Plan Vacation with Us
          </button>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Round-Trip Travel Advice</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-200/80 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            {roundTripFaqs.map((faq, i) => (
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
