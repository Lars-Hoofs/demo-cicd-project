const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
    },
  };

  logger.info('Health check requested');
  res.json(healthStatus);
});

// GET /api/health/detailed - Detailed health check
router.get('/detailed', (req, res) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    checks: {
      server: {
        status: 'UP',
        responseTime: Date.now(),
      },
      memory: {
        status: process.memoryUsage().heapUsed < 100 * 1024 * 1024 ? 'UP' : 'WARNING',
        usage: process.memoryUsage(),
      },
      environment: {
        status: 'UP',
        variables: {
          NODE_ENV: process.env.NODE_ENV || 'development',
          PORT: process.env.PORT || '3000',
          // Voeg hier andere omgevingsvariabelen toe (zonder gevoelige informatie)
        },
      },
    },
  };

  const overallStatus = Object.values(detailedHealth.checks)
    .every(check => check.status === 'UP') ? 'UP' : 'DOWN';
  
  detailedHealth.status = overallStatus;
  
  logger.info('Detailed health check requested');
  res.json(detailedHealth);
});

module.exports = router;
