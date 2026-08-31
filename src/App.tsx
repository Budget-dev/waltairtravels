import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { FleetSection } from './components/FleetSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BookingModal } from './components/BookingModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { ManageBookingModal } from './components/ManageBookingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { SEOHead } from './components/SEOHead';
import { BackendTelemetryModal } from './components/BackendTelemetryModal';
import { AiTripPlannerModal } from './components/AiTripPlannerModal';

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

import { ServiceCategory, TripSubType, Booking, TourPackage, AppUser } from './types';
import { db, auth, onAuthStateChanged, signOut, collection, getDocs, onSnapshot, query, orderBy } from './firebase';

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
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
        'cancellation-policy', 'privacy-policy', 'terms-and-conditions'
      ];
      if (validPages.includes(hash)) return hash;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);

  const PAGE_METADATA: Record<string, { title: string; description: string; keywords?: string[] }> = {
    "home": {
        "title": "Waltair Travels – Taxi & Cab Service in Visakhapatnam (Vizag) – Airport, Outstation & Local",
        "description": "Waltair Travels provides reliable 24/7 taxi services in Visakhapatnam (Vizag). Book airport transfers, city cabs, and outstation journeys with fixed fares. Trusted local drivers and transparent pricing – call us now.",
        "keywords": ["taxi Vizag", "Visakhapatnam taxi service", "cab service Vizag", "taxi in Visakhapatnam", "Vizag cab", "taxi near me Vizag", "best taxi in Visakhapatnam", "cheap taxi service Vizag"]
    },
    "about-us": {
        "title": "About Waltair Travels | Our Journey in Vizag",
        "description": "Learn about our 25-year history of providing reliable transport, outstation, and airport taxi services in Visakhapatnam."
    },
    "services": {
        "title": "Our Premium Transport Services in Visakhapatnam",
        "description": "Explore our range of services including airport transfers, corporate rentals, and outstation trips from Vizag."
    },
    "outstation": {
        "title": "Outstation Taxi from Visakhapatnam – Trips to Hyderabad, Chennai… – Waltair Travels",
        "description": "Book one-way or round-trip outstation cabs from Vizag to Hyderabad, Chennai, Vijayawada and more. Waltair Travels offers comfortable cars at ₹10–12/km, no hidden charges. Reserve your Vizag to outstation taxi now.",
        "keywords": ["Outstation taxi Vizag", "outstation cabs in Visakhapatnam", "Vizag to Araku Valley taxi", "Visakhapatnam outstation taxi"]
    },
    "packages": {
        "title": "Tour Packages | Araku, Lambasingi & More",
        "description": "Discover beautiful destinations with our curated tour packages from Visakhapatnam."
    },
    "travel-blog": {
        "title": "Travel Blog | Tips & Destinations in Andhra Pradesh",
        "description": "Read our travel guides, tips, and insights for visiting Andhra Pradesh and exploring Vizag by cab."
    },
    "contact-us": {
        "title": "Contact Us | 24/7 Taxi Support Vizag",
        "description": "Get in touch with Waltair Travels for bookings, inquiries, and customer support for all your Visakhapatnam cab needs."
    },
    "airport-taxi": {
        "title": "Visakhapatnam Airport Taxi – Waltair Travels (VTZ Transfers)",
        "description": "Need a cab to VTZ Airport? Waltair Travels offers punctual Visakhapatnam airport pick-up and drop services. Fixed rates, 24/7 availability, experienced drivers – book your Vizag airport taxi online.",
        "keywords": ["Visakhapatnam airport taxi", "Vizag airport cab", "airport transfers Vizag"]
    },
    "outstation-cabs": {
        "title": "Outstation Cabs from Visakhapatnam – Round Trips & One Way Drops",
        "description": "Book one-way or round-trip outstation cabs from Vizag to Hyderabad, Chennai, Vijayawada and more. Waltair Travels offers comfortable cars at ₹10–12/km, no hidden charges. Reserve your Vizag to outstation taxi now.",
        "keywords": ["Outstation taxi Vizag", "outstation cabs in Visakhapatnam", "Vizag to Araku Valley taxi", "Visakhapatnam outstation taxi"]
    },
    "local-rentals": {
        "title": "Visakhapatnam Local Taxi & Hourly Hire – City Tours – Waltair Travels",
        "description": "Explore Vizag your way with Waltair’s local cab services. Hire a taxi by the hour for city sightseeing, airport shuttles, or daily errands. Professional drivers, easy booking – get around Visakhapatnam hassle-free.",
        "keywords": ["hourly cab hire Vizag", "Visakhapatnam local taxi", "hourly taxi hire Visakhapatnam", "Vizag local cab"]
    },
    "one-way-trips": {
        "title": "One-Way Taxi Drops from Visakhapatnam",
        "description": "Affordable one-way taxi drops to major cities and towns from Vizag."
    },
    "round-trips": {
        "title": "Round Trip Cab Services from Vizag",
        "description": "Comfortable round-trip taxi services for family and corporate travel out of Visakhapatnam."
    },
    "help-center": {
        "title": "Help Center & Support | Waltair Travels",
        "description": "Find answers to common questions and get support for your Vizag taxi bookings."
    },
    "faqs": {
        "title": "Frequently Asked Questions | Visakhapatnam Cab Rates",
        "description": "Answers to frequently asked questions about our cab services, including Visakhapatnam taxi fares, airport rates, and outstation policies.",
        "keywords": ["Visakhapatnam taxi fares", "Visakhapatnam cab rates", "taxi price in vizag"]
    },
    "cancellation-policy": {
        "title": "Cancellation & Refund Policy",
        "description": "Read our flexible cancellation and refund policies."
    },
    "privacy-policy": {
        "title": "Privacy Policy",
        "description": "How we protect your personal information and data."
    },
    "terms-and-conditions": {
        "title": "Terms and Conditions",
        "description": "Terms of service for using Waltair Travels."
    }
};
  const currentMetadata = PAGE_METADATA[currentPage] || PAGE_METADATA['home'];

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
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingInitialData, setBookingInitialData] = useState<{
    serviceType: ServiceCategory;
    subType: TripSubType;
    pickupLocation: string;
    dropoffLocation: string;
    travelDate: string;
    pickupTime: string;
    phone?: string;
    preSelectedVehicleId?: string;
  } | null>(null);

  const [isTrackOpen, setIsTrackOpen] = useState<boolean>(false);
  const [trackRefQuery, setTrackRefQuery] = useState<string>('');
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
          vehicleName: 'Prime Sedan (Dzire / Etios)',
          estimatedDistanceKm: 42,
          baseFare: 650,
          distanceFare: 378,
          tollCharges: 140,
          gstAmount: 58,
          totalFare: 1226,
          paymentMethod: 'cash_to_driver',
          status: 'on_the_way',
          driver: {
            name: 'K. Satish Varma',
            phone: '+91 98480 23456',
            vehicleNumber: 'AP 31 TH 7842',
            vehicleModel: 'Toyota Etios (White)',
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
      localStorage.setItem('waltair_user_bookings', JSON.stringify(combined));
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
          localStorage.setItem('waltair_user_bookings', JSON.stringify(combined));
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
  }) => {
    setBookingInitialData({
      ...bookingData,
      phone: bookingData.phone || user?.phone
    });
    setIsBookingOpen(true);
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
    setIsBookingOpen(true);
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
    setIsBookingOpen(true);
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
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setAllBookings(prev => {
      const updated = [newBooking, ...prev.filter(b => b.bookingRef !== newBooking.bookingRef)];
      localStorage.setItem('waltair_user_bookings', JSON.stringify(updated));
      return updated;
    });
    setToastMessage(`Your booking (${newBooking.bookingRef}) has been confirmed successfully!`);
    setIsToastOpen(true);
  };

  const handleOpenLiveTrack = (bookingRef: string) => {
    setTrackRefQuery(bookingRef);
    setIsTrackOpen(true);
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
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden relative bg-slate-950 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      <SEOHead title={currentMetadata.title} description={currentMetadata.description} keywords={currentMetadata.keywords} />
      
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
          setIsBookingOpen(true);
        }}
        onOpenTrackTrip={() => {
          setTrackRefQuery(allBookings.length > 0 ? allBookings[0].bookingRef : '');
          setIsTrackOpen(true);
        }}
        onOpenManageTrips={() => setIsManageOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* 2. Main Body Content (Home view or Dedicated TSX SEO Page) */}
      <main className="overflow-x-hidden">
        <div
          key={currentPage}
          className="transition-opacity duration-300 ease-out animate-in fade-in"
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
                    setIsBookingOpen(true);
                  }}
                />

                <FleetSection onBookVehicle={handleBookVehicle} condensed={true} />
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
                  setIsBookingOpen(true);
                }}
              />
            )}

            {currentPage === 'services' && (
              <OurServicesPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'outstation' && (
              <OutstationPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onBookRoute={handleBookRoute}
              />
            )}

            {currentPage === 'packages' && (
              <PackagesPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onBookPackage={handleBookPackage}
              />
            )}

            {currentPage === 'travel-blog' && (
              <TravelBlogPage
                currentUser={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            )}

            {currentPage === 'contact-us' && (
              <ContactUsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
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
                  setIsBookingOpen(true);
                }}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'outstation-cabs' && (
              <OutstationCabsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
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
                  setIsBookingOpen(true);
                }}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'one-way-trips' && (
              <OneWayTripsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'round-trips' && (
              <RoundTripsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'help-center' && (
              <HelpCenterPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'faqs' && (
              <FaqsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'cancellation-policy' && (
              <CancellationPolicyPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'privacy-policy' && (
              <PrivacyPolicyPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {currentPage === 'terms-and-conditions' && (
              <TermsConditionsPage
                onNavigateHome={() => navigateToPage('home')}
                onOpenBooking={() => setIsBookingOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}
        </div>
      </main>

      {/* 3. Footer Matching Screenshot Layout */}
      <Footer onNavigatePage={navigateToPage} />

      {/* 11. Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* MODALS */}

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialData={bookingInitialData}
        currentCity={currentCity}
        onBookingSuccess={handleBookingSuccess}
        onOpenLiveTrack={handleOpenLiveTrack}
      />

      {/* Live GPS Tracking Simulator */}
      <LiveTrackingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        bookingRefQuery={trackRefQuery}
        allBookings={allBookings}
      />

      {/* Manage Trips & Invoices Portal */}
      <ManageBookingModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        allBookings={allBookings}
        onOpenLiveTrack={handleOpenLiveTrack}
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
          setIsBookingOpen(true);
        }}
      />

      <Toast 
        isVisible={isToastOpen} 
        message={toastMessage} 
        onClose={() => setIsToastOpen(false)} 
      />
    </div>
  );
}
