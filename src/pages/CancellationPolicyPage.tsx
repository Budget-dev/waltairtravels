import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  ShieldCheck, 
  Clock, 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

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
    'name': 'Waltair Cabs Cancellation & Refund Policy',
    'description': 'Clear and customer-friendly cancellation guidelines, advance token refund schedules, and rescheduling policy.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Waltair Cabs',
    },
  };

  return (
    <>
      <SEOHead
        title="Cancellation & Refund Policy | Waltair Cabs Visakhapatnam"
        description="Learn about Waltair Cabs cancellation rules, refund timelines, and zero cancellation fee options for airport and outstation taxi bookings."
        canonicalUrl="/cancellation-policy"
        keywords={["waltair cabs cancellation policy", "taxi refund vizag", "cab cancellation terms visakhapatnam"]}
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
        heroImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80"
      >
        <div className="max-w-4xl mx-auto space-y-10 text-slate-600 text-sm sm:text-base leading-relaxed">

          {/* Highlights summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-base">100% Free Cancellation</div>
              <p className="text-xs text-slate-500">Up to 2 hours before local/airport trips & 4 hours for outstation runs.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-base">Quick Refund SLA</div>
              <p className="text-xs text-slate-500">All advance refunds processed back to source bank within 24-48 business hours.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-900 text-base">Free Rescheduling</div>
              <p className="text-xs text-slate-500">Shift your departure time or date without any rebooking penalty.</p>
            </div>
          </div>

          {/* Detailed Policy Slabs */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Cancellation Timelines & Charges</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Trip Category</th>
                    <th className="py-3 px-4">Cancellation Timeframe</th>
                    <th className="py-3 px-4">Refund Percentage</th>
                    <th className="py-3 px-4">Cancellation Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Airport Transfers & City Rentals</td>
                    <td className="py-3.5 px-4 text-emerald-700">&gt; 2 Hours prior to pickup</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">100% Refund</td>
                    <td className="py-3.5 px-4 font-bold text-slate-500">₹0 (Free)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Airport Transfers & City Rentals</td>
                    <td className="py-3.5 px-4 text-amber-700">&lt; 2 Hours (after driver dispatch)</td>
                    <td className="py-3.5 px-4 text-amber-700">Advance minus driver turnaround fee</td>
                    <td className="py-3.5 px-4 font-bold text-amber-700">₹250 (Driver fuel compensation)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Outstation One-Way & Round Trips</td>
                    <td className="py-3.5 px-4 text-emerald-700">&gt; 4 Hours prior to pickup</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">100% Refund</td>
                    <td className="py-3.5 px-4 font-bold text-slate-500">₹0 (Free)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Multi-Day Sightseeing Packages (Araku/Lambasingi)</td>
                    <td className="py-3.5 px-4 text-emerald-700">&gt; 24 Hours prior to start</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">100% Refund</td>
                    <td className="py-3.5 px-4 font-bold text-slate-500">₹0 (Free)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Refund Process */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">How to Initiate a Cancellation or Refund</h3>
            <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
              <li>Open the <strong className="text-slate-900">Manage Trips</strong> portal from the website navigation using your Booking Reference Number and Mobile Number.</li>
              <li>Click <strong className="text-slate-900">Cancel Booking</strong> and select the reason for cancellation.</li>
              <li>Alternatively, call our 24/7 helpline at <strong className="text-teal-700">+91 91234 56789</strong> or WhatsApp our support desk for instant cancellation.</li>
              <li>If any advance payment was made, your refund is credited directly to your UPI ID, debit/credit card, or net banking account within 24 to 48 hours.</li>
            </ol>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
