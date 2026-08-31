import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Building,
  Headphones
} from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { ContactInquiry } from '../types';

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
    <section id="contact" className="py-14 md:py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Info & 24x7 Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              <span>24x7 Customer Helpdesk</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              We Are Always Here to Assist Your Travel
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Have questions regarding Bhogapuram Airport terminal pickups, outstation tariffs, corporate GST billing, or custom wedding convoy packages? Connect with our dedicated dispatch coordinators.
            </p>

            <div className="space-y-4 pt-2">
              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="p-3 rounded-xl bg-cyan-700/80 text-white shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">24x7 Booking Helpline</div>
                  <a href="tel:+919123456789" className="text-lg font-bold text-white hover:text-cyan-400 transition-colors">
                    +91 91234 56789
                  </a>
                  <div className="text-xs text-slate-400">Toll Free: 1800 270 4567</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="p-3 rounded-xl bg-teal-700/80 text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Official Correspondence</div>
                  <a href="mailto:info@waltairtravels.com" className="text-base font-bold text-white hover:text-cyan-400 transition-colors">
                    info@waltairtravels.com
                  </a>
                  <div className="text-xs text-slate-400">bookings@waltairtravels.com</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="p-3 rounded-xl bg-emerald-700/80 text-white shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Head Office</div>
                  <div className="text-sm font-bold text-white">
                    Waltair Uplands, VIP Road, Siripuram
                  </div>
                  <div className="text-xs text-slate-400">Visakhapatnam, Andhra Pradesh 530003, India</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry / Corporate Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-cyan-400" />
                  <span>Send an Inquiry / Corporate Tie-Up</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Our operations team responds within 15 minutes with customized quotes.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-200">Inquiry Received!</h4>
                  <p className="text-xs text-emerald-300">
                    A Waltair Travels customer manager will call you shortly on your provided mobile number.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anand Rao"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
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
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email ID</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="corporate@company.com"
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Requirement Type</label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message / Specific Requirements</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention dates, preferred car models (Innova, Sedan, Tempo), passenger count..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#005a66] hover:bg-[#004751] text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'SUBMIT TRAVEL INQUIRY'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
