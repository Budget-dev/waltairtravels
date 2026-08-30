import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '919123456789';
  const defaultText = encodeURIComponent('Hello Waltair Travels! I would like to check cab availability and book a taxi.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      id="floating-whatsapp-btn"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#005a66] hover:bg-[#004751] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 ring-4 ring-white/80 group cursor-pointer"
      aria-label="Chat on WhatsApp"
      title="Chat with Waltair Travels Booking Desk"
    >
      {/* WhatsApp SVG Icon */}
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.983.541 1.764.813 2.8.813 3.182 0 5.768-2.587 5.768-5.766.001-3.187-2.58-5.767-5.772-5.767zm0 10.373c-.911 0-1.636-.25-2.433-.679l-.206-.111-1.442.378.384-1.405-.121-.193c-.496-.79-.769-1.583-.768-2.597 0-2.539 2.065-4.605 4.606-4.605 2.544 0 4.609 2.066 4.609 4.607 0 2.541-2.065 4.605-4.628 4.605zm2.868-3.487c-.157-.079-.929-.459-1.073-.511-.144-.052-.249-.079-.354.079-.105.158-.407.511-.499.616-.092.105-.184.118-.341.039-.157-.079-.664-.245-1.265-.781-.468-.417-.783-.933-.875-1.09-.092-.158-.01-.243.069-.322.071-.071.157-.184.236-.276.079-.092.105-.158.157-.263.053-.105.026-.197-.013-.276-.039-.079-.354-.853-.485-1.168-.128-.306-.258-.264-.354-.269-.092-.005-.197-.006-.302-.006-.105 0-.276.039-.42.197-.144.158-.551.538-.551 1.312s.564 1.523.643 1.628c.079.105 1.11 1.694 2.688 2.376.375.162.668.259.897.332.378.12.721.103.993.062.303-.045.929-.38 1.06-.747.131-.367.131-.682.092-.747-.039-.066-.144-.105-.301-.184z"/>
      </svg>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat with Dispatch 24x7
      </span>
    </a>
  );
};
