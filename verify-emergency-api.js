#!/usr/bin/env node

/**
 * Verify Emergency API Endpoints
 * 
 * This script verifies that the HMS emergency API endpoints are working correctly.
 * 
 * Usage:
 *   node verify-emergency-api.js
 * 
 * Environment variables:
 *   BACKEND_URL - Backend API URL (default: http://localhost:3000)
 *   HMS_TOKEN - HMS authentication token (optional for some endpoints)
 *   HOSPITAL_ID - Hospital ID to check (default: HOSP-001)
 */

const https = require('https')
const http = require('http')

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const HMS_TOKEN = process.env.HMS_TOKEN
const HOSPITAL_ID = process.env.HOSPITAL_ID || 'HOSP-001'

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const urlObj = new URL(url)
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }

    const req = protocol.request(requestOptions, (res) => {
      let body = ''
      
      res.on('data', (chunk) => {
        body += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body)
          resolve({ status: res.statusCode, data: jsonBody })
        } catch (e) {
          resolve({ status: res.statusCode, data: body })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })
    
    req.end()
  })
}

async function checkHealth() {
  const url = `${BACKEND_URL}/api/v1/health`
  
  try {
    console.log('1️⃣  Checking backend health...')
    const response = await makeRequest(url, { method: 'GET' })
    
    if (response.status === 200) {
      console.log('   ✅ Backend is healthy')
      console.log(`   📊 Status: ${response.data.status}`)
      return true
    } else {
      console.log(`   ❌ Backend health check failed (status: ${response.status})`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Cannot reach backend: ${error.message}`)
    return false
  }
}

async function checkPendingEmergencies() {
  const url = `${BACKEND_URL}/api/v1/hms/emergency/pending?hospitalId=${HOSPITAL_ID}`
  
  try {
    console.log('\n2️⃣  Checking pending emergencies...')
    console.log(`   Hospital ID: ${HOSPITAL_ID}`)
    
    const headers = { 'Content-Type': 'application/json' }
    if (HMS_TOKEN) {
      headers['Authorization'] = `Bearer ${HMS_TOKEN}`
    }
    
    const response = await makeRequest(url, { 
      method: 'GET',
      headers 
    })
    
    if (response.status === 200) {
      const count = response.data.data?.requests?.length || 0
      console.log(`   ✅ API endpoint working`)
      console.log(`   📊 Pending requests: ${count}`)
      
      if (count > 0) {
        console.log('\n   📋 Emergency Requests:')
        response.data.data.requests.slice(0, 3).forEach((req, idx) => {
          console.log(`      ${idx + 1}. ${req.requestId} - Severity: ${req.severity}/10 - Bed: ${req.requiredBedType}`)
        })
        if (count > 3) {
          console.log(`      ... and ${count - 3} more`)
        }
      } else {
        console.log('   ℹ️  No pending emergency requests found')
        console.log('   💡 Tip: Create test emergencies using create-test-emergency.js')
      }
      return true
    } else if (response.status === 401) {
      console.log('   ⚠️  Authentication required (401)')
      console.log('   💡 Set HMS_TOKEN environment variable')
      return false
    } else {
      console.log(`   ❌ API request failed (status: ${response.status})`)
      console.log(`   📄 Response: ${JSON.stringify(response.data, null, 2)}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function checkBedAvailability() {
  const url = `${BACKEND_URL}/api/v1/hms/beds/availability?hospitalId=${HOSPITAL_ID}`
  
  try {
    console.log('\n3️⃣  Checking bed availability...')
    
    const headers = { 'Content-Type': 'application/json' }
    if (HMS_TOKEN) {
      headers['Authorization'] = `Bearer ${HMS_TOKEN}`
    }
    
    const response = await makeRequest(url, {
      method: 'GET',
      headers
    })
    
    if (response.status === 200) {
      console.log('   ✅ Bed availability API working')
      
      const availability = response.data.data?.availability || {}
      console.log('\n   📊 Available Beds by Type:')
      
      Object.entries(availability).forEach(([type, count]) => {
        console.log(`      ${type}: ${count} available`)
      })
      
      return true
    } else {
      console.log(`   ❌ Bed availability check failed (status: ${response.status})`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🔍 HMS Emergency API Verification')
  console.log('='.repeat(60))
  console.log(`\nBackend URL: ${BACKEND_URL}`)
  console.log(`Hospital ID: ${HOSPITAL_ID}`)
  console.log(`HMS Token: ${HMS_TOKEN ? '✅ Set' : '❌ Not set (some checks may fail)'}\n`)
  
  const healthOk = await checkHealth()
  
  if (!healthOk) {
    console.log('\n❌ Backend is not reachable. Cannot continue with other checks.')
    console.log('\n💡 Troubleshooting:')
    console.log('   - Verify BACKEND_URL is correct')
    console.log('   - Check if backend is running')
    console.log('   - For production: https://your-backend.onrender.com')
    console.log('   - For local: http://localhost:3000')
    process.exit(1)
  }
  
  const emergencyOk = await checkPendingEmergencies()
  await checkBedAvailability()
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`Backend Health: ${healthOk ? '✅' : '❌'}`)
  console.log(`Emergency API: ${emergencyOk ? '✅' : '❌'}`)
  
  if (emergencyOk) {
    console.log('\n✅ Emergency API is working correctly!')
    console.log('\n📱 Next Steps:')
    console.log('   1. Open HMS: https://your-hms.vercel.app/dashboard/emergency')
    console.log('   2. Verify emergencies show up in UI')
    console.log('   3. Test accept/reject functionality')
  } else {
    console.log('\n⚠️  Some checks failed. See above for details.')
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

module.exports = { checkHealth, checkPendingEmergencies, checkBedAvailability }
