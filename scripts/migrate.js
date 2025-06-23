#!/usr/bin/env node

/**
 * Database Migratie Script
 * 
 * Dit script voert database migraties uit voor verschillende omgevingen.
 * Het demonstreert hoe migraties automatisch kunnen worden uitgevoerd
 * tijdens deployment.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Laad omgevingsvariabelen
dotenv.config();

const logger = require('../src/utils/logger');

class MigrationRunner {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.migrationsPath = path.join(__dirname, '..', 'migrations');
    this.executedMigrationsFile = path.join(__dirname, '..', '.migrations');
  }

  async run() {
    logger.info(`Starting database migrations for environment: ${this.environment}`);
    
    try {
      // Controleer database verbinding
      await this.checkDatabaseConnection();
      
      // Maak migratie tracking tabel
      await this.ensureMigrationTable();
      
      // Haal uitgevoerde migraties op
      const executedMigrations = await this.getExecutedMigrations();
      
      // Haal beschikbare migraties op
      const availableMigrations = await this.getAvailableMigrations();
      
      // Filter nieuwe migraties
      const pendingMigrations = availableMigrations.filter(
        migration => !executedMigrations.includes(migration)
      );
      
      if (pendingMigrations.length === 0) {
        logger.info('No pending migrations found');
        return;
      }
      
      logger.info(`Found ${pendingMigrations.length} pending migrations`);
      
      // Voer migraties uit
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }
      
      logger.info('All migrations completed successfully');
      
    } catch (error) {
      logger.error('Migration failed:', error);
      process.exit(1);
    }
  }

  async checkDatabaseConnection() {
    logger.info('Checking database connection...');
    
    // Simuleer database verbinding check
    // In een echte applicatie zou je hier de database verbinding testen
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable not set');
    }
    
    logger.info('Database connection verified');
  }

  async ensureMigrationTable() {
    logger.info('Ensuring migration tracking table exists...');
    
    // Simuleer het maken van een migratie tabel
    // In een echte applicatie zou je hier SQL uitvoeren:
    /*
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    */
    
    logger.info('Migration tracking table ready');
  }

  async getExecutedMigrations() {
    // Lees uitgevoerde migraties van bestand (simulatie)
    if (!fs.existsSync(this.executedMigrationsFile)) {
      return [];
    }
    
    const content = fs.readFileSync(this.executedMigrationsFile, 'utf8');
    return content.split('\n').filter(line => line.trim());
  }

  async getAvailableMigrations() {
    // Maak migrations directory als deze niet bestaat
    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
      
      // Maak voorbeeld migraties
      this.createExampleMigrations();
    }
    
    const files = fs.readdirSync(this.migrationsPath);
    return files
      .filter(file => file.endsWith('.sql') || file.endsWith('.js'))
      .sort();
  }

  async executeMigration(migrationFile) {
    logger.info(`Executing migration: ${migrationFile}`);
    
    const migrationPath = path.join(this.migrationsPath, migrationFile);
    
    try {
      if (migrationFile.endsWith('.sql')) {
        await this.executeSqlMigration(migrationPath);
      } else if (migrationFile.endsWith('.js')) {
        await this.executeJsMigration(migrationPath);
      }
      
      // Markeer migratie als uitgevoerd
      await this.markMigrationAsExecuted(migrationFile);
      
      logger.info(`Migration completed: ${migrationFile}`);
      
    } catch (error) {
      logger.error(`Migration failed: ${migrationFile}`, error);
      throw error;
    }
  }

  async executeSqlMigration(filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    logger.info(`Executing SQL migration: ${sql.substring(0, 100)}...`);
    
    // Hier zou je de SQL uitvoeren tegen de database
    // await database.query(sql);
  }

  async executeJsMigration(filePath) {
    const migration = require(filePath);
    
    if (typeof migration.up !== 'function') {
      throw new Error(`Migration ${filePath} must export an 'up' function`);
    }
    
    await migration.up();
  }

  async markMigrationAsExecuted(migrationFile) {
    const executed = await this.getExecutedMigrations();
    executed.push(migrationFile);
    
    fs.writeFileSync(
      this.executedMigrationsFile,
      executed.join('\n'),
      'utf8'
    );
  }

  createExampleMigrations() {
    const migrations = [
      {
        name: '001_create_users_table.sql',
        content: `-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`
      },
      {
        name: '002_add_user_roles.sql',
        content: `-- Add roles to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
  ('admin', 'Administrator with full access'),
  ('user', 'Regular user with limited access')
ON CONFLICT (name) DO NOTHING;`
      }
    ];

    migrations.forEach(migration => {
      const filePath = path.join(this.migrationsPath, migration.name);
      fs.writeFileSync(filePath, migration.content, 'utf8');
    });

    logger.info('Created example migrations');
  }
}

// Run migrations als dit script direct wordt uitgevoerd
if (require.main === module) {
  const runner = new MigrationRunner();
  runner.run().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = MigrationRunner;
