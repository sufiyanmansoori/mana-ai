import 'dotenv/config';
import { createServer } from 'node:http';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createPool } from './db/pool.js';
import { createLogger } from './logger.js';

const config = loadConfig();
const logger = createLogger(config.logLevel);
const pool = createPool(config);
const app = createApp({ config, pool, logger });
const server = createServer(app);
const rateLimitCleanup = setInterval(() => {
  void pool.query("DELETE FROM rate_limit_windows WHERE window_start < now() - interval '1 day'")
    .catch((error: unknown) => logger.error({ err: error }, 'Rate-limit cleanup failed'));
}, 60 * 60 * 1000);
rateLimitCleanup.unref();

server.listen(config.port, config.host, () => {
  logger.info({
    host: config.host,
    port: config.port,
    environment: config.nodeEnv,
  }, 'Mana AI API listening');
});

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Graceful shutdown started');
  clearInterval(rateLimitCleanup);
  const timeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out');
    process.exit(1);
  }, 15000);
  timeout.unref();

  server.close(async (error) => {
    if (error) logger.error({ err: error }, 'HTTP server shutdown failed');
    try {
      await pool.end();
    } catch (poolError) {
      logger.error({ err: poolError }, 'Database pool shutdown failed');
      process.exitCode = 1;
    } finally {
      clearTimeout(timeout);
      process.exit();
    }
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

pool.on('error', (error) => {
  logger.error({ err: error }, 'Unexpected idle database client error');
});
