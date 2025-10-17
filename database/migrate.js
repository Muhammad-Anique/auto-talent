#!/usr/bin/env node

/**
 * Database Migration Runner for Auto-Apply Feature
 * 
 * This script helps manage database migrations for the auto-apply feature.
 * It can be run manually or integrated into deployment pipelines.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Migration tracking table
const MIGRATIONS_TABLE = 'schema_migrations';

async function ensureMigrationsTable() {
    const { error } = await supabase.rpc('exec_sql', {
        sql: `
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    });

    if (error) {
        console.error('❌ Failed to create migrations table:', error);
        throw error;
    }
}

async function getExecutedMigrations() {
    const { data, error } = await supabase
        .from(MIGRATIONS_TABLE)
        .select('version')
        .order('version');

    if (error) {
        console.error('❌ Failed to get executed migrations:', error);
        throw error;
    }

    return data.map(row => row.version);
}

async function recordMigration(version, description) {
    const { error } = await supabase
        .from(MIGRATIONS_TABLE)
        .insert({
            version,
            description,
            executed_at: new Date().toISOString()
        });

    if (error) {
        console.error('❌ Failed to record migration:', error);
        throw error;
    }
}

async function executeMigration(filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`📄 Executing migration: ${path.basename(filePath)}`);

    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
        console.error(`❌ Migration failed: ${path.basename(filePath)}`, error);
        throw error;
    }

    console.log(`✅ Migration completed: ${path.basename(filePath)}`);
}

async function runMigrations() {
    try {
        console.log('🚀 Starting database migrations...');

        // Ensure migrations table exists
        await ensureMigrationsTable();

        // Get list of executed migrations
        const executedMigrations = await getExecutedMigrations();
        console.log(`📋 Found ${executedMigrations.length} executed migrations`);

        // Get list of migration files
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log(`📁 Found ${migrationFiles.length} migration files`);

        let executedCount = 0;

        for (const file of migrationFiles) {
            const version = file.replace('.sql', '');

            if (executedMigrations.includes(version)) {
                console.log(`⏭️  Skipping already executed migration: ${file}`);
                continue;
            }

            const filePath = path.join(migrationsDir, file);
            const description = `Auto-apply migration: ${file}`;

            // Execute migration
            await executeMigration(filePath);

            // Record migration
            await recordMigration(version, description);

            executedCount++;
        }

        if (executedCount === 0) {
            console.log('✅ All migrations are up to date');
        } else {
            console.log(`✅ Successfully executed ${executedCount} new migrations`);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

async function rollbackMigration(version) {
    try {
        console.log(`🔄 Rolling back migration: ${version}`);

        // This is a simple implementation - in production you'd want more sophisticated rollback
        const { error } = await supabase
            .from(MIGRATIONS_TABLE)
            .delete()
            .eq('version', version);

        if (error) {
            console.error('❌ Failed to rollback migration:', error);
            throw error;
        }

        console.log(`✅ Rolled back migration: ${version}`);

    } catch (error) {
        console.error('❌ Rollback failed:', error);
        process.exit(1);
    }
}

async function showStatus() {
    try {
        const executedMigrations = await getExecutedMigrations();

        console.log('📊 Migration Status:');
        console.log(`   Executed migrations: ${executedMigrations.length}`);

        if (executedMigrations.length > 0) {
            console.log('   Latest migrations:');
            executedMigrations.slice(-5).forEach(version => {
                console.log(`     - ${version}`);
            });
        }

    } catch (error) {
        console.error('❌ Failed to get migration status:', error);
        process.exit(1);
    }
}

// CLI interface
const command = process.argv[2];

switch (command) {
    case 'migrate':
    case 'up':
        runMigrations();
        break;

    case 'rollback':
    case 'down':
        const version = process.argv[3];
        if (!version) {
            console.error('❌ Please specify migration version to rollback');
            process.exit(1);
        }
        rollbackMigration(version);
        break;

    case 'status':
        showStatus();
        break;

    default:
        console.log('Auto-Apply Database Migration Tool');
        console.log('');
        console.log('Usage:');
        console.log('  node migrate.js migrate     - Run pending migrations');
        console.log('  node migrate.js rollback <version> - Rollback a migration');
        console.log('  node migrate.js status      - Show migration status');
        console.log('');
        console.log('Environment variables required:');
        console.log('  NEXT_PUBLIC_SUPABASE_URL');
        console.log('  SUPABASE_SERVICE_ROLE_KEY');
        break;
}
