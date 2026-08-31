import React, { useState } from 'react';
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
  Sparkles,
  ChevronRight,
  Shield,
  HelpCircle,
  Activity,
  Server
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          id="brand-logo-link"
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0 min-w-0"
        >
          {/* Stylized W Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 flex items-center justify-center shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform shrink-0">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8 L9 24 L14 12 L18 24 L23 8 L28 20" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center">
              <span>Waltair</span>
              <span className="text-cyan-700 ml-1 sm:ml-1.5 font-extrabold">Travels</span>
            </div>
            <span className="text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-400 -mt-0.5 sm:-mt-1 hidden xs:block">
              Visakhapatnam Cabs
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[15px] font-medium text-slate-700">
          <button 
            onClick={() => handleNav('home')}
            className={`relative px-3 py-2 transition-colors group cursor-pointer ${
              currentPage === 'home' ? 'text-cyan-700 font-semibold' : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50 rounded-lg'
            }`}
          >
            Home
            {currentPage === 'home' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-700 rounded-full"></span>
            )}
          </button>

          <button 
            onClick={() => handleNav('about-us')}
            className={`px-3 py-2 transition-colors cursor-pointer rounded-lg ${
              currentPage === 'about-us' ? 'text-cyan-700 font-bold bg-cyan-50' : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            }`}
          >
            About Us
          </button>

          {/* Services Dropdown */}
          <div className="relative">
            <button 
              id="services-dropdown-btn"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              onMouseEnter={() => setIsServicesOpen(true)}
              className={`px-3 py-2 transition-colors rounded-lg flex items-center gap-1 cursor-pointer ${
                ['services', 'airport-taxi', 'outstation-cabs', 'local-rentals', 'one-way-trips', 'round-trips'].includes(currentPage)
                  ? 'text-cyan-700 font-bold bg-cyan-50'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
              }`}
            >
              Services
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-cyan-700' : ''}`} />
            </button>

            {isServicesOpen && (
              <div 
                onMouseLeave={() => setIsServicesOpen(false)}
                className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50"
              >
                <button 
                  onClick={() => handleNav('airport-taxi')}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-cyan-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-cyan-100 text-cyan-800">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Airport Taxi</div>
                    <div className="text-xs text-slate-500">Bhogapuram & VTZ pickups</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleNav('outstation-cabs')}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-cyan-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Outstation Cabs</div>
                    <div className="text-xs text-slate-500">One-way & roundtrips</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleNav('local-rentals')}
                  className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-cyan-50 text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Local Hourly Rentals</div>
                    <div className="text-xs text-slate-500">4hr, 8hr & 12hr city packages</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleNav('services')}
                  className="w-full text-left pt-2 pb-1 px-2.5 text-xs text-cyan-700 font-bold hover:underline border-t border-slate-100 mt-1 cursor-pointer"
                >
                  View All Services Overview →
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNav('outstation')}
            className={`px-3 py-2 transition-colors cursor-pointer rounded-lg ${
              currentPage === 'outstation' ? 'text-cyan-700 font-bold bg-cyan-50' : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            }`}
          >
            Outstation
          </button>

          <button 
            onClick={() => handleNav('packages')}
            className={`px-3 py-2 transition-colors cursor-pointer rounded-lg ${
              currentPage === 'packages' ? 'text-cyan-700 font-bold bg-cyan-50' : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            }`}
          >
            Packages
          </button>

          <button 
            onClick={() => handleNav('travel-blog')}
            className={`px-3 py-2 transition-colors cursor-pointer rounded-lg flex items-center gap-1.5 font-semibold ${
              currentPage === 'travel-blog' ? 'text-cyan-800 font-bold bg-cyan-50' : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog</span>
          </button>

          <button 
            onClick={() => handleNav('contact-us')}
            className={`px-3 py-2 transition-colors cursor-pointer rounded-lg ${
              currentPage === 'contact-us' ? 'text-cyan-700 font-bold bg-cyan-50' : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-50'
            }`}
          >
            Contact Us
          </button>

          <button
            onClick={onOpenTrackTrip}
            className="px-3 py-2 text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[14px]"
          >
            <Compass className="w-4 h-4" />
            <span>Track Ride</span>
          </button>

          {onOpenAiPlanner && (
            <button
              onClick={onOpenAiPlanner}
              className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200/80 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
              title="AI Trip Itinerary & Quote Generator"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
              <span>AI Planner</span>
            </button>
          )}

          {onOpenTelemetry && (
            <button
              onClick={onOpenTelemetry}
              className="p-2 text-slate-500 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="View 25-Year System Architecture & Live Telemetry"
              aria-label="System Telemetry"
            >
              <Activity className="w-4 h-4" />
            </button>
          )}
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* City Selector Pill (Desktop / Tablet view) */}
          <div className="relative hidden md:block">
            <button
              id="city-selector-btn"
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-700" />
              <span className="truncate max-w-[120px] sm:max-w-none">{currentCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCityMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50">
                <div className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Available Service Cities
                </div>
                {CITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c.name);
                      setIsCityMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-colors ${
                      currentCity === c.name ? 'bg-cyan-50 text-cyan-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.label}</span>
                    {currentCity === c.name && <span className="text-cyan-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              id="notif-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 sm:p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-700 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="fixed top-[60px] left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] sm:absolute sm:top-auto sm:left-auto sm:translate-x-0 sm:right-0 mt-1 sm:mt-2 sm:w-96 origin-top bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-700" />
                    Trip Updates & Offers
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-cyan-700 hover:underline font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 rounded-xl text-xs transition-colors ${
                        n.read ? 'bg-slate-50 text-slate-600' : 'bg-cyan-50/60 border border-cyan-100 text-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 mb-1 flex justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-600">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Login / Sign Up / My Account Button */}
          {user && user.isLoggedIn ? (
            <div className="relative">
              <button 
                id="user-profile-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-medium text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email || user.phone || 'Verified Rider'}</div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenManageTrips();
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-cyan-700" />
                      <span>My Bookings & Invoices</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleNav('travel-blog');
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-teal-700" />
                      <span>Travel Blog & Stories</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="login-signup-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1 sm:gap-2 bg-[#005a66] hover:bg-[#004852] text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-teal-900/10 hover:shadow-lg transition-all cursor-pointer shrink-0"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Login</span>
              <span className="hidden sm:inline">/ Sign Up</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Sidebar with Backdrop Overlay */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dark Backdrop Overlay */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          aria-label="Close sidebar backdrop"
        />

        {/* Slide-in Sidebar Panel from the Right */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-10 overflow-hidden transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-[#005a66] to-slate-900 text-white flex items-center justify-between border-b border-teal-800/40 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Sparkles className="w-4 h-4" />
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
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* City Selector Box */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-700" />
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
                        ? 'bg-cyan-700 text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{c.label}</span>
                    {currentCity === c.name && <CheckCircle className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Navigation Links */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Menu Navigation
              </div>

              {[
                { id: 'home', label: 'Home', icon: Car },
                { id: 'services', label: 'Our Services', icon: Sparkles },
                { id: 'airport-taxi', label: 'Airport Taxi (ASI Bhogapuram)', icon: Plane },
                { id: 'outstation', label: 'Outstation Cabs', icon: Compass },
                { id: 'local-rentals', label: 'Local Hourly Rentals', icon: Clock },
                { id: 'packages', label: 'Holiday Packages (Araku & Lambasingi)', icon: Sparkles },
                { id: 'travel-blog', label: 'Travel Blog & Guides', icon: BookOpen },
                { id: 'about-us', label: 'About Us', icon: Shield },
                { id: 'contact-us', label: 'Contact Us & Help', icon: HelpCircle }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-all active:scale-98 cursor-pointer ${
                      isActive 
                        ? 'text-cyan-800 font-bold bg-cyan-50 border border-cyan-200/80 shadow-xs' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-cyan-700' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-700' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Utility Tools */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                Quick Actions
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenTrackTrip();
                  }}
                  className="px-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4 text-cyan-700" />
                  <span>Track Ride</span>
                </button>
                {onOpenAiPlanner && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAiPlanner();
                    }}
                    className="px-2 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-semibold text-[11px] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 border border-cyan-200"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-700" />
                    <span>AI Planner</span>
                  </button>
                )}
                {onOpenTelemetry && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenTelemetry();
                    }}
                    className="px-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                  >
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Telemetry</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenManageTrips();
                  }}
                  className="px-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <Car className="w-4 h-4 text-cyan-700" />
                  <span>My Trips</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="px-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-700" />
                  <span>Fleet Admin</span>
                </button>
              </div>
            </div>

            {/* Instant Helpline Call */}
            <a
              href="tel:+919985926666"
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-900 font-medium text-xs transition-transform active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">24/7 Booking Helpline</div>
                  <div className="text-[10px] text-teal-700">+91 99859 26666</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-teal-600 text-white rounded-lg">Call</span>
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
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer active:scale-98"
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
                className="w-full py-2.5 rounded-xl bg-[#005a66] hover:bg-[#004751] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer active:scale-98"
              >
                <User className="w-4 h-4" />
                <span>Login or Register</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
