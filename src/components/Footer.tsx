import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  ShieldCheck
} from 'lucide-react';
import { trackPhoneClick } from '../services/analyticsService';

interface FooterProps {
  onNavigatePage?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const handleLinkClick = (e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    if (onNavigatePage) {
      onNavigatePage(pageId);
    } else {
      window.location.hash = pageId;
    }
  };

  return (
    <footer className="bg-[#071018] text-slate-300 pt-0 pb-8 border-t border-slate-900">
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm sm:text-base">Need a cab in the next 30 minutes?</p>
            <p className="text-teal-50/80 text-xs mt-0.5">Airport, outstation, and hourly rentals with live GPS tracking.</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:+919110510236"
              onClick={() => trackPhoneClick('footer_banner')}
              className="px-4 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs hover:bg-teal-50"
            >
              Call +91 91105 10236
            </a>
            <a
              href="#booking"
              onClick={(e) => handleLinkClick(e, 'booking')}
              className="px-4 py-2.5 rounded-xl bg-teal-950/40 border border-white/20 text-white font-bold text-xs hover:bg-teal-950/60"
            >
              Book online
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        
        {/* Main 6 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={(e) => handleLinkClick(e, 'home')}
              className="flex items-center gap-2.5 group cursor-pointer inline-flex"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-teal-500/30 shrink-0 group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Waltair Cabs" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Waltair%20Cabs%20Coastal%20Travel%20Badge.png';
                  }}
                />
              </div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center">
                <span>Waltair</span>
                <span className="text-teal-400 ml-1 font-extrabold">Cabs</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your verified cab partner in Visakhapatnam. Guaranteed airport transfers to Bhogapuram ASI & VTZ, outstation trips, and Araku Valley tours with 100% transparent pricing.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="#facebook" 
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#instagram" 
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#twitter" 
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#linkedin" 
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="hover:text-teal-300 transition-colors cursor-pointer">Home</a>
              </li>
              <li>
                <a href="#about-us" onClick={(e) => handleLinkClick(e, 'about-us')} className="hover:text-teal-300 transition-colors cursor-pointer">About Us</a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} className="hover:text-teal-300 transition-colors cursor-pointer">Our Services</a>
              </li>
              <li>
                <a href="#outstation" onClick={(e) => handleLinkClick(e, 'outstation')} className="hover:text-teal-300 transition-colors cursor-pointer">Outstation</a>
              </li>
              <li>
                <a href="#packages" onClick={(e) => handleLinkClick(e, 'packages')} className="hover:text-teal-300 transition-colors cursor-pointer">Packages</a>
              </li>
              <li>
                <a href="#travel-blog" onClick={(e) => handleLinkClick(e, 'travel-blog')} className="hover:text-teal-300 text-teal-400 font-medium transition-colors flex items-center gap-1 cursor-pointer">Travel Blog</a>
              </li>
              <li>
                <a href="#contact-us" onClick={(e) => handleLinkClick(e, 'contact-us')} className="hover:text-teal-300 transition-colors cursor-pointer">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">Top Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#airport-taxi" onClick={(e) => handleLinkClick(e, 'airport-taxi')} className="hover:text-teal-300 transition-colors cursor-pointer">Airport Taxi</a>
              </li>
              <li>
                <a href="#vizag-to-araku-cab" onClick={(e) => handleLinkClick(e, 'vizag-to-araku-cab')} className="hover:text-teal-300 text-teal-400 font-semibold transition-colors cursor-pointer">Vizag to Araku Cab</a>
              </li>
              <li>
                <a href="#outstation-cabs" onClick={(e) => handleLinkClick(e, 'outstation-cabs')} className="hover:text-teal-300 transition-colors cursor-pointer">Outstation Cabs</a>
              </li>
              <li>
                <a href="#local-rentals" onClick={(e) => handleLinkClick(e, 'local-rentals')} className="hover:text-teal-300 transition-colors cursor-pointer">Local Rentals</a>
              </li>
              <li>
                <a href="#one-way-trips" onClick={(e) => handleLinkClick(e, 'one-way-trips')} className="hover:text-teal-300 transition-colors cursor-pointer">One-Way Trips</a>
              </li>
              <li>
                <a href="#round-trips" onClick={(e) => handleLinkClick(e, 'round-trips')} className="hover:text-teal-300 transition-colors cursor-pointer">Round Trips</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#help-center" onClick={(e) => handleLinkClick(e, 'help-center')} className="hover:text-teal-300 transition-colors cursor-pointer">Help Center</a>
              </li>
              <li>
                <a href="#faqs" onClick={(e) => handleLinkClick(e, 'faqs')} className="hover:text-teal-300 transition-colors cursor-pointer">FAQs</a>
              </li>
              <li>
                <a href="#cancellation-policy" onClick={(e) => handleLinkClick(e, 'cancellation-policy')} className="hover:text-teal-300 transition-colors cursor-pointer">Cancellation Policy</a>
              </li>
              <li>
                <a href="#privacy-policy" onClick={(e) => handleLinkClick(e, 'privacy-policy')} className="hover:text-teal-300 transition-colors cursor-pointer">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms-and-conditions" onClick={(e) => handleLinkClick(e, 'terms-and-conditions')} className="hover:text-teal-300 transition-colors cursor-pointer">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Download Our App & Contact Us */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider">Download Our App</h4>
            <p className="text-[11px] text-slate-400">Book your cab on the go with real-time GPS tracking.</p>
            
            {/* Store Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.183-.234-.294-.537-.294-.87V2.684c0-.333.111-.636.293-.87zM15.207 13.414l2.42 2.42-12.83 7.37 10.41-9.79zm0-2.828L4.797.796 17.627 8.16l-2.42 2.426zM18.847 9.38l3.197 1.838c.677.389.677 1.026 0 1.415l-3.197 1.838-2.128-2.128 2.128-2.128z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase text-slate-400">GET IT ON</div>
                  <div className="text-xs font-bold text-white leading-tight">Google Play</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.84-.98 2.95 1.07.08 2.15-.55 2.79-1.29z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase text-slate-400">Download on the</div>
                  <div className="text-xs font-bold text-white leading-tight">App Store</div>
                </div>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="pt-1 space-y-1.5 text-xs">
              <a 
                href="tel:+919110510236" 
                onClick={() => trackPhoneClick('footer_contact')}
                className="flex items-center gap-2 text-slate-300 hover:text-teal-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>+91 91105 10236</span>
              </a>
              <a href="mailto:info@waltairtravels.com" className="flex items-center gap-2 text-slate-300 hover:text-teal-300 transition-colors">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>info@waltairtravels.com</span>
              </a>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Visakhapatnam, Andhra Pradesh, India</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Waltair Cabs. All rights reserved. Registered Commercial Fleet Partner.
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <button onClick={(e) => handleLinkClick(e, 'privacy-policy')} className="hover:text-teal-300 transition-colors cursor-pointer">Privacy</button>
            <span>•</span>
            <button onClick={(e) => handleLinkClick(e, 'terms-and-conditions')} className="hover:text-teal-300 transition-colors cursor-pointer">Terms</button>
            <span>•</span>
            <button onClick={(e) => handleLinkClick(e, 'cancellation-policy')} className="hover:text-teal-300 transition-colors cursor-pointer">Cancellation</button>
            <span>•</span>
            <button onClick={(e) => handleLinkClick(e, 'faqs')} className="hover:text-teal-300 transition-colors cursor-pointer">FAQs</button>
            <span>•</span>
            <button 
              onClick={(e) => handleLinkClick(e, 'admin')} 
              className="text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
