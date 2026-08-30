import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Car, 
  ShieldCheck, 
  BadgePercent, 
  Coins,
  Sparkles
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockData';

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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'One Way Outstation Taxi',
    'name': 'One-Way Drop Taxi Service Visakhapatnam',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels',
    },
    'description': 'Economical one-way drop taxi service from Visakhapatnam to Rajahmundry, Kakinada, Vijayawada, Srikakulam, and Bhubaneswar. Pay for one side only.',
  };

  const oneWayRoutes = [
    { from: 'Visakhapatnam', to: 'Rajahmundry', distance: '190 KM', time: '3.5 hrs', sedan: '₹3,499', suv: '₹4,799', saves: 'Save up to 40%' },
    { from: 'Visakhapatnam', to: 'Kakinada Port', distance: '155 KM', time: '3.0 hrs', sedan: '₹2,999', suv: '₹3,999', saves: 'Save up to 45%' },
    { from: 'Visakhapatnam', to: 'Vijayawada', distance: '350 KM', time: '6.5 hrs', sedan: '₹6,499', suv: '₹8,499', saves: 'Save up to 50%' },
    { from: 'Visakhapatnam', to: 'Srikakulam', distance: '110 KM', time: '2.0 hrs', sedan: '₹2,199', suv: '₹3,199', saves: 'Save up to 35%' },
    { from: 'Visakhapatnam', to: 'Vizianagaram', distance: '60 KM', time: '1.2 hrs', sedan: '₹1,299', suv: '₹1,899', saves: 'Save up to 30%' },
    { from: 'Visakhapatnam', to: 'Berhampur (Odisha)', distance: '260 KM', time: '5.0 hrs', sedan: '₹4,999', suv: '₹6,799', saves: 'Save up to 40%' },
  ];

  return (
    <>
      <SEOHead
        title="One-Way Taxi Drops from Visakhapatnam - Pay One Side Only"
        description="Book one-way outstation cabs from Visakhapatnam to Vijayawada, Rajahmundry, Kakinada, Srikakulam, and Hyderabad. Save up to 50% on return km charges."
        keywords={[
          'one way cab Vizag',
          'one way taxi Visakhapatnam to Rajahmundry',
          'Vizag to Vijayawada one way cab',
          'single drop taxi Andhra Pradesh',
          'cheap outstation cab Vizag',
        ]}
        canonicalPath="/one-way-trips"
        structuredData={structuredData}
      />

      <PageLayout
        title="One-Way Intercity Drops"
        subtitle="Why pay double when you're only travelling one way? Save up to 50% with our guaranteed single-sided outstation fares."
        categoryBadge="One-Way Economy"
        breadcrumbs={[{ label: 'Top Services', onClick: () => onNavigatePage('services') }, { label: 'One-Way Trips' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book One-Way Cab"
      >
        <div className="space-y-12">

          {/* Value comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <BadgePercent className="w-4 h-4" />
                <span>The One-Way Advantage</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Traditional Taxis vs. Waltair One-Way</h2>
              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/40 text-slate-300">
                  <div className="font-bold text-red-400 mb-1">Traditional Offline Cabs:</div>
                  Charges round-trip kilometers even if you stay at the destination, doubling your total invoice cost.
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-slate-200">
                  <div className="font-bold text-emerald-400 mb-1">Waltair Travels One-Way:</div>
                  Billed strictly for the one-sided journey distance with all tolls, driver batta, and fuel included.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold text-sm">Doorstep Pickup</div>
                <p className="text-xs text-slate-400">Pickup from any village, home, railway station, or airport in Visakhapatnam.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold text-sm">Direct Destination Drop</div>
                <p className="text-xs text-slate-400">Drop at exact hotel, residence, or office address in the destination city.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-amber-400 font-bold text-sm">Zero Cancellation Fee</div>
                <p className="text-xs text-slate-400">Free cancellation up to 3 hours prior to scheduled departure time.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-teal-400 font-bold text-sm">24/7 Verified Chauffeurs</div>
                <p className="text-xs text-slate-400">Courteous, non-smoking, commercial-licensed highway drivers.</p>
              </div>
            </div>
          </div>

          {/* One Way Routes Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Popular One-Way Outstation Fares</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">All fares include car rental, fuel, driver allowance, and GST options.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">From</th>
                    <th className="py-3 px-4">To Destination</th>
                    <th className="py-3 px-4">Distance & Time</th>
                    <th className="py-3 px-4">Sedan One-Way</th>
                    <th className="py-3 px-4">SUV One-Way</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {oneWayRoutes.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-400">{r.from}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{r.to}</td>
                      <td className="py-3.5 px-4 text-slate-400">{r.distance} (~{r.time})</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{r.sedan}</td>
                      <td className="py-3.5 px-4 font-bold text-teal-400">{r.suv}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={onOpenBooking}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Book Drop
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
