// Application startup initialization
import { ProductionDB } from './database-production'
import { initializeInstagram } from './instagram-api'

let initialized = false

export async function initializeApp() {
  if (initialized) return
  
  try {
    console.log('🚀 Initializing SalesPilots application...')
    
    // Initialize database with demo data
    await ProductionDB.initializeDemoData()
    
    // Initialize Instagram with API ID
    await initializeInstagram()
    
    initialized = true
    console.log('✅ Application initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize application:', error)
    // Don't throw - let the app continue in degraded mode
  }
}

// Auto-initialize on import in production
if (typeof window === 'undefined') {
  initializeApp()
}
