#!/usr/bin/env node

/**
 * DETAILED MongoDB Connection Diagnostic
 * Analyzes: DNS, network connectivity, credentials, and Mongoose behavior
 */

const mongoose = require('mongoose');
const dns = require('dns').promises;
const net = require('net');
require('dotenv').config();

async function testDNS() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 1. DNS RESOLUTION TEST');
  console.log('='.repeat(60));
  
  try {
    const hostname = 'cluster0.2i0o1zg.mongodb.net';
    console.log(`Testing DNS resolution for: ${hostname}`);
    
    const addresses = await dns.resolve4(hostname);
    console.log(`✅ DNS RESOLVED: ${hostname}`);
    console.log(`   IP Addresses: ${addresses.join(', ')}`);
    return true;
  } catch (error) {
    console.error(`❌ DNS FAILED: ${error.message}`);
    console.error('   Possible causes:');
    console.error('   - No internet connection');
    console.error('   - DNS server not responding');
    console.error('   - Firewall blocking DNS');
    return false;
  }
}

async function testNetworkConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 2. NETWORK CONNECTIVITY TEST');
  console.log('='.repeat(60));
  
  return new Promise((resolve) => {
    console.log('Attempting TCP connection to cluster0.2i0o1zg.mongodb.net:27017...');
    
    const socket = new net.Socket();
    const timeout = 5000;
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      console.log('✅ TCP Connection successful on port 27017');
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.error(`❌ TCP Connection TIMEOUT (${timeout}ms)`);
      console.error('   Possible causes:');
      console.error('   - Firewall blocking port 27017');
      console.error('   - MongoDB Atlas IP whitelist not including your IP');
      console.error('   - Network issues');
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.error(`❌ TCP Connection ERROR: ${err.message}`);
      console.error('   Possible causes:');
      console.error('   - Connection refused');
      console.error('   - Network unreachable');
      console.error('   - Firewall blocking connection');
      resolve(false);
    });
    
    socket.connect(27017, 'cluster0.2i0o1zg.mongodb.net');
  });
}

async function testMongooseConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 3. MONGOOSE CONNECTION TEST');
  console.log('='.repeat(60));
  
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not set in .env file');
    return false;
  }
  
  console.log(`Testing connection to: ${process.env.MONGO_URI.replace(/:[^:]*@/, ':****@')}`);
  console.log('Options: serverSelectionTimeoutMS=5000');
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4
    });
    
    console.log('✅ Mongoose Connection Successful');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   DB Name: ${conn.connection.name}`);
    console.log(`   Connection State: ${conn.connection.readyState === 1 ? 'CONNECTED' : 'CONNECTING'}`);
    
    await mongoose.connection.close();
    console.log('✅ Connection closed gracefully');
    return true;
  } catch (error) {
    console.error(`❌ Mongoose Connection Failed: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   -> Connection refused (server not accepting connections)');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.error('   -> Connection timeout (server not responding)');
    } else if (error.message.includes('EHOSTUNREACH')) {
      console.error('   -> Host unreachable (network routing issue)');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('   -> DNS resolution failed');
    } else if (error.message.includes('authentication failed')) {
      console.error('   -> Authentication failed (check username/password in .env)');
    }
    
    return false;
  }
}

async function testCredentials() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 4. CREDENTIALS VALIDATION');
  console.log('='.repeat(60));
  
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI not set');
    return false;
  }
  
  // Parse connection string
  try {
    const urlObj = new URL(uri);
    console.log('✅ Connection string is valid URL');
    console.log(`   Protocol: ${urlObj.protocol}`);
    console.log(`   Username: ${urlObj.username ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Password: ${urlObj.password ? '✅ Set (length: ' + urlObj.password.length + ')' : '❌ Missing'}`);
    console.log(`   Hostname: ${urlObj.hostname}`);
    console.log(`   Port: ${urlObj.port || 'default (27017)'}`);
    console.log(`   Database: ${urlObj.pathname.slice(1) || 'default (admin)'}`);
    
    return urlObj.username && urlObj.password;
  } catch (error) {
    console.error(`❌ Invalid connection string: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('\n');
  console.log('╔' + '='.repeat(58) + '╗');
  console.log('║     MONGODB CONNECTION DIAGNOSTIC SUITE                 ║');
  console.log('║     Analyzing: DNS, Network, Credentials, Mongoose      ║');
  console.log('╚' + '='.repeat(58) + '╝');
  
  const results = {
    dns: false,
    network: false,
    credentials: false,
    mongoose: false
  };
  
  // Test credentials first (quick test)
  results.credentials = await testCredentials();
  if (!results.credentials) {
    console.log('\n⚠️  Stopping tests - invalid credentials');
    process.exit(1);
  }
  
  // Test DNS
  results.dns = await testDNS();
  
  // Test network connectivity
  if (results.dns) {
    results.network = await testNetworkConnection();
  }
  
  // Test Mongoose
  if (results.network) {
    results.mongoose = await testMongooseConnection();
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`DNS Resolution:        ${results.dns ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Network Connectivity:  ${results.network ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Credentials Valid:     ${results.credentials ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Mongoose Connection:   ${results.mongoose ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n' + '='.repeat(60));
  if (results.mongoose) {
    console.log('✅ ALL TESTS PASSED - MongoDB is accessible!');
    console.log('   Server should start successfully');
    process.exit(0);
  } else {
    console.log('❌ TESTS FAILED - MongoDB is NOT accessible');
    
    if (!results.dns) {
      console.log('\n🔧 FIX: Check internet connection and DNS');
    } else if (!results.network) {
      console.log('\n🔧 FIX: MongoDB Atlas IP whitelist');
      console.log('   1. Go to https://cloud.mongodb.com');
      console.log('   2. Network Access > IP Whitelist');
      console.log('   3. Add your IP or 0.0.0.0/0');
    }
    
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
