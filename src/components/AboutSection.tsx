import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Clock, 
  Plane, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,

  PhoneCall
} from 'lucide-react';
import { FAQS } from '../data/mockData';

export const AboutSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="about" className="py-14 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Left Column: Visual Story & Highlights */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                            <span>Visakhapatnam's Premier Cab Network</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Setting New Benchmarks for Airport & Outstation Travel in Andhra Pradesh
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Founded with the singular mission of eliminating ride cancellations and opaque surge charges, <strong>Waltair Travels</strong> has grown into the region's most trusted fleet partner. Whether you are arriving at the new Bhogapuram International Airport or heading on a serene weekend to Araku Valley, we guarantee punctuality, safety, and comfort.
            </p>

            {/* 4 Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-800 shrink-0">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Bhogapuram Express</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Fixed rate connectivity to Bhogapuram ASI Airport.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Verified Chauffeurs</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Commercial licensed, background checked & polite.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-800 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Cancellation Policy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Driver assigned guarantee with on-time arrival.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sanitized Air-Conditioned</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Clean interiors with dual-cooling AC for summer.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact hotline callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-xs text-cyan-200">Need Immediate Cab Dispatch?</div>
                <div className="text-sm sm:text-base font-bold">24x7 Hotline: +91 91234 56789</div>
              </div>
              <a
                href="tel:+919123456789"
                className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                Call Control Desk
              </a>
            </div>

          </div>

          {/* Right Column: Stats Bento Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-700">50,000+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">Airport Trips Completed</div>
              <p className="text-[11px] text-slate-500">Across VTZ & Bhogapuram international routes</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">4.9 ★</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">Average Customer Rating</div>
              <p className="text-[11px] text-slate-500">From over 12,000+ verified Google & web reviews</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">220+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">Active Commercial Cabs</div>
              <p className="text-[11px] text-slate-500">Sedans, SUVs, Innovas & Tempo Travellers</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">99.8%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">On-Time Pickup Rate</div>
              <p className="text-[11px] text-slate-500">Backed by GPS dispatch & airport traffic sensors</p>
            </div>

          </div>

        </div>

        {/* FAQs Section */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Everything you need to know about our cabs, airport wait times, and fares.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-slate-900 font-bold text-sm sm:text-base hover:text-cyan-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
