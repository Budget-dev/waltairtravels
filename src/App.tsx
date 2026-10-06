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
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthModal } from './components/AuthModal';
import { BackendTelemetryModal } from './components/BackendTelemetryModal';
import { AiTripPlannerModal } from './components/AiTripPlannerModal';
import { FastBookingBar } from './components/FastBookingBar';

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

import { ServiceCategory, TripSubType, Booking, TourPackage, AppUser } from './types';
import { db, auth, onAuthStateChanged, signOut, collection, getDocs, onSnapshot, query, orderBy } from './firebase';

export default function App() {
  const [currentCity, setCurrentCity] = useState<string>('Visakhapatnam, IN');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Page Routing State (e.g., 'home', 'about-us', 'airport-taxi', etc.)
  const getInitialPage = (): string => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validPages = [
        'home', 'about-us', 'services', 'outstation', 'packages', 'travel-blog',
        'contact-us', 'airport-taxi', 'outstation-cabs', 'local-rentals',
        'one-way-trips', 'round-trips', 'help-center', 'faqs',
        'cancellation-policy', 'privacy-policy', 'terms-and-conditions', 'booking'
      ];
      if (validPages.includes(hash)) return hash;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with browser back/forward buttons and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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
          localStorage.setItem('waltair_user_session', JSON.stringify(appUser));
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Auth state listener init note:', e);
    }
  }, []);

  // Fetch / Listen to Firestore Bookings in Real-time
  const fetchBookings = async () => {
    try {
      const q = collection(db, 'bookings');
      const snapshot = await getDocs(q);
      const items: Booking[] = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() } as Booking);
      });

      // Also combine with local bookings if any
      const local = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
      const combined = [...items, ...local.filter((l: Booking) => !items.some(i => i.bookingRef === l.bookingRef))];
      
      // If completely empty on first launch, seed a sample airport booking so tracking immediately works
      if (combined.length === 0) {
        const seedSample: Booking = {
          id: 'seed-1',
          bookingRef: 'WAL-84920',
          customerName: 'Suresh Varma',
          customerPhone: '9848012345',
          customerEmail: 'suresh.varma@example.com',
          serviceType: 'airport',
          subType: 'pickup',
          pickupLocation: 'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
          dropoffLocation: 'Siripuram Circle & Waltair Uplands, Visakhapatnam',
          travelDate: new Date().toISOString().split('T')[0],
          pickupTime: '11:00',
          vehicleCategory: 'Sedan',
          vehicleName: 'Maruti Suzuki Dzire',
          estimatedDistanceKm: 42,
          baseFare: 550,
          distanceFare: 351,
          tollCharges: 140,
          gstAmount: 52,
          totalFare: 1093,
          paymentMethod: 'cash_to_driver',
          status: 'on_the_way',
          driver: {
            name: 'K. Satish Varma',
            phone: '+91 98480 23456',
            vehicleNumber: 'AP 31 TH 7842',
            vehicleModel: 'Maruti Suzuki Dzire (White)',
            rating: 4.9,
            totalTrips: 1420,
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            currentLat: 17.729,
            currentLng: 83.310,
            etaMinutes: 8
          },
          otp: '4821',
          createdAt: new Date().toISOString(),
          city: 'Visakhapatnam, IN'
        };
        combined.push(seedSample);
      }

      setAllBookings(combined);
    } catch (err) {
      console.warn('Firestore fetch fallback:', err);
      const local = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
      setAllBookings(local);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Set up real-time listener if available
    try {
      const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        const items: Booking[] = [];
        snapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() } as Booking);
        });
        const local = JSON.parse(localStorage.getItem('waltair_user_bookings') || '[]');
        const combined = [...items, ...local.filter((l: Booking) => !items.some(i => i.bookingRef === l.bookingRef))];
        if (combined.length > 0) {
          setAllBookings(combined);
        }
      }, (err) => {
        console.warn('Snapshot listener info:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      // ignore
    }
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
    setAllBookings(prev => [newBooking, ...prev.filter(b => b.bookingRef !== newBooking.bookingRef)]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out info:', e);
    }
    localStorage.removeItem('waltair_user_session');
    setUser(null);
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden relative bg-slate-50 text-slate-900 font-sans">
      <a href="#main-content" className="skip-link">Skip to content</a>

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
        onOpenAdmin={() => setIsAdminOpen(true)}
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
        </div>
      </main>

      {/* 3. Footer Matching Screenshot Layout */}
      <Footer onNavigatePage={navigateToPage} />

      {/* 11. Floating WhatsApp Button */}
      <WhatsAppButton offsetForMobileCta={currentPage !== 'home'} />

      {/* 12. Floating Express 10-Second Quick-Booking Bar */}
      <FastBookingBar
        currentCity={currentCity}
        currentPage={currentPage}
        onInitiateBooking={handleInitiateBooking}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* MODALS */}

      {/* Booking History & My Bookings Portal */}
      <ManageBookingModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        allBookings={allBookings}
        onBookingUpdated={fetchBookings}
      />

      {/* Operations Admin Dashboard */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allBookings={allBookings}
        onRefresh={fetchBookings}
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
