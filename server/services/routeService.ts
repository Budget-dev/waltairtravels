import { routeCache } from '../cache';

export interface RouteEstimateRequest {
  origin: string;
  destination: string;
  waypoints?: string[];
}

export interface RouteEstimateResponse {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  formattedDuration: string;
  tollBoothsCount: number;
  tollEstimateInr: number;
  scenicRoute: boolean;
  ghatRoad: boolean;
  recommendedVehicle: string;
  cached: boolean;
}

// Distance & Route Matrix for Coastal AP & Eastern Ghats
const DISTANCE_MATRIX: Record<string, { km: number; mins: number; tolls: number; ghat: boolean; scenic: boolean }> = {
  // Airport Routes
  'visakhapatnam_airport_vtz:rk_beach': { km: 16, mins: 35, tolls: 0, ghat: false, scenic: true },
  'visakhapatnam_airport_vtz:rushikonda': { km: 26, mins: 50, tolls: 0, ghat: false, scenic: true },
  'visakhapatnam_airport_vtz:madhurawada': { km: 28, mins: 45, tolls: 0, ghat: false, scenic: false },
  'visakhapatnam_airport_vtz:gajuwaka': { km: 10, mins: 20, tolls: 0, ghat: false, scenic: false },
  'visakhapatnam_airport_vtz:steel_plant': { km: 18, mins: 30, tolls: 0, ghat: false, scenic: false },
  'visakhapatnam_airport_vtz:simhachalam': { km: 12, mins: 25, tolls: 0, ghat: false, scenic: false },
  
  // Bhogapuram International Airport
  'bhogapuram_airport:visakhapatnam_city': { km: 52, mins: 65, tolls: 1, ghat: false, scenic: true },
  'bhogapuram_airport:rushikonda': { km: 44, mins: 55, tolls: 1, ghat: false, scenic: true },
  'bhogapuram_airport:vizianagaram': { km: 25, mins: 35, tolls: 0, ghat: false, scenic: false },
  'bhogapuram_airport:srikakulam': { km: 68, mins: 80, tolls: 2, ghat: false, scenic: false },

  // Outstation & Hill Stations
  'visakhapatnam:araku_valley': { km: 115, mins: 210, tolls: 1, ghat: true, scenic: true },
  'visakhapatnam:lambasingi': { km: 135, mins: 240, tolls: 1, ghat: true, scenic: true },
  'visakhapatnam:vizianagaram': { km: 60, mins: 85, tolls: 1, ghat: false, scenic: false },
  'visakhapatnam:srikakulam': { km: 110, mins: 140, tolls: 2, ghat: false, scenic: false },
  'visakhapatnam:annavaram': { km: 125, mins: 150, tolls: 2, ghat: false, scenic: false },
  'visakhapatnam:kakinada': { km: 155, mins: 195, tolls: 3, ghat: false, scenic: false },
  'visakhapatnam:rajahmundry': { km: 190, mins: 240, tolls: 4, ghat: false, scenic: false },
  'visakhapatnam:hyderabad': { km: 620, mins: 660, tolls: 8, ghat: false, scenic: false },
  'visakhapatnam:bhubaneswar': { km: 440, mins: 480, tolls: 6, ghat: false, scenic: true },
  'visakhapatnam:puri': { km: 410, mins: 450, tolls: 5, ghat: false, scenic: true },
};

export class RouteService {
  public static estimateRoute(request: RouteEstimateRequest): RouteEstimateResponse {
    const originNorm = this.normalizeLocation(request.origin);
    const destNorm = this.normalizeLocation(request.destination);
    const cacheKey = `${originNorm}:${destNorm}`;

    const cached = routeCache.get(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    // Lookup in matrix or reverse lookup
    let match = DISTANCE_MATRIX[`${originNorm}:${destNorm}`] || DISTANCE_MATRIX[`${destNorm}:${originNorm}`];

    if (!match) {
      // Fuzzy heuristic estimation based on common travel pairs
      const isGhat = destNorm.includes('araku') || destNorm.includes('lambasingi') || destNorm.includes('paderu');
      const isAirport = originNorm.includes('airport') || destNorm.includes('airport');
      const isBhogapuram = originNorm.includes('bhogapuram') || destNorm.includes('bhogapuram');

      const estimatedKm = isBhogapuram ? 54 : isAirport ? 22 : isGhat ? 120 : 45;
      const speedKmPerHour = isGhat ? 35 : 45;
      const mins = Math.round((estimatedKm / speedKmPerHour) * 60);

      match = {
        km: estimatedKm,
        mins,
        tolls: estimatedKm > 50 ? Math.floor(estimatedKm / 60) : 0,
        ghat: isGhat,
        scenic: isGhat || originNorm.includes('beach') || destNorm.includes('beach'),
      };
    }

    const hours = Math.floor(match.mins / 60);
    const remainingMins = match.mins % 60;
    const formattedDuration = hours > 0 ? `${hours} hr ${remainingMins} min` : `${remainingMins} min`;

    const response: RouteEstimateResponse = {
      origin: request.origin,
      destination: request.destination,
      distanceKm: match.km,
      durationMinutes: match.mins,
      formattedDuration,
      tollBoothsCount: match.tolls,
      tollEstimateInr: match.tolls * 65,
      scenicRoute: match.scenic,
      ghatRoad: match.ghat,
      recommendedVehicle: match.ghat ? 'Innova Crysta / Ertiga (SUV for Ghat Roads)' : 'Dzire / Etios (Sedan)',
      cached: false,
    };

    routeCache.set(cacheKey, response);
    return response;
  }

  private static normalizeLocation(loc: string): string {
    const l = loc.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (l.includes('vtz') || (l.includes('visakhapatnam') && l.includes('airport'))) return 'visakhapatnam_airport_vtz';
    if (l.includes('bhogapuram')) return 'bhogapuram_airport';
    if (l.includes('araku')) return 'araku_valley';
    if (l.includes('lambasingi')) return 'lambasingi';
    if (l.includes('beach') || l.includes('rk_beach')) return 'rk_beach';
    if (l.includes('rushikonda')) return 'rushikonda';
    if (l.includes('madhurawada')) return 'madhurawada';
    if (l.includes('gajuwaka')) return 'gajuwaka';
    if (l.includes('steel_plant')) return 'steel_plant';
    if (l.includes('srikakulam')) return 'srikakulam';
    if (l.includes('vizianagaram')) return 'vizianagaram';
    if (l.includes('annavaram')) return 'annavaram';
    if (l.includes('kakinada')) return 'kakinada';
    return l.substring(0, 30);
  }
}
