import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
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
  Zap,
  HelpCircle,
  Plane,
  Train
} from 'lucide-react';
import { db, collection, addDoc } from '../firebase';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/SEOHead';
import { trackPhoneClick, trackWhatsAppClick, trackBookingStart } from '../services/analyticsService';

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
      // Fallback save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('waltair_offline_inquiries') || '[]');
        existing.push({ ...formData, createdAt: new Date().toISOString() });
        localStorage.setItem('waltair_offline_inquiries', JSON.stringify(existing));
      } catch {
        // ignore
      }
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dispatchLocations = [
    {
      title: 'Headquarters & Operations Desk',
      address: 'Waltair Uplands, Siripuram Circle, Visakhapatnam, AP - 530003',
      timings: '24 Hours Open / 365 Days',
      phone: '+91 91105 10236',
      icon: Building2,
      badge: 'Main HQ'
    },
    {
      title: 'Bhogapuram Airport Transit Counter',
      address: 'Near NH-16 Airport Expressway Junction, Bhogapuram, AP',
      timings: 'Synchronized with Flight Schedules',
      phone: '+91 91105 10236',
      icon: Plane,
      badge: 'Airport Terminal'
    },
    {
      title: 'Railway Station Pickup Point',
      address: 'Platform 1 & 8 Passenger Exits, Visakhapatnam Junction (VSKP)',
      timings: '24/7 Train Arrivals',
      phone: '+91 91105 10236',
      icon: Train,
      badge: 'Rail Kiosk'
    }
  ];

  return (
    <>
      <SEOHead
        title="Contact Waltair Cabs | 24/7 Taxi Booking Visakhapatnam"
        description="Contact Waltair Cabs in Visakhapatnam. 24/7 taxi booking hotline +91 91105 10236, WhatsApp dispatch desk, and office located at Waltair Uplands, Siripuram."
        canonicalPath="/contact-us"
        keywords={[
          'contact waltair cabs vizag',
          'vizag cab booking phone number',
          'taxi office visakhapatnam',
          'waltair cabs customer care',
          'visakhapatnam airport taxi booking number'
        ]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact Us', item: '/contact-us' }
        ]}
      />
      <PageLayout
        title="Contact Waltair Cabs"
        subtitle="24/7 Operations Desk, Airport Transit Dispatch, and Dedicated Corporate Mobility Support. Always a call or message away."
        categoryBadge="Customer Support & Office"
        breadcrumbs={[{ label: 'Contact Us' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={() => {
          trackBookingStart('local', 'contact_hero');
          onOpenBooking();
        }}
        ctaText="Book Instant Taxi"
        heroImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      >
      <div className="space-y-16">

        {/* Quick Contact Action Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="tel:+919110510236"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-teal-500 transition-all flex items-start gap-4 group"
          >
            <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Direct Phone Dispatch</div>
              <div className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors mt-0.5">
                +91 91105 10236
              </div>
              <div className="text-xs text-slate-500 mt-1">Available 24x7 for urgent rides</div>
            </div>
          </a>

          <a
            href="https://wa.me/919110510236?text=Hi%20Waltair%20Travels,%20I%20would%20like%20to%20inquire%20about%20a%20cab%20booking."
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-emerald-500 transition-all flex items-start gap-4 group"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Instant WhatsApp Chat</div>
              <div className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5">
                Chat with Desk
              </div>
              <div className="text-xs text-slate-500 mt-1">Avg response time: &lt; 2 minutes</div>
            </div>
          </a>

          <a
            href="mailto:info@waltairtravels.com"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-cyan-500 transition-all flex items-start gap-4 group"
          >
            <div className="p-3.5 rounded-2xl bg-cyan-50 text-cyan-700 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Corporate & Invoicing</div>
              <div className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors mt-0.5">
                info@waltairtravels.com
              </div>
              <div className="text-xs text-slate-500 mt-1">GST invoices & contract requests</div>
            </div>
          </a>
        </div>

        {/* Form and Office Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Dispatch Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
              <div>
                <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  Physical Hubs
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">Our Operating Locations</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Visit our office in Siripuram or meet our airport representatives on arrival.
                </p>
              </div>

              <div className="space-y-4">
                {dispatchLocations.map((loc, idx) => {
                  const Icon = loc.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-teal-700" />
                          <span className="text-xs font-bold text-slate-900">{loc.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                          {loc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{loc.address}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-700" /> {loc.timings}
                        </span>
                        <a href={`tel:${loc.phone}`} className="font-bold text-teal-700 hover:underline">
                          {loc.phone}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust Badge */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900 font-bold">100% Commercial AP Permits:</strong> All Waltair vehicles hold state-wide valid tourist permits, insurance, and emergency GPS SOS tracking.
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received Successfully!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out. Our 24/7 dispatch supervisor will call you back within 15 minutes with exact vehicle options and confirmed fares.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Send an Inquiry or Custom Quote Request</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out your requirements below and receive an instant transparent quote.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rajesh Varma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98480 12345"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajesh@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Inquiry Purpose</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
                      >
                        <option value="General Inquiry">General Ride Inquiry</option>
                        <option value="Airport Taxi Booking">Bhogapuram Airport Taxi (ASI)</option>
                        <option value="Outstation Cabs">Intercity Outstation Journey</option>
                        <option value="Tour Package Customization">Araku / Lambasingi Tour Package</option>
                        <option value="Corporate / Billing Inquiry">Corporate Contract / GST Invoicing</option>
                        <option value="Driver / Partner Registration">Driver Partner Registration</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Travel Details & Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify dates, pickup/drop locations, number of passengers, luggage count, or preferred vehicle (Dzire / Ertiga / Innova Crysta)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-950/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Submit Travel Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </PageLayout>
    </>
  );
};
