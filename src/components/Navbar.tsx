import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { CITIES, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { NotificationItem, AppUser } from '../types';

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
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top Brand Notice Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950 text-white text-xs py-1.5 px-4 border-b border-teal-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/25 text-teal-200 font-bold text-[10px] tracking-wide uppercase border border-teal-400/40 shrink-0">
              <Sparkles className="w-3 h-3 text-teal-400" />
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
              href="tel:+919123456789" 
              className="text-teal-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>+91 91234 56789</span>
            </a>
            <span className="text-teal-700 hidden md:inline">•</span>
            <span className="text-emerald-400 text-[11px] font-semibold hidden md:inline">
              Fixed Rates • Zero Surge
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          id="brand-logo-link"
          className="flex items-center gap-2.5 group cursor-pointer shrink-0 min-w-0"
        >
          {/* Stylized W Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-800 to-slate-900 flex items-center justify-center shadow-md shadow-teal-950/20 group-hover:scale-105 transition-transform shrink-0">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8 L9 24 L14 12 L18 24 L23 8 L28 20" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center leading-none">
              <span>Waltair</span>
              <span className="text-teal-800 ml-1 font-black">Travels</span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-400 mt-0.5">
              Visakhapatnam Cabs
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold text-slate-700">
          <button 
            onClick={() => handleNav('home')}
            className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'home' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Home
            {currentPage === 'home' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('about-us')}
            className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'about-us' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            About Us
            {currentPage === 'about-us' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          {/* Services Dropdown */}
          <div className="relative">
            <button 
              id="services-dropdown-btn"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              onMouseEnter={() => setIsServicesOpen(true)}
              className={`px-3 py-2 transition-colors rounded-lg flex items-center gap-1 cursor-pointer ${
                ['services', 'airport-taxi', 'outstation-cabs', 'local-rentals', 'one-way-trips', 'round-trips'].includes(currentPage)
                  ? 'text-teal-900 font-bold bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Services
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-teal-800' : ''}`} />
            </button>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  className="absolute top-full left-0 mt-1 w-68 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50"
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
            className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'outstation' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Outstation
            {currentPage === 'outstation' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('packages')}
            className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'packages' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Packages
            {currentPage === 'packages' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('travel-blog')}
            className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'travel-blog' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog</span>
            {currentPage === 'travel-blog' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>

          <button 
            onClick={() => handleNav('contact-us')}
            className={`relative px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              currentPage === 'contact-us' ? 'text-teal-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            Contact
            {currentPage === 'contact-us' && (
              <motion.span 
                layoutId="navActiveLine" 
                className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-800 rounded-full" 
              />
            )}
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* City Selector Pill (Desktop / Tablet view) */}
          <div className="relative hidden md:block">
            <button
              id="city-selector-btn"
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span className="truncate max-w-[130px]">{currentCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {isCityMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Service Hubs
                  </div>
                  {CITIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCity(c.name);
                        setIsCityMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentCity === c.name ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c.label}</span>
                      {currentCity === c.name && <span className="text-teal-700">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
          {user && user.isLoggedIn ? (
            <div className="relative">
              <button 
                id="user-profile-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white px-2.5 sm:px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="fixed left-4 right-4 top-[72px] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email || user.phone || 'Verified Rider'}</div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenManageTrips();
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-xl text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Car className="w-4 h-4 text-teal-700" />
                        <span>My Trips & Invoices</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
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
              className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer shrink-0"
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

      {/* Mobile Slide-in Drawer with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
              aria-label="Close sidebar backdrop"
            />

            {/* Slide-in Panel from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/40 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold text-xs">
                    W
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Waltair Travels</div>
                    <div className="text-[10px] text-teal-200">Visakhapatnam & Coastal AP</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* City Selector */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>Select Hub / City</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CITIES.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onSelectCity(c.name);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          currentCity === c.name 
                            ? 'bg-teal-800 text-white shadow-xs' 
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{c.label}</span>
                        {currentCity === c.name && <CheckCircle className="w-3 h-3 shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
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
                        onOpenManageTrips();
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-teal-700" />
                      <span>My Trips & Booking Management</span>
                    </button>
                  </div>
                </div>

                {/* 24/7 Helpline Card */}
                <a
                  href="tel:+919985926666"
                  className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 font-medium text-xs transition-transform active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">24/7 Booking Helpline</div>
                      <div className="text-[10px] text-teal-700">+91 99859 26666</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-teal-800 text-white rounded-lg">Call</span>
                </a>

                {/* User Session Footer */}
                {user && user.isLoggedIn ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out ({user.name})</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Login or Register</span>
                  </button>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
