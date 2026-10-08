import { auth } from '../firebase';

export interface SystemHealthStatus {
  status: string;
  service: string;
  version: string;
  uptimeSeconds: number;
  latencyMs: number;
  environment: string;
}

export interface BackendMetrics {
  requests: {
    total: number;
    rpm: number;
    errorRate: number;
  };
  latency: {
    p50Ms: number;
    p90Ms: number;
    p99Ms: number;
    avgMs: number;
  };
  memory: {
    rssMb: number;
    heapUsedMb: number;
  };
  caches: {
    fareCache: { hitRatio: number; hits: number; size: number };
    routeCache: { hitRatio: number; hits: number; size: number };
    aiResponseCache: { hitRatio: number; hits: number; size: number };
  };
}

class ApiClient {
  private basePrefix = '/api';

  private async fetchWithRetry<T>(url: string, options: RequestInit = {}, retries = 2): Promise<T> {
    const start = performance.now();
    try {
      let authHeader: Record<string, string> = {};
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          if (token) {
            authHeader = { Authorization: `Bearer ${token}` };
          }
        } catch {}
      }

      const res = await fetch(`${this.basePrefix}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeader,
          ...(options.headers || {}),
        },
      });


      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errorBody.detail || errorBody.error || `HTTP ${res.status}`);
      }

      return (await res.json()) as T;
    } catch (err: any) {
      if (retries > 0 && (!options.method || options.method === 'GET')) {
        // Exponential backoff with random jitter (100ms - 300ms)
        const delay = Math.pow(2, 2 - retries) * 100 + Math.random() * 50;
        await new Promise((r) => setTimeout(r, delay));
        return this.fetchWithRetry<T>(url, options, retries - 1);
      }
      throw err;
    }
  }

  public async getHealth(): Promise<SystemHealthStatus> {
    const start = performance.now();
    const data = await this.fetchWithRetry<any>('/health');
    const latencyMs = Math.round(performance.now() - start);
    return {
      ...data,
      latencyMs,
    };
  }

  public async getMetrics(): Promise<BackendMetrics> {
    return this.fetchWithRetry<BackendMetrics>('/metrics');
  }

  public async calculateFare(payload: {
    serviceType: string;
    subType?: string;
    vehicleCategory: string;
    pickupLocation: string;
    dropoffLocation: string;
    distanceKm?: number;
    durationHours?: number;
    days?: number;
    pickupTime?: string;
  }): Promise<any> {
    return this.fetchWithRetry<{ success: boolean; fare: any }>('/fares/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async estimateRoute(origin: string, destination: string): Promise<any> {
    return this.fetchWithRetry<{ success: boolean; estimate: any }>('/routes/estimate', {
      method: 'POST',
      body: JSON.stringify({ origin, destination }),
    });
  }

  public async createBooking(bookingData: any): Promise<any> {
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return this.fetchWithRetry<{ success: boolean; booking: any }>('/bookings', {
      method: 'POST',
      headers: {
        'idempotency-key': idempotencyKey,
      },
      body: JSON.stringify({ ...bookingData, idempotencyKey }),
    });
  }

  public async getBooking(bookingRef: string): Promise<any> {
    return this.fetchWithRetry<{ success: boolean; booking: any }>(`/bookings/${bookingRef}`);
  }

  public async getFleetStatus(): Promise<any> {
    return this.fetchWithRetry<any>('/fleet/status');
  }

  public async planAiTrip(payload: {
    destination: string;
    durationDays: number;
    travelGroup: string;
    preferences?: string[];
    budgetTier?: string;
  }): Promise<any> {
    return this.fetchWithRetry<{ success: boolean; plan: any }>('/ai/plan-trip', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async submitContactInquiry(payload: {
    name: string;
    email: string;
    phone?: string;
    serviceType?: string;
    message: string;
  }): Promise<any> {
    return this.fetchWithRetry<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient();
