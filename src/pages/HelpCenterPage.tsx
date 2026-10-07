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
  ChevronRight,
  Zap,
  Clock,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';

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
      links: [
        'How early should I book for Bhogapuram Airport?',
        'Can I modify pickup time?',
        'How is the driver assigned?'
      ],
    },
    {
      icon: CreditCard,
      title: 'Fares & Payments',
      desc: 'Payment options (Cash, UPI, Cards), GST invoices, toll charges, and night allowance.',
      links: [
        'Are highway tolls included in the fare?',
        'How to download a GST invoice?',
        'What are the night driver charges?'
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Safety & Security',
      desc: 'GPS tracking, driver background checks, emergency SOS, and luggage safety.',
      links: [
        'How does live ride tracking work?',
        'What if I forget an item in the taxi?',
        'Are drivers commercially certified?'
      ],
    },
    {
      icon: FileText,
      title: 'Cancellations & Refunds',
      desc: 'Cancellation window, refund processing timelines, and change of travel plans.',
      links: [
        'What is the cancellation policy?',
        'How long does an advance refund take?',
        'Can I reschedule without charges?'
      ],
    },
  ];

  const filteredTopics = helpTopics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.links.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <PageLayout
      title="Help Center & Support Desk"
      subtitle="Quick assistance, step-by-step guides, and 24x7 customer helpline for all your travel needs across Visakhapatnam and Andhra Pradesh."
      categoryBadge="24x7 Rider Assistance"
      breadcrumbs={[{ label: 'Support' }, { label: 'Help Center' }]}
      onNavigateHome={onNavigateHome}
      onOpenBooking={onOpenBooking}
      ctaText="Book a Cab"
      heroImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
    >
      <SEOHead
        title="Help Center & 24x7 Customer Support | Waltair Cabs Visakhapatnam"
        description="Need help with your cab booking, driver contact, refund status, or Bhogapuram airport transit? Contact Waltair Cabs 24x7 support desk in Vizag."
        canonicalUrl="/help-center"
        keywords={["waltair cabs help center", "vizag taxi customer care", "taxi booking support vizag", "cab helpline visakhapatnam"]}
      />
      <div className="space-y-16">

        {/* Search Hero Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-5 max-w-3xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <span>Search Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How can our support team help you today?</h2>
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords (e.g. airport delay, refund, GST invoice, tolls)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white shadow-inner transition-colors"
            />
          </div>
        </div>

        {/* Help Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <motion.div 
                key={i} 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{topic.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{topic.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {topic.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigatePage('faqs')}
                        className="w-full text-left text-xs text-slate-700 hover:text-teal-700 py-1.5 flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{link}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigatePage('faqs')}
                    className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <span>View all related questions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Direct Live Support Channels */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Live Human Support</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Need Immediate Help with an Ongoing Trip?</h2>
            <p className="text-xs sm:text-sm text-teal-100">
              Our central dispatch supervisors are standing by 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="tel:+919110510236"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-center space-y-2 transition-all block group"
            >
              <Phone className="w-6 h-6 text-teal-300 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white uppercase tracking-wider">Call Helpline</div>
              <div className="text-base font-black text-teal-300">+91 91105 10236</div>
              <div className="text-[11px] text-slate-300">Immediate human pickup</div>
            </a>

            <a
              href="https://wa.me/919110510236"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-center space-y-2 transition-all block group"
            >
              <MessageSquare className="w-6 h-6 text-emerald-300 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Desk</div>
              <div className="text-base font-black text-emerald-300">Chat with Operations</div>
              <div className="text-[11px] text-slate-300">Avg reply &lt; 2 minutes</div>
            </a>

            <a
              href="mailto:info@waltairtravels.com"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-center space-y-2 transition-all block group"
            >
              <Mail className="w-6 h-6 text-cyan-300 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white uppercase tracking-wider">Email Support</div>
              <div className="text-base font-black text-cyan-300">info@waltairtravels.com</div>
              <div className="text-[11px] text-slate-300">Corporate & billing queries</div>
            </a>
          </div>
        </div>

      </div>
    </PageLayout>
  );
};
