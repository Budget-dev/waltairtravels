import React from 'react';
import { motion } from 'motion/react';
import { 
  Luggage, 
  Mountain, 
  PhoneCall, 
  Send, 
  Repeat, 
  Briefcase, 
  IndianRupee, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Headphones,
  ArrowRight
} from 'lucide-react';
import { ServiceCategory, TripSubType } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ServiceCategory, subType?: TripSubType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const serviceCards = [
    {
      id: 'airport',
      subType: 'pickup' as TripSubType,
      title: 'Airport Taxi',
      badge: 'ASI Bhogapuram & VTZ',
      desc: 'Guaranteed flight-delay adjusted transfers',
      btn: 'Book Airport',
      icon: Luggage,
      color: 'teal'
    },
    {
      id: 'outstation',
      subType: 'oneway' as TripSubType,
      title: 'Outstation Cabs',
      badge: 'Intercity Trips',
      desc: 'Comfortable sedans & SUVs across AP',
      btn: 'Explore Routes',
      icon: Mountain,
      color: 'cyan'
    },
    {
      id: 'local',
      subType: 'local_8hr' as TripSubType,
      title: 'Hourly Rentals',
      badge: '4h / 8h / 12h Packages',
      desc: 'Flexible multi-stop city travel & shopping',
      btn: 'Rent by Hour',
      icon: PhoneCall,
      color: 'emerald'
    },
    {
      id: 'oneway',
      subType: 'oneway' as TripSubType,
      category: 'outstation' as ServiceCategory,
      title: 'One-Way Drops',
      badge: 'Zero Return Fare',
      desc: 'Pay only for one direction with no penalty',
      btn: 'Book One-Way',
      icon: Send,
      color: 'blue'
    },
    {
      id: 'roundtrip',
      subType: 'roundtrip' as TripSubType,
      category: 'outstation' as ServiceCategory,
      title: 'Round Trips',
      badge: 'Dedicated Driver',
      desc: 'Relaxing return trips with same chauffeur',
      btn: 'Book Roundtrip',
      icon: Repeat,
      color: 'indigo'
    },
    {
      id: 'packages',
      subType: 'package' as TripSubType,
      category: 'packages' as ServiceCategory,
      title: 'Tour Packages',
      badge: 'Araku & Lambasingi',
      desc: 'All-inclusive curated holiday itineraries',
      btn: 'View Tours',
      icon: Briefcase,
      color: 'teal'
    },
  ];

  const valueProps = [
    {
      title: 'Transparent Pricing',
      desc: 'Clear base fare & per-km charges with zero hidden toll surprises.',
      icon: IndianRupee,
    },
    {
      title: 'Verified Chauffeurs',
      desc: 'Commercial licensed, police verified & courteous drivers.',
      icon: ShieldCheck,
    },
    {
      title: 'Instant Confirmation',
      desc: 'Driver & cab details shared with live SMS & WhatsApp tracking.',
      icon: Zap,
    },
    {
      title: 'Live GPS Tracking',
      desc: 'Real-time vehicle telemetry for complete passenger safety.',
      icon: MapPin,
    },
    {
      title: '24/7 Operations Desk',
      desc: 'Always available human assistance for any trip modifications.',
      icon: Headphones,
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-3">
            <span>Tailored Mobility Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Transportation Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            From seamless airport terminal pickups to scenic ghat journeys across Araku Valley, select the ride that fits your travel schedule.
          </p>
        </div>

        {/* 6 Services Grid - 2 cols on mobile, 3 cols on tablet, 6 cols on desktop for perfect balance */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-12 sm:mb-14">
          {serviceCards.map((card, idx) => {
            const IconComponent = card.icon;
            const category = card.category || (card.id as ServiceCategory);
            return (
              <motion.div 
                key={card.id}
                id={`service-card-${card.id}`}
                onClick={() => onSelectService(category, card.subType)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-teal-400 hover:shadow-xl hover:shadow-teal-900/8 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                <div>
                  {/* Icon & Mini Badge */}
                  <div className="flex items-center justify-between gap-1 mb-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 text-teal-800 group-hover:bg-teal-800 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 group-hover:text-teal-800 transition-colors">
                    {card.title}
                  </h3>
                  
                  <div className="text-[10px] sm:text-[11px] font-semibold text-teal-700 bg-teal-50/80 px-2 py-0.5 rounded-md inline-block mb-2">
                    {card.badge}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-900">
                  <span>{card.btn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Value Proposition Bar - Clean Grid with Card Aesthetics */}
        <div className="bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 lg:p-7 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {valueProps.map((prop, i) => {
              const Icon = prop.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-2 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-teal-800 flex items-center justify-center shrink-0 shadow-2xs">
                    <Icon className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{prop.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{prop.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
