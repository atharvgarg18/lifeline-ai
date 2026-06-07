#!/usr/bin/env node

/**
 * Create Test Emergency SOS Request
 * 
 * This script helps create test emergency SOS requests for testing the HMS emergency flow.
 * 
 * Usage:
 *   node create-test-emergency.js
 * 
 * Environment variables:
 *   BACKEND_URL - Backend API URL (default: http://localhost:3000)
 *   PATIENT_TOKEN - Patient authentication token (required)
 */

const https = require('https')
const http = require('http')

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const PATIENT_TOKEN = process.env.PATIENT_TOKEN

// Test data
const TEST_EMERGENCIES = [
  {
    name: 'Cardiac Emergency',
    symptoms: ['chest pain', 'shortness of breath', 'sweating'],
    severity: 9,
    latitude: 28.6139,
    longitude: 77.2090,
    description: 'Severe chest pain, difficulty breathing, cold sweats',
    medicalHistory: 'Hypertension, previous heart condition',
    contactName: 'Emergency Contact',
    contactPhone: '+91-9999999999'
  },
  {
    name: 'Accident Trauma',
    symptoms: ['severe bleeding', 'fracture', 'head injury'],
    severity: 8,
    latitude: 28.6200,
    longitude: 77.2150,
    description: 'Road accident with multiple injuries',
    medicalHistory: 'No known medical conditions',
    contactName: 'Family Member',
    contactPhone: '+91-8888888888'
  },
  {
    name: 'Respiratory Distress',
    symptoms: ['difficulty breathing', 'cough', 'fever'],
    severity: 7,
    latitude: 28.6100,
    longitude: 77.2000,
    description: 'High fever with severe breathing difficulty',
    medicalHistory: 'Asthma',
    contactName: 'Spouse',
    contactPhone: '+91-7777777777'
  },
  {
    name: 'Allergic Reaction',
    symptoms: ['swelling', 'rash', 'difficulty breathing'],
    severity: 8,
    latitude: 28.6180,
    longitude: 77.2120,
    description: 'Severe allergic reaction after food intake',
    medicalHistory: 'Known food allergies',
    contactName: 'Friend',
    contactPhone: '+91-6666666666'
  },
  {
    name: 'Stroke Symptoms',
    symptoms: ['facial drooping', 'arm weakness', 'speech difficulty'],
    severity: 10,
    latitude: 28.6150,
    longitude: 77.2080,
    description: 'Sudden onset of stroke symptoms',
    medicalHistory: 'Diabetes, high cholesterol',
    contactName: 'Daughter',
    contactPhone: '+91-5555555555'
  }
]

function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const urlObj = new URL(url)
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
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

    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

async function createEmergency(emergency) {
  const url = `${BACKEND_URL}/api/v1/emergency-sos/trigger`
  
  try {
    console.log(`\n🚨 Creating emergency: ${emergency.name}`)
    console.log(`   Severity: ${emergency.severity}/10`)
    console.log(`   Location: ${emergency.latitude}, ${emergency.longitude}`)
    
    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PATIENT_TOKEN}`
      }
    }, emergency)

    if (response.status === 200 || response.status === 201) {
      console.log(`   ✅ Success! Emergency ID: ${response.data.data?.emergencyId}`)
      console.log(`   📤 Dispatched to ${response.data.data?.dispatchedTo?.length || 0} hospitals`)
      return response.data
    } else {
      console.log(`   ❌ Failed: ${response.data.message || response.data}`)
      return null
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return null
  }
}

async function main() {
  console.log('='.repeat(60))
  console.log('🏥 Emergency SOS Test Data Creator')
  console.log('='.repeat(60))
  console.log(`\nBackend URL: ${BACKEND_URL}`)
  
  if (!PATIENT_TOKEN) {
    console.log('\n❌ ERROR: PATIENT_TOKEN environment variable is required!')
    console.log('\nUsage:')
    console.log('  PATIENT_TOKEN=your_token node create-test-emergency.js')
    console.log('\nOr for production:')
    console.log('  BACKEND_URL=https://your-backend.onrender.com PATIENT_TOKEN=your_token node create-test-emergency.js')
    process.exit(1)
  }

  console.log(`\nWill create ${TEST_EMERGENCIES.length} test emergencies...\n`)

  let successCount = 0
  let failCount = 0

  for (const emergency of TEST_EMERGENCIES) {
    const result = await createEmergency(emergency)
    if (result) {
      successCount++
    } else {
      failCount++
    }
    
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${TEST_EMERGENCIES.length}`)
  console.log('\n✨ Done! Check your HMS dashboard for emergency requests.')
  console.log('   URL: https://your-hms.vercel.app/dashboard/emergency')
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

module.exports = { createEmergency, TEST_EMERGENCIES }
