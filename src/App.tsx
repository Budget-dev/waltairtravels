import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { FleetSection } from './components/FleetSection';
import { PopularRoutesAndPackages } from './components/PopularRoutesAndPackages';
import { AboutSection } from './components/AboutSection';
import { BlogSection } from './components/BlogSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ManageBookingModal } from './components/ManageBookingModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { BackendTelemetryModal } from './components/BackendTelemetryModal';
import { AiTripPlannerModal } from './components/AiTripPlannerModal';
import { TravelSplashScreen } from './components/TravelSplashScreen';

// Dedicated SEO Pages
import { AboutUsPage } from './pages/AboutUsPage';
import { OurServicesPage } from './pages/OurServicesPage';
import { OutstationPage } from './pages/OutstationPage';
import { PackagesPage } from './pages/PackagesPage';
import { TravelBlogPage } from './pages/TravelBlogPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { AirportTaxiPage } from './pages/AirportTaxiPage';
import { OutstationCabsPage } from './pages/OutstationCabsPage';
import { LocalRentalsPage } from './pages/LocalRentalsPage';
import { OneWayTripsPage } from './pages/OneWayTripsPage';
import { RoundTripsPage } from './pages/RoundTripsPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { FaqsPage } from './pages/FaqsPage';
import { CancellationPolicyPage } from './pages/CancellationPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { BookingPage } from './pages/BookingPage';
import { VizagToArakuPage } from './pages/VizagToArakuPage';
import { SEOHead } from './components/SEOHead';
import { trackEvent } from './services/analyticsService';

import { ServiceCategory, TripSubType, Booking, TourPackage, AppUser } from './types';
import { db, auth, onAuthStateChanged, signOut, collection, getDocs, onSnapshot, query, orderBy, getRedirectResult } from './firebase';
import { syncFetchBookings, syncSaveBooking } from './services/dbSync';


export const PAGE_URL_MAP: Record<string, string> = {
  'home': '/',
  'airport-taxi': '/airport-taxi-vizag',
  'vizag-to-araku-cab': '/vizag-to-araku-cab',
  'outstation-cabs': '/outstation-cabs-vizag',
  'local-rentals': '/local-rentals-vizag',
  'packages': '/packages',
  'one-way-trips': '/one-way-trips',
  'round-trips': '/round-trips',
  'services': '/services',
  'outstation': '/outstation',
  'travel-blog': '/travel-blog',
  'about-us': '/about-us',
  'contact-us': '/contact-us',
  'faqs': '/faqs',
  'help-center': '/help-center',
  'cancellation-policy': '/cancellation-policy',
  'privacy-policy': '/privacy-policy',
  'terms-and-conditions': '/terms-and-conditions',
  'booking': '/booking',
  'admin': '/admin',
};

export const resolveRouteFromLocation = (): string => {
  if (typeof window === 'undefined') return 'home';

  // 1. Resolve from standard clean pathname first
  const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
  if (pathname) {
    if (pathname === 'airport-taxi-vizag' || pathname === 'airport-taxi') return 'airport-taxi';
    if (pathname === 'vizag-to-araku-cab' || pathname === 'araku-cab') return 'vizag-to-araku-cab';
    if (pathname === 'outstation-cabs-vizag' || pathname === 'outstation-cabs') return 'outstation-cabs';
    if (pathname === 'local-rentals-vizag' || pathname === 'local-rentals') return 'local-rentals';
    if (pathname === 'packages' || pathname === 'tour-packages') return 'packages';
    if (pathname === 'one-way-trips' || pathname === 'one-way-cabs-vizag') return 'one-way-trips';
    if (pathname === 'round-trips' || pathname === 'round-trip-cabs-vizag') return 'round-trips';
    if (pathname === 'services' || pathname === 'our-services' || pathname === 'cab-service-vizag') return 'services';
    if (pathname === 'outstation') return 'outstation';
    if (pathname === 'travel-blog' || pathname === 'blog') return 'travel-blog';
    if (pathname === 'about-us') return 'about-us';
    if (pathname === 'contact-us') return 'contact-us';
    if (pathname === 'faqs') return 'faqs';
    if (pathname === 'help-center') return 'help-center';
    if (pathname === 'cancellation-policy') return 'cancellation-policy';
    if (pathname === 'privacy-policy') return 'privacy-policy';
    if (pathname === 'terms-and-conditions') return 'terms-and-conditions';
    if (pathname === 'booking') return 'booking';
    if (pathname === 'admin') return 'admin';
  }

  // 2. Resolve from hash fallback second
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'airport-taxi-vizag') return 'airport-taxi';
    if (hash === 'vizag-to-araku-cab') return 'vizag-to-araku-cab';
    if (hash === 'outstation-cabs-vizag') return 'outstation-cabs';
    if (hash === 'local-rentals-vizag') return 'local-rentals';
    const validPages = [
      'home', 'about-us', 'services', 'outstation', 'packages', 'travel-blog',
      'contact-us', 'airport-taxi', 'vizag-to-araku-cab', 'outstation-cabs', 'local-rentals',
      'one-way-trips', 'round-trips', 'help-center', 'faqs',
      'cancellation-policy', 'privacy-policy', 'terms-and-conditions', 'booking', 'admin'
    ];
    if (validPages.includes(hash)) return hash;
  }

  return 'home';
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<string>('Visakhapatnam, IN');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Page Routing State (resolved from pathname or hash)
  const [currentPage, setCurrentPage] = useState<string>(resolveRouteFromLocation);

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    const targetPath = PAGE_URL_MAP[page] || `/${page}`;
    try {
      window.history.pushState(null, '', targetPath);
    } catch {
      window.location.hash = page;
    }
    trackEvent('page_view', { page, path: targetPath });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // First visit travel splash experience state (skipped on subsequent visits or direct /admin)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const hash = window.location.hash.replace('#', '');
    if (path === 'admin' || hash === 'admin') return false;
    try {
      const seen = sessionStorage.getItem('waltair_splash_viewed');
      return !seen;
    } catch {
      return false;
    }
  });

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('waltair_splash_viewed', 'true');
    } catch {}
    setShowSplash(false);
  };

  // Sync with browser back/forward buttons, pushState popstate, and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const resolved = resolveRouteFromLocation();
      setCurrentPage(resolved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  
  // Modals state
  const [bookingInitialData, setBookingInitialData] = useState<{
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone?: string;
    preSelectedVehicleId?: string;
    pickupCoords?: { lat?: number; lng?: number } | null;
    dropoffCoords?: { lat?: number; lng?: number } | null;
  } | null>(null);

  const [isManageOpen, setIsManageOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState<boolean>(false);

  // User session state
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('waltair_user_session');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.uid || parsed.email || parsed.name || parsed.phone)) {
        return {
          uid: parsed.uid || 'usr_' + Date.now(),
          name: parsed.name || parsed.displayName || 'Rider',
          email: parsed.email || null,
          phone: parsed.phone || undefined,
          photoURL: parsed.photoURL || null,
          isLoggedIn: parsed.isLoggedIn !== false,
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Listen to storage & custom auth changes across tabs and components
  useEffect(() => {
    const handleAuthSync = () => {
      try {
        const saved = localStorage.getItem('waltair_user_session');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.uid || parsed.email || parsed.name || parsed.phone)) {
            setUser({
              uid: parsed.uid || 'usr_' + Date.now(),
              name: parsed.name || parsed.displayName || 'Rider',
              email: parsed.email || null,
              phone: parsed.phone || undefined,
              photoURL: parsed.photoURL || null,
              isLoggedIn: parsed.isLoggedIn !== false,
            });
            return;
          }
        }
        setUser(null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleAuthSync);
    window.addEventListener('waltair_auth_change', handleAuthSync);
    return () => {
      window.removeEventListener('storage', handleAuthSync);
      window.removeEventListener('waltair_auth_change', handleAuthSync);
    };
  }, []);

  // Handle redirect result from Google OAuth redirect fallback
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const fbUser = result.user;
          const appUser: AppUser = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Rider',
            email: fbUser.email,
            phone: fbUser.phoneNumber || undefined,
            photoURL: fbUser.photoURL,
            isLoggedIn: true,
          };
          setUser(appUser);
          try {
            localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
            window.dispatchEvent(new Event('waltair_auth_change'));
          } catch (storageErr) {
            console.warn('Redirect storage note:', storageErr);
          }
          setIsAuthOpen(false);
        }
      })
      .catch((err) => {
        console.warn('Google redirect result note:', err);
      });
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const appUser: AppUser = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Rider',
            email: fbUser.email,
            phone: fbUser.phoneNumber || undefined,
            photoURL: fbUser.photoURL,
            isLoggedIn: true,
          };
          setUser(appUser);
          try {
            localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
            window.dispatchEvent(new Event('waltair_auth_change'));
          } catch (storageErr) {
            console.warn('Session save note:', storageErr);
          }
          setIsAuthOpen(false);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Auth state listener init note:', e);
    }
  }, []);

  // Fetch & Synchronize Bookings Multi-tier (Server DB + LocalStorage + Cloud Firestore)
  const fetchBookings = async () => {
    try {
      const list = await syncFetchBookings({
        email: user?.email || undefined,
        phone: user?.phone || undefined,
        userId: user?.uid || undefined,
      });
      setAllBookings(list);
    } catch (err) {
      console.warn('Sync fetch bookings note:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    
    // Listen to custom booking changes across components & tabs
    const handleBookingsChanged = () => {
      fetchBookings();
    };
    window.addEventListener('waltair_bookings_changed', handleBookingsChanged);
    window.addEventListener('storage', handleBookingsChanged);

    // Set up real-time listener if Firestore is connected
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(collection(db, 'bookings'), () => {
        fetchBookings();
      }, (err) => {
        console.debug('Bookings snapshot note:', err);
      });
    } catch (e) {
      // ignore
    }

    return () => {
      window.removeEventListener('waltair_bookings_changed', handleBookingsChanged);
      window.removeEventListener('storage', handleBookingsChanged);
      unsubscribe();
    };
  }, []);

  // Handlers from Hero
  const handleInitiateBooking = (bookingData: {
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone: string;
    pickupCoords?: { lat?: number; lng?: number } | null;
    dropoffCoords?: { lat?: number; lng?: number } | null;
  }) => {
    setBookingInitialData({
      ...bookingData,
      phone: bookingData.phone || user?.phone
    });
    navigateToPage('booking');
  };

  // Quick book vehicle from Fleet section
  const handleBookVehicle = (vehicleId: string) => {
    setBookingInitialData({
      serviceType: 'airport',
      subType: 'pickup',
      pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
      dropoffLocation: 'Visakhapatnam City Center',
      travelDate: new Date().toISOString().split('T')[0],
      pickupTime: '10:30',
      preSelectedVehicleId: vehicleId,
      phone: user?.phone
    });
    navigateToPage('booking');
  };

  // Quick book popular outstation route
  const handleBookRoute = (from: string, to: string) => {
    setBookingInitialData({
      serviceType: 'outstation',
      subType: 'oneway',
      pickupLocation: from,
      dropoffLocation: to,
      travelDate: new Date().toISOString().split('T')[0],
      pickupTime: '09:00',
      phone: user?.phone
    });
    navigateToPage('booking');
  };

  // Quick book holiday package
  const handleBookPackage = (pkg: TourPackage) => {
    setBookingInitialData({
      serviceType: 'packages',
      subType: 'package',
      pickupLocation: 'Visakhapatnam (Doorstep Pickup)',
      dropoffLocation: `${pkg.title} Sightseeing Tour`,
      travelDate: new Date().toISOString().split('T')[0],
      pickupTime: '07:00',
      phone: user?.phone
    });
    navigateToPage('booking');
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    syncSaveBooking(newBooking);
    setAllBookings(prev => [newBooking, ...prev.filter(b => b.bookingRef !== newBooking.bookingRef)]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out info:', e);
    }
    localStorage.removeItem('waltair_user_session');
    window.dispatchEvent(new Event('waltair_auth_change'));
    setUser(null);
  };

  // Dedicated Strict Admin Route (Independent of public UI)
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen w-full bg-slate-950 font-sans">
        <SEOHead
          title="Admin Portal | Waltair Travels & Cabs"
          description="Waltair Travels & Cabs administration and operations portal."
          canonicalPath="/admin"
        />
        <AdminPanel
          isOpen={true}
          onClose={() => navigateToPage('home')}
          allBookings={allBookings}
          onRefresh={fetchBookings}
          isFullPage={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden relative bg-slate-50 text-slate-900 font-sans">
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Elegant Travel Entrance Splash Screen */}
      {showSplash && <TravelSplashScreen onComplete={handleSplashComplete} />}

      {/* 1. Sticky Navigation Bar */}
      <Navbar
        currentCity={currentCity}
        currentPage={currentPage}
        onNavigatePage={navigateToPage}
        onSelectCity={(city) => setCurrentCity(city)}
        onOpenBooking={() => {
          setBookingInitialData({
            serviceType: 'airport',
            subType: 'pickup',
            pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
            dropoffLocation: 'Siripuram Circle, Visakhapatnam',
            travelDate: new Date().toISOString().split('T')[0],
            pickupTime: '10:30',
            phone: user?.phone
          });
          navigateToPage('booking');
        }}
        onOpenTrackTrip={() => setIsManageOpen(true)}
        onOpenManageTrips={() => setIsManageOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* 2. Main Body Content (Home view or Dedicated TSX SEO Page) */}
      <main id="main-content" className="overflow-x-hidden">
        <div
          key={currentPage}
          className="wt-page-enter"
        >
            {currentPage === 'home' && (
              <>
                <SEOHead
                  title="Waltair Cabs | Premier Taxi & Cab Service in Visakhapatnam (Vizag)"
                  description="Book verified cabs in Visakhapatnam with Waltair Cabs. 24/7 airport taxi to VTZ & Bhogapuram ASI, outstation rides to Araku, local hourly rentals, and zero surge pricing."
                  canonicalPath="/"
                  keywords={[
                    'cab service in vizag',
                    'taxi in visakhapatnam',
                    'vizag cabs',
                    'airport taxi vizag',
                    'bhogapuram airport cab',
                    'vizag to araku cab',
                    'outstation cab vizag',
                    'local cabs vizag',
                    'taxi near me vizag'
                  ]}
                  breadcrumbs={[{ name: 'Home', item: '/' }]}
                />
                <Hero
                  currentCity={currentCity}
                  onOpenCitySelector={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onInitiateBooking={handleInitiateBooking}
                />

                <ServicesSection
                  onSelectService={(service, subType) => {
                    setBookingInitialData({
                      serviceType: service,
                      subType: subType || (service === 'airport' ? 'pickup' : 'oneway'),
                      pickupLocation: service === 'airport' 
                        ? 'Alluri Sitharama Raju International Airport ASI , Bhogapuram' 
                        : 'Visakhapatnam City Center',
                      dropoffLocation: service === 'airport'
                        ? 'Visakhapatnam City Center'
                        : 'Araku Valley (Hill Station)',
                      travelDate: new Date().toISOString().split('T')[0],
                      pickupTime: '09:00',
                      phone: user?.phone
                    });
                    setCurrentPage('booking');
                  }}
                />

                <FleetSection onBookVehicle={handleBookVehicle} />

                <PopularRoutesAndPackages
                  onBookRoute={handleBookRoute}
                  onBookPackage={handleBookPackage}
                />

                <AboutSection />

                <BlogSection currentUser={user} onOpenAuth={() => setIsAuthOpen(true)} />

                <CustomerReviewsSection />

                <ContactSection />
              </>
            )}

            {currentPage === 'about-us' && (
              <AboutUsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => {
                  setBookingInitialData({
                    serviceType: 'airport',
                    subType: 'pickup',
                    pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
                    dropoffLocation: 'Visakhapatnam City Center',
                    travelDate: new Date().toISOString().split('T')[0],
                    pickupTime: '10:30',
                    phone: user?.phone
                  });
                  setCurrentPage('booking');
                }}
              />
            )}

            {currentPage === 'services' && (
              <OurServicesPage
                onNavigateHome={() => navigateToPage('home')}
                onSelectService={(service, subType) => {
                  setBookingInitialData({
                    serviceType: service,
                    subType: subType || (service === 'airport' ? 'pickup' : 'oneway'),
                    pickupLocation: service === 'airport'
                      ? 'Alluri Sitharama Raju International Airport ASI , Bhogapuram'
                      : 'Visakhapatnam City Center',
                    dropoffLocation: service === 'airport'
                      ? 'Visakhapatnam City Center'
                      : 'Araku Valley (Hill Station)',
                    travelDate: new Date().toISOString().split('T')[0],
                    pickupTime: '09:00',
                    phone: user?.phone
                  });
                  navigateToPage('booking');
                }}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'outstation' && (
              <OutstationPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onBookRoute={handleBookRoute}
              />
            )}

            {currentPage === 'packages' && (
              <PackagesPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onBookPackage={handleBookPackage}
              />
            )}

            {currentPage === 'travel-blog' && (
              <TravelBlogPage
                currentUser={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
              />
            )}

            {currentPage === 'contact-us' && (
              <ContactUsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
              />
            )}

            {currentPage === 'airport-taxi' && (
              <AirportTaxiPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => {
                  setBookingInitialData({
                    serviceType: 'airport',
                    subType: 'pickup',
                    pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
                    dropoffLocation: 'Siripuram Circle, Visakhapatnam',
                    travelDate: new Date().toISOString().split('T')[0],
                    pickupTime: '10:30',
                    phone: user?.phone
                  });
                  setCurrentPage('booking');
                }}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'outstation-cabs' && (
              <OutstationCabsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'vizag-to-araku-cab' && (
              <VizagToArakuPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => {
                  setBookingInitialData({
                    serviceType: 'outstation',
                    subType: 'roundtrip',
                    pickupLocation: 'Visakhapatnam City Center',
                    dropoffLocation: 'Araku Valley & Borra Caves (Sightseeing Tour)',
                    travelDate: new Date().toISOString().split('T')[0],
                    pickupTime: '06:00',
                    phone: user?.phone
                  });
                  setCurrentPage('booking');
                }}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'local-rentals' && (
              <LocalRentalsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => {
                  setBookingInitialData({
                    serviceType: 'local',
                    subType: 'rental_8hr',
                    pickupLocation: 'Visakhapatnam City Center',
                    dropoffLocation: 'Local Visakhapatnam Sightseeing (8 Hrs / 80 KM)',
                    travelDate: new Date().toISOString().split('T')[0],
                    pickupTime: '09:00',
                    phone: user?.phone
                  });
                  setCurrentPage('booking');
                }}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'one-way-trips' && (
              <OneWayTripsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'round-trips' && (
              <RoundTripsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'help-center' && (
              <HelpCenterPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'faqs' && (
              <FaqsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'cancellation-policy' && (
              <CancellationPolicyPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'privacy-policy' && (
              <PrivacyPolicyPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'terms-and-conditions' && (
              <TermsConditionsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setCurrentPage('booking')}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'booking' && (
              <BookingPage
                onNavigateHome={() => navigateToPage('home')}
                initialData={bookingInitialData}
                currentCity={currentCity}
                onBookingSuccess={(booking) => {
                  handleBookingSuccess(booking);
                }}
                onOpenBookingHistory={() => setIsManageOpen(true)}
              />
            )}

            {/* End of Pages */}
        </div>
      </main>

      {/* 3. Footer Matching Screenshot Layout */}
      <Footer onNavigatePage={navigateToPage} />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* MODALS */}

      {/* Booking History & My Bookings Portal */}
      <ManageBookingModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        allBookings={allBookings}
        currentUser={user}
        onBookingUpdated={fetchBookings}
        onOpenBookingFlow={() => navigateToPage('booking')}
      />

      {/* Rider Login / Sign Up */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* 25-Year Principal Architecture & Telemetry Modal */}
      <BackendTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />

      {/* Server-Side Gemini AI Trip Planner */}
      <AiTripPlannerModal
        isOpen={isAiPlannerOpen}
        onClose={() => setIsAiPlannerOpen(false)}
        onSelectPlanAndBook={(dest, vehicle, fare) => {
          setBookingInitialData({
            serviceType: dest.toLowerCase().includes('airport') ? 'airport' : 'packages',
            subType: 'oneway',
            pickupLocation: 'Visakhapatnam City Center',
            dropoffLocation: dest,
            travelDate: new Date().toISOString().split('T')[0],
            pickupTime: '06:00',
            phone: user?.phone,
          });
          setCurrentPage('booking');
        }}
      />

    </div>
  );
}
