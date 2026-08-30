import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { FileText, ShieldAlert, CheckCircle, Scale, AlertCircle } from 'lucide-react';

interface TermsConditionsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Waltair Travels Terms and Conditions',
    'description': 'Standard operating terms, passenger codes of conduct, luggage limits, and legal service agreements for Waltair Travels.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Waltair Travels',
    },
  };

  return (
    <>
      <SEOHead
        title="Terms & Conditions - User Agreement & Booking Terms"
        description="Review the terms and conditions for booking cabs, airport transfers, and outstation vehicles with Waltair Travels Visakhapatnam."
        keywords={[
          'Waltair Travels terms and conditions',
          'taxi service agreement Vizag',
          'cab booking rules Andhra Pradesh',
        ]}
        canonicalPath="/terms-and-conditions"
        structuredData={structuredData}
      />

      <PageLayout
        title="Terms & Conditions"
        subtitle="Standard operating rules, user guidelines, luggage allowances, and legal provisions governing services provided by Waltair Travels."
        categoryBadge="Service Agreement"
        breadcrumbs={[{ label: 'Support', onClick: () => onNavigatePage('help-center') }, { label: 'Terms & Conditions' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Verified Taxi"
      >
        <div className="max-w-4xl mx-auto space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Scale className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">Agreement Overview</div>
              <p className="text-xs text-slate-400 mt-0.5">
                By confirming a reservation with Waltair Travels, passengers agree to the operational guidelines and tariff provisions outlined below.
              </p>
            </div>
          </div>

          <section className="space-y-3 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">1. Booking & Vehicle Confirmation</h2>
            <p>
              Trip reservations made online or over phone are subject to vehicle availability. Driver details (name, phone, vehicle registration, and OTP) are transmitted via SMS / WhatsApp 2 hours prior to scheduled departure.
            </p>
          </section>

          <section className="space-y-3 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">2. Distance & Time Calculations</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong className="text-slate-200">Point-to-Point / Airport:</strong> Billed at fixed flat package rates or actual GPS kilometers between specified pickup and drop coordinates.</li>
              <li><strong className="text-slate-200">Hourly Rentals:</strong> Packages include designated base hours and kilometers. Additional usage is charged per extra kilometer and extra hour at standard vehicle category slabs.</li>
              <li><strong className="text-slate-200">Outstation Round Trips:</strong> Calculated on a minimum run of 250 kilometers per calendar day.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">3. Tolls, Parking & Interstate Permits</h2>
            <p>
              Highway Fastag tolls, state border permits (for interstate travel outside Andhra Pradesh into Odisha or Telangana), and airport parking fees beyond complimentary minutes are payable by the customer unless explicitly included in a flat all-inclusive package.
            </p>
          </section>

          <section className="space-y-3 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Luggage & Passenger Capacity</h2>
            <p>
              Passengers must adhere to the lawful seating capacity of the vehicle (4 passengers for Hatchbacks/Sedans, 6-7 passengers for SUVs/Innova Crysta). Carriage of hazardous, flammable, or illegal contraband is strictly prohibited under Indian Motor Vehicle laws.
            </p>
          </section>

          <section className="space-y-3 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-lg sm:text-xl font-bold text-white">5. Force Majeure & Route Diversions</h2>
            <p>
              Waltair Travels is not liable for travel delays caused by unavoidable natural calamities, road blockades, sudden heavy monsoon floods in ghat sectors, or severe traffic congestion. Alternative routes or replacement vehicles will be coordinated promptly.
            </p>
          </section>

        </div>
      </PageLayout>
    </>
  );
};
