import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { apiRouter } from './server/routes';
import {
  requestIdMiddleware,
  metricsMiddleware,
  createRateLimiter,
  errorHandler,
} from './server/middleware';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 5004;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // 1. High Performance Parsers & Security Controls
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Allow OAuth Popups (Prevents Cross-Origin-Opener-Policy popup communication isolation)
  app.use((_req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
  });

  // 2. Request Correlation & Observability Middleware
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware);

  // 3. Adaptive In-Memory Token Bucket Rate Limiting (120 reqs / min per IP)
  app.use(createRateLimiter({ maxTokens: 120, refillRatePerSec: 2 }));

  // 4. Mount API Routes BEFORE Vite Middleware
  app.use('/api', apiRouter);

  // 5. Global Standardized Error Handling Middleware for APIs
  app.use('/api', errorHandler);

  // 6. Vite Middleware Integration (Dev vs Prod)
  if (!isProduction) {
    console.log('[Server] Initializing Vite Development Middleware Mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Initializing Production Static Asset Serving...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 7. Bind Server to Host 0.0.0.0 and Port 3000
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`======================================================`);
    console.log(`🚀 Waltair Travels Enterprise Backend Engine Online`);
    console.log(`⚡ Listening on: http://0.0.0.0:${PORT}`);
    console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`📈 Metrics Endpoint: http://localhost:${PORT}/api/metrics`);
    console.log(`🛡️ Architecture: Layered Micro-Modular Express + Vite SPA`);
    console.log(`======================================================`);
  });

  // 8. Resilient Graceful Shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`[Server] Received ${signal}. Initiating graceful shutdown...`);
    server.close(() => {
      console.log('[Server] HTTP server closed gracefully. Exiting process.');
      process.exit(0);
    });

    // Force shutdown if connections do not close within 8s
    setTimeout(() => {
      console.error('[Server] Forced shutdown timeout exceeded. Terminating.');
      process.exit(1);
    }, 8000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[Server] Fatal bootstrap error:', err);
  process.exit(1);
});
