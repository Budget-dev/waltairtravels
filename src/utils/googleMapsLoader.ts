import { Loader } from '@googlemaps/js-api-loader';

// Priority: User's configured API Key in .env -> fallback
const envKey = (typeof import.meta !== 'undefined' && (import.meta as any).env) 
  ? (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY 
  : '';

const API_KEY = envKey || '';

let loaderPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = (): Promise<typeof google> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not defined'));
  }

  if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
    return Promise.resolve((window as any).google);
  }

  if (!loaderPromise) {
    try {
      const loader = new Loader({
        apiKey: API_KEY,
        version: 'weekly',
        libraries: ['places', 'geometry'],
        // Attribution tracking channel mandated by GMP guideline
        solutionChannel: 'gmp_mcp_codeassist_v1_aistudio',
      } as any);

      // Support loader.importLibrary or loader.load()
      if (typeof (loader as any).importLibrary === 'function') {
        loaderPromise = Promise.all([
          (loader as any).importLibrary('places'),
          (loader as any).importLibrary('geometry'),
        ]).then(() => (window as any).google);
      } else if (typeof (loader as any).load === 'function') {
        loaderPromise = (loader as any).load().then(() => (window as any).google);
      } else {
        loaderPromise = Promise.resolve((window as any).google);
      }
    } catch (e) {
      console.warn('Google Maps loader initialisation notice:', e);
      loaderPromise = Promise.resolve((window as any).google);
    }
  }

  return loaderPromise;
};
