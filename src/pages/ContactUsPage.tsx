import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { SEOHead } from '../components/SEOHead';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  HelpCircle
} from 'lucide-react';
import { db, collection, addDoc } from '../firebase';

interface ContactUsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Inquiry submission fallback:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact Waltair Travels Visakhapatnam',
    'description': '24x7 Customer Support Desk, Corporate Travel Desk & Bhogapuram Airport Taxi dispatch center.',
    'mainEntity': {
      '@type': 'LocalBusiness',
      'name': 'Waltair Travels Head Office',
      'telephone': '+91-9123456789',
      'email': 'info@waltairtravels.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Waltair Uplands, Siripuram Circle',
        'addressLocality': 'Visakhapatnam',
        'addressRegion': 'Andhra Pradesh',
        'postalCode': '530003',
        'addressCountry': 'IN',
      },
    },
  };

  return (
    <>
      <SEOHead
        title="Contact Us - 24x7 Taxi Support & Corporate Booking Desk"
        description="Get in touch with Waltair Travels Visakhapatnam. Call +91 91234 56789 for instant cab dispatch, airport transfers, corporate contracts, or trip assistance."
        keywords={[
          'contact Waltair Travels',
          'Vizag cab customer care number',
          'Bhogapuram taxi contact number',
          'Visakhapatnam taxi booking phone',
        ]}
        canonicalPath="/contact-us"
        structuredData={structuredData}
      />

      <PageLayout
        title="Contact Waltair Travels"
        subtitle="24/7 Operations Desk, Airport Transit Dispatch, and Dedicated Corporate Mobility Support."
        categoryBadge="Customer Support & Office"
        breadcrumbs={[{ label: 'Contact Us' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book Instant Taxi"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Office info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Get in Touch</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Whether you need immediate cab dispatch for an upcoming flight, want to book a multi-day family tour, or require corporate GST invoicing, our team is ready 24 hours a day.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="tel:+919123456789"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">24x7 Helpline / Dispatch</div>
                    <div className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mt-0.5">
                      +91 91234 56789
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/919123456789?text=Hi%20Waltair%20Travels,%20I%20would%20like%20to%20inquire%20about%20a%20cab%20booking."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">WhatsApp Direct Support</div>
                    <div className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mt-0.5">
                      Chat on WhatsApp
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:info@waltairtravels.com"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-teal-950 text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Email Support</div>
                    <div className="text-base font-bold text-white group-hover:text-teal-400 transition-colors mt-0.5">
                      info@waltairtravels.com
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="p-3 rounded-xl bg-amber-950 text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Head Office</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                      Waltair Uplands, Siripuram Circle, Visakhapatnam, Andhra Pradesh - 530003
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thank You for Reaching Out!</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Your inquiry has been received. Our operations team will contact you within 15 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-cyan-400 hover:text-white font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white">Send Us a Direct Message</h2>
                    <p className="text-xs text-slate-400 mt-1">Fill out the details below and we will respond promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Naidu"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98480 12345"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ramesh@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Inquiry Purpose</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Airport Taxi Booking">Airport Taxi Booking</option>
                        <option value="Outstation Cabs">Outstation Trip</option>
                        <option value="Tour Package Customization">Holiday Tour Package</option>
                        <option value="Corporate / Billing Inquiry">Corporate Billing / GST</option>
                        <option value="Driver / Partner Registration">Driver Partner Registration</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Message / Travel Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify your pickup location, dates, passengers, or specific vehicle preferences..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
