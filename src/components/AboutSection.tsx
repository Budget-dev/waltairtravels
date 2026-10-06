import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Clock, 
  Plane, 
  ChevronDown, 
  CheckCircle2
} from 'lucide-react';
import { FAQS } from '../data/mockData';

export const AboutSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const trustPillars = [
    {
      title: 'Bhogapuram Express',
      desc: 'Dedicated round-the-clock connectivity to Bhogapuram ASI Airport.',
      icon: Plane,
      color: 'teal'
    },
    {
      title: '100% Verified Chauffeurs',
      desc: 'Commercial licensed, police background verified, courteous & punctual.',
      icon: ShieldCheck,
      color: 'emerald'
    },
    {
      title: 'Zero Cancellation Guarantee',
      desc: 'Once confirmed, your driver and cab assignment is 100% locked.',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Sanitized & Climate-Controlled',
      desc: 'Fresh interiors with dual-blower AC for comfortable hot summer rides.',
      icon: Award,
      color: 'amber'
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-18">
          
          {/* Left Column: Story & Trust Pillars */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
              <span>Visakhapatnam's Dedicated Cab Network</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Setting New Standards for Airport & Intercity Travel in Andhra Pradesh
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed leading-normal">
              Founded to eliminate last-minute ride cancellations and opaque surge charges, <strong>Waltair Travels</strong> has grown into the region's preferred cab service. Whether landing at Bhogapuram International Airport (ASI) or touring Araku Valley, we guarantee punctuality, safety, and fixed transparent tariffs.
            </p>

            {/* 4 Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {trustPillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-teal-700" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helpline Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div>
                <div className="text-[11px] text-teal-200 font-medium">Need Urgent Ride Dispatch?</div>
                <div className="text-sm sm:text-base font-bold text-white">24/7 Control Desk: +91 91105 10236</div>
              </div>
              <a
                href="tel:+919110510236"
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
              >
                Call Hotline
              </a>
            </div>

          </div>

          {/* Right Column: Stats Bento Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-4">
            
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs text-center space-y-1.5"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-800">50k+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">Airport Trips</div>
              <p className="text-[11px] text-slate-500 leading-snug">VTZ & Bhogapuram international routes</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs text-center space-y-1.5"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">4.9 ★</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">Average Rating</div>
              <p className="text-[11px] text-slate-500 leading-snug">Over 12,000+ verified customer reviews</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs text-center space-y-1.5"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-700">220+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">Active Cabs</div>
              <p className="text-[11px] text-slate-500 leading-snug">Dzire, Ertiga, Carens, Fronx & Crysta</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs text-center space-y-1.5"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">99.8%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">On-Time Pickup</div>
              <p className="text-[11px] text-slate-500 leading-snug">Zero delay promise with live GPS tracking</p>
            </motion.div>

          </div>

        </div>

        {/* FAQs Section with Smooth Framer Motion Accordion */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Common questions about airport pickups, outstation one-way fares, and vehicle booking.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-slate-900 font-bold text-xs sm:text-sm hover:text-teal-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
