import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Plane, 
  Compass, 
  Clock, 
  MapPin, 
  Shield, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall,
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';
import { ServiceCategory, TripSubType } from '../types';
import { VEHICLES } from '../data/mockData';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';

interface OurServicesPageProps {
  onNavigateHome: () => void;
  onSelectService: (service: ServiceCategory, subType?: TripSubType) => void;
  onNavigatePage: (page: string) => void;
}

export const OurServicesPage: React.FC<OurServicesPageProps> = ({
  onNavigateHome,
  onSelectService,
  onNavigatePage,
}) => {
  const servicesList = [
    {
      id: 'airport-taxi',
      title: 'Airport Taxi Transfers',
      badge: 'Bhogapuram & VTZ Airport Specialist',
      startingPrice: 'Quote on Request',
      icon: Plane,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      description: 'Punctual door-to-door pickups and drop-offs to Bhogapuram ASI International Airport and Visakhapatnam Airport. Includes real-time flight tracking and complimentary 45-minute terminal waiting.',
      features: [
        'Dedicated Bhogapuram expressway corridor dispatch',
        'Real-time flight arrival & delay monitoring',
        'Meet & Greet arrival terminal assistance with name placard',
        'Flat transparent tariffs with all NH16 highway tolls included',
      ],
      serviceKey: 'airport' as ServiceCategory,
      subType: 'pickup' as TripSubType,
      pageLink: 'airport-taxi',
    },
    {
      id: 'outstation-cabs',
      title: 'Outstation & Intercity Cabs',
      badge: 'One-Way & Round Trips',
      startingPrice: 'Quote on Request',
      icon: Compass,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      description: 'Travel effortlessly across Andhra Pradesh, Odisha, and Telangana. Choose from cost-effective one-way drops or multi-day round-trip family vacations with vetted veteran highway drivers.',
      features: [
        'Pay one-way fare only for single intercity drops',
        'Zero return km penalty on all verified one-way corridors',
        'Over 35 popular destinations (Araku, Vijayawada, Kakinada, Rajahmundry)',
        'Clean AC Sedans, Ertiga MUVs & Toyota Innova Crystas',
      ],
      serviceKey: 'outstation' as ServiceCategory,
      subType: 'oneway' as TripSubType,
      pageLink: 'outstation-cabs',
    },
    {
      id: 'local-rentals',
      title: 'Local Hourly Car Rentals',
      badge: 'Flexible 4Hr, 8Hr & 12Hr Packages',
      startingPrice: 'Quote on Request',
      icon: Clock,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: 'Hire an AC car with chauffeur for city errands, medical appointments, shopping at Jagadamba Center, or corporate client meetings. Keep the cab on standby with unlimited stops.',
      features: [
        '4 Hours / 40 KM package for short city errands & meetings',
        '8 Hours / 80 KM full-day city exploration & beach road cruise',
        '12 Hours / 120 KM comprehensive city & industrial coverage',
        'Transparent extra km & extra hour slabs with zero surge',
      ],
      serviceKey: 'local' as ServiceCategory,
      subType: 'local_8hr' as TripSubType,
      pageLink: 'local-rentals',
    },
    {
      id: 'packages',
      title: 'Curated Sightseeing Packages',
      badge: 'Araku, Lambasingi & Temple Tours',
      startingPrice: 'Quote on Request',
      icon: MapPin,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      description: 'Experience Andhra’s top tourist destinations with expert local drivers. Includes Araku Valley coffee plantations, Borra Caves, Lambasingi misty hill stations, and Annavaram Temple darshan.',
      features: [
        'Complete sightseeing itinerary coverage with flexible photo stops',
        'Hill-experienced verified mountain drivers skilled in ghat roads',
        'Doorstep hotel or home pickup & drop across Visakhapatnam',
        'Customized stops for authentic bamboo chicken & Araku tribal coffee',
      ],
      serviceKey: 'packages' as ServiceCategory,
      subType: 'package' as TripSubType,
      pageLink: 'packages',
    },
  ];

  return (
    <PageLayout
      title="Our Cab & Chauffeur Services"
      subtitle="Comprehensive transportation solutions designed for business travelers, families, tourists, and daily commuters across Coastal Andhra Pradesh."
      categoryBadge="Full Service Suite"
      breadcrumbs={[{ label: 'Our Services' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={() => onSelectService('airport', 'pickup')}
      ctaText="Book Instant Cab"
      heroImage="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80"
    >
      <SEOHead
        title="Cab & Taxi Services in Vizag | Airport, Outstation & Rentals | Waltair Cabs"
        description="Explore Waltair Cabs services in Visakhapatnam: Bhogapuram airport transfers, one-way outstation cabs, hourly city car rentals, and Araku sightseeing packages."
        canonicalUrl="/services"
        keywords={["vizag cab services", "taxi services in vizag", "car rental visakhapatnam", "airport cab service", "outstation taxi vizag"]}
      />
      <div className="space-y-16">
        
        {/* Services Grid with Visual Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Service Hero Image */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img 
                      src={srv.image} 
                      alt={srv.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-teal-300 font-bold text-xs border border-teal-400/30 shadow-md">
                        {srv.badge}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shadow-md">
                        {srv.startingPrice}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 backdrop-blur-md border border-teal-400/40 flex items-center justify-center text-teal-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">
                          {srv.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {srv.description}
                    </p>

                    <div className="pt-2 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Included Perks:</div>
                      <ul className="space-y-2">
                        {srv.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-2 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => onSelectService(srv.serviceKey, srv.subType)}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-950/20 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>⚡ Book This Service</span>
                  </button>
                  <button
                    onClick={() => onNavigatePage(srv.pageLink)}
                    className="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Rates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fleet Preview Section */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 mb-2">
                <Car className="w-3.5 h-3.5" />
                <span>Our Commercial Fleet</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">All Clean, Chilled AC & GPS-Enabled</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Choose the perfect ride for your passenger group size and luggage capacity.
              </p>
            </div>
            <button
              onClick={() => onSelectService('airport', 'pickup')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer self-start md:self-auto"
            >
              Book Any Cab
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VEHICLES.slice(0, 4).map((veh) => (
              <div key={veh.id} className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between group hover:border-teal-400/50 transition-all">
                <div>
                  <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-950">
                    <img src={veh.image} alt={veh.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{veh.name}</h4>
                  <div className="text-[11px] text-teal-300 mt-0.5">{veh.seats} Passengers • {veh.luggageCount} Bags</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{veh.popularFor}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300">Quote on Request</span>
                  <button
                    onClick={() => onSelectService('airport', 'pickup')}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-lg">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Fleet Variety & Reliability</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Maruti Dzire, Ertiga, Hyundai Aura, Kia Carens, Fronx, and Innova Crysta for any route.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">100% Commercial Permits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fully verified commercial yellow-plate cars with legal insurance and professional chauffeurs.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Instant Confirmation & Live Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get driver name, phone, vehicle plate, and live GPS arrival status via WhatsApp & SMS.
            </p>
          </div>
        </div>

      </div>
    </PageLayout>
  );
};
