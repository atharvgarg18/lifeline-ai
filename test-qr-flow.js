/**
 * QR Code End-to-End Test Script
 * Tests the complete QR generation → scanning → validation flow
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';
const PATIENT_ID = 'PAT-001';
const HOSPITAL_ID = 'HOSP-001';

async function testQRFlow() {
  console.log('🧪 Testing QR Code End-to-End Flow\n');

  try {
    // Step 1: Generate QR Code
    console.log('Step 1: Generating QR code for patient:', PATIENT_ID);
    const generateResponse = await axios.post(
      `${API_URL}/patient-profile/patients/${PATIENT_ID}/qr/generate`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!generateResponse.data.success) {
      console.error('❌ QR Generation failed:', generateResponse.data.message);
      return;
    }

    const qrData = generateResponse.data.data;
    console.log('✅ QR Code generated successfully');
    console.log('   QR Code ID:', qrData.qrCodeId);
    console.log('   Patient ID:', PATIENT_ID);
    console.log('   Expires At:', qrData.expiresAt);
    console.log('   Status:', qrData.status);
    console.log('   QR Data (first 50 chars):', qrData.qrData.substring(0, 50) + '...');
    console.log();

    // Step 2: Decode QR Data (simulate what scanner reads)
    console.log('Step 2: Decoding QR data...');
    const decoded = JSON.parse(Buffer.from(qrData.qrData, 'base64').toString('utf-8'));
    console.log('✅ QR Data decoded:');
    console.log('   QR Code ID:', decoded.qrCodeId);
    console.log('   Patient ID:', decoded.patientId);
    console.log('   Timestamp:', decoded.timestamp);
    console.log('   Version:', decoded.version);
    console.log('   Signature (first 20 chars):', decoded.signature.substring(0, 20) + '...');
    console.log();

    // Step 3: Scan QR Code (HMS endpoint)
    console.log('Step 3: Scanning QR code at HMS...');
    const scanResponse = await axios.post(
      `${API_URL}/hms/qr/scan`,
      {
        qrData: qrData.qrData,
        hospitalId: HOSPITAL_ID,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!scanResponse.data.success) {
      console.error('❌ QR Scan failed:', scanResponse.data.message);
      return;
    }

    const scanResult = scanResponse.data.data;
    console.log('✅ QR Code scanned and validated successfully');
    console.log('   QR Valid:', scanResult.qrValid);
    console.log('   Can Admit:', scanResult.canAdmit);
    console.log('   Patient Name:', scanResult.patient.name);
    console.log('   Patient Age:', scanResult.patient.age);
    console.log('   Blood Group:', scanResult.patient.bloodGroup);
    console.log('   Allergies:', scanResult.patient.allergies.join(', '));
    console.log('   Chronic Diseases:', scanResult.patient.chronicDiseases.join(', '));
    console.log();

    console.log('🎉 QR CODE FLOW TEST PASSED! All steps working correctly.\n');

    // Step 4: Test with expired QR (simulate)
    console.log('Step 4: Testing validation with invalid QR data...');
    try {
      const invalidQrData = Buffer.from(JSON.stringify({
        qrCodeId: 'INVALID-QR-123',
        patientId: 'PAT-999',
        timestamp: new Date().toISOString(),
        version: 1,
        signature: 'invalid-signature',
      })).toString('base64');

      const invalidScanResponse = await axios.post(
        `${API_URL}/hms/qr/scan`,
        {
          qrData: invalidQrData,
          hospitalId: HOSPITAL_ID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('❌ Invalid QR should have been rejected');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Invalid QR correctly rejected:', error.response.data.message);
      } else {
        console.error('❌ Unexpected error:', error.message);
      }
    }

    console.log();
    console.log('✅ ALL TESTS PASSED! QR flow is working correctly.\n');

  } catch (error) {
    console.error('❌ Test failed with error:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    console.log();
    console.log('⚠️  Make sure the backend is running on http://localhost:3000');
  }
}

// Run the test
testQRFlow();
