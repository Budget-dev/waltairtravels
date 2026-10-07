import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Shield, Lock, Eye, Server, UserCheck, FileText } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Waltair Travels Privacy Policy',
    'description': 'Information on how Waltair Travels collects, stores, protects, and handles personal passenger data and GPS information.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Waltair Travels',
    },
  };

  return (
    <>
      <SEOHead
        title="Privacy Policy | Waltair Cabs Visakhapatnam"
        description="Learn how Waltair Cabs protects your personal information, phone number, and location privacy during cab bookings and taxi rides."
        canonicalUrl="/privacy-policy"
        keywords={["waltair cabs privacy policy", "taxi data privacy visakhapatnam"]}
        structuredData={structuredData}
      />
      <PageLayout
        title="Privacy Policy"
        subtitle="Your privacy and data safety are foundational to our operations. Learn how we safeguard your personal information and trip history."
        categoryBadge="Data Privacy & Compliance"
        breadcrumbs={[{ label: 'Support', onClick: () => onNavigatePage('help-center') }, { label: 'Privacy Policy' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Secure Ride"
        heroImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80"
      >
        <div className="max-w-4xl mx-auto space-y-8 text-slate-600 text-xs sm:text-sm leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3">
            <Shield className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-sm">Last Updated: August 2026</div>
              <p className="text-xs text-slate-600 mt-0.5">
                This Privacy Policy applies to all services offered by Waltair Travels across our website, mobile booking engines, and customer support channels.
              </p>
            </div>
          </div>

          <section className="space-y-3 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-700" />
              1. Information We Collect
            </h2>
            <p>
              To process your travel reservations, verify safety, and assign dedicated chauffeurs, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li><strong className="text-slate-800">Personal Contact Data:</strong> Name, phone number, email address, and billing information.</li>
              <li><strong className="text-slate-800">Trip & Geolocation Details:</strong> Exact pickup address, destination, flight number (for airport transfers), and travel date/time.</li>
              <li><strong className="text-slate-800">Live GPS Coordinates:</strong> Real-time location during active trips for passenger emergency safety and driver routing.</li>
              <li><strong className="text-slate-800">Corporate Details:</strong> GSTIN registration and company name for tax invoicing (when provided).</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-700" />
              2. How We Use Your Information
            </h2>
            <p>We use your information strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li>Dispatching appropriate vehicles and sharing driver credentials via SMS/WhatsApp.</li>
              <li>Monitoring flight delays to synchronize airport taxi arrival times.</li>
              <li>Generating digital trip invoices, GST tax receipts, and payment acknowledgments.</li>
              <li>Responding to customer support tickets and resolving route or billing queries.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-700" />
              3. Data Security & Non-Disclosure
            </h2>
            <p>
              We enforce strict technical security standards. We <strong className="text-slate-900">never sell, rent, or trade</strong> your personal contact or travel records to third-party advertising brokers or unauthorized marketing networks.
            </p>
            <p>
              Payment data processed via UPI, debit/credit cards, or net banking is encrypted using industry-standard SSL 256-bit protocols directly through RBI-compliant payment gateways.
            </p>
          </section>

          <section className="space-y-3 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-700" />
              4. Your Rights & Data Deletion
            </h2>
            <p>
              You have the right to request a copy of your trip history or request permanent deletion of your stored user profile by emailing <strong className="text-teal-700">privacy@waltairtravels.com</strong>.
            </p>
          </section>

        </div>
      </PageLayout>
    </>
  );
};
