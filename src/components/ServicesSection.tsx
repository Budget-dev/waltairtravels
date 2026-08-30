import React from 'react';
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
      desc: 'Reliable airport pickups & drops',
      btn: 'Book Taxi',
      icon: Luggage,
      bg: 'bg-cyan-50',
      text: 'text-cyan-800'
    },
    {
      id: 'outstation',
      subType: 'oneway' as TripSubType,
      title: 'Outstation Cabs',
      desc: 'Comfortable travel outside the city',
      btn: 'Explore Cabs',
      icon: Mountain,
      bg: 'bg-teal-50',
      text: 'text-teal-800'
    },
    {
      id: 'local',
      subType: 'local_8hr' as TripSubType,
      title: 'Local Rentals',
      desc: 'Hourly & full-day city travel',
      btn: 'Rent by Hour',
      icon: PhoneCall,
      bg: 'bg-emerald-50',
      text: 'text-emerald-800'
    },
    {
      id: 'oneway',
      subType: 'oneway' as TripSubType,
      category: 'outstation' as ServiceCategory,
      title: 'One-Way Trips',
      desc: 'Convenient point-to-point travel',
      btn: 'Pay One-Way',
      icon: Send,
      bg: 'bg-sky-50',
      text: 'text-sky-800'
    },
    {
      id: 'roundtrip',
      subType: 'roundtrip' as TripSubType,
      category: 'outstation' as ServiceCategory,
      title: 'Round Trips',
      desc: 'Return journeys made easy',
      btn: 'Book Return',
      icon: Repeat,
      bg: 'bg-indigo-50',
      text: 'text-indigo-800'
    },
    {
      id: 'packages',
      subType: 'package' as TripSubType,
      category: 'packages' as ServiceCategory,
      title: 'Travel Packages',
      desc: 'Custom packages for your journey',
      btn: 'View Tours',
      icon: Briefcase,
      bg: 'bg-teal-50',
      text: 'text-teal-800'
    },
  ];

  return (
    <section id="services" className="py-12 md:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Tailored mobility solutions for daily commutes, airport transfers, corporate travel, and scenic holidays.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 mb-12">
          {serviceCards.map((card) => {
            const IconComponent = card.icon;
            const category = card.category || (card.id as ServiceCategory);
            return (
              <div 
                key={card.id}
                id={`service-card-${card.id}`}
                onClick={() => onSelectService(category, card.subType)}
                className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-cyan-600 hover:-translate-y-1 active:scale-98 transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.text} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-700 group-hover:text-white transition-all`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {card.desc}
                </p>
                <span className="mt-auto text-[11px] font-bold text-cyan-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {card.btn} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Bar (Exact 5 items from screenshot) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Item 1: Transparent Pricing */}
            <div className="flex items-start gap-3.5 pt-3 sm:pt-0 lg:px-3">
              <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-800 shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Transparent Pricing</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  No hidden charges, what you see is what you pay.
                </p>
              </div>
            </div>

            {/* Item 2: Safe & Secure */}
            <div className="flex items-start gap-3.5 pt-3 sm:pt-0 lg:px-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Safe & Secure</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified drivers, sanitized cars, your safety is our priority.
                </p>
              </div>
            </div>

            {/* Item 3: Instant Booking */}
            <div className="flex items-start gap-3.5 pt-3 sm:pt-0 lg:px-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Instant Booking</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quick booking with instant confirmation.
                </p>
              </div>
            </div>

            {/* Item 4: Live Tracking */}
            <div className="flex items-start gap-3.5 pt-3 sm:pt-0 lg:px-3">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-800 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Live Tracking</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your ride in real-time from pickup to drop.
                </p>
              </div>
            </div>

            {/* Item 5: 24x7 Customer Support */}
            <div className="flex items-start gap-3.5 pt-3 sm:pt-0 lg:px-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">24x7 Customer Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  We're here to help, anytime, anywhere.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
