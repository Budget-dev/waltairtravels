import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { ChevronDown, HelpCircle, Sparkles, Phone } from 'lucide-react';
import { FAQS } from '../data/mockData';

interface FaqsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const extendedFaqs = [
    ...FAQS.map(f => ({ question: f.q, answer: f.a, category: 'general' })),
    {
      question: 'How do I book a cab for Bhogapuram International Airport (ASI)?',
      answer: 'You can book directly on our website or mobile portal by selecting "Airport Transfer" and entering your flight number. We automatically track flight schedules and ensure your cab is positioned at the terminal with zero wait anxiety.',
      category: 'airport',
    },
    {
      question: 'Is advance payment mandatory for booking confirmation?',
      answer: 'No, advance payment is optional for standard city and airport trips. You can choose to pay 100% cash or UPI directly to the driver upon reaching your destination. For multi-day holiday packages and outstation luxury vehicles, a nominal 20% advance secures your dedicated vehicle.',
      category: 'payment',
    },
    {
      question: 'Are toll charges, parking, and driver allowances included in the fare?',
      answer: 'Yes! Our system provides a transparent breakdown. For airport flat-rate packages, highway toll plaza fees and airport entry charges are pre-included. On standard per-km outstation rentals, toll fees are charged at actual Fastag rates with full receipt transparency.',
      category: 'fares',
    },
    {
      question: 'Can I choose between a Sedan, SUV, or Innova Crysta?',
      answer: 'Absolutely. We offer Prime Sedans (Dzire, Etios), Prime SUVs (Ertiga 6-seater), Innova Crysta luxury captains, and 12-26 seaters Tempo Travellers. You can select your preferred vehicle during the online booking step.',
      category: 'fleet',
    },
    {
      question: 'What is your cancellation and refund policy?',
      answer: 'We provide free cancellation up to 2 hours prior to scheduled pickup for city rides, and up to 4 hours for outstation trips. Any advance token paid is refunded 100% to your original payment method within 24-48 business hours.',
      category: 'cancellation',
    },
    {
      question: 'Do you offer GST tax invoices for corporate business travelers?',
      answer: 'Yes! During booking or right after trip completion, you can enter your company GSTIN and legal business name to receive an instant, compliant GST tax invoice via email and SMS.',
      category: 'corporate',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': extendedFaqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <>
      
      <PageLayout
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our fleet, rates, airport pickups, cancellation rules, and safety standards."
        categoryBadge="Knowledge Base & Answers"
        breadcrumbs={[{ label: 'Support', onClick: () => onNavigatePage('help-center') }, { label: 'FAQs' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Ride Now"
      >
        <div className="max-w-4xl mx-auto space-y-10">

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {extendedFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base pr-2">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-300' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Unanswered Questions Callout */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Still have a question?</h3>
              <p className="text-xs text-slate-400">Our customer support champions are available 24/7 to assist you personally.</p>
            </div>
            <a
              href="tel:+919123456789"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 91234 56789</span>
            </a>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
