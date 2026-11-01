import 'dotenv/config';
import { createServer } from 'node:http';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createPool } from './db/pool.js';
import { createLogger } from './logger.js';

async function bootstrap() {
  // 1. Load Configuration & Logger
  const config = loadConfig();
  const logger = createLogger(config.logLevel, config.loggerConfig);

  try {
    // 2. Initialize Database Pool
    const pool = createPool(config);

    // Optional: Test DB connection on startup
    await pool.query('SELECT NOW()');
    logger.info('Database connection established successfully');

    // 3. Create Express App & HTTP Server
    const app = createApp({ config, pool, logger });
    const server = createServer(app);

    // 4. Background Cleanup Task (Rate Limits)
    const rateLimitCleanup = setInterval(async () => {
      try {
        await pool.query(
          "DELETE FROM rate_limit_windows WHERE window_start < now() - interval '1 day'"
        );
      } catch (error) {
        logger.error({ err: error }, 'Rate-limit cleanup failed');
      }
    }, 60 * 60 * 1000); // Every 1 hour

    // Prevent cleanup from keeping process alive
    rateLimitCleanup.unref();

    // 5. Start Listening
    server.listen(config.port, config.host, () => {
      logger.info(
        {
          host: config.host,
          port: config.port,
          env: config.nodeEnv,
          pid: process.pid
        },
        '🚀 Mana AI API is listening'
      );
    });

    // 6. Graceful Shutdown Handler
    let isShuttingDown = false;

    const shutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.warn({ signal }, '⚠️ Graceful shutdown initiated');
      clearInterval(rateLimitCleanup);

      // Force kill after timeout
      const forceKillTimer = setTimeout(() => {
        logger.error('Graceful shutdown timed out. Forcing exit...');
        process.exit(1);
      }, config.appConfig?.shutdownTimeoutMs ?? 15000);
      forceKillTimer.unref();

      try {
        // Stop accepting new connections
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
        });
        logger.info('HTTP server closed');

        // Close DB connections
        await pool.end();
        logger.info('Database pool drained');

        clearTimeout(forceKillTimer);
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during shutdown');
        clearTimeout(forceKillTimer);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unexpected DB errors
    pool.on('error', (err) => {
      logger.fatal({ err }, 'Unexpected idle database client error');
      process.exit(1);
    });

  } catch (error) {
    // If startup fails (e.g., DB down), log and exit
    logger.fatal({ err: error }, 'Failed to start Mana AI API');
    process.exit(1);
  }
}

// Run Bootstrap
bootstrap();
