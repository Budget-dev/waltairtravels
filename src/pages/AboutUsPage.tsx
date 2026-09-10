import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  Users, 
  Car, 
  MapPin, 
  CheckCircle2, 
  HeartHandshake, 
  Star,
  Phone,
  
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onOpenBooking: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onNavigateHome,
  onOpenBooking,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Waltair Travels Visakhapatnam',
    'description': 'Leading chauffeur taxi and premium cab network in Visakhapatnam, Bhogapuram Airport, and Andhra Pradesh.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Waltair Travels',
      'logo': 'https://waltairtravels.com/icon.png',
    },
  };

  return (
    <>
      
      <PageLayout
        title="About Waltair Travels"
        subtitle="Empowering seamless, punctual, and transparent travel across Visakhapatnam, Bhogapuram International Airport, and South India."
        categoryBadge="Our Story & Vision"
        breadcrumbs={[{ label: 'About Us' }]}
        onNavigateHome={onNavigateHome}
        onOpenBooking={onOpenBooking}
        ctaText="Book a Verified Ride"
      >
        <div className="space-y-12 sm:space-y-16">
          
          {/* Mission & Key Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-slate-300 leading-relaxed text-sm sm:text-base">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Redefining Reliable Commuting in the City of Destiny
              </h2>
              <p>
                Founded in the heart of Visakhapatnam, <strong className="text-white">Waltair Travels</strong> was built on a single, unwavering promise: to deliver reliable, transparently priced, and impeccably punctual taxi solutions for residents, corporate travelers, and tourists alike.
              </p>
              <p>
                As Andhra Pradesh expands with the state-of-the-art <strong className="text-cyan-400">Alluri Sitharama Raju International Airport (ASI) in Bhogapuram</strong>, our dedicated fleet of 150+ commercial vehicles ensures you never have to worry about flight delays, midnight arrivals, or surging fares.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">250,000+</div>
                  <div className="text-xs text-slate-400 mt-1">Safe Trips Completed</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">99.4%</div>
                  <div className="text-xs text-slate-400 mt-1">On-Time Pickup Rate</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</div>
                  <div className="text-xs text-slate-400 mt-1">Average Customer Rating</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-950/40 relative group">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                  alt="Waltair Travels Fleet and Professional Chauffeurs"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <span>Commercial Fleet Certified</span>
                  </div>
                  <p className="text-xs text-slate-300">GPS-monitored, sanitized Hatchbacks, Sedans, Innova Crystas & Tempo Travellers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars of Trust */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Travelers Choose Waltair</h2>
              <p className="text-sm text-slate-400">Built on integrity, zero surge pricing, and veteran commercial chauffeurs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Verified Drivers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every driver undergoes strict background verification, route training, and customer hospitality orientation.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Zero Hidden Charges</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  What you see is what you pay. Transparent per-km rates, clear toll/parking policies, and GST tax invoice included.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800/50">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">24x7 Airport Dispatch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Round-the-clock operations team tracking flight arrivals in real-time so your driver is waiting at the terminal.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800/50">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Dedicated Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant human assistance via WhatsApp or phone. No bot frustration when you need immediate ride modifications.
                </p>
              </div>
            </div>
          </div>

          {/* Regional Roots & Coverage */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Serving Over 40+ Mandals and Districts</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  From Visakhapatnam urban limits, Anakapalle, and Bhogapuram to Araku Valley, Srikakulam, Vizianagaram, Kakinada, Rajahmundry, and Hyderabad corridors.
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-md"
              >
                Book Your Ride
              </button>
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
};
