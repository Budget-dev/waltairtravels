// Device GPS, IP Geolocation, OpenStreetMap and Curated AP dataset provide full location services without requiring an API key.

let loaderPromise: Promise<any> | null = null;

export const loadGoogleMaps = (): Promise<any> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not defined'));
  }

  if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
    return Promise.resolve((window as any).google);
  }

  if (!loaderPromise) {
    // Graceful resolution - location resolution uses Device GPS + IP + OpenStreetMap
    loaderPromise = Promise.resolve((window as any).google || null);
  }

  return loaderPromise;
};
