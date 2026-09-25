import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Plane, 
  Train, 
  Check, 
  Compass,
  Car,
  Flag,
  Info
} from 'lucide-react';
import { reverseGeocodeCoords } from '../utils/placesService';

export interface LocationCoord {
  lat: number;
  lng: number;
  label?: string;
  name?: string;
}

interface LeafletRouteMapProps {
  pickup?: LocationCoord | null;
  dropoff?: LocationCoord | null;
  onSelectPickup?: (coord: LocationCoord) => void;
  onSelectDropoff?: (coord: LocationCoord) => void;
  className?: string;
  height?: string;
  interactiveSelection?: boolean;
  showTransitHubs?: boolean;
  cityCenter?: { lat: number; lng: number };
}

// Major Regional Transit Hubs in Visakhapatnam & North Andhra
const KEY_TRANSIT_HUBS = [
  {
    id: 'hub-asi',
    name: 'Bhogapuram Airport (ASI)',
    short: 'ASI Airport',
    lat: 18.0267,
    lng: 83.4984,
    type: 'airport',
    desc: 'New Alluri Sitharama Raju International Airport',
  },
  {
    id: 'hub-vtz',
    name: 'Visakhapatnam Airport (VTZ)',
    short: 'VTZ Airport',
    lat: 17.7215,
    lng: 83.2245,
    type: 'airport',
    desc: 'NAD Junction Airport Terminal',
  },
  {
    id: 'hub-vskp',
    name: 'Visakhapatnam Junction (VSKP)',
    short: 'VSKP Railway Stn',
    lat: 17.7285,
    lng: 83.2986,
    type: 'railway',
    desc: 'Main Railway Terminal',
  },
  {
    id: 'hub-waltair',
    name: 'Siripuram / Waltair Uplands',
    short: 'Siripuram Circle',
    lat: 17.7230,
    lng: 83.3150,
    type: 'city',
    desc: 'Commercial & Corporate Hub',
  },
  {
    id: 'hub-rushikonda',
    name: 'Rushikonda Beach & IT SEZ',
    short: 'Rushikonda IT SEZ',
    lat: 17.7818,
    lng: 83.3852,
    type: 'it',
    desc: 'Beach & Technology Corridor',
  },
  {
    id: 'hub-araku',
    name: 'Araku Valley Hill Station',
    short: 'Araku Valley',
    lat: 18.3273,
    lng: 82.8775,
    type: 'tourist',
    desc: 'Coffee Hills & Waterfalls',
  },
];

// Helper to compute distance (Haversine formula in KM)
export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Create custom SVG Leaflet Marker Icon
const createCustomMarkerIcon = (type: 'pickup' | 'dropoff' | 'hub', label?: string) => {
  if (type === 'pickup') {
    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-pointer group">
          <div class="absolute -bottom-1 w-3 h-1.5 bg-black/25 rounded-full blur-[1px]"></div>
          <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-500/30">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11 2 11.3V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <div class="absolute -top-7 whitespace-nowrap bg-emerald-900/90 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm pointer-events-none">
            ${label || 'Pickup'}
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  if (type === 'dropoff') {
    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-pointer group">
          <div class="absolute -bottom-1 w-3 h-1.5 bg-black/25 rounded-full blur-[1px]"></div>
          <div class="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-rose-500/30">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </div>
          <div class="absolute -top-7 whitespace-nowrap bg-rose-900/90 text-rose-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm pointer-events-none">
            ${label || 'Destination'}
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  // Hub Icon
  return L.divIcon({
    className: 'custom-leaflet-hub',
    html: `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
        <div class="w-6 h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center shadow-md border border-white hover:scale-110 transition-transform">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({
  pickup,
  dropoff,
  onSelectPickup,
  onSelectDropoff,
  className = '',
  height = '320px',
  interactiveSelection = true,
  showTransitHubs = true,
  cityCenter = { lat: 17.6868, lng: 83.2185 }, // Visakhapatnam center
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [activePinTarget, setActivePinTarget] = useState<'pickup' | 'dropoff'>('dropoff');
  const [clickGeocoding, setClickGeocoding] = useState(false);
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

  // Computed metrics
  const routeDistance = (pickup?.lat && pickup?.lng && dropoff?.lat && dropoff?.lng)
    ? calculateDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
    : null;

  const estimatedDurationMins = routeDistance
    ? Math.round(routeDistance * 1.5 + 10) // estimate with city/highway mix
    : null;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default center on pickup, dropoff or Vizag center
    const initialLat = pickup?.lat || dropoff?.lat || cityCenter.lat;
    const initialLng = pickup?.lng || dropoff?.lng || cityCenter.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false, // custom placed zoom control
      attributionControl: true,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    // Handle ResizeObserver to prevent grey tile glitches
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Polyline when pickup, dropoff, or hubs change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    const boundsPoints: [number, number][] = [];

    // 1. Add Pickup Marker
    if (pickup?.lat && pickup?.lng) {
      boundsPoints.push([pickup.lat, pickup.lng]);
      const pickupIcon = createCustomMarkerIcon('pickup', pickup.name || 'Pickup');
      const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(layer);
      pickupMarker.bindPopup(`
        <div style="font-family: inherit; min-width: 140px; font-size: 12px;">
          <div style="font-weight: bold; color: #059669;">📍 Pickup Point</div>
          <div style="color: #334155; margin-top: 4px;">${pickup.label || pickup.name || 'Selected pickup'}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}</div>
        </div>
      `);
    }

    // 2. Add Dropoff Marker
    if (dropoff?.lat && dropoff?.lng) {
      boundsPoints.push([dropoff.lat, dropoff.lng]);
      const dropoffIcon = createCustomMarkerIcon('dropoff', dropoff.name || 'Destination');
      const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon }).addTo(layer);
      dropoffMarker.bindPopup(`
        <div style="font-family: inherit; min-width: 140px; font-size: 12px;">
          <div style="font-weight: bold; color: #e11d48;">🏁 Destination</div>
          <div style="color: #334155; margin-top: 4px;">${dropoff.label || dropoff.name || 'Selected destination'}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}</div>
        </div>
      `);
    }

    // 3. Draw Route Polyline if both points exist
    if (pickup?.lat && pickup?.lng && dropoff?.lat && dropoff?.lng) {
      const latlngs: [number, number][] = [
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ];

      const polyline = L.polyline(latlngs, {
        color: '#0891b2',
        weight: 5,
        opacity: 0.85,
        dashArray: '6, 8',
      }).addTo(map);

      routePolylineRef.current = polyline;
    }

    // 4. Add Transit Hubs if enabled
    if (showTransitHubs) {
      KEY_TRANSIT_HUBS.forEach((hub) => {
        const hubIcon = createCustomMarkerIcon('hub');
        const hubMarker = L.marker([hub.lat, hub.lng], { icon: hubIcon }).addTo(layer);
        
        hubMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; min-width: 170px;">
            <div style="font-weight: 700; color: #0e7490;">${hub.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${hub.desc}</div>
            <div style="margin-top: 8px; display: flex; gap: 4px;">
              <button id="btn-pick-${hub.id}" style="background: #059669; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600;">
                Set Pickup
              </button>
              <button id="btn-drop-${hub.id}" style="background: #e11d48; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600;">
                Set Drop-off
              </button>
            </div>
          </div>
        `);

        hubMarker.on('popupopen', () => {
          const pickBtn = document.getElementById(`btn-pick-${hub.id}`);
          const dropBtn = document.getElementById(`btn-drop-${hub.id}`);
          if (pickBtn) {
            pickBtn.onclick = () => {
              onSelectPickup?.({
                lat: hub.lat,
                lng: hub.lng,
                name: hub.name,
                label: hub.name,
              });
              map.closePopup();
            };
          }
          if (dropBtn) {
            dropBtn.onclick = () => {
              onSelectDropoff?.({
                lat: hub.lat,
                lng: hub.lng,
                name: hub.name,
                label: hub.name,
              });
              map.closePopup();
            };
          }
        });
      });
    }

    // 5. Fit bounds or Center
    if (boundsPoints.length >= 2) {
      const bounds = L.latLngBounds(boundsPoints);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    } else if (boundsPoints.length === 1) {
      map.setView(boundsPoints[0], 13);
    }
  }, [pickup, dropoff, showTransitHubs, onSelectPickup, onSelectDropoff]);

  // Click on Map to set location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !interactiveSelection) return;

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClickGeocoding(true);

      let resolvedAddress = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      let resolvedName = 'Selected Map Point';

      try {
        const geo = await reverseGeocodeCoords(lat, lng);
        if (geo?.address) {
          resolvedAddress = geo.address;
          resolvedName = geo.name;
        }
      } catch (err) {
        console.warn('Leaflet map click reverse geocoding notice:', err);
      } finally {
        setClickGeocoding(false);
      }

      const coordObj: LocationCoord = {
        lat,
        lng,
        label: resolvedAddress,
        name: resolvedName,
      };

      if (activePinTarget === 'pickup') {
        onSelectPickup?.(coordObj);
      } else {
        onSelectDropoff?.(coordObj);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [interactiveSelection, activePinTarget, onSelectPickup, onSelectDropoff]);

  // Map Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (pickup?.lat && pickup?.lng && dropoff?.lat && dropoff?.lng) {
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    } else {
      map.setView([cityCenter.lat, cityCenter.lng], 12);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 ${className}`}>
      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%' }} 
        className="z-0"
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Interactive Target Switcher */}
        {interactiveSelection && (
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-sm border border-slate-200/80 p-1 flex items-center gap-1 pointer-events-auto">
            <span className="text-[10px] font-semibold text-slate-500 px-1.5 hidden sm:inline">Click map to set:</span>
            <button
              type="button"
              onClick={() => setActivePinTarget('pickup')}
              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activePinTarget === 'pickup'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              Pickup
            </button>
            <button
              type="button"
              onClick={() => setActivePinTarget('dropoff')}
              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activePinTarget === 'dropoff'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-300"></span>
              Drop-off
            </button>
          </div>
        )}

        {/* Right: Route Distance Badge */}
        {routeDistance !== null && (
          <div className="bg-slate-900/90 text-white backdrop-blur-md rounded-lg shadow-sm border border-slate-800 px-2.5 py-1 text-[11px] font-medium flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Navigation className="w-3 h-3" />
              <span>~{routeDistance} km</span>
            </div>
            {estimatedDurationMins && (
              <span className="text-slate-300 border-l border-slate-700 pl-2">
                ~{estimatedDurationMins} mins drive
              </span>
            )}
          </div>
        )}
      </div>

      {/* Floating Zoom & Center Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          title="Fit Route to Screen"
          className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Loading Indicator for Click Geocoding */}
      {clickGeocoding && (
        <div className="absolute inset-0 z-20 bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-md border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-3 h-3 rounded-full border-2 border-cyan-600 border-t-transparent animate-spin"></span>
            Pinning location with OpenStreetMap...
          </div>
        </div>
      )}

      {/* Quick Transit Hub Selector Bar on Map Bottom */}
      {showTransitHubs && (
        <div className="absolute bottom-3 left-3 right-14 z-10 pointer-events-auto overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap bg-white/90 backdrop-blur-md p-1 rounded-lg border border-slate-200/80 shadow-xs max-w-full">
            <span className="text-[10px] font-bold text-slate-400 pl-1.5 uppercase tracking-wider">Quick Hubs:</span>
            {KEY_TRANSIT_HUBS.map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => {
                  setSelectedHub(hub.id);
                  mapInstanceRef.current?.setView([hub.lat, hub.lng], 13);
                  if (activePinTarget === 'pickup') {
                    onSelectPickup?.({ lat: hub.lat, lng: hub.lng, name: hub.name, label: hub.name });
                  } else {
                    onSelectDropoff?.({ lat: hub.lat, lng: hub.lng, name: hub.name, label: hub.name });
                  }
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedHub === hub.id 
                    ? 'bg-cyan-700 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800'
                }`}
              >
                {hub.type === 'airport' && <Plane className="w-2.5 h-2.5" />}
                {hub.type === 'railway' && <Train className="w-2.5 h-2.5" />}
                {hub.short}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
