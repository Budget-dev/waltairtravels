import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add BookingPage import
content = content.replace("import { TermsConditionsPage } from './pages/TermsConditionsPage';", "import { TermsConditionsPage } from './pages/TermsConditionsPage';\nimport { BookingPage } from './pages/BookingPage';")

# Remove BookingModal import
content = content.replace("import { BookingModal } from './components/BookingModal';\n", "")

# Remove BookingModal jsx
booking_modal_pattern = r'\{\s*/\*\s*Interactive Booking Modal\s*\*/\s*\}\s*<BookingModal[\s\S]*?/>'
content = re.sub(booking_modal_pattern, '', content)

# Change isBookingOpen usages
# Find setBookingInitialData followed by setIsBookingOpen(true)
content = re.sub(r'setIsBookingOpen\(true\);?', "setCurrentPage('booking');", content)

# Also handle any setIsBookingOpen in state
# We can keep `isBookingOpen` state if we want, or just remove it, but it's simpler to keep it unused or remove it. Let's remove it if possible.
content = re.sub(r'const \[isBookingOpen, setIsBookingOpen\] = useState<boolean>\(false\);\n', '', content)

# In getInitialPage, add 'booking'
content = content.replace("'terms-and-conditions'", "'terms-and-conditions', 'booking'")

# Add BookingPage rendering block
booking_page_render = """
            {currentPage === 'booking' && (
              <BookingPage
                onNavigateHome={() => navigateToPage('home')}
                initialData={bookingInitialData}
                currentCity={currentCity}
                onBookingSuccess={(booking) => {
                  handleBookingSuccess(booking);
                  // We also need to navigate away from booking page when success triggers 
                  // or the BookingPage itself handles the success state.
                  // The BookingPage shows the success screen (step 4), so we don't strictly need to navigate away immediately.
                }}
                onOpenLiveTrack={(id) => {
                  handleOpenLiveTrack(id);
                }}
              />
            )}
"""

content = content.replace("{/* 3. Footer Matching Screenshot Layout */}", booking_page_render + "\n      {/* 3. Footer Matching Screenshot Layout */}")

with open('src/App.tsx', 'w') as f:
    f.write(content)

