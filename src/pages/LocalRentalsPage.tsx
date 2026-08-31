import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  Clock, 
  MapPin, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LocalRentalsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const LocalRentalsPage: React.FC<LocalRentalsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Hourly Car Rental Visakhapatnam',
    'name': 'Local Hourly Car Rental & Chauffeur Drive',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels',
    },
    'description': 'Hire a cab on hourly basis in Visakhapatnam for 4 hrs / 40 km, 8 hrs / 80 km, or 12 hrs / 120 km. Unlimited stops and flexible waiting.',
  };

  const rentalPackages = [
    {
      hours: '4 Hours',
      km: '40 KM',
      badge: 'City Errands & Meetings',
      sedanPrice: '₹1,200',
      suvPrice: '₹1,750',
      innovaPrice: '₹2,200',
      idealFor: 'Doctor visits, business appointments in Siripuram, quick shopping at Jagadamba, or railway station transfers.',
    },
    {
      hours: '8 Hours',
      km: '80 KM',
      badge: 'Most Popular / Full Day',
      sedanPrice: '₹2,200',
      suvPrice: '₹2,950',
      innovaPrice: '₹3,600',
      idealFor: 'Complete city exploration, Rushikonda beach, Kailasagiri, Submarine Museum, Simhachalam temple darshan, and dining.',
    },
    {
      hours: '12 Hours',
      km: '120 KM',
      badge: 'Extended Day / Industrial SEZ',
      sedanPrice: '₹3,100',
      suvPrice: '₹3,950',
      innovaPrice: '₹4,800',
      idealFor: 'Pharma City Parawada, Atchutapuram SEZ corporate visits, wedding guest transport, or extensive multi-spot itineraries.',
    },
  ];

  return (
    <>
      
      <PageLayout
        title="Local Hourly Car Rentals"
        subtitle="Keep a dedicated car and chauffeur at your disposal. Flexible packages with unlimited stops across Visakhapatnam."
        categoryBadge="Hourly City Rental"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'Local Rentals' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Hourly Rental"
      >
        <div className="space-y-12">

          {/* Package Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {rentalPackages.map((pkg, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-md bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/50">
                      {pkg.badge}
                    </span>
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-white">{pkg.hours}</h3>
                    <div className="text-sm font-semibold text-emerald-400 mt-0.5">Includes {pkg.km} of driving</div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pkg.idealFor}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Starting Rates:</div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400">Prime Sedan (Etios / Dzire)</span>
                      <span className="font-bold text-white">{pkg.sedanPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400">Prime SUV (Ertiga 6-Seater)</span>
                      <span className="font-bold text-white">{pkg.suvPrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400">Innova Crysta Luxury</span>
                      <span className="font-bold text-white">{pkg.innovaPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>

          {/* Common Use Cases */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Why Choose Hourly Rental Over Point-to-Point Cabs?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Leave Belongings in Car</h3>
                <p className="text-xs text-slate-400">
                  Shop and attend meetings without carrying heavy shopping bags or luggage between stops.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Corporate Hospitality</h3>
                <p className="text-xs text-slate-400">
                  Impress VIP visiting delegates, executives, and clients with a dedicated air-conditioned chauffeur on standby.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Zero App Booking Stress</h3>
                <p className="text-xs text-slate-400">
                  No re-booking or waiting for drivers in peak traffic hours when moving from one locality to another.
                </p>
              </div>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
