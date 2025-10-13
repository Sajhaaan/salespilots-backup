const fs = require('fs');
const path = require('path');

// Paths to data files
const authUsersPath = path.join(process.cwd(), 'data', 'auth_users.json');
const usersPath = path.join(process.cwd(), 'data', 'users.json');
const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
const messagesPath = path.join(process.cwd(), 'data', 'messages.json');
const paymentsPath = path.join(process.cwd(), 'data', 'payments.json');
const productsPath = path.join(process.cwd(), 'data', 'products.json');
const customersPath = path.join(process.cwd(), 'data', 'customers.json');

// Read JSON file safely
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Write JSON file safely
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
  }
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Fix user profiles
function fixUserProfiles() {
  console.log('🔧 Fixing user profiles...');
  
  const authUsers = readJsonFile(authUsersPath);
  const users = readJsonFile(usersPath);
  
  // Create a map of existing user profiles
  const existingUserMap = new Map();
  users.forEach(user => {
    existingUserMap.set(user.authUserId, user);
  });
  
  // Check each auth user and create profile if missing
  authUsers.forEach(authUser => {
    if (!existingUserMap.has(authUser.id)) {
      console.log(`⚠️ Missing profile for: ${authUser.email} (${authUser.id})`);
      
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        authUserId: authUser.id,
        email: authUser.email,
        businessName: `${authUser.firstName || 'User'}'s Business`,
        businessType: "General",
        instagramHandle: "",
        description: `Business profile for ${authUser.email}`,
        targetAudience: "General customers",
        responseStyle: "friendly",
        businessHours: "9:00 AM - 6:00 PM",
        currency: "INR",
        location: "India",
        subscriptionPlan: authUser.role === 'admin' ? 'enterprise' : 'free',
        instagramConnected: false,
        whatsappConnected: false,
        automationEnabled: false,
        storeSetupCompleted: false,
        role: authUser.role || 'user',
        createdAt: authUser.createdAt || new Date().toISOString()
      };
      
      users.push(newUser);
      console.log(`✅ Created profile for: ${authUser.email}`);
    }
  });
  
  writeJsonFile(usersPath, users);
  console.log(`📊 Total users: ${users.length}`);
}

// Initialize empty data files if they don't exist
function initializeDataFiles() {
  console.log('📁 Initializing data files...');
  
  const files = [
    { path: ordersPath, data: [] },
    { path: messagesPath, data: [] },
    { path: paymentsPath, data: [] },
    { path: productsPath, data: [] },
    { path: customersPath, data: [] }
  ];
  
  files.forEach(file => {
    if (!fs.existsSync(file.path)) {
      writeJsonFile(file.path, file.data);
    }
  });
}

// Create sample data for testing
function createSampleData() {
  console.log('📝 Creating sample data for testing...');
  
  const users = readJsonFile(usersPath);
  if (users.length === 0) {
    console.log('⚠️ No users found, skipping sample data creation');
    return;
  }
  
  // Get the first user for sample data
  const sampleUser = users[0];
  
  // Create sample orders
  const orders = readJsonFile(ordersPath);
  if (orders.length === 0) {
    const sampleOrders = [
      {
        id: `order-${Date.now()}-1`,
        userId: sampleUser.id,
        customerName: "John Doe",
        customerInstagram: "@johndoe",
        customerPhone: "+91-9876543210",
        productName: "Premium T-Shirt",
        productPrice: 999,
        quantity: 1,
        totalAmount: 999,
        status: "delivered",
        paymentStatus: "verified",
        notes: "Sample order for testing",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString()
      },
      {
        id: `order-${Date.now()}-2`,
        userId: sampleUser.id,
        customerName: "Jane Smith",
        customerInstagram: "@janesmith",
        customerPhone: "+91-9876543211",
        productName: "Cotton Hoodie",
        productPrice: 1499,
        quantity: 2,
        totalAmount: 2998,
        status: "pending",
        paymentStatus: "pending",
        notes: "Another sample order",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeJsonFile(ordersPath, sampleOrders);
  }
  
  // Create sample messages
  const messages = readJsonFile(messagesPath);
  if (messages.length === 0) {
    const sampleMessages = [
      {
        id: `msg-${Date.now()}-1`,
        userId: sampleUser.id,
        customerInstagram: "@johndoe",
        messageText: "Hi, I'm interested in your products",
        isFromCustomer: true,
        language: "english",
        category: "inquiry",
        processed: true,
        createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: `msg-${Date.now()}-2`,
        userId: sampleUser.id,
        customerInstagram: "@johndoe",
        messageText: "Thank you for your inquiry! Here are our latest products...",
        isFromCustomer: false,
        language: "english",
        category: "inquiry",
        processed: true,
        createdAt: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      }
    ];
    writeJsonFile(messagesPath, sampleMessages);
  }
  
  // Create sample payments
  const payments = readJsonFile(paymentsPath);
  if (payments.length === 0) {
    const samplePayments = [
      {
        id: `payment-${Date.now()}-1`,
        orderId: `order-${Date.now()}-1`,
        userId: sampleUser.id,
        customerName: "John Doe",
        amount: 999,
        paymentMethod: "UPI",
        paymentProvider: "Paytm",
        status: "completed",
        transactionId: "TXN123456789",
        verified: true,
        verificationStatus: "verified",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    writeJsonFile(paymentsPath, samplePayments);
  }
  
  // Create sample products
  const products = readJsonFile(productsPath);
  if (products.length === 0) {
    const sampleProducts = [
      {
        id: `prod-${Date.now()}-1`,
        userId: sampleUser.id,
        name: "Premium T-Shirt",
        description: "High-quality cotton t-shirt",
        price: 999,
        category: "Clothing",
        stock: 50,
        sku: "TSH-001",
        status: "active",
        images: [],
        tags: ["cotton", "premium", "comfortable"],
        colors: ["white", "black", "blue"],
        sizes: ["S", "M", "L", "XL"],
        material: "100% Cotton",
        weight: 200,
        dimensions: "Regular fit",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `prod-${Date.now()}-2`,
        userId: sampleUser.id,
        name: "Cotton Hoodie",
        description: "Warm and comfortable hoodie",
        price: 1499,
        category: "Clothing",
        stock: 25,
        sku: "HOD-001",
        status: "active",
        images: [],
        tags: ["hoodie", "warm", "comfortable"],
        colors: ["gray", "black"],
        sizes: ["M", "L", "XL"],
        material: "Cotton blend",
        weight: 400,
        dimensions: "Oversized fit",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeJsonFile(productsPath, sampleProducts);
  }
  
  // Create sample customers
  const customers = readJsonFile(customersPath);
  if (customers.length === 0) {
    const sampleCustomers = [
      {
        id: `cust-${Date.now()}-1`,
        userId: sampleUser.id,
        instagramUsername: "@johndoe",
        name: "John Doe",
        phone: "+91-9876543210",
        email: "john.doe@example.com",
        totalOrders: 1,
        totalSpent: 999,
        lastInteraction: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `cust-${Date.now()}-2`,
        userId: sampleUser.id,
        instagramUsername: "@janesmith",
        name: "Jane Smith",
        phone: "+91-9876543211",
        email: "jane.smith@example.com",
        totalOrders: 1,
        totalSpent: 2998,
        lastInteraction: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    writeJsonFile(customersPath, sampleCustomers);
  }
}

// Main function
function main() {
  console.log('🚀 Starting SalesPilots data fix...');
  
  ensureDataDir();
  fixUserProfiles();
  initializeDataFiles();
  
  console.log('✅ Data fix completed!');
  console.log('📊 Summary:');
  console.log(`- Auth users: ${readJsonFile(authUsersPath).length}`);
  console.log(`- User profiles: ${readJsonFile(usersPath).length}`);
  console.log(`- Orders: ${readJsonFile(ordersPath).length}`);
  console.log(`- Messages: ${readJsonFile(messagesPath).length}`);
  console.log(`- Payments: ${readJsonFile(paymentsPath).length}`);
  console.log(`- Products: ${readJsonFile(productsPath).length}`);
  console.log(`- Customers: ${readJsonFile(customersPath).length}`);
}

// Run the script
main();
