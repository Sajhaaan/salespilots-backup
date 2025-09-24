#!/usr/bin/env node

/**
 * Database Backup Script for SalesPilot
 * 
 * This script creates automated backups of the Supabase database
 * and uploads them to secure cloud storage.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs').promises
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  backupDir: process.env.BACKUP_DIR || './backups',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  s3Bucket: process.env.BACKUP_S3_BUCKET,
  s3Region: process.env.BACKUP_S3_REGION || 'ap-south-1',
}

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

/**
 * Create a timestamped backup filename
 */
function getBackupFilename(type = 'full') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `salespilot-${type}-backup-${timestamp}.sql`
}

/**
 * Ensure backup directory exists
 */
async function ensureBackupDir() {
  try {
    await fs.access(config.backupDir)
  } catch (error) {
    await fs.mkdir(config.backupDir, { recursive: true })
    console.log(`Created backup directory: ${config.backupDir}`)
  }
}

/**
 * Export database schema and data
 */
async function exportDatabase() {
  console.log('Starting database export...')
  
  const filename = getBackupFilename('full')
  const filepath = path.join(config.backupDir, filename)
  
  // Extract database connection details from Supabase URL
  const dbUrl = new URL(config.supabaseUrl.replace('https://', 'postgresql://'))
  const dbName = dbUrl.hostname.split('.')[0]
  
  // Construct pg_dump command
  const pgDumpCmd = [
    'pg_dump',
    '--host', `db.${dbUrl.hostname.split('.').slice(1).join('.')}`,
    '--port', '5432',
    '--username', 'postgres',
    '--dbname', dbName,
    '--verbose',
    '--clean',
    '--no-owner',
    '--no-privileges',
    '--format', 'plain',
    '--file', filepath
  ].join(' ')
  
  try {
    // Set password via environment variable
    const env = { ...process.env, PGPASSWORD: process.env.SUPABASE_DB_PASSWORD }
    await execAsync(pgDumpCmd, { env })
    
    console.log(`Database exported to: ${filepath}`)
    return filepath
  } catch (error) {
    console.error('Database export failed:', error.message)
    throw error
  }
}

/**
 * Create incremental backup (only changed data)
 */
async function createIncrementalBackup() {
  console.log('Creating incremental backup...')
  
  // Get tables that have been modified since last backup
  const lastBackupTime = await getLastBackupTime()
  const modifiedTables = await getModifiedTables(lastBackupTime)
  
  if (modifiedTables.length === 0) {
    console.log('No changes detected since last backup')
    return null
  }
  
  const filename = getBackupFilename('incremental')
  const filepath = path.join(config.backupDir, filename)
  
  // Create backup of only modified tables
  const backupData = {
    timestamp: new Date().toISOString(),
    tables: {}
  }
  
  for (const tableName of modifiedTables) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .gte('updated_at', lastBackupTime)
    
    if (error) {
      console.warn(`Failed to backup table ${tableName}:`, error.message)
      continue
    }
    
    backupData.tables[tableName] = data
  }
  
  await fs.writeFile(filepath, JSON.stringify(backupData, null, 2))
  console.log(`Incremental backup created: ${filepath}`)
  
  return filepath
}

/**
 * Get timestamp of last backup
 */
async function getLastBackupTime() {
  try {
    const files = await fs.readdir(config.backupDir)
    const backupFiles = files
      .filter(file => file.includes('backup'))
      .sort()
      .reverse()
    
    if (backupFiles.length === 0) {
      return new Date(0).toISOString() // Unix epoch
    }
    
    // Extract timestamp from filename
    const latestFile = backupFiles[0]
    const timestampMatch = latestFile.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/)
    
    if (timestampMatch) {
      return timestampMatch[1].replace(/-/g, ':').replace(/(\d{2}):(\d{2}):(\d{2}):(\d{3})Z$/, '$1:$2:$3.$4Z')
    }
    
    return new Date(0).toISOString()
  } catch (error) {
    console.warn('Could not determine last backup time:', error.message)
    return new Date(0).toISOString()
  }
}

/**
 * Get list of tables modified since given timestamp
 */
async function getModifiedTables(since) {
  const tables = [
    'users',
    'customers',
    'products',
    'orders',
    'payments',
    'messages',
    'automation_rules',
    'analytics',
    'subscriptions',
    'file_uploads',
    'notifications'
  ]
  
  const modifiedTables = []
  
  for (const table of tables) {
    try {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', since)
      
      if (count && count > 0) {
        modifiedTables.push(table)
      }
    } catch (error) {
      // Table might not have updated_at column or might not exist
      console.warn(`Could not check modifications for table ${table}:`, error.message)
    }
  }
  
  return modifiedTables
}

/**
 * Compress backup file
 */
async function compressBackup(filepath) {
  console.log('Compressing backup...')
  
  const compressedPath = `${filepath}.gz`
  await execAsync(`gzip "${filepath}"`)
  
  console.log(`Backup compressed: ${compressedPath}`)
  return compressedPath
}

/**
 * Upload backup to S3 (if configured)
 */
async function uploadToS3(filepath) {
  if (!config.s3Bucket) {
    console.log('S3 bucket not configured, skipping upload')
    return
  }
  
  console.log('Uploading backup to S3...')
  
  const filename = path.basename(filepath)
  const s3Key = `database-backups/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${filename}`
  
  try {
    await execAsync([
      'aws', 's3', 'cp',
      `"${filepath}"`,
      `s3://${config.s3Bucket}/${s3Key}`,
      '--region', config.s3Region,
      '--storage-class', 'STANDARD_IA' // Cheaper storage for backups
    ].join(' '))
    
    console.log(`Backup uploaded to S3: s3://${config.s3Bucket}/${s3Key}`)
  } catch (error) {
    console.error('S3 upload failed:', error.message)
    throw error
  }
}

/**
 * Clean up old backups
 */
async function cleanupOldBackups() {
  console.log('Cleaning up old backups...')
  
  try {
    const files = await fs.readdir(config.backupDir)
    const now = new Date()
    const cutoffTime = new Date(now.getTime() - (config.retentionDays * 24 * 60 * 60 * 1000))
    
    for (const file of files) {
      const filepath = path.join(config.backupDir, file)
      const stats = await fs.stat(filepath)
      
      if (stats.mtime < cutoffTime && file.includes('backup')) {
        await fs.unlink(filepath)
        console.log(`Deleted old backup: ${file}`)
      }
    }
  } catch (error) {
    console.warn('Cleanup failed:', error.message)
  }
}

/**
 * Send backup notification
 */
async function sendNotification(success, details) {
  // In production, integrate with your notification system
  // (Slack, email, etc.)
  
  const message = success 
    ? `✅ Database backup completed successfully\n${details}`
    : `❌ Database backup failed\n${details}`
  
  console.log('Notification:', message)
  
  // Example: Send to Slack webhook
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      })
    } catch (error) {
      console.warn('Failed to send Slack notification:', error.message)
    }
  }
}

/**
 * Main backup function
 */
async function performBackup(type = 'full') {
  const startTime = new Date()
  console.log(`Starting ${type} backup at ${startTime.toISOString()}`)
  
  try {
    await ensureBackupDir()
    
    let backupPath
    if (type === 'incremental') {
      backupPath = await createIncrementalBackup()
      if (!backupPath) {
        console.log('No incremental backup needed')
        return
      }
    } else {
      backupPath = await exportDatabase()
    }
    
    // Compress the backup
    const compressedPath = await compressBackup(backupPath)
    
    // Upload to S3 if configured
    await uploadToS3(compressedPath)
    
    // Cleanup old backups
    await cleanupOldBackups()
    
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
    
    const details = [
      `Type: ${type}`,
      `Duration: ${duration}s`,
      `File: ${path.basename(compressedPath)}`,
      `Size: ${(await fs.stat(compressedPath)).size} bytes`
    ].join('\n')
    
    await sendNotification(true, details)
    console.log(`Backup completed successfully in ${duration}s`)
    
  } catch (error) {
    console.error('Backup failed:', error)
    await sendNotification(false, error.message)
    process.exit(1)
  }
}

// CLI interface
if (require.main === module) {
  const backupType = process.argv[2] || 'full'
  
  if (!['full', 'incremental'].includes(backupType)) {
    console.error('Usage: node backup-database.js [full|incremental]')
    process.exit(1)
  }
  
  performBackup(backupType)
    .then(() => {
      console.log('Backup process completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('Backup process failed:', error)
      process.exit(1)
    })
}

module.exports = {
  performBackup,
  exportDatabase,
  createIncrementalBackup,
  cleanupOldBackups
}
