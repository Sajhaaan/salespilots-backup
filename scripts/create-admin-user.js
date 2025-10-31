const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')
require('dotenv').config()

// Supabase configuration - load from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables')
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Password hashing function (same as in lib/auth.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const iterations = 120_000
  const keylen = 64
  const digest = 'sha512'
  const derived = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex')
  return `pbkdf2$${iterations}$${digest}$${salt}$${derived}`
}

async function createAdminUser() {
  try {
    console.log('👑 Creating Admin User');
    console.log('========================\n');

    const email = 'admin@salespilot.io'
    const password = 'admin123' // You can change this
    const passwordHash = hashPassword(password)

    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🔐 Password hash generated');

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('auth_users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('⚠️  User already exists, updating password...');
      
      const { error: updateError } = await supabase
        .from('auth_users')
        .update({ 
          password_hash: passwordHash,
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.log('❌ Error updating user:', updateError);
        return;
      }

      console.log('✅ User updated successfully!');
    } else {
      console.log('🆕 Creating new admin user...');
      
      const newUser = {
        id: crypto.randomUUID(), // Generate a UUID for the id
        email: email,
        password_hash: passwordHash,
        first_name: 'Admin',
        last_name: 'User',
        email_verified: true,
        role: 'admin',
        created_at: new Date().toISOString()
      };

      const { data: createdUser, error: createError } = await supabase
        .from('auth_users')
        .insert([newUser])
        .select()
        .single();

      if (createError) {
        console.log('❌ Error creating user:', createError);
        return;
      }

      console.log('✅ Admin user created successfully!');
      console.log('   ID:', createdUser.id);
    }

    console.log('\n🎉 Admin user is ready!');
    console.log('📝 Login credentials:');
    console.log('   Email: admin@salespilot.io');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }
}

async function createRegularUser() {
  try {
    console.log('\n👤 Creating Regular User');
    console.log('========================\n');

    const email = 'user@salespilot.io'
    const password = 'user123' // You can change this
    const passwordHash = hashPassword(password)

    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🔐 Password hash generated');

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('auth_users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('⚠️  User already exists, updating password...');
      
      const { error: updateError } = await supabase
        .from('auth_users')
        .update({ 
          password_hash: passwordHash,
          role: 'user',
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.log('❌ Error updating user:', updateError);
        return;
      }

      console.log('✅ User updated successfully!');
    } else {
      console.log('🆕 Creating new regular user...');
      
      const newUser = {
        id: crypto.randomUUID(), // Generate a UUID for the id
        email: email,
        password_hash: passwordHash,
        first_name: 'Regular',
        last_name: 'User',
        email_verified: true,
        role: 'user',
        created_at: new Date().toISOString()
      };

      const { data: createdUser, error: createError } = await supabase
        .from('auth_users')
        .insert([newUser])
        .select()
        .single();

      if (createError) {
        console.log('❌ Error creating user:', createError);
        return;
      }

      console.log('✅ Regular user created successfully!');
      console.log('   ID:', createdUser.id);
    }

    console.log('\n🎉 Regular user is ready!');
    console.log('📝 Login credentials:');
    console.log('   Email: user@salespilot.io');
    console.log('   Password: user123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Failed to create regular user:', error);
  }
}

// Run the scripts
createAdminUser();
createRegularUser();
