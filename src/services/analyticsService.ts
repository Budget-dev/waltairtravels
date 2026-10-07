/**
 * Analytics and Conversion Tracking Engine: Waltair Cabs
 * Handles Google Analytics (GA4) measurement for G-4MX7ZXV2JW and Firebase Analytics.
 */
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export type ConversionEvent = 
  | 'click_phone'
  | 'click_whatsapp'
  | 'booking_start'
  | 'booking_submit'
  | 'generate_lead'
  | 'page_view';

interface EventParams {
  [key: string]: any;
}

export function trackEvent(eventName: ConversionEvent, params: EventParams = {}) {
  try {
    const timestamp = new Date().toISOString();
    const enrichedParams = {
      ...params,
      timestamp,
      page_path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '',
      device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
    };

    // 1. Firebase Analytics Integration
    if (analytics) {
      logEvent(analytics, eventName as any, enrichedParams);
    }

    // 2. Window gtag.js DataLayer Integration (if loaded via GTM or tag)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, enrichedParams);
    }

    // 3. Debug logging in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[Analytics] Tracked ${eventName}:`, enrichedParams);
    }
  } catch (err) {
    console.debug(`[Analytics Note] Event ${eventName} logging skipped:`, err);
  }
}

// Shortcut Helpers for High-Value Conversion CTAs
export const trackPhoneClick = (source: string = 'header') => 
  trackEvent('click_phone', { source, phone: '+919110510236' });

export const trackWhatsAppClick = (source: string = 'floating_button') => 
  trackEvent('click_whatsapp', { source, phone: '+919110510236' });

export const trackBookingStart = (source: string = 'general', serviceType: string = 'taxi') => 
  trackEvent('booking_start', { source, serviceType });

export const trackBookingSubmit = (bookingRef: string, details?: string | number) => 
  trackEvent('booking_submit', { bookingRef, details, currency: 'INR' });

export const trackLeadGenerated = (source: string, phoneProvided: boolean | string = true) => 
  trackEvent('generate_lead', { source, phoneProvided: Boolean(phoneProvided) });
