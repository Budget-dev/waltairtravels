import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Car, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Luggage, 
  Users, 
  Mountain,
  Coffee,
  Sun,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { VEHICLES } from '../data/mockData';
import { trackBookingStart, trackPhoneClick, trackWhatsAppClick } from '../services/analyticsService';

interface VizagToArakuPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const VizagToArakuPage: React.FC<VizagToArakuPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const verifiedStops = [
    {
      title: 'Tyda Nature Camp & Jungle Bells',
      kmFromVizag: '75 KM',
      description: 'Ideal morning breakfast stop nestled in the Eastern Ghats. Famous for wooden eco-cottages and bird watching.',
      tag: 'Morning Stop'
    },
    {
      title: 'Million-Year-Old Borra Caves',
      kmFromVizag: '90 KM',
      description: 'One of India\'s largest caves featuring breathtaking karstic limestone stalactites and stalagmites formed over centuries by the Gosthani River.',
      tag: 'Must-Visit Landmark'
    },
    {
      title: 'Ananthagiri Coffee Plantations & Viewpoint',
      kmFromVizag: '98 KM',
      description: 'Lush green organic coffee estates and sweeping valley overlooks as the ghat road climbs into higher elevations.',
      tag: 'Scenic Overlook'
    },
    {
      title: 'Galikonda Viewpoint (Highest Peak)',
      kmFromVizag: '105 KM',
      description: 'The highest elevation point in the Visakhapatnam region (over 5,000 ft above sea level) offering a 360-degree panoramic vista.',
      tag: 'Photo Stop'
    },
    {
      title: 'Katiki Waterfalls (Off-Road Detour)',
      kmFromVizag: '93 KM (detour)',
      description: 'A 50-foot cascading natural waterfall accessed via a scenic rugged track near Borra Caves.',
      tag: 'Adventure Detour'
    },
    {
      title: 'Araku Town, Tribal Museum & Coffee House',
      kmFromVizag: '115 KM',
      description: 'Center of Araku Valley known for the Araku Tribal Heritage Museum, Padmapuram Botanical Gardens, and world-famous GI-tagged Araku Arabica coffee.',
      tag: 'Valley Destination'
    }
  ];

  const arakuFaqs = [
    {
      question: 'What is the distance and travel time from Visakhapatnam to Araku Valley by cab?',
      answer: 'The road distance from Visakhapatnam city center to Araku Valley is approximately 114 to 115 kilometers via the S-Kota and Ananthagiri ghat road. Typical travel time is 3.5 to 4 hours, depending on traffic and stops at Borra Caves or Tyda.'
    },
    {
      question: 'Can I book a one-way cab to Araku Valley or do I have to pay for a round trip?',
      answer: 'Waltair Cabs offers both one-way drop cabs to Araku hotels/resorts and same-day round-trip sightseeing packages. For verified one-way drops, you only pay for the one-way route without hidden return kilometer charges.'
    },
    {
      question: 'Are your drivers experienced on the Araku hairpin ghat road?',
      answer: 'Yes. All our chauffeurs assigned to Araku routes are seasoned commercial drivers with extensive experience handling the 30+ hairpin bends, foggy weather, and mountain terrain safely.'
    },
    {
      question: 'Which vehicle is recommended for a family trip to Araku?',
      answer: 'For 1 to 4 travelers, our Maruti Suzuki Dzire or Hyundai Aura sedans offer smooth, fuel-efficient comfort. For families with children or seniors (5 to 7 passengers), we recommend our 6-seater Maruti Ertiga or luxury Toyota Innova Crysta for high ground clearance and generous luggage capacity.'
    },
    {
      question: 'What is the best time to start the trip from Vizag to Araku?',
      answer: 'We recommend starting early morning between 5:30 AM and 6:30 AM. This lets you enjoy the crisp morning mist on the ghat road, stop for hot breakfast at Tyda, and reach Borra Caves before tourist queues peak.'
    }
  ];

  return (
    <>
      <SEOHead
        title="Vizag to Araku Cab Booking | Safe Ghat Road Drivers & Fares"
        description="Book verified cabs from Visakhapatnam to Araku Valley and Borra Caves. Experienced hill chauffeurs, scenic stops at Tyda and Katiki, one-way drops, and same-day sightseeing."
        canonicalPath="/vizag-to-araku-cab"
        keywords={[
          'vizag to araku cab',
          'araku cab from vizag',
          'vizag to araku cab fare',
          'borra caves cab',
          'vizag to araku taxi package',
          'visakhapatnam to araku valley car rental with driver',
          'innova for araku trip vizag'
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Outstation Cabs', item: '/outstation-cabs-vizag' },
          { name: 'Vizag to Araku Cab', item: '/vizag-to-araku-cab' }
        ]}
        faqs={arakuFaqs}
      />

      <PageLayout
        title="Vizag to Araku Valley Cab Service & Sightseeing"
        subtitle="115 KM scenic journey through the Eastern Ghats with verified hill chauffeurs, stops at Borra Caves & Tyda, and transparent pricing."
        categoryBadge="Pillar Outstation Route"
        breadcrumbs={[
          { label: 'Outstation Cabs', onClick: () => onNavigatePage('outstation-cabs') },
          { label: 'Vizag to Araku Cab' }
        ]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={() => {
          trackBookingStart('outstation', 'araku_route_hero');
          onOpenBooking();
        }}
        ctaText="Book Araku Cab Now"
        heroImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="space-y-16">
          
          {/* Quick Route Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Distance</p>
                <p className="text-base font-bold text-slate-900">115 KM (One-Way)</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Travel Time</p>
                <p className="text-base font-bold text-slate-900">3.5 – 4 Hours</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Terrain</p>
                <p className="text-base font-bold text-slate-900">Ghats & Hairpins</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Chauffeur</p>
                <p className="text-base font-bold text-slate-900">Hill-Trained Driver</p>
              </div>
            </div>
          </div>

          {/* Section 1: Route Overview & Who Should Book */}
          <section className="space-y-6">
            <div className="max-w-3xl">
              <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Scenic Mountain Corridor</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Why Travelers Choose a Private Cab for Araku Valley
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2">
                Traveling from Visakhapatnam to Araku Valley takes you along one of Andhra Pradesh's most picturesque routes. While tourist trains operate on fixed schedules with limited seat availability, a chauffeured private cab gives you total freedom to stop at roadside coffee stalls, explore Borra Caves at your own pace, and enjoy panoramic viewpoints without rushing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">1</div>
                <h3 className="text-base font-bold text-slate-900">Doorstep Pickup in Vizag</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Direct pickup from any hotel, home, or Visakhapatnam Airport (VTZ) terminal with assistance for heavy luggage.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">2</div>
                <h3 className="text-base font-bold text-slate-900">Scenic Flexibility</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Break for breakfast at Tyda, click photos at Galikonda, and visit the coffee museum without transport transfers.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">3</div>
                <h3 className="text-base font-bold text-slate-900">Safety & Vehicle Reliability</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Commercial yellow-plate vehicles with regular brake and tire inspections suited for mountain elevation changes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Major Verified Stops Along the Ghat Route */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Itinerary Highlights</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Verified Sightseeing Stops Along the Route
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">All stops covered in full-day packages</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verifiedStops.map((stop, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 transition-colors shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                      {stop.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{stop.kmFromVizag}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{stop.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{stop.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Recommended Vehicles for Araku Mountain Roads */}
          <section className="space-y-6">
            <div>
              <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Vehicle Options</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Choose the Ideal Cab for the Araku Ghat Road
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VEHICLES.filter(v => ['dzire', 'ertiga', 'crysta'].includes(v.id)).map((v) => (
                <div key={v.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="h-36 rounded-2xl overflow-hidden bg-slate-100">
                      <img 
                        src={v.image} 
                        alt={`${v.name} for Vizag to Araku cab service`} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{v.name}</h3>
                      <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">{v.category}</span>
                    </div>
                    <p className="text-xs text-slate-500">{v.popularFor}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-teal-600" /> {v.seats} Seats</span>
                      <span className="flex items-center gap-1"><Luggage className="w-3.5 h-3.5 text-teal-600" /> {v.luggageCount} Bags</span>
                      <span className="text-emerald-700 font-semibold">Chilled AC</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Tariff Basis</p>
                      <p className="text-xs font-bold text-slate-800">₹{v.ratePerKm}/km or package</p>
                    </div>
                    <button
                      onClick={() => {
                        trackBookingStart('outstation', `araku_vehicle_${v.id}`);
                        onOpenBooking();
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Book {v.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: FAQs */}
          <section className="space-y-6">
            <div>
              <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Help & Travel Advice</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Frequently Asked Questions: Vizag to Araku Cabs
              </h2>
            </div>

            <div className="divide-y divide-slate-200/80 rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
              {arakuFaqs.map((faq, i) => (
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
          </section>

          {/* Section 5: Direct Dispatch & Booking Action */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-2xl font-extrabold">Ready for Your Araku Valley Journey?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Book in advance or call our 24/7 Visakhapatnam dispatch desk for instant chauffeur assignment and guaranteed fixed tariffs.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  trackBookingStart('outstation', 'araku_footer_cta');
                  onOpenBooking();
                }}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm transition-all shadow-md cursor-pointer"
              >
                Book Araku Cab Online
              </button>
              <a
                href="tel:+919110510236"
                onClick={() => trackPhoneClick('araku_cta')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-300" />
                <span>+91 91105 10236</span>
              </a>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
