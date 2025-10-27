#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌱 SEED - Configurando proyecto...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create .env files if they don't exist
const backendEnvPath = path.join(__dirname, '../backend/.env');
const backendEnvExamplePath = path.join(__dirname, '../backend/.env.example');

if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
  fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
  console.log('✅ Created backend/.env file from example');
}

// Install dependencies
console.log('\n📦 Installing dependencies...\n');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\nInstalling backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('\nInstalling frontend dependencies...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  
  console.log('\n✅ All dependencies installed successfully!');
  
} catch (error) {
  console.error('\n❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create database setup instructions
const dbInstructions = `
📊 DATABASE SETUP REQUIRED:

1. Go to your Supabase project: https://raehwuosfeaofhvlvybq.supabase.co
2. Navigate to SQL Editor
3. Copy and paste the contents of database/schema.sql
4. Execute the SQL script
5. Verify tables are created successfully

🔧 CONFIGURATION:

Backend API: http://localhost:5000
Frontend App: http://localhost:3000
Database: Supabase (PostgreSQL)

🚀 TO START DEVELOPMENT:

npm run dev

This will start both backend and frontend servers.
`;

console.log(dbInstructions);

console.log('\n🎉 Setup completed successfully!');
console.log('Run "npm run dev" to start the development servers.');
