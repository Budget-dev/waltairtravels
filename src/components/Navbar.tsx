import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Bell, 
  User, 
  Phone, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  Clock, 
  Car, 
  Compass, 
  BookOpen, 
  LogOut, 
  CheckCircle,
  Plane,
  Briefcase,
  Map,
  ChevronRight,
  Shield,
  HelpCircle,
  Activity,
  Mountain
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { NotificationItem, AppUser } from '../types';
import { trackPhoneClick } from '../services/analyticsService';

interface NavbarProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onOpenBooking: () => void;
  onOpenTrackTrip: () => void;
  onOpenManageTrips: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenTelemetry?: () => void;
  onOpenAiPlanner?: () => void;
  user: AppUser | null;
  onLogout: () => void;
  currentPage?: string;
  onNavigatePage?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  onOpenBooking,
  onOpenTrackTrip,
  onOpenManageTrips,
  onOpenAdmin,
  onOpenAuth,
  onOpenTelemetry,
  onOpenAiPlanner,
  user,
  onLogout,
  currentPage = 'home',
  onNavigatePage,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Sync with session storage and custom auth change events so Navbar is 100% reactive
  const [localSession, setLocalSession] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('waltair_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncSession = () => {
      try {
        const saved = localStorage.getItem('waltair_user_session');
        setLocalSession(saved ? JSON.parse(saved) : null);
      } catch {
        setLocalSession(null);
      }
    };
    window.addEventListener('storage', syncSession);
    window.addEventListener('waltair_auth_change', syncSession);
    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('waltair_auth_change', syncSession);
    };
  }, []);

  const activeUser = user || localSession;
  const isUserLoggedIn = Boolean(
    activeUser &&
    activeUser.isLoggedIn !== false &&
    (activeUser.uid || activeUser.email || activeUser.name || activeUser.phone)
  );

  const handleSignOut = () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    try {
      localStorage.removeItem('waltair_user_session');
      window.dispatchEvent(new Event('waltair_auth_change'));
    } catch (e) {
      console.warn('Session clear note:', e);
    }
    onLogout();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNav = (pageId: string) => {
    if (onNavigatePage) {
      onNavigatePage(pageId);
    } else {
      window.location.hash = pageId;
    }
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  };

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      {/* Top Brand Notice Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white text-xs py-1 px-4 border-b border-teal-800/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/25 text-teal-200 font-bold text-[10px] tracking-wide uppercase border border-teal-400/40 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>Airport Express</span>
            </span>
            <span className="text-slate-200 truncate hidden sm:inline">
              Visakhapatnam & Bhogapuram International Airport (ASI) Transfers • 24/7 Verified Fleet
            </span>
            <span className="text-slate-200 truncate sm:hidden">
              Bhogapuram ASI & Vizag Airport Cabs
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-medium">
            <a 
              href="tel:+919110510236" 
              onClick={() => trackPhoneClick('navbar_top')}
              className="text-teal-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>+91 91105 10236</span>
            </a>
            <span className="text-teal-700 hidden md:inline">•</span>
            <span className="text-emerald-400 text-[11px] font-semibold hidden md:inline">
              Fixed Rates • Zero Surge
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar - Sleek Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          id="brand-logo-link"
          className="flex items-center gap-2 group cursor-pointer shrink-0 min-w-0"
        >
          {/* Brand Logo Icon */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-teal-500/20 bg-slate-900 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Waltair Travels Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Glossy%20WT%20Road%20Trip%20App%20Icon.png';
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center leading-none whitespace-nowrap">
              <span>Waltair</span>
              <span className="text-teal-800 ml-1 font-black">Travels</span>
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-wider uppercase font-semibold text-slate-400 mt-0.5 whitespace-nowrap">
              Visakhapatnam Cabs
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 text-xs xl:text-[13px] font-semibold text-slate-700 whitespace-nowrap">
          <button 
            onClick={() => handleNav('home')}
            className={`whitespace-nowrap shrink-0 relative px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'home' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Home
            {currentPage === 'home' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('about-us')}
            className={`whitespace-nowrap shrink-0 relative px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'about-us' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            About Us
            {currentPage === 'about-us' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          {/* Services Dropdown */}
          <div className="relative">
            <button 
              id="services-dropdown-btn"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              onMouseEnter={() => setIsServicesOpen(true)}
              className={`whitespace-nowrap shrink-0 px-2 xl:px-2.5 py-1.5 transition-colors rounded-lg flex items-center gap-1 cursor-pointer ${
                ['services', 'airport-taxi', 'outstation-cabs', 'local-rentals', 'one-way-trips', 'round-trips'].includes(currentPage)
                  ? 'text-teal-900 font-bold bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Services
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-teal-800' : ''}`} />
            </button>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  className="absolute top-full left-0 mt-1 w-68 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 whitespace-normal"
                >
                  <button 
                    onClick={() => handleNav('airport-taxi')}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/70 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-teal-100/80 text-teal-900">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900">Airport Taxi</div>
                      <div className="text-[11px] text-slate-500">Bhogapuram ASI & VTZ transfers</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNav('outstation-cabs')}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/70 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-cyan-100/80 text-cyan-900">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900">Outstation Cabs</div>
                      <div className="text-[11px] text-slate-500">One-way drops & roundtrips</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNav('vizag-to-araku-cab')}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/70 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-900">
                      <Mountain className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900">Vizag to Araku Cab</div>
                      <div className="text-[11px] text-slate-500">Borra Caves, Tyda & Hill Station Tour</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNav('local-rentals')}
                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/70 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-900">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900">Local Hourly Rentals</div>
                      <div className="text-[11px] text-slate-500">4hr, 8hr & 12hr city packages</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNav('services')}
                    className="w-full text-left pt-2 pb-1 px-2.5 text-xs text-teal-800 font-bold hover:underline border-t border-slate-100 mt-1 cursor-pointer flex items-center justify-between"
                  >
                    <span>View All Services</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => handleNav('outstation')}
            className={`whitespace-nowrap shrink-0 relative px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'outstation' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Outstation
            {currentPage === 'outstation' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('packages')}
            className={`whitespace-nowrap shrink-0 relative px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'packages' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Packages
            {currentPage === 'packages' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('travel-blog')}
            className={`whitespace-nowrap shrink-0 relative px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              currentPage === 'travel-blog' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog</span>
            {currentPage === 'travel-blog' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('contact-us')}
            className={`whitespace-nowrap shrink-0 relative px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'contact-us' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Contact
            {currentPage === 'contact-us' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={onOpenManageTrips}
            className="whitespace-nowrap shrink-0 px-2.5 py-1 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ml-0.5 shadow-2xs"
            title="View saved bookings on this device"
          >
            <Car className="w-3.5 h-3.5 text-teal-700" />
            <span>My Bookings</span>
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 whitespace-nowrap">
          
          {/* Operating Hub Badge (Desktop / Tablet view) */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-200/80 bg-teal-50/70 text-slate-800 text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="font-bold text-teal-950">Visakhapatnam (Vizag)</span>
            <span className="text-[10px] text-teal-700 bg-white/90 px-1.5 py-0.5 rounded-full font-bold border border-teal-200/60 ml-0.5">Hub</span>
          </div>

          {/* Admin Fleet & Lead Console Button */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-500 text-teal-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Open Fleet Operations & Lead Admin Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Admin Portal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="notif-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-700 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="fixed left-4 right-4 top-[72px] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-teal-700" />
                      Trip Updates & Offers
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-teal-700 hover:underline font-medium cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.read ? 'bg-slate-50 text-slate-600' : 'bg-teal-50/70 border border-teal-100 text-slate-800'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 mb-0.5 flex justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile or Login Button */}
          {isUserLoggedIn && activeUser ? (
            <div className="relative shrink-0">
              <button 
                id="user-profile-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white px-2.5 sm:px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer border border-slate-700/60 hover:border-teal-500/50"
              >
                <div className="relative">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                    {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
                </div>
                <span className="font-semibold max-w-[100px] sm:max-w-[130px] truncate">
                  {activeUser.name ? activeUser.name.split(' ')[0] : 'Rider'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="fixed left-4 right-4 top-[72px] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 whitespace-normal"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{activeUser.name || 'Waltair Rider'}</div>
                        <div className="text-[11px] text-slate-500 truncate">{activeUser.email || activeUser.phone || 'Verified Account'}</div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Logged In</span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenManageTrips();
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2 cursor-pointer font-medium transition-colors"
                      >
                        <Car className="w-4 h-4 text-teal-700" />
                        <span>My Trips & Invoices</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-xs rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="login-signup-btn"
              onClick={onOpenAuth}
              className="whitespace-nowrap shrink-0 flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3 sm:px-3.5 py-1.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Login</span>
            </motion.button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Slide-in Drawer via React Portal directly into document.body */}
    {typeof document !== 'undefined' &&
      createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div
              id="mobile-drawer-portal-root"
              className="fixed inset-0 z-[99999] lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              {/* Dark Full-screen Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-[99998]"
                aria-label="Close sidebar backdrop"
              />

              {/* Slide-in Panel from Right */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col z-[99999] overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/40 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-teal-400/40 shadow-xs shrink-0 bg-slate-900 flex items-center justify-center">
                      <img 
                        src="/logo.png" 
                        alt="Waltair Travels" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.src = 'https://waltairtravelsandcabs.sirv.com/Glossy%20WT%20Road%20Trip%20App%20Icon.png';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Waltair Travels</div>
                      <div className="text-[10px] text-teal-200">Visakhapatnam & Coastal AP</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="mobile-drawer-close-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Close sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
                  
                  {/* Primary Service Hub Badge Card */}
                  <div className="p-3 bg-gradient-to-r from-teal-50/90 to-slate-50 rounded-2xl border border-teal-200/80 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Primary Service Hub</div>
                        <div className="text-xs font-bold text-slate-900">Visakhapatnam & ASI Airport</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>24/7 Active</span>
                    </span>
                  </div>

                  {/* Primary Nav Links */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Navigation Menu
                    </div>

                    {[
                      { id: 'home', label: 'Home', icon: Car },
                      { id: 'services', label: 'Our Services', icon: Briefcase },
                      { id: 'airport-taxi', label: 'Airport Taxi (ASI Bhogapuram)', icon: Plane },
                      { id: 'outstation', label: 'Outstation Cabs', icon: Compass },
                      { id: 'vizag-to-araku-cab', label: 'Vizag to Araku Cab (Borra Caves)', icon: Mountain },
                      { id: 'local-rentals', label: 'Hourly City Rentals', icon: Clock },
                      { id: 'packages', label: 'Holiday Tours (Araku & Lambasingi)', icon: Map },
                      { id: 'travel-blog', label: 'Travel Guides & Blog', icon: BookOpen },
                      { id: 'about-us', label: 'About Us', icon: Shield },
                      { id: 'contact-us', label: 'Contact Us', icon: HelpCircle }
                    ].map((item) => {
                      const IconComponent = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNav(item.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all active:scale-98 cursor-pointer ${
                            isActive 
                              ? 'text-teal-900 font-bold bg-teal-50 border border-teal-200/80' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComponent className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-slate-300'}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                      Quick Actions
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-500 text-teal-300 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-teal-400" />
                          <span>Admin & Lead Console</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Hub
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenManageTrips();
                        }}
                        className="p-3 rounded-xl bg-teal-850 hover:bg-teal-900 bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <Car className="w-4 h-4" />
                        <span>My Bookings & History</span>
                      </button>
                    </div>
                  </div>

                  {/* 24/7 Helpline Card */}
                  <a
                    href="tel:+919110510236"
                    className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 font-medium text-xs transition-transform active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">24/7 Booking Helpline</div>
                        <div className="text-[10px] text-teal-700">+91 91105 10236</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-teal-800 text-white rounded-lg">Call</span>
                  </a>

                  {/* User Session Footer */}
                  {isUserLoggedIn && activeUser ? (
                    <div className="pt-2 space-y-2 border-t border-slate-100">
                      <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-white truncate">{activeUser.name || 'Waltair Rider'}</div>
                          <div className="text-[10px] text-teal-300 truncate">{activeUser.email || activeUser.phone || 'Active Session'}</div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          Online
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out ({activeUser.name ? activeUser.name.split(' ')[0] : 'Rider'})</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        id="mobile-drawer-login-btn"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span>Login or Register</span>
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
