import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  Users, 
  Car, 
  MapPin, 
  CheckCircle2, 
  HeartHandshake, 
  Star,
  Phone,
  Plane,
  Check,
  Shield,
  FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
}) => {
  const fleetShowcase = [
    {
      name: 'Maruti Suzuki Dzire / Hyundai Aura',
      category: 'Executive Sedan',
      seats: '4 Passengers + 1 Driver',
      luggage: '2 Large + 1 Small Bags',
      ac: 'Climate Control AC',
      ideal: 'Solo airport transfers, corporate city commutes & economical outstation drops.',
      img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
      badge: 'Most Booked Sedan'
    },
    {
      name: 'Maruti Suzuki Ertiga / Kia Carens',
      category: 'Smart Family SUV',
      seats: '6 Passengers + 1 Driver',
      luggage: '3 Large Bags',
      ac: 'Rear AC Vents with Speed Control',
      ideal: 'Small families, shopping sprees, weekend Lambasingi trips & group airport commutes.',
      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      badge: 'Family Favorite'
    },
    {
      name: 'Toyota Innova Crysta Luxury',
      category: 'Premium MPV',
      seats: '7 Passengers + 1 Driver',
      luggage: '5 Large Bags + Overhead Carrier',
      ac: 'Triple-Row Dual Zone AC',
      ideal: 'VIP delegates, wedding parties, Araku Ghat hairpin roads & long-distance interstate tours.',
      img: 'https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.01%20AM%20(3).jpeg',
      badge: 'Ultimate Highway Comfort'
    }
  ];

  const driverStandards = [
    {
      title: 'Police & Identity Verified',
      desc: 'All chauffeurs undergo biometric Aadhaar verification and local police background clearance.'
    },
    {
      title: 'Commercial Badge Licensed',
      desc: 'Only drivers holding valid commercial transport badges with extensive highway experience.'
    },
    {
      title: 'Ghat Road Specialists',
      desc: 'Trained specifically in defensive hairpin curve navigation on Araku, Lambasingi, and Ananthagiri passes.'
    },
    {
      title: 'Zero-Tolerance Policy',
      desc: 'Strict zero-alcohol, non-smoking policy enforced with random checks before dispatch.'
    }
  ];

  const regionalHubs = [
    {
      hub: 'Bhogapuram Airport ASI Corridor',
      coverage: 'Express highway taxi pickups & drops with real-time flight tracking.',
      status: 'Primary Hub'
    },
    {
      hub: 'Visakhapatnam Urban limits',
      coverage: 'Siripuram, MVP Colony, Gajuwaka, Madhurawada, Rushikonda IT SEZ.',
      status: 'Instant 15m Dispatch'
    },
    {
      hub: 'Eastern Ghats Tourist Circuit',
      coverage: 'Araku Valley, Borra Caves, Tyda, Lambasingi & Katiki Waterfalls.',
      status: 'Daily Departures'
    },
    {
      hub: 'Intercity Highway Corridors',
      coverage: 'Kakinada Port, Rajahmundry, Vijayawada, Srikakulam & Berhampur.',
      status: 'One-Way & Round Trip'
    }
  ];

  return (
    <>
      <SEOHead
        title="About Waltair Cabs | Visakhapatnam's Trusted Taxi Service"
        description="Learn about Waltair Cabs, Visakhapatnam's premier taxi company. Serving travelers with zero surge pricing, verified commercial drivers, and punctual 24/7 airport transfers."
        canonicalPath="/about-us"
        keywords={[
          'waltair cabs visakhapatnam',
          'about waltair cabs',
          'taxi company vizag',
          'visakhapatnam cab service provider',
          'reliable taxi vizag'
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'About Us', item: '/about-us' }
        ]}
      />
      <PageLayout
        title="About Waltair Cabs"
        subtitle="The trusted mobility partner of Visakhapatnam. Delivering punctual airport transfers, premium outstation travel, and transparent fares with verified local chauffeurs."
        categoryBadge="Our Story & Standards"
        breadcrumbs={[{ label: 'About Us' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book a Verified Ride"
      heroImage="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80"
    >
      <div className="space-y-16">
        
        {/* Story & Visual Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              <span>Pioneering Andhra's Coastal Mobility</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Reliable, Transparent, and Safe Cab Travel in the City of Destiny
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Founded in Visakhapatnam, <strong className="text-slate-900">Waltair Cabs</strong> was born out of frustration with predatory surge pricing, unexpected ride cancellations, and substandard vehicles.
              </p>
              <p>
                Today, as Visakhapatnam gears up with the world-class <strong className="text-teal-700">Alluri Sitharama Raju International Airport (ASI) in Bhogapuram</strong> and continues to grow as Andhra Pradesh’s economic capital, our fleet of 150+ commercially certified vehicles provides seamless connectivity 24 hours a day, 365 days a year.
              </p>
            </div>

            {/* Real Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-teal-700">250,000+</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Safe Trips Done</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">99.4%</div>
                <div className="text-xs text-slate-500 font-medium mt-1">On-Time Rate</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-amber-600">4.9 ★</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Google Rating</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                alt="Waltair Cabs Fleet and Professional Chauffeurs"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-teal-500/30 flex items-center gap-2.5 shadow-xl">
                <img 
                  src="/logo.png" 
                  alt="Waltair Cabs Official Mark" 
                  className="w-9 h-9 rounded-xl object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Waltair%20Cabs%20Coastal%20Travel%20Badge.png';
                  }}
                />
                <div>
                  <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">Official Mark</div>
                  <div className="text-xs font-extrabold text-white">Waltair Cabs</div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200">
                <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Commercial Fleet Certified</span>
                </div>
                <p className="text-xs text-slate-600">
                  Every cab carries Yellow-plate commercial fitness certificates, active GPS tracking, and comprehensive passenger insurance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Showcase with Photography */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Well-Maintained Fleet</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sanitized, air-conditioned, and serviced vehicles tailored for city comfort and highway safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fleetShowcase.map((veh, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={veh.img}
                      alt={veh.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-teal-800 text-white text-[11px] font-bold">
                      {veh.badge}
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                      {veh.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">{veh.name}</h3>
                    
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-700 shrink-0" />
                        <span>{veh.seats}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-teal-700 shrink-0" />
                        <span>{veh.luggage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{veh.ac}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                      {veh.ideal}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Select this Vehicle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4 Pillars of Waltair Trust */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Travelers Choose Waltair</h2>
            <p className="text-xs sm:text-sm text-slate-500">Built on integrity, transparent pricing, and veteran commercial chauffeurs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Verified Chauffeurs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Background-checked, uniform-clad, non-smoking professional drivers who respect your privacy and schedule.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Surge Pricing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rain, rush hour, or festival midnight — our fares remain fixed and upfront with no surge multipliers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">24/7 Airport Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We monitor incoming flights into Bhogapuram ASI & VTZ. If flight timings shift, cab arrival synchronizes automatically.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant Human Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Talk directly with our Visakhapatnam dispatch desk via phone or WhatsApp. No automated chatbot frustration.
              </p>
            </div>
          </div>
        </div>

        {/* Chauffeur Code & Safety Standards */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">Safety First Protocol</div>
              <h2 className="text-2xl font-bold text-slate-900">Our Chauffeur Verification Process</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 w-fit">
              100% Certified Drivers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {driverStandards.map((std, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{std.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Coverage Grid */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Andhra Pradesh Wide Network</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Serving Over 40+ Mandals and Districts</h2>
            <p className="text-xs sm:text-sm text-teal-100">
              From urban Visakhapatnam to remote Eastern Ghats hamlets and south coastal arterial highways.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalHubs.map((rh, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
                <div className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">{rh.status}</div>
                <h3 className="text-base font-bold text-white">{rh.hub}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{rh.coverage}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <span className="text-xs text-slate-300">Ready to travel with Visakhapatnam's highest-rated taxi service?</span>
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-teal-950/40 cursor-pointer"
            >
              Book Your Cab Now
            </button>
          </div>
        </div>

      </div>
    </PageLayout>
    </>
  );
};
