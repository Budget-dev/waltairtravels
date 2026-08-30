import { fareCache } from '../cache';

export interface FareCalculationRequest {
  serviceType: 'airport' | 'outstation' | 'local' | 'packages';
  subType?: string;
  vehicleCategory: 'sedan' | 'suv' | 'prime_suv' | 'hatchback' | 'tempo';
  pickupLocation: string;
  dropoffLocation: string;
  travelDate?: string;
  pickupTime?: string;
  distanceKm?: number;
  durationHours?: number;
  days?: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  driverAllowance: number;
  nightSurcharge: number;
  peakHourSurcharge: number;
  tollEstimate: number;
  gstAmount: number;
  discountAmount: number;
  totalFare: number;
  currency: string;
  ratePerKm: number;
  minKmCharged: number;
  estimatedKm: number;
  calculatedAt: string;
  cached: boolean;
}

// Vehicle Tier Parameters
const VEHICLE_PRICING: Record<
  string,
  {
    baseRatePerKm: number;
    airportFlatVizag: number;
    airportFlatBhogapuram: number;
    hourlyRate: number;
    minOutstationKmPerDay: number;
    driverBattaPerDay: number;
  }
> = {
  sedan: {
    baseRatePerKm: 14,
    airportFlatVizag: 800,
    airportFlatBhogapuram: 1200,
    hourlyRate: 200,
    minOutstationKmPerDay: 300,
    driverBattaPerDay: 400,
  },
  suv: {
    baseRatePerKm: 18,
    airportFlatVizag: 1200,
    airportFlatBhogapuram: 1700,
    hourlyRate: 280,
    minOutstationKmPerDay: 300,
    driverBattaPerDay: 500,
  },
  prime_suv: {
    baseRatePerKm: 22,
    airportFlatVizag: 1600,
    airportFlatBhogapuram: 2200,
    hourlyRate: 350,
    minOutstationKmPerDay: 300,
    driverBattaPerDay: 600,
  },
  hatchback: {
    baseRatePerKm: 12,
    airportFlatVizag: 700,
    airportFlatBhogapuram: 1050,
    hourlyRate: 170,
    minOutstationKmPerDay: 300,
    driverBattaPerDay: 350,
  },
  tempo: {
    baseRatePerKm: 28,
    airportFlatVizag: 2200,
    airportFlatBhogapuram: 3000,
    hourlyRate: 500,
    minOutstationKmPerDay: 350,
    driverBattaPerDay: 800,
  },
};

export class FareEngineService {
  /**
   * Deterministic fare computation with multi-level LRU caching
   */
  public static calculateFare(request: FareCalculationRequest): FareBreakdown {
    const cacheKey = JSON.stringify({
      serviceType: request.serviceType,
      subType: request.subType,
      vehicleCategory: request.vehicleCategory,
      pickup: request.pickupLocation.trim().toLowerCase(),
      dropoff: request.dropoffLocation.trim().toLowerCase(),
      dist: request.distanceKm,
      hours: request.durationHours,
      days: request.days,
      time: request.pickupTime,
    });

    const cachedFare = fareCache.get(cacheKey);
    if (cachedFare) {
      return { ...cachedFare, cached: true };
    }

    const category = VEHICLE_PRICING[request.vehicleCategory] || VEHICLE_PRICING.sedan;
    let baseFare = 0;
    let distanceFare = 0;
    let timeFare = 0;
    let driverAllowance = 0;
    let nightSurcharge = 0;
    let peakHourSurcharge = 0;
    let tollEstimate = 0;
    let minKmCharged = 0;
    const estimatedKm = request.distanceKm || this.estimateDefaultDistance(request);

    // Night surcharge detection (10:00 PM to 05:00 AM)
    if (request.pickupTime) {
      const hour = parseInt(request.pickupTime.split(':')[0], 10);
      if (!isNaN(hour) && (hour >= 22 || hour < 5)) {
        nightSurcharge = 250;
      }
    }

    // 1. AIRPORT TRANSFERS
    if (request.serviceType === 'airport') {
      const isBhogapuram =
        request.pickupLocation.toLowerCase().includes('bhogapuram') ||
        request.dropoffLocation.toLowerCase().includes('bhogapuram');

      baseFare = isBhogapuram ? category.airportFlatBhogapuram : category.airportFlatVizag;
      tollEstimate = isBhogapuram ? 120 : 60;
      minKmCharged = isBhogapuram ? 55 : 25;
    }
    // 2. OUTSTATION TRIPS
    else if (request.serviceType === 'outstation') {
      const days = Math.max(1, request.days || 1);
      const isRoundTrip = request.subType === 'roundtrip';
      
      const totalEstimatedKm = isRoundTrip ? estimatedKm * 2 : estimatedKm;
      minKmCharged = category.minOutstationKmPerDay * days;
      const chargeableKm = Math.max(minKmCharged, totalEstimatedKm);

      distanceFare = chargeableKm * category.baseRatePerKm;
      driverAllowance = category.driverBattaPerDay * days;

      if (chargeableKm > 200) {
        tollEstimate = Math.round(chargeableKm * 0.9);
      }
    }
    // 3. HOURLY LOCAL RENTALS
    else if (request.serviceType === 'local') {
      const hours = request.durationHours || 8;
      const packageKm = hours * 10; // Standard 8hr/80km or 4hr/40km
      minKmCharged = packageKm;

      baseFare = hours * category.hourlyRate;
      if (estimatedKm > packageKm) {
        distanceFare = (estimatedKm - packageKm) * category.baseRatePerKm;
      }
    }
    // 4. TOUR PACKAGES (Araku, Lambasingi, Vizag City)
    else {
      if (request.dropoffLocation.toLowerCase().includes('araku')) {
        baseFare = request.vehicleCategory === 'suv' ? 4200 : 3200;
        tollEstimate = 100;
        minKmCharged = 240;
      } else if (request.dropoffLocation.toLowerCase().includes('lambasingi')) {
        baseFare = request.vehicleCategory === 'suv' ? 4800 : 3800;
        tollEstimate = 120;
        minKmCharged = 280;
      } else {
        baseFare = request.vehicleCategory === 'suv' ? 3000 : 2200;
        minKmCharged = 100;
      }
    }

    const subtotal = baseFare + distanceFare + timeFare + driverAllowance + nightSurcharge + peakHourSurcharge + tollEstimate;
    const gstAmount = Math.round(subtotal * 0.05); // 5% GST for transport
    const discountAmount = subtotal > 3000 ? 150 : 0; // Automatic corporate/loyalty discount
    const totalFare = subtotal + gstAmount - discountAmount;

    const breakdown: FareBreakdown = {
      baseFare,
      distanceFare,
      timeFare,
      driverAllowance,
      nightSurcharge,
      peakHourSurcharge,
      tollEstimate,
      gstAmount,
      discountAmount,
      totalFare,
      currency: 'INR',
      ratePerKm: category.baseRatePerKm,
      minKmCharged,
      estimatedKm,
      calculatedAt: new Date().toISOString(),
      cached: false,
    };

    fareCache.set(cacheKey, breakdown);
    return breakdown;
  }

  private static estimateDefaultDistance(request: FareCalculationRequest): number {
    const p = request.pickupLocation.toLowerCase();
    const d = request.dropoffLocation.toLowerCase();

    if (p.includes('airport') || d.includes('airport')) {
      return p.includes('bhogapuram') || d.includes('bhogapuram') ? 55 : 20;
    }
    if (d.includes('araku')) return 115;
    if (d.includes('lambasingi')) return 135;
    if (d.includes('srikakulam')) return 110;
    if (d.includes('vizianagaram')) return 60;
    if (d.includes('annavaram')) return 120;
    if (d.includes('kakinada')) return 155;
    return 30; // Default local commute
  }
}
