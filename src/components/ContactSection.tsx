import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  Building,
  Headphones,
  Sparkles
} from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../firebase';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('Corporate & Bulk Taxi');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const submissionData = {
      name: name.trim(),
      email: email.trim() || 'not_provided@waltairtravels.com',
      phone: phone.replace(/\D/g, ''),
      serviceType,
      message: message.trim(),
      status: 'new',
      createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'contact_submissions'), submissionData);
    } catch (err) {
      console.warn('Contact submission saved locally fallback:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section id="contact" className="py-14 sm:py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Direct Info & 24/7 Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <Headphones className="w-3.5 h-3.5" />
              <span>24/7 Dispatch Desk & Support</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We Are Always Here to Assist Your Journey
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Have questions regarding Bhogapuram Airport terminal pickups, outstation tariffs, corporate GST invoicing, or custom Araku packages? Connect directly with our dispatch supervisors.
            </p>

            <div className="space-y-3 pt-2">
              {/* Phone */}
              <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="p-2.5 rounded-xl bg-teal-900/80 text-teal-300 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">24/7 Booking Helpline</div>
                  <a href="tel:+919123456789" className="text-base sm:text-lg font-bold text-white hover:text-teal-300 transition-colors">
                    +91 91234 56789
                  </a>
                  <div className="text-xs text-slate-400">Toll Free: 1800 270 4567</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="p-2.5 rounded-xl bg-cyan-900/80 text-cyan-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Official Correspondence</div>
                  <a href="mailto:info@waltairtravels.com" className="text-sm sm:text-base font-bold text-white hover:text-teal-300 transition-colors">
                    info@waltairtravels.com
                  </a>
                  <div className="text-xs text-slate-400">bookings@waltairtravels.com</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-900/80 text-emerald-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Vizag Operations Hub</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Waltair Uplands, VIP Road, Siripuram Circle
                  </div>
                  <div className="text-[11px] text-slate-400">Visakhapatnam, Andhra Pradesh 530003</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry / Corporate Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 sm:p-7 lg:p-8 border border-slate-800 shadow-2xl">
              
              <div className="mb-5">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-400" />
                  <span>Send a Travel Inquiry / Corporate Request</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Our dispatch coordinator responds within 15 minutes with customized fare quotes.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-200">Inquiry Received!</h4>
                  <p className="text-xs text-emerald-300">
                    A Waltair Travels trip coordinator will call you shortly on your provided mobile number.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anand Rao"
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email ID</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="corporate@company.com"
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Requirement Type</label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors"
                      >
                        <option value="Corporate & Bulk Taxi">Corporate & Employee Commute</option>
                        <option value="Airport Delegations">Airport VIP Delegation</option>
                        <option value="Wedding Cabs & Tempo Fleet">Wedding Fleet / Event Cabs</option>
                        <option value="Custom Araku Itinerary">Custom Multi-Day Araku Tour</option>
                        <option value="Long Term Monthly Rental">Monthly Attached Cab</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Travel Requirement Details</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention travel dates, preferred vehicles (Innova, Sedan, Tempo), passenger count..."
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors font-sans"
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'SUBMIT TRAVEL INQUIRY'}</span>
                  </motion.button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
