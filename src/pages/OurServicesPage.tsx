import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { 
  Plane, 
  Compass, 
  Clock, 
  MapPin, 
  Shield, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { ServiceCategory, TripSubType } from '../types';

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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Taxi and Cab Rental Services',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels Visakhapatnam',
    },
    'areaServed': {
      '@type': 'City',
      'name': 'Visakhapatnam',
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Cab Rental Offerings',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Airport Taxi Transfers (VTZ & Bhogapuram ASI)',
          },
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Outstation Cabs & Intercity Trips',
          },
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Local Hourly Car Rentals (4hr, 8hr, 12hr)',
          },
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Holiday & Sightseeing Tour Packages (Araku, Lambasingi, Annavaram)',
          },
        },
      ],
    },
  };

  const servicesList = [
    {
      id: 'airport-taxi',
      title: 'Airport Taxi Transfers',
      badge: 'Bhogapuram & VTZ Airport Specialist',
      icon: Plane,
      color: 'from-cyan-500/20 to-cyan-900/40 text-cyan-400 border-cyan-700/50',
      description: 'Punctual door-to-door pickups and drop-offs to Bhogapuram ASI International Airport and Visakhapatnam Airport. Includes flight delay monitoring and complimentary 45-minute terminal waiting.',
      features: [
        'Dedicated Bhogapuram highway corridor dispatch',
        'Real-time flight arrival tracking',
        'Meet & Greet terminal assistance',
        'Transparent flat rates with all tolls included',
      ],
      serviceKey: 'airport' as ServiceCategory,
      subType: 'pickup' as TripSubType,
      pageLink: 'airport-taxi',
    },
    {
      id: 'outstation-cabs',
      title: 'Outstation & Intercity Cabs',
      badge: 'One-Way & Round Trips',
      icon: Compass,
      color: 'from-teal-500/20 to-teal-900/40 text-teal-400 border-teal-700/50',
      description: 'Travel effortlessly across Andhra Pradesh, Odisha, and Telangana. Choose from cost-effective one-way drops or multi-day round-trip family vacations with verified highway drivers.',
      features: [
        'Pay one-way fare only for single drops',
        'No return km billing on one-way routes',
        'Over 35 popular destinations covered',
        'Clean AC sedans, Ertigas & Innova Crystas',
      ],
      serviceKey: 'outstation' as ServiceCategory,
      subType: 'oneway' as TripSubType,
      pageLink: 'outstation-cabs',
    },
    {
      id: 'local-rentals',
      title: 'Local Hourly Car Rentals',
      badge: 'Flexible 4Hr, 8Hr & 12Hr Packages',
      icon: Clock,
      color: 'from-emerald-500/20 to-emerald-900/40 text-emerald-400 border-emerald-700/50',
      description: 'Hire a car with chauffeur for city errands, medical appointments, shopping at Jagadamba Center, or corporate client meetings. Keep the cab on standby with unlimited stops.',
      features: [
        '4 Hours / 40 KM package for short city errands',
        '8 Hours / 80 KM full-day exploration',
        '12 Hours / 120 KM comprehensive city coverage',
        'Transparent extra km & extra hour slabs',
      ],
      serviceKey: 'local' as ServiceCategory,
      subType: 'local_8hr' as TripSubType,
      pageLink: 'local-rentals',
    },
    {
      id: 'packages',
      title: 'Curated Sightseeing Packages',
      badge: 'Araku, Lambasingi & Temple Tours',
      icon: MapPin,
      color: 'from-amber-500/20 to-amber-900/40 text-amber-400 border-amber-700/50',
      description: 'Experience Andhra’s top tourist destinations with expert local drivers. Includes Araku Valley coffee plantations, Borra Caves, Lambasingi hill stations, and Annavaram Temple darshan.',
      features: [
        'Complete sightseeing itinerary coverage',
        'Hill-experienced verified mountain drivers',
        'Doorstep hotel or home pickup & drop',
        'Customized stops for tribal coffee & viewpoints',
      ],
      serviceKey: 'packages' as ServiceCategory,
      subType: 'package' as TripSubType,
      pageLink: 'packages',
    },
  ];

  return (
    <>
      <SEOHead
        title="Our Services - Airport, Outstation & Local Cabs in Visakhapatnam"
        description="Explore Waltair Travels complete suite of taxi services: Bhogapuram Airport transfers, one-way outstation cabs, hourly city rentals, and Araku holiday packages."
        keywords={[
          'Waltair Travels services',
          'Vizag taxi booking',
          'Bhogapuram cab service',
          'outstation taxi Andhra Pradesh',
          'hourly car rental Visakhapatnam',
        ]}
        canonicalPath="/services"
        structuredData={structuredData}
      />

      <PageLayout
        title="Our Cab & Chauffeur Services"
        subtitle="Comprehensive transportation solutions designed for business travelers, families, tourists, and daily commuters across Coastal Andhra Pradesh."
        categoryBadge="Full Service Suite"
        breadcrumbs={[{ label: 'Our Services' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={() => onSelectService('airport', 'pickup')}
        ctaText="Book Instant Cab"
      >
        <div className="space-y-12">
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesList.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition-all group shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${srv.color} flex items-center justify-center border shadow-md`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                        {srv.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {srv.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Benefits:</div>
                      <ul className="space-y-1.5">
                        {srv.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                    <button
                      onClick={() => onSelectService(srv.serviceKey, srv.subType)}
                      className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-md cursor-pointer"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => onNavigatePage(srv.pageLink)}
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Value Highlights */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center mx-auto">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Fleet Variety</h3>
              <p className="text-xs text-slate-400">Hatchbacks, Sedans, Ertiga 7-seaters, Innova Crysta, and 12-26 seaters Tempo Travellers.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Commercial Permits</h3>
              <p className="text-xs text-slate-400">100% yellow-plate commercial licensed vehicles with comprehensive passenger insurance.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center mx-auto">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Instant Confirmation</h3>
              <p className="text-xs text-slate-400">Get driver details and live vehicle tracking SMS / WhatsApp 2 hours prior to pickup.</p>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
