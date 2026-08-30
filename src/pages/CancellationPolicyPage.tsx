import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { 
  ShieldCheck, 
  Clock, 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  CreditCard
} from 'lucide-react';

interface CancellationPolicyPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const CancellationPolicyPage: React.FC<CancellationPolicyPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Waltair Travels Cancellation & Refund Policy',
    'description': 'Clear and customer-friendly cancellation guidelines, advance token refund schedules, and rescheduling policy.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Waltair Travels',
    },
  };

  return (
    <>
      <SEOHead
        title="Cancellation & Refund Policy - Waltair Travels Visakhapatnam"
        description="Read Waltair Travels transparent cancellation and refund rules. Free cancellations up to 2-4 hours before departure and 100% advance refund process."
        keywords={[
          'Waltair Travels cancellation policy',
          'Vizag cab refund rules',
          'taxi booking cancellation fee',
          'cab reschedule policy Visakhapatnam',
        ]}
        canonicalPath="/cancellation-policy"
        structuredData={structuredData}
      />

      <PageLayout
        title="Cancellation & Refund Policy"
        subtitle="Transparent, flexible, and customer-first cancellation rules designed to accommodate unexpected schedule changes."
        categoryBadge="Legal & Customer Rights"
        breadcrumbs={[{ label: 'Support', onClick: () => onNavigatePage('help-center') }, { label: 'Cancellation Policy' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Risk-Free Ride"
      >
        <div className="max-w-4xl mx-auto space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed">

          {/* Highlights summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-base">100% Free Cancellation</div>
              <p className="text-xs text-slate-400">Up to 2 hours before local/airport trips & 4 hours for outstation runs.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center mx-auto">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-base">Quick Refund SLA</div>
              <p className="text-xs text-slate-400">All advance refunds processed back to source bank within 24-48 business hours.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-base">Free Rescheduling</div>
              <p className="text-xs text-slate-400">Shift your departure time or date without any rebooking penalty.</p>
            </div>
          </div>

          {/* Detailed Policy Slabs */}
          <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Cancellation Timelines & Charges</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Trip Category</th>
                    <th className="py-3 px-4">Cancellation Timeframe</th>
                    <th className="py-3 px-4">Refund Percentage</th>
                    <th className="py-3 px-4">Cancellation Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Airport Transfers & City Rentals</td>
                    <td className="py-3.5 px-4 text-emerald-400">&gt; 2 Hours prior to pickup</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">100% Refund</td>
                    <td className="py-3.5 px-4 font-bold text-slate-400">₹0 (Free)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Airport Transfers & City Rentals</td>
                    <td className="py-3.5 px-4 text-amber-400">&lt; 2 Hours (after driver dispatch)</td>
                    <td className="py-3.5 px-4 text-amber-400">Advance minus driver turnaround fee</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">₹250 (Driver fuel compensation)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Outstation One-Way & Round Trips</td>
                    <td className="py-3.5 px-4 text-emerald-400">&gt; 4 Hours prior to pickup</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">100% Refund</td>
                    <td className="py-3.5 px-4 font-bold text-slate-400">₹0 (Free)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Multi-Day Sightseeing Packages (Araku/Lambasingi)</td>
                    <td className="py-3.5 px-4 text-emerald-400">&gt; 24 Hours prior to start</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">100% Refund</td>
                    <td className="py-3.5 px-4 font-bold text-slate-400">₹0 (Free)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Refund Process */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">How to Initiate a Cancellation or Refund</h3>
            <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-xs sm:text-sm">
              <li>Open the <strong className="text-white">Manage Trips</strong> portal from the website navigation using your Booking Reference Number and Mobile Number.</li>
              <li>Click <strong className="text-white">Cancel Booking</strong> and select the reason for cancellation.</li>
              <li>Alternatively, call our 24/7 helpline at <strong className="text-cyan-400">+91 91234 56789</strong> or WhatsApp our support desk for instant cancellation.</li>
              <li>If any advance payment was made, your refund is credited directly to your UPI ID, debit/credit card, or net banking account within 24 to 48 hours.</li>
            </ol>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
