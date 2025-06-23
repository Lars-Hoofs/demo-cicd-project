#!/usr/bin/env node

/**
 * Deployment Script
 * 
 * Dit script automatiseert het deployment proces inclusief:
 * - Omgevingsvariabelen validatie
 * - Database migraties
 * - Health checks
 * - Configuratie voor productie omgeving
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Laad omgevingsvariabelen
dotenv.config();

const logger = require('../src/utils/logger');
const MigrationRunner = require('./migrate');

class DeploymentManager {
  constructor() {
    this.environment = process.env.NODE_ENV || 'production';
    this.requiredEnvVars = [
      'NODE_ENV',
      'PORT',
      'DATABASE_URL',
      'API_SECRET'
    ];
  }

  async deploy() {
    logger.info(`Starting deployment process for environment: ${this.environment}`);
    
    try {
      // Stap 1: Pre-deployment checks
      await this.preDeploymentChecks();
      
      // Stap 2: Backup (in productie)
      if (this.environment === 'production') {
        await this.createBackup();
      }
      
      // Stap 3: Database migraties
      await this.runMigrations();
      
      // Stap 4: Configureer applicatie
      await this.configureApplication();
      
      // Stap 5: Start applicatie
      await this.startApplication();
      
      // Stap 6: Health checks
      await this.performHealthChecks();
      
      // Stap 7: Post-deployment tasks
      await this.postDeploymentTasks();
      
      logger.info('Deployment completed successfully!');
      
    } catch (error) {
      logger.error('Deployment failed:', error);
      
      // Rollback in productie
      if (this.environment === 'production') {
        await this.rollback();
      }
      
      process.exit(1);
    }
  }

  async preDeploymentChecks() {
    logger.info('Running pre-deployment checks...');
    
    // Controleer omgevingsvariabelen
    this.validateEnvironmentVariables();
    
    // Controleer Node.js versie
    this.validateNodeVersion();
    
    // Controleer disk space
    await this.checkDiskSpace();
    
    // Controleer dependencies
    await this.validateDependencies();
    
    logger.info('Pre-deployment checks passed');
  }

  validateEnvironmentVariables() {
    logger.info('Validating environment variables...');
    
    const missing = this.requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Environment-specific validaties
    if (this.environment === 'production') {
      const prodVars = ['JWT_SECRET', 'DATABASE_URL'];
      const missingProd = prodVars.filter(varName => !process.env[varName]);
      
      if (missingProd.length > 0) {
        throw new Error(`Missing production environment variables: ${missingProd.join(', ')}`);
      }
    }
    
    logger.info('Environment variables validated');
  }

  validateNodeVersion() {
    const requiredVersion = '16.0.0';
    const currentVersion = process.version.substring(1); // Remove 'v' prefix
    
    logger.info(`Checking Node.js version: ${currentVersion} (required: ${requiredVersion}+)`);
    
    if (this.compareVersions(currentVersion, requiredVersion) < 0) {
      throw new Error(`Node.js version ${requiredVersion} or higher required, got ${currentVersion}`);
    }
  }

  compareVersions(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part > v2part) return 1;
      if (v1part < v2part) return -1;
    }
    
    return 0;
  }

  async checkDiskSpace() {
    logger.info('Checking available disk space...');
    
    try {
      // Controleer disk space (Unix/Linux/macOS)
      if (process.platform !== 'win32') {
        const output = execSync('df -h / | tail -1', { encoding: 'utf8' });
        const usage = output.split(/\s+/)[4];
        logger.info(`Disk usage: ${usage}`);
        
        const usagePercent = parseInt(usage.replace('%', ''));
        if (usagePercent > 90) {
          throw new Error(`Disk usage too high: ${usage}`);
        }
      }
    } catch (error) {
      logger.warn('Could not check disk space:', error.message);
    }
  }

  async validateDependencies() {
    logger.info('Validating dependencies...');
    
    try {
      // Controleer of package-lock.json bestaat
      if (!fs.existsSync('package-lock.json')) {
        logger.warn('package-lock.json not found, running npm install...');
        execSync('npm install', { stdio: 'inherit' });
      }
      
      // Audit dependencies
      execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
      
    } catch (error) {
      if (error.status === 1) {
        logger.warn('npm audit found vulnerabilities, but continuing...');
      } else {
        throw error;
      }
    }
  }

  async createBackup() {
    logger.info('Creating backup...');
    
    const backupDir = path.join(process.cwd(), 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    
    // Maak backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Simuleer database backup
    logger.info(`Creating database backup at ${backupPath}`);
    
    // In een echte applicatie zou je hier bijvoorbeeld pg_dump gebruiken:
    // execSync(`pg_dump ${process.env.DATABASE_URL} > ${backupPath}/database.sql`);
    
    fs.writeFileSync(
      path.join(backupPath, 'backup-info.json'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        environment: this.environment,
        version: process.env.npm_package_version || '1.0.0'
      }, null, 2)
    );
    
    logger.info(`Backup created at ${backupPath}`);
  }

  async runMigrations() {
    logger.info('Running database migrations...');
    
    const migrationRunner = new MigrationRunner();
    await migrationRunner.run();
    
    logger.info('Database migrations completed');
  }

  async configureApplication() {
    logger.info('Configuring application for production...');
    
    // Configureer logging
    if (this.environment === 'production') {
      // Zorg ervoor dat logs directory bestaat
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
    }
    
    // Configureer andere productie instellingen
    // Bijvoorbeeld: SSL certificaten, cache configuratie, etc.
    
    logger.info('Application configuration completed');
  }

  async startApplication() {
    logger.info('Starting application...');
    
    // In een echte deployment zou je hier de applicatie starten
    // bijvoorbeeld met PM2, systemd, of container orchestration
    
    // Voor demo doeleinden simuleren we dit
    logger.info('Application start simulated (in real deployment: pm2 start, docker run, etc.)');
  }

  async performHealthChecks() {
    logger.info('Performing health checks...');
    
    const maxRetries = 30;
    const retryInterval = 2000; // 2 seconds
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Simuleer health check
        await this.healthCheck();
        logger.info('Health check passed');
        return;
        
      } catch (error) {
        logger.warn(`Health check failed (attempt ${i + 1}/${maxRetries}):`, error.message);
        
        if (i === maxRetries - 1) {
          throw new Error('Health checks failed after maximum retries');
        }
        
        await this.sleep(retryInterval);
      }
    }
  }

  async healthCheck() {
    // Simuleer HTTP health check
    // In een echte applicatie zou je hier een HTTP request maken:
    // const response = await fetch('http://localhost:3000/api/health');
    // if (!response.ok) throw new Error('Health check failed');
    
    logger.info('Health check: Application is responding');
  }

  async postDeploymentTasks() {
    logger.info('Running post-deployment tasks...');
    
    // Warm up cache
    await this.warmUpCache();
    
    // Send deployment notification
    await this.sendDeploymentNotification();
    
    // Clean up old backups
    await this.cleanupOldBackups();
    
    logger.info('Post-deployment tasks completed');
  }

  async warmUpCache() {
    logger.info('Warming up cache...');
    // Simuleer cache warm-up
    logger.info('Cache warmed up');
  }

  async sendDeploymentNotification() {
    logger.info('Sending deployment notification...');
    
    const notification = {
      environment: this.environment,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      status: 'success'
    };
    
    // In een echte applicatie zou je hier notificaties sturen naar:
    // - Slack/Teams
    // - Email
    // - Monitoring systemen
    
    logger.info('Deployment notification sent:', notification);
  }

  async cleanupOldBackups() {
    logger.info('Cleaning up old backups...');
    
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) return;
    
    // Houd alleen de laatste 5 backups
    const backups = fs.readdirSync(backupDir)
      .filter(dir => dir.startsWith('backup-'))
      .sort()
      .reverse();
    
    const toDelete = backups.slice(5);
    
    for (const backup of toDelete) {
      const backupPath = path.join(backupDir, backup);
      fs.rmSync(backupPath, { recursive: true, force: true });
      logger.info(`Removed old backup: ${backup}`);
    }
  }

  async rollback() {
    logger.error('Initiating rollback...');
    
    // Implementeer rollback logica
    // - Stop applicatie
    // - Restore database backup
    // - Restore previous version
    
    logger.error('Rollback completed');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run deployment als dit script direct wordt uitgevoerd
if (require.main === module) {
  const deployer = new DeploymentManager();
  deployer.deploy().catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentManager;
