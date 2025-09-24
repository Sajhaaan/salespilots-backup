import { ProductionDB } from '../lib/database-production.js'
import { hashPassword } from '../lib/auth.js'

async function initializeDemoAdmin() {
  try {
    console.log('🔧 Initializing Demo Admin User')
    console.log('================================\n')

    // Initialize demo data (this will create the admin user)
    await ProductionDB.initializeDemoData()
    
    console.log('\n🎉 Demo admin user initialized!')
    console.log('📝 Login credentials:')
    console.log('   Email: admin@salespilot.io')
    console.log('   Password: admin123')
    console.log('\n✅ You can now log in to the admin panel!')

  } catch (error) {
    console.error('❌ Failed to initialize demo admin:', error)
  }
}

// Run the initialization
initializeDemoAdmin()
