#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 SEED - Starting development servers...\n');

// Start backend
console.log('🚀 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '../backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend
console.log('🎨 Starting frontend server...');
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, '../frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// Handle errors
backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('\n✅ Development servers started!');
console.log('📊 Backend: http://localhost:5000');
console.log('🎨 Frontend: http://localhost:3000');
console.log('\nPress Ctrl+C to stop both servers');
