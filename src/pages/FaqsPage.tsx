import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { 
  ChevronDown, 
  HelpCircle, 
  Phone, 
  Search, 
  Plane,
  Car,
  CreditCard,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { FAQS } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchTerm, setSearchTerm] = useState<string>('');

  const extendedFaqs = [
    {
      id: 'faq-1',
      question: 'How do I book a cab for Bhogapuram International Airport (ASI)?',
      answer: 'You can book directly on our website or mobile portal by selecting "Airport Taxi" and entering your flight number. Our dispatch team automatically tracks flight timings so your chauffeur is stationed outside arrivals with zero waiting anxiety.',
      category: 'airport',
    },
    {
      id: 'faq-2',
      question: 'Are highway tolls, parking fees, and driver allowances included in the fare?',
      answer: 'Yes! For all airport flat-rate transfers, highway toll plaza charges (like Tagarapuvalasa) and airport terminal entry are pre-included. For outstation per-km rentals, toll fees are charged transparently at actual Fastag rates with zero markup.',
      category: 'fares',
    },
    {
      id: 'faq-3',
      question: 'How does the "Express 10-Second Fast Booking" work?',
      answer: 'Simply enter your pickup, drop, and phone number on our Fast Booking widget. You get an instant confirmed fare quotation with zero mandatory upfront payment, and our dispatch team confirms your vehicle within 3 minutes.',
      category: 'booking',
    },
    {
      id: 'faq-4',
      question: 'Which specific cars are available in your fleet?',
      answer: 'Our fleet features exclusively clean, yellow-plate commercial models: Maruti Suzuki Dzire & Hyundai Aura (Sedan), Maruti Suzuki Ertiga & Kia Carens (Family SUV), and Toyota Innova Crysta (Luxury 7+1 MPV). You can choose your exact preferred vehicle class.',
      category: 'fleet',
    },
    {
      id: 'faq-5',
      question: 'Is advance payment mandatory to confirm my ride?',
      answer: 'No! Advance payment is completely optional for standard city and airport trips. You can pay 100% via Cash or UPI (Google Pay, PhonePe, Paytm) directly to the chauffeur after reaching your destination. Only custom multi-day luxury tour packages require a nominal token advance.',
      category: 'fares',
    },
    {
      id: 'faq-6',
      question: 'What is your cancellation and refund policy?',
      answer: 'We offer free cancellation up to 2 hours prior to scheduled pickup for city rides, and up to 4 hours for outstation trips. Any advance token paid is refunded 100% to your original payment method within 24-48 business hours.',
      category: 'booking',
    },
    {
      id: 'faq-7',
      question: 'Do you offer GST tax invoices for corporate business travelers?',
      answer: 'Yes! During booking or right after trip completion, you can enter your company GSTIN and legal business name to receive an instant, compliant GST tax invoice via email and WhatsApp.',
      category: 'corporate',
    },
    {
      id: 'faq-8',
      question: 'Are your chauffeurs trained for Araku and Lambasingi ghat roads?',
      answer: 'Yes, all drivers assigned to the Eastern Ghats routes are experienced veteran mountain chauffeurs who have extensive experience navigating hairpin bends, monsoon mist, and night ghat roads safely.',
      category: 'safety',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'airport', label: '✈️ Airport Transfers' },
    { id: 'fares', label: '💳 Fares & Tolls' },
    { id: 'booking', label: '⚡ Booking & Dispatch' },
    { id: 'fleet', label: '🚗 Fleet & Safety' },
    { id: 'corporate', label: '🏢 Corporate & GST' },
  ];

  const filteredFaqs = extendedFaqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions (FAQs) - Waltair Travels Visakhapatnam"
        description="Got questions about booking cabs, Bhogapuram airport transit, outstation per-km rates, GST invoicing, or payment methods? Browse our comprehensive FAQ guide."
        keywords={[
          'Waltair Travels FAQs',
          'Vizag taxi booking questions',
          'Bhogapuram cab fare questions',
          'outstation taxi policies Visakhapatnam',
        ]}
        canonicalPath="/faqs"
      />

      <PageLayout
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our fleet, rates, Bhogapuram airport pickups, cancellation rules, and safety standards."
        categoryBadge="Knowledge Base & Answers"
        breadcrumbs={[{ label: 'Support', onClick: () => onNavigatePage('help-center') }, { label: 'FAQs' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Ride Now"
        heroImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
      >
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Search and Category Filters */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search any query (e.g. flight delay, refund, GST invoice, tolls)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No matching questions found</h3>
                <p className="text-xs text-slate-500">Try searching with a different keyword or contact our 24/7 helpline.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base pr-2">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-teal-700 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-teal-700' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 sm:px-6 pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Unanswered Questions Callout */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Have a Question Not Listed Here?</h3>
              <p className="text-xs text-slate-500">Our customer support team is available 24/7 to assist you personally.</p>
            </div>
            <a
              href="tel:+919110510236"
              className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 91105 10236</span>
            </a>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
