import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  Car, 
  FileText, 
  MapPin, 
  Search,
  ChevronRight
} from 'lucide-react';

interface HelpCenterPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onNavigatePage: (page: string) => void;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({
  onNavigateHome,
  onOpenBooking,
  onNavigatePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics = [
    {
      icon: Car,
      title: 'Booking & Dispatch',
      desc: 'How to reserve a cab, advance bookings, driver assignment timeline, and vehicle options.',
      links: ['How early should I book for Bhogapuram Airport?', 'Can I modify pickup time?', 'How is the driver assigned?'],
    },
    {
      icon: CreditCard,
      title: 'Fares & Payments',
      desc: 'Payment options (Cash, UPI, Cards), GST invoices, toll charges, and night allowance.',
      links: ['Are highway tolls included in the fare?', 'How to download a GST invoice?', 'What are the night driver charges?'],
    },
    {
      icon: ShieldCheck,
      title: 'Safety & Security',
      desc: 'GPS tracking, driver background checks, emergency SOS, and luggage safety.',
      links: ['How does live ride tracking work?', 'What if I forget an item in the taxi?', 'Are drivers commercially certified?'],
    },
    {
      icon: FileText,
      title: 'Cancellations & Refunds',
      desc: 'Cancellation window, refund processing timelines, and change of travel plans.',
      links: ['What is the cancellation policy?', 'How long does an advance refund take?', 'Can I reschedule without charges?'],
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How do I contact Waltair Travels customer support?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can reach Waltair Travels 24x7 customer support via phone at +91 91234 56789 or by email at info@waltairtravels.com.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How does airport pickup tracking work?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We track your flight number in real-time. If your flight is delayed, our driver automatically adjusts pickup time without extra waiting penalties.',
        },
      },
    ],
  };

  return (
    <>
      
      <PageLayout
        title="Help Center & Support Desk"
        subtitle="Quick assistance, step-by-step guides, and 24x7 customer helpline for all your travel needs in Visakhapatnam."
        categoryBadge="24x7 Rider Assistance"
        breadcrumbs={[{ label: 'Support' }, { label: 'Help Center' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Cab"
      >
        <div className="space-y-12">

          {/* Search Box */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white">How can our support team help you today?</h2>
            <div className="relative max-w-xl mx-auto">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords (e.g. airport delay, refund, invoice, tolls)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpTopics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <div key={i} className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/50 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                      <p className="text-xs text-slate-400">{topic.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {topic.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigatePage('faqs')}
                        className="w-full text-left text-xs text-slate-300 hover:text-cyan-400 py-1.5 flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <span>{link}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Support Channels */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Need Immediate Assistance?</h2>
              <p className="text-xs text-slate-400">Our live dispatchers are standing by 24 hours a day, 7 days a week.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <a
                href="tel:+919123456789"
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500 text-center space-y-2 transition-colors block"
              >
                <Phone className="w-6 h-6 text-cyan-400 mx-auto" />
                <div className="text-xs font-bold text-white uppercase">Call Helpline</div>
                <div className="text-sm font-bold text-cyan-400">+91 91234 56789</div>
              </a>

              <a
                href="https://wa.me/919123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500 text-center space-y-2 transition-colors block"
              >
                <MessageSquare className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white uppercase">WhatsApp Chat</div>
                <div className="text-sm font-bold text-emerald-400">Instant Chat</div>
              </a>

              <a
                href="mailto:info@waltairtravels.com"
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500 text-center space-y-2 transition-colors block"
              >
                <Mail className="w-6 h-6 text-teal-400 mx-auto" />
                <div className="text-xs font-bold text-white uppercase">Email Help Desk</div>
                <div className="text-sm font-bold text-teal-400">info@waltairtravels.com</div>
              </a>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
