import re

with open('src/pages/BookingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (!initialData) return null;", """
  if (!initialData) {
    // If navigated directly without data, default to local rental
    initialData = {
      serviceType: 'local',
      subType: 'rental_8hr',
      pickupLocation: 'Visakhapatnam City Center',
      dropoffLocation: '',
      travelDate: new Date().toISOString().split('T')[0],
      pickupTime: '10:00'
    };
  }
""")

with open('src/pages/BookingPage.tsx', 'w') as f:
    f.write(content)

