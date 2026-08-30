import { Router } from 'express';
import type { Request, Response } from 'express';
import { metricsCollector } from './metrics';
import { fareCache, routeCache, aiResponseCache } from './cache';
import { FareEngineService } from './services/fareEngine';
import { RouteService } from './services/routeService';
import { bookingEngine, BookingStatus } from './services/bookingEngine';
import { AiTravelService } from './services/aiService';

export const apiRouter = Router();

/**
 * 1. System Health Check
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    service: 'waltair-travels-backend',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * 2. Real-time Telemetry & Latency Histogram
 */
apiRouter.get('/metrics', (_req: Request, res: Response) => {
  const metrics = metricsCollector.getMetrics();
  res.json({
    ...metrics,
    caches: {
      fareCache: fareCache.getStats(),
      routeCache: routeCache.getStats(),
      aiResponseCache: aiResponseCache.getStats(),
    },
  });
});

/**
 * 3. Cache Diagnostics & Invalidation
 */
apiRouter.get('/cache/stats', (_req: Request, res: Response) => {
  res.json({
    fareCache: fareCache.getStats(),
    routeCache: routeCache.getStats(),
    aiResponseCache: aiResponseCache.getStats(),
  });
});

apiRouter.post('/cache/clear', (_req: Request, res: Response) => {
  fareCache.clear();
  routeCache.clear();
  aiResponseCache.clear();
  res.json({ status: 'ok', message: 'All in-memory LRU caches cleared successfully' });
});

/**
 * 4. High-Performance Fare Calculation Engine
 */
apiRouter.post('/fares/calculate', (req: Request, res: Response) => {
  const {
    serviceType = 'airport',
    subType = 'pickup',
    vehicleCategory = 'sedan',
    pickupLocation = 'Visakhapatnam Airport (VTZ)',
    dropoffLocation = 'Beach Road, Vizag',
    distanceKm,
    durationHours,
    days,
    pickupTime,
  } = req.body || {};

  const fare = FareEngineService.calculateFare({
    serviceType,
    subType,
    vehicleCategory,
    pickupLocation,
    dropoffLocation,
    distanceKm: distanceKm ? Number(distanceKm) : undefined,
    durationHours: durationHours ? Number(durationHours) : undefined,
    days: days ? Number(days) : undefined,
    pickupTime,
  });

  res.json({ success: true, fare });
});

/**
 * 5. Route & Distance Matrix Estimation
 */
apiRouter.post('/routes/estimate', (req: Request, res: Response) => {
  const { origin, destination } = req.body || {};

  if (!origin || !destination) {
    res.status(400).json({
      error: 'Missing required parameters: origin and destination are required',
    });
    return;
  }

  const estimate = RouteService.estimateRoute({
    origin: String(origin),
    destination: String(destination),
  });

  res.json({ success: true, estimate });
});

/**
 * 6. Bookings Transaction Engine
 */
apiRouter.post('/bookings', (req: Request, res: Response) => {
  const {
    bookingRef,
    idempotencyKey,
    customerName,
    customerPhone,
    customerEmail,
    serviceType,
    subType,
    pickupLocation,
    dropoffLocation,
    travelDate,
    pickupTime,
    vehicleCategory,
    vehicleName,
    estimatedDistanceKm,
    totalFare,
    paymentMethod,
  } = req.body || {};

  if (!customerName || !customerPhone || !pickupLocation || !dropoffLocation) {
    res.status(400).json({
      error: 'Validation failed: customerName, customerPhone, pickupLocation, dropoffLocation are mandatory',
    });
    return;
  }

  const booking = bookingEngine.createBooking({
    bookingRef,
    idempotencyKey: idempotencyKey || req.header('idempotency-key'),
    customerName,
    customerPhone,
    customerEmail,
    serviceType: serviceType || 'airport',
    subType: subType || 'pickup',
    pickupLocation,
    dropoffLocation,
    travelDate: travelDate || new Date().toISOString().split('T')[0],
    pickupTime: pickupTime || '10:00',
    vehicleCategory: vehicleCategory || 'sedan',
    vehicleName: vehicleName || 'Swift Dzire',
    estimatedDistanceKm: Number(estimatedDistanceKm) || 20,
    totalFare: Number(totalFare) || 800,
    paymentMethod: paymentMethod || 'Cash to Chauffeur',
  });

  res.status(201).json({
    success: true,
    message: 'Booking generated successfully',
    booking,
  });
});

apiRouter.get('/bookings', (_req: Request, res: Response) => {
  const list = bookingEngine.listRecentBookings(25);
  res.json({ success: true, count: list.length, bookings: list });
});

apiRouter.get('/bookings/:ref', (req: Request, res: Response) => {
  const booking = bookingEngine.getBookingByRef(req.params.ref);
  if (!booking) {
    res.status(404).json({ error: `Booking with reference ${req.params.ref} not found` });
    return;
  }
  res.json({ success: true, booking });
});

apiRouter.patch('/bookings/:ref/status', (req: Request, res: Response) => {
  const { status, note } = req.body || {};
  try {
    const updated = bookingEngine.updateBookingStatus(
      req.params.ref,
      status as BookingStatus,
      note || `Status transition to ${status}`
    );
    if (!updated) {
      res.status(404).json({ error: `Booking ${req.params.ref} not found` });
      return;
    }
    res.json({ success: true, booking: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid state transition' });
  }
});

/**
 * 7. Live Fleet Dispatch & Telemetry Status
 */
apiRouter.get('/fleet/status', (_req: Request, res: Response) => {
  res.json({
    timestamp: new Date().toISOString(),
    totalFleetSize: 48,
    activeOnDuty: 39,
    standbyAtAirports: 14,
    standbyVizagAirportVTZ: 9,
    standbyBhogapuramAirport: 5,
    onTrip: 25,
    maintenance: 2,
    fleetReadinessPercent: 96,
    avgResponseMinutes: 8.4,
  });
});

/**
 * 8. Server-Side Gemini AI Travel Concierge
 */
apiRouter.post('/ai/plan-trip', async (req: Request, res: Response) => {
  const {
    destination = 'Araku Valley',
    durationDays = 2,
    travelGroup = 'family',
    preferences = [],
    budgetTier = 'comfortable',
  } = req.body || {};

  try {
    const plan = await AiTravelService.generateTripPlan({
      destination: String(destination),
      durationDays: Number(durationDays),
      travelGroup: String(travelGroup),
      preferences: Array.isArray(preferences) ? preferences : [String(preferences)],
      budgetTier: budgetTier as any,
    });

    res.json({ success: true, plan });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate AI travel plan' });
  }
});

/**
 * 9. Enterprise Contact & Inquiry Processor
 */
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, message, serviceType } = req.body || {};
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  // Simulated queue ingestion
  const ticketId = `INQ-${Date.now().toString().slice(-6)}`;
  res.status(201).json({
    success: true,
    ticketId,
    message: 'Your request has been prioritized. Our dispatch executive will contact you shortly.',
    details: { name, email, phone, serviceType, message },
  });
});
