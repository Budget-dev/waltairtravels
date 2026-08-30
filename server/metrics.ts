/**
 * Enterprise Telemetry & Systems Metrics Collector
 * Tracks percentile latencies (P50, P90, P99), active connections, throughput RPM,
 * memory RSS/Heap, and system availability uptime.
 */

export interface SystemMetrics {
  timestamp: string;
  uptimeSeconds: number;
  requests: {
    total: number;
    success: number;
    errors: number;
    errorRate: number;
    rpm: number; // Requests per minute
  };
  latency: {
    p50Ms: number;
    p90Ms: number;
    p99Ms: number;
    avgMs: number;
    minMs: number;
    maxMs: number;
  };
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
    externalMb: number;
  };
  system: {
    nodeVersion: string;
    platform: string;
    cpuCores: number;
  };
}

class MetricsCollector {
  private startTime: number = Date.now();
  private totalRequests: number = 0;
  private successRequests: number = 0;
  private errorRequests: number = 0;

  // Ring buffer for latency samples (last 2000 requests)
  private readonly maxSamples: number = 2000;
  private latencySamples: number[] = [];

  // Minute-by-minute rolling request counter
  private rollingWindowRequests: { timestamp: number; count: number }[] = [];

  public recordRequest(durationMs: number, isSuccess: boolean): void {
    this.totalRequests++;
    if (isSuccess) {
      this.successRequests++;
    } else {
      this.errorRequests++;
    }

    if (this.latencySamples.length >= this.maxSamples) {
      this.latencySamples.shift();
    }
    this.latencySamples.push(durationMs);

    // Track RPM window
    const now = Date.now();
    this.rollingWindowRequests.push({ timestamp: now, count: 1 });
    this.cleanupRollingWindow(now);
  }

  private cleanupRollingWindow(now: number): void {
    const oneMinuteAgo = now - 60 * 1000;
    this.rollingWindowRequests = this.rollingWindowRequests.filter(
      (r) => r.timestamp > oneMinuteAgo
    );
  }

  public getMetrics(): SystemMetrics {
    const now = Date.now();
    this.cleanupRollingWindow(now);

    const mem = process.memoryUsage();
    const sorted = [...this.latencySamples].sort((a, b) => a - b);
    const count = sorted.length;

    const p50 = count > 0 ? sorted[Math.floor(count * 0.5)] : 0;
    const p90 = count > 0 ? sorted[Math.floor(count * 0.9)] : 0;
    const p99 = count > 0 ? sorted[Math.floor(count * 0.99)] : 0;
    const min = count > 0 ? sorted[0] : 0;
    const max = count > 0 ? sorted[count - 1] : 0;
    const sum = count > 0 ? sorted.reduce((acc, val) => acc + val, 0) : 0;
    const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;

    const errorRate =
      this.totalRequests > 0
        ? Number(((this.errorRequests / this.totalRequests) * 100).toFixed(2))
        : 0;

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((now - this.startTime) / 1000),
      requests: {
        total: this.totalRequests,
        success: this.successRequests,
        errors: this.errorRequests,
        errorRate,
        rpm: this.rollingWindowRequests.length,
      },
      latency: {
        p50Ms: Number(p50.toFixed(2)),
        p90Ms: Number(p90.toFixed(2)),
        p99Ms: Number(p99.toFixed(2)),
        avgMs: avg,
        minMs: Number(min.toFixed(2)),
        maxMs: Number(max.toFixed(2)),
      },
      memory: {
        rssMb: Number((mem.rss / 1024 / 1024).toFixed(2)),
        heapTotalMb: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
        heapUsedMb: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
        externalMb: Number((mem.external / 1024 / 1024).toFixed(2)),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        cpuCores: typeof navigator !== 'undefined' ? 4 : 4,
      },
    };
  }
}

export const metricsCollector = new MetricsCollector();
