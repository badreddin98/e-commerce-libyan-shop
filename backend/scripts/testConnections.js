const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const connectDB = require('../config/db');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testMongoDB() {
  console.log('\n🔍 Testing MongoDB Connection...');
  try {
    await connectDB();
    console.log('✅ MongoDB Connection: SUCCESS');
    
    // Test database operations
    const collections = await mongoose.connection.db.collections();
    console.log(`📊 Available collections: ${collections.map(c => c.collectionName).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function testExpressServer() {
  console.log('\n🔍 Testing Express Server...');
  try {
    const app = express();
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Express Server: SUCCESS (Port ${PORT})`);
      server.close();
    });
    
    return new Promise((resolve) => {
      server.on('error', (error) => {
        console.error('❌ Express Server: FAILED');
        console.error('Error:', error.message);
        resolve(false);
      });
      
      server.on('listening', () => {
        resolve(true);
      });
    });
  } catch (error) {
    console.error('❌ Express Server: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔍 Testing Environment Variables...');
  const requiredVars = ['MONGODB_URI', 'PORT', 'NODE_ENV'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('✅ Environment Variables: SUCCESS');
    return true;
  } else {
    console.error('❌ Environment Variables: FAILED');
    console.error('Missing variables:', missingVars.join(', '));
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Connection Tests...\n');
  
  const envResult = await testEnvironmentVariables();
  const dbResult = await testMongoDB();
  const serverResult = await testExpressServer();
  
  console.log('\n📝 Test Summary:');
  console.log('================');
  console.log(`Environment Variables: ${envResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`MongoDB Connection: ${dbResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Express Server: ${serverResult ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = envResult && dbResult && serverResult;
  console.log('\n================');
  console.log(`Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run all tests
runAllTests();
