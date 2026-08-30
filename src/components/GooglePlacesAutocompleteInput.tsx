import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  Navigation, 
  Plane, 
  Building2, 
  Sparkles, 
  Check,
  Compass,
  Loader2,
  Home,
  Landmark,
  Palmtree,
  Factory
} from 'lucide-react';
import { loadGoogleMaps } from '../utils/googleMapsLoader';
import { 
  searchAnyLocation, 
  reverseGeocodeCoords, 
  PlaceResult,
  CURATED_AP_LOCATIONS 
} from '../utils/placesService';

export interface SelectedPlaceData {
  address: string;
  name?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  category?: string;
  district?: string;
}

interface GooglePlacesAutocompleteInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: SelectedPlaceData) => void;
  placeholder?: string;
  iconType?: 'pickup' | 'dropoff' | 'generic';
  className?: string;
  required?: boolean;
  cityBias?: string;
  compact?: boolean;
}

export const GooglePlacesAutocompleteInput: React.FC<GooglePlacesAutocompleteInputProps> = ({
  id,
  label,
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Search village, town, mandal, airport, city...',
  iconType = 'generic',
  className = '',
  required = false,
  cityBias = 'Visakhapatnam',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google Maps Places Autocomplete Service if available
  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps()
      .then((g) => {
        if (!isMounted || !g?.maps?.places) return;
        try {
          autocompleteServiceRef.current = new g.maps.places.AutocompleteService();
          const dummyDiv = document.createElement('div');
          placesServiceRef.current = new g.maps.places.PlacesService(dummyDiv);
          sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
          setIsGoogleMapsReady(true);
        } catch (err) {
          console.warn('Google Places service init notice:', err);
        }
      })
      .catch(() => {
        // OpenStreetMap & regional database work seamlessly without external API
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Universal Search Handler: OpenStreetMap (Villages, Mandals, Towns, Cities) + Curated AP DB + Google Places
  const fetchPredictions = useCallback((query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      // Show top curated spots (Airports, Railway Stations, City Centers)
      setPredictions(CURATED_AP_LOCATIONS.slice(0, 8));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        // 1. Fetch from multi-source OpenStreetMap + Curated AP Village/City Geocoder
        const osmResults = await searchAnyLocation(trimmed, cityBias);

        // 2. If Google Places is ready, also fetch Google predictions to merge
        if (autocompleteServiceRef.current && trimmed.length >= 2) {
          const request: google.maps.places.AutocompletionRequest = {
            input: trimmed,
            componentRestrictions: { country: 'in' },
            sessionToken: sessionTokenRef.current || undefined,
            locationBias: new google.maps.Circle({
              center: { lat: 17.6868, lng: 83.2185 },
              radius: 120000,
            }),
          };

          autocompleteServiceRef.current.getPlacePredictions(
            request,
            (googleResults, status) => {
              setIsLoading(false);
              if (status === google.maps.places.PlacesServiceStatus.OK && googleResults && googleResults.length > 0) {
                const googleMapped: PlaceResult[] = googleResults.map((res) => ({
                  id: `google-${res.place_id}`,
                  name: res.structured_formatting?.main_text || res.description,
                  address: res.description,
                  category: res.description.toLowerCase().includes('airport') ? 'airport' : 'landmark',
                  categoryLabel: 'Google Verified',
                  source: 'google' as const,
                }));

                // Combine OpenStreetMap villages/cities with Google Places results
                const combined = [...osmResults, ...googleMapped];
                const seen = new Set<string>();
                const deduped: PlaceResult[] = [];
                for (const item of combined) {
                  const key = item.name.toLowerCase().trim();
                  if (!seen.has(key)) {
                    seen.add(key);
                    deduped.push(item);
                  }
                }
                setPredictions(deduped.slice(0, 12));
              } else {
                setPredictions(osmResults);
              }
            }
          );
        } else {
          setIsLoading(false);
          setPredictions(osmResults);
        }
      } catch (err) {
        setIsLoading(false);
        setPredictions(CURATED_AP_LOCATIONS.slice(0, 6));
      }
    }, 200);
  }, [cityBias]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setIsOpen(true);
    setSelectedIndex(-1);
    fetchPredictions(val);
  };

  // Handle Selection of a Suggestion
  const handleSelectPrediction = (item: PlaceResult) => {
    const finalAddress = item.address || item.name;
    onChange(finalAddress);
    setIsOpen(false);
    setSelectedIndex(-1);

    // If Google Places detail can be fetched for geometry
    if (item.source === 'google' && item.id.startsWith('google-') && placesServiceRef.current) {
      const placeId = item.id.replace('google-', '');
      try {
        placesServiceRef.current.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'geometry', 'name', 'place_id'],
            sessionToken: sessionTokenRef.current || undefined,
          },
          (placeDetails, status) => {
            if (window.google?.maps?.places?.AutocompleteSessionToken) {
              sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
            }

            if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
              const lat = placeDetails.geometry?.location?.lat();
              const lng = placeDetails.geometry?.location?.lng();
              onPlaceSelect?.({
                address: placeDetails.formatted_address || finalAddress,
                name: placeDetails.name || item.name,
                placeId: placeDetails.place_id,
                lat,
                lng,
                category: item.category,
                district: item.district,
              });
            } else {
              onPlaceSelect?.({
                address: finalAddress,
                name: item.name,
                placeId: item.id,
                lat: item.lat,
                lng: item.lng,
                category: item.category,
                district: item.district,
              });
            }
          }
        );
        return;
      } catch (err) {
        console.warn('Place details fetch handled gracefully:', err);
      }
    }

    onPlaceSelect?.({
      address: finalAddress,
      name: item.name,
      placeId: item.id,
      lat: item.lat,
      lng: item.lng,
      category: item.category,
      district: item.district,
    });
  };

  // Use Current Geolocation Location with OpenStreetMap / Google Reverse Geocoding
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let formatted = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        let placeName = 'My Current Location';

        // 1. Try reverse geocoding with OpenStreetMap Nominatim
        const osmReverse = await reverseGeocodeCoords(latitude, longitude);
        if (osmReverse && osmReverse.address) {
          formatted = osmReverse.address;
          placeName = osmReverse.name;
        } else if (window.google?.maps?.Geocoder) {
          // 2. Try Google Geocoder
          try {
            const geocoder = new window.google.maps.Geocoder();
            const res = await new Promise<any>((resolve) => {
              geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                if (status === 'OK' && results && results[0]) resolve(results[0]);
                else resolve(null);
              });
            });
            if (res?.formatted_address) {
              formatted = res.formatted_address;
            }
          } catch (e) {
            // keep osm formatted
          }
        }

        setIsLocating(false);
        onChange(formatted);
        onPlaceSelect?.({
          address: formatted,
          name: placeName,
          lat: latitude,
          lng: longitude,
          category: 'village',
        });
        setIsOpen(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        const fallback = 'Siripuram Circle & Waltair Uplands, Visakhapatnam, Andhra Pradesh';
        onChange(fallback);
        onPlaceSelect?.({
          address: fallback,
          name: 'Siripuram Circle',
          lat: 17.7208,
          lng: 83.3184,
          category: 'city',
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || predictions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        fetchPredictions(value);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < predictions.length) {
        e.preventDefault();
        handleSelectPrediction(predictions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Icon based on pickup/dropoff
  const renderIcon = () => {
    if (iconType === 'pickup') {
      return (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
        </div>
      );
    }
    if (iconType === 'dropoff') {
      return (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
          <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-700" />
        </div>
      );
    }
    return <Search className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  // Category Icon & Badge renderer
  const renderCategoryIcon = (category: PlaceResult['category']) => {
    switch (category) {
      case 'village':
        return (
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            <Home className="w-3.5 h-3.5" />
          </div>
        );
      case 'mandal':
      case 'town':
        return (
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
            <Landmark className="w-3.5 h-3.5" />
          </div>
        );
      case 'airport':
        return (
          <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700 shrink-0">
            <Plane className="w-3.5 h-3.5" />
          </div>
        );
      case 'transit':
        return (
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
        );
      case 'temple':
        return (
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 shrink-0">
            <Landmark className="w-3.5 h-3.5" />
          </div>
        );
      case 'tourist':
        return (
          <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
            <Palmtree className="w-3.5 h-3.5" />
          </div>
        );
      case 'industrial':
        return (
          <div className="p-1.5 rounded-lg bg-slate-200 text-slate-700 shrink-0">
            <Factory className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <div className={`flex items-center justify-between ${compact ? 'mb-0.5' : 'mb-1'}`}>
          <label htmlFor={id} className={`block font-bold text-slate-700 ${compact ? 'text-[11px]' : 'text-xs'}`}>
            {label}
          </label>
          <span className="inline-flex items-center gap-1 text-[10px] text-cyan-700 font-semibold">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Search Any Village / City</span>
          </span>
        </div>
      )}

      {/* Input Field Container */}
      <div className={`group relative flex items-center gap-2 bg-slate-50 hover:bg-white focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all shadow-xs ${
        compact ? 'px-2.5 py-1.5 sm:py-2' : 'px-3 py-2.5'
      }`}>
        {renderIcon()}

        <input
          ref={inputRef}
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            fetchPredictions(value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={`w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-semibold outline-none ${
            compact ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'
          }`}
        />

        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-cyan-600 animate-spin shrink-0" />
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
              fetchPredictions('');
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Clear location"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}

        {/* GPS Geolocation Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          title="Detect my current village/locality via GPS"
          className={`rounded-lg text-cyan-700 hover:bg-cyan-50 border border-transparent hover:border-cyan-200 transition-all flex items-center gap-1 font-bold shrink-0 cursor-pointer ${
            compact ? 'p-1 text-[10px]' : 'p-1.5 text-[11px]'
          }`}
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">GPS</span>
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-80 overflow-y-auto">
          
          {/* Header Info */}
          <div className="px-3.5 py-2 bg-gradient-to-r from-slate-50 to-cyan-50/40 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-cyan-800">
              <Compass className="w-3.5 h-3.5 text-cyan-600" />
              <span>Villages, Mandals & Towns Across Andhra Pradesh</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {predictions.length} places
            </span>
          </div>

          {/* Location Items List */}
          {predictions.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {predictions.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <li
                    key={`${item.id}-${index}`}
                    onClick={() => handleSelectPrediction(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-3.5 py-2.5 cursor-pointer flex items-start gap-2.5 transition-colors text-left ${
                      isSelected ? 'bg-cyan-50/90 text-cyan-950' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {renderCategoryIcon(item.category)}

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-1.5">
                        <span className="truncate">{item.name}</span>
                        
                        {/* Distinct Category Tag */}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                          item.category === 'village' ? 'bg-emerald-100 text-emerald-800' :
                          item.category === 'mandal' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'airport' ? 'bg-cyan-100 text-cyan-800' :
                          item.category === 'temple' ? 'bg-orange-100 text-orange-800' :
                          item.category === 'tourist' ? 'bg-teal-100 text-teal-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.categoryLabel}
                        </span>
                      </div>

                      {/* Full Address / District / State */}
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.address}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-cyan-700 shrink-0 self-center" />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              <p className="font-semibold text-slate-700 mb-1">Looking for a specific village or landmark?</p>
              <p className="text-[11px]">Type the exact name (e.g., Padmanabham, Chodavaram, Anandapuram, Kotauratla, Tekkali) to search across all of India.</p>
            </div>
          )}

          {/* Quick instructions footer */}
          <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-3">
            <span>Use ↑ ↓ keys to navigate • Enter to pick</span>
            <span className="text-cyan-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              OpenStreetMap + GPS Enabled
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
