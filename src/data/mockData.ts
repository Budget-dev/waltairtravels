import { Vehicle, TourPackage, PopularRoute, CustomerReview, NotificationItem, BlogPost } from '../types';

export const CITIES = [
  { id: 'vizag', name: 'Visakhapatnam, IN', label: 'Visakhapatnam (Vizag)' },
  { id: 'vijayawada', name: 'Vijayawada, IN', label: 'Vijayawada' },
  { id: 'rajahmundry', name: 'Rajahmundry, IN', label: 'Rajahmundry' },
  { id: 'kakinada', name: 'Kakinada, IN', label: 'Kakinada' },
];

export const POPULAR_LOCATIONS = [
  'Alluri Sitharama Raju International Airport ASI , Bhogapuram',
  'Visakhapatnam International Airport (VTZ), NAD Junction',
  'Visakhapatnam Railway Station (Central)',
  'Siripuram Circle & Waltair Uplands',
  'MVP Colony & Sector 1-12',
  'Rushikonda IT Park & Beach Road',
  'Madhurawada & Yendada Hill View',
  'Gajuwaka & Steel Plant Township',
  'Dwaraka Nagar & Complex RTC Bus Stand',
  'RK Beach & Submarine Museum Road',
  'Kailasagiri Hilltop & Sea Viewpoint',
  'Simhachalam Temple Foothills',
  'Pendurthi Junction & VZM Highway',
  'Anakapalle Main Town',
  'Bheemili (Bheemunipatnam) Dutch Beach',
  'Araku Valley (Hill Station)',
  'Annavaram Satyanarayana Swamy Temple',
  'Vizianagaram Fort Town',
  'Srikakulam Arasavalli Sun Temple',
  'Kakinada Port & Smart City',
  'Rajahmundry Godavari Ghats',
  'Vijayawada Kanaka Durga Temple'
];

export const VEHICLE_FLEET: Vehicle[] = [
  {
    id: 'dzire',
    name: 'Maruti Suzuki Dzire',
    modelExamples: 'Swift Dzire (Sedan)',
    category: 'Sedan',
    image: 'https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.01%20AM.jpeg',
    seats: 4,
    luggageCount: 3,
    ac: true,
    ratePerKm: 13,
    baseFare: 550,
    baseKm: 15,
    extraKmRate: 13,
    popularFor: 'City rides, airport transfers & corporate travel',
    features: ['Clean & Sanitized', 'Chilled AC', '3 Large Bags Boot', 'Mobile Charging', 'Professional Chauffeur']
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga',
    modelExamples: 'Ertiga (6+1 Seater MPV)',
    category: 'MUV / MPV',
    image: 'https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.01%20AM%20(1).jpeg',
    seats: 6,
    luggageCount: 4,
    ac: true,
    ratePerKm: 17,
    baseFare: 900,
    baseKm: 20,
    extraKmRate: 17,
    popularFor: 'Family trips, outstation tours, Bhogapuram airport & group travel',
    features: ['6+1 Passenger Seating', 'Roof AC Vents', 'Luggage Carrier Available', 'High Ground Clearance', 'Smooth Highway Ride']
  },
  {
    id: 'aura',
    name: 'Hyundai Aura',
    modelExamples: 'Hyundai Aura (Prime Sedan)',
    category: 'Sedan',
    image: 'https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.01%20AM%20(2).jpeg',
    seats: 4,
    luggageCount: 3,
    ac: true,
    ratePerKm: 13,
    baseFare: 550,
    baseKm: 15,
    extraKmRate: 13,
    popularFor: 'City errands, office commute, station & airport pickup',
    features: ['Spacious Cabin', 'Smooth Suspension', 'Rear AC Vents', 'Generous Boot Space', 'Commercial Permit']
  },
  {
    id: 'carens',
    name: 'Kia Carens',
    modelExamples: 'Kia Carens (Premium 6+1 Seater)',
    category: 'Premium MPV',
    image: 'https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.02%20AM.jpeg',
    seats: 6,
    luggageCount: 4,
    ac: true,
    ratePerKm: 19,
    baseFare: 1100,
    baseKm: 20,
    extraKmRate: 19,
    popularFor: 'Executive group trips, wedding transit & long distance outstation',
    features: ['One-Touch Tumble Seats', 'All-Row AC Vents', 'Plush Leatherette Seating', 'Quiet Cabin', 'USB Ports in All Rows']
  },
  {
    id: 'fronx',
    name: 'Maruti Suzuki Fronx',
    modelExamples: 'Fronx Smart Crossover / Compact SUV',
    category: 'Crossover',
    image: 'https://waltairtravelsandcabs.sirv.com/ChatGPT%20Image%20Sep%2017%2C%202026%2C%2004_59_49%20PM.png',
    seats: 4,
    luggageCount: 3,
    ac: true,
    ratePerKm: 15,
    baseFare: 700,
    baseKm: 15,
    extraKmRate: 15,
    popularFor: 'Highway trips, beach road cruising & stylish city transit',
    features: ['High Ground Clearance', 'Modern Turbo Comfort', 'Spacious Legroom', 'Fast USB-C Charging', 'Roof Rails']
  },
  {
    id: 'crysta',
    name: 'Toyota Innova Crysta',
    modelExamples: 'Innova Crysta (7+1 Seater Luxury)',
    category: 'Luxury MPV',
    image: 'https://waltairtravelsandcabs.sirv.com/WhatsApp%20Image%202026-09-17%20at%2010.56.01%20AM%20(3).jpeg',
    seats: 7,
    luggageCount: 5,
    ac: true,
    ratePerKm: 23,
    baseFare: 1400,
    baseKm: 25,
    extraKmRate: 23,
    popularFor: 'VIP airport pickup, corporate delegations & Araku hill station',
    features: ['Captain Reclining Seats', 'Dual Zone Climate AC', 'Unmatched Highway Comfort', 'Overhead Carrier', 'Top Tier Chauffeur']
  }
];

export const VEHICLES: Vehicle[] = VEHICLE_FLEET;

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'araku-borra-caves',
    title: 'Araku Valley & Borra Caves Scenic Explorer',
    subtitle: 'Misty hills, coffee plantations, waterfalls & 1-million-year-old caves',
    duration: 'Full Day (12-14 Hours)',
    distance: '240 km Roundtrip',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 342,
    highlights: ['Borra Caves Stalactite Wonders', 'Katiki Waterfalls Trek', 'Padmapuram Botanical Gardens', 'Tribal Museum & Coffee House', 'Ananthagiri Hills Coffee Viewpoints'],
    itinerary: [
      '06:30 AM: Pickup from Vizag hotel/home',
      '08:30 AM: Scenic ghat road breakfast break at Tyda',
      '10:00 AM: Guided tour of million-year-old Borra Caves',
      '12:30 PM: Katiki Waterfalls jeep & trek (Optional)',
      '01:30 PM: Authentic bamboo chicken & Andhra lunch in Araku',
      '03:00 PM: Padmapuram Gardens & Araku Coffee Museum',
      '05:00 PM: Sunset view at Galikonda viewpoint',
      '08:30 PM: Return drop at your doorstep in Visakhapatnam'
    ],
    vehicleIncluded: 'Sedan / SUV / Innova as selected',
    category: 'hills'
  },
  {
    id: 'vizag-city-coastal',
    title: 'Vizag Coastal City & Heritage Grand Tour',
    subtitle: 'Rishikonda beach, submarine museum, aircraft museum, Kailasagiri & Thotlakonda',
    duration: '8 Hours (80 km)',
    distance: '80 km Included',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 512,
    highlights: ['INS Kursura Real Submarine Museum', 'TU-142 Aircraft War Museum', 'Kailasagiri Ropeway & Shiva Parvathi Statues', 'Rishikonda Blue Flag Beach', 'Thotlakonda Ancient Buddhist Heritage'],
    itinerary: [
      '09:00 AM: Home/hotel pickup anywhere in Vizag',
      '09:30 AM: Kailasagiri Hilltop panoramic bay view & ropeway',
      '11:30 AM: TU-142 Aircraft Museum & Kursura Submarine Museum',
      '01:30 PM: Coastal sea-facing lunch on Beach Road',
      '03:00 PM: Thotlakonda / Bavikonda Buddhist Monastery ruins',
      '04:30 PM: Rishikonda Beach water sports & sunset stroll',
      '06:30 PM: Drop back at your location'
    ],
    vehicleIncluded: 'AC Sedan or SUV',
    category: 'beaches'
  },
  {
    id: 'simhachalam-annavaram',
    title: 'Sacred Temple Circuit (Simhachalam & Annavaram)',
    subtitle: 'Divine darshan of Lord Varaha Lakshmi Narasimha & Sri Satyanarayana Swamy',
    duration: '10 Hours',
    distance: '260 km Roundtrip',
    price: 3799,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 220,
    highlights: ['Simhachalam 11th-century Kalinga architecture', 'Annavaram Ratnagiri Hilltop Temple', 'Pampa River Ghats', 'Special Darshan assistance coordination', 'Experienced devout driver'],
    itinerary: [
      '06:00 AM: Early morning pickup from Vizag',
      '07:00 AM: Simhachalam Temple Darshan & Chandanotsavam shrine',
      '09:30 AM: Highway drive towards Annavaram with breakfast break',
      '11:30 AM: Reach Ratnagiri Hills, Annavaram Satyanarayana Vratham & Darshan',
      '01:30 PM: Temple Prasadam & Andhra meal',
      '03:00 PM: Scenic coastal drive return',
      '06:00 PM: Comfortable drop at your residence'
    ],
    vehicleIncluded: 'AC Sedan / SUV',
    category: 'temples'
  },
  {
    id: 'lambasingi-misty-hills',
    title: 'Lambasingi "Kashmir of Andhra" Winter Tour',
    subtitle: 'Sub-zero morning mist, strawberry farms, Kothapalli waterfalls & apple orchards',
    duration: 'Full Day (14 Hours)',
    distance: '300 km Roundtrip',
    price: 4199,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 185,
    highlights: ['Morning dew & frost views', 'Kothapalli cascading waterfalls', 'Organic Strawberry fruit picking', 'Pine forest photo spots', 'Tribal night market'],
    itinerary: [
      '05:00 AM: Early departure to catch misty morning clouds',
      '08:00 AM: Reach Lambasingi Ghats, fog view & hot coffee',
      '09:30 AM: Visit fresh strawberry plantations & organic farms',
      '11:30 AM: Kothapalli Waterfalls hike & bamboo bridges',
      '02:00 PM: Traditional hill-station tribal lunch',
      '03:30 PM: Susan Garden yellow blossom fields (seasonal) & pine woods',
      '08:00 PM: Safe return to Visakhapatnam'
    ],
    vehicleIncluded: 'High-clearance SUV or Ertiga',
    category: 'hills'
  }
];

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'bhogapuram-vizag',
    from: 'Bhogapuram Int\'l Airport (ASI)',
    to: 'Vizag City Center / Siripuram',
    distance: '42 km',
    duration: '45 mins',
    startingPrice: 899,
    category: 'airport',
    description: 'Fast expressway connection with zero waiting charges on flight delays.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vizag-araku',
    from: 'Visakhapatnam',
    to: 'Araku Valley',
    distance: '115 km',
    duration: '3 hrs 15 mins',
    startingPrice: 2499,
    category: 'outstation',
    description: 'Breathtaking ghat road journey through Ananthagiri hills with expert drivers.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vizag-vijayawada',
    from: 'Visakhapatnam',
    to: 'Vijayawada',
    distance: '348 km',
    duration: '6 hrs 30 mins',
    startingPrice: 5200,
    category: 'outstation',
    description: 'Smooth NH16 highway ride with hygienic food stops and toll assistance.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vizag-rajahmundry',
    from: 'Visakhapatnam',
    to: 'Rajahmundry',
    distance: '190 km',
    duration: '3 hrs 45 mins',
    startingPrice: 3100,
    category: 'outstation',
    description: 'Fast door-to-door cab with comfortable sanitized sedans and SUVs.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vizag-srikakulam',
    from: 'Visakhapatnam',
    to: 'Srikakulam',
    distance: '105 km',
    duration: '2 hrs 15 mins',
    startingPrice: 1950,
    category: 'outstation',
    description: 'Reliable one-way or roundtrip transfers for business and pilgrimage.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vizag-kakinada',
    from: 'Visakhapatnam',
    to: 'Kakinada',
    distance: '152 km',
    duration: '3 hrs 10 mins',
    startingPrice: 2600,
    category: 'outstation',
    description: 'Comfortable commute to Kakinada port & industrial corridor.',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Suresh Varma K.',
    rating: 5,
    location: 'Siripuram, Vizag',
    serviceUsed: 'Bhogapuram Airport Drop',
    date: '2 days ago',
    comment: 'Booked Waltair Travels for my early 5:30 AM flight. Driver Satish arrived 15 minutes before time, sanitized cab, smooth expressway drive. No surge pricing like other apps. Truly top notch!',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-2',
    name: 'Dr. Ananya Reddy',
    rating: 5,
    location: 'MVP Colony, Vizag',
    serviceUsed: 'Araku Valley 2-Day Tour',
    date: '1 week ago',
    comment: 'Took the Innova Crysta for family trip with elderly parents. The driver was extremely polite, drove carefully on the hairpin bends, and showed us hidden scenic viewpoints. Great value for money!',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-3',
    name: 'Rohan Deshmukh',
    rating: 5,
    location: 'Rushikonda IT SEZ',
    serviceUsed: 'Outstation to Vijayawada',
    date: '2 weeks ago',
    comment: 'Corporate booking was seamless. Instant tax invoice received on WhatsApp & email, live GPS tracking shared with my office team, and super clean Dzire sedan. Highly recommended!',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'rev-4',
    name: 'Padma & Venkat Rao',
    rating: 5,
    location: 'Gajuwaka',
    serviceUsed: 'Simhachalam & Annavaram Darshan',
    date: '3 weeks ago',
    comment: 'Smooth and devotional trip. The driver knew exact temple timings, parking spots, and assisted our parents with wheelchairs. God bless Waltair Travels team!',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '✈️ Bhogapuram Airport Express',
    message: 'Fixed fare ₹899 for Bhogapuram International Airport pickups & drops with zero delay surcharges.',
    time: '10 mins ago',
    read: false,
    type: 'offer'
  },
  {
    id: 'notif-2',
    title: '🟢 24x7 Live Fleet Active',
    message: 'Over 140 cabs currently active across Visakhapatnam, Rushikonda, and Highway zones.',
    time: '1 hr ago',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-3',
    title: '⛰️ Araku Weekend Special',
    message: 'Get ₹300 OFF on Araku full-day Innova & SUV package bookings this weekend. Use code VIZAGHILL.',
    time: '5 hrs ago',
    read: true,
    type: 'offer'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'seed-blog-1',
    title: 'Complete Guide to Bhogapuram Airport (ASI) Transfers: Fares, Route & Timings',
    excerpt: 'Everything you need to know about reaching the upcoming Alluri Sitharama Raju International Airport with dedicated express cab bookings.',
    content: `The upcoming Bhogapuram International Airport (ASI) is set to become the premier aviation gateway for Andhra Pradesh. Located approximately 42 kilometers northeast of Visakhapatnam city center along NH-16, planning your airport commute in advance ensures a hassle-free trip.

### Why Pre-Booking Your Airport Cab Matters
1. **Distance & Travel Time:** The commute from Siripuram, Gajuwaka, or Rushikonda takes roughly 45 to 65 minutes depending on traffic. Pre-booking guarantees on-time doorstep pickup.
2. **Fixed Toll-Inclusive Pricing:** Waltair Travels offers transparent upfront pricing with zero surge charges and toll inclusions for the Tagarapuvalasa plaza.
3. **Flight Delay Adjustments:** Our dispatch team monitors incoming flight tracking so your chauffeur is stationed at the arrivals bay even if your flight lands ahead or behind schedule.

### Recommended Vehicle Classes
* **Sedan (Dzire / Etios):** Ideal for solo travelers and couples with up to 2 large suitcases.
* **Innova Crysta / SUV:** Perfect for families or business delegates carrying excess luggage.
* **12-Seater Tempo Traveller:** Best suited for corporate teams and wedding delegations.`,
    author: 'Suresh Varma',
    authorEmail: 'suresh@waltairtravels.com',
    date: '2025-05-10',
    category: 'Airport & Commute',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
    tags: ['Bhogapuram', 'Airport Taxi', 'Vizag Airport', 'Travel Tips']
  },
  {
    id: 'seed-blog-2',
    title: 'Top 7 Scenic Stops on the Vizag to Araku Valley Road Trip',
    excerpt: 'Discover breathtaking viewpoint highlights, coffee plantations, Borra Caves, and tribal eateries along the Eastern Ghats highway.',
    content: `A road trip from Visakhapatnam to Araku Valley is one of South India's most enchanting mountain drives. Spanning 115 km of scenic winding roads and lush coffee estates, here are the must-visit stops:

1. **Tyda Jungle Bells & Eco-Tourism:** An ideal morning refreshment pitstop surrounded by natural deciduous flora.
2. **Ananthagiri Hills Coffee Plantations:** Stop by organic tribal coffee stalls for freshly brewed world-renowned Araku Arabica coffee.
3. **Tatiguda & Katiki Waterfalls:** Off-road jeep routes or short hikes leading to cascading natural springs.
4. **Million-Year-Old Borra Caves:** Marvel at spectacular stalactite and stalagmite limestone formations illuminated by vibrant geological lighting.
5. **Padmapuram Botanical Gardens & Tree Tops:** Stroll through historic rose gardens and rare floral varieties planted during WWII.
6. **Tribal Museum & Dhimsa Dance:** Experience authentic indigenous lifestyle artifacts and interactive folk arts.
7. **Chaparai Water Cascades:** Relax by smoothed natural rock stream flows before your drive back.`,
    author: 'Ananya Reddy',
    authorEmail: 'ananya@waltairtravels.com',
    date: '2025-05-02',
    category: 'Sightseeing & Roadtrips',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    tags: ['Araku Valley', 'Road Trip', 'Borra Caves', 'Weekend Getaway']
  },
  {
    id: 'seed-blog-3',
    title: 'Lambasingi in Winter: Experiencing Andhra’s Sub-Zero Mist & Strawberry Farms',
    excerpt: 'A comprehensive travel itinerary for exploring the Kashmir of Andhra Pradesh with safe hilltop SUV rentals.',
    content: `Lambasingi, located at an elevation of 1,000 meters in Chintapalli mandal, transforms into a mystical winter wonderland between November and January.

### When to Visit
Early mornings between 5:30 AM and 8:00 AM offer the densest fog cover and temperatures dropping below 3°C.

### Top Attractions in Lambasingi
* **Susan Garden Blossom Fields:** Golden yellow mustard-style blossoms spread across rolling fields in winter.
* **Organic Strawberry Picking:** Visit local tribal farms where you can handpick fresh ruby strawberries.
* **Kothapalli Waterfalls:** A multi-tiered cascading fall with natural bamboo observation decks.
* **Tajangi Reservoir Camping:** Scenic reservoir surrounded by tranquil hills and sunrise viewpoints.`,
    author: 'Rohan Deshmukh',
    authorEmail: 'rohan@waltairtravels.com',
    date: '2025-04-24',
    category: 'Travel Guide',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    tags: ['Lambasingi', 'Winter Hills', 'Camping', 'Family Trips']
  }
];

export const FAQS = [
  {
    q: 'How do I book a taxi to Alluri Sitharama Raju Int\'l Airport (ASI), Bhogapuram?',
    a: 'You can select "Airport Taxi" on our booking widget, choose "Airport Drop" or "Airport Pickup", select Bhogapuram Airport, pick your date & time, and click Search & Book. You will receive an instant confirmation SMS & WhatsApp with driver details.'
  },
  {
    q: 'Are toll charges, parking, and driver allowances included in the fare?',
    a: 'Yes! Waltair Travels believes in 100% transparent pricing. The estimated fare displayed includes base fare, distance, estimated tolls, and GST. There are no hidden surcharges or surprise extra fees at the end of the trip.'
  },
  {
    q: 'What if my flight arrives late at the airport?',
    a: 'We provide 45 minutes of complimentary flight delay waiting time for all airport pickups. Our dispatch team monitors flight landing status automatically so your chauffeur is ready when you walk out.'
  },
  {
    q: 'Can I cancel or reschedule my ride?',
    a: 'Yes, free cancellation is available up to 2 hours prior to scheduled pickup for city rides, and up to 4 hours for outstation journeys via the "Manage Trip" section or by calling 24x7 support at +91 91234 56789.'
  },
  {
    q: 'Are the cabs sanitized and drivers verified?',
    a: 'Every vehicle undergoes routine hygiene checks and AC servicing. All drivers are verified with valid commercial badges, background checks, and extensive route knowledge across Andhra Pradesh and Odisha.'
  }
];
