import { Booking } from '../types';

export const WHATSAPP_PHONE_NUMBER = '919110510236';
export const DISPLAY_PHONE_NUMBER = '+91 91105 10236';

export const createBookingWhatsAppUrl = (booking: Partial<Booking>): string => {
  const passengerList = booking.passengers && booking.passengers.length > 0
    ? [booking.customerName, ...booking.passengers.filter(Boolean)].filter(Boolean).join(', ')
    : booking.customerName || 'Customer';

  const totalPassengers = booking.passengers && booking.passengers.length > 0
    ? booking.passengers.length + 1
    : 1;

  const lines = [
    `*NEW CAB BOOKING - WALTAIR TRAVELS*`,
    `--------------------------------`,
    `*Booking ID:* ${booking.bookingRef || 'N/A'}`,
    `*Primary Contact:* ${booking.customerName || ''}`,
    `*Phone Number:* +91 ${booking.customerPhone || ''}`,
    booking.customerEmail ? `*Email:* ${booking.customerEmail}` : '',
    `*Passengers (${totalPassengers}):* ${passengerList}`,
    `*Selected Cab:* ${booking.vehicleName || booking.vehicleCategory || 'Standard Cab'}`,
    `*Service:* ${booking.serviceType ? booking.serviceType.toUpperCase() : 'CAB'} (${booking.subType || 'Standard'})`,
    `*Pickup Address:* ${booking.pickupLocation || ''}`,
    `*Drop Address:* ${booking.dropoffLocation || ''}`,
    `*Travel Date:* ${booking.travelDate || ''}`,
    `*Pickup Time:* ${booking.pickupTime || ''}`,
    booking.specialRequests ? `*Special Requests:* ${booking.specialRequests}` : '',
    `*Fare Quote:* Please provide fare quote upon request`,
    `--------------------------------`,
    `Please confirm my cab reservation and share details!`
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${text}`;
};
