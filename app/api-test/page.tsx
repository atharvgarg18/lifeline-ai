'use client'

import { useEffect, useState } from 'react'

export default function APITestPage() {
  const [apiKey, setApiKey] = useState<string>('')
  const [geocodeTest, setGeocodeTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    setApiKey(key || 'NOT FOUND')
    console.log('API Key from env:', key)
  }, [])

  const testGeocoding = async () => {
    setLoading(true)
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=Delhi&key=${apiKey}`
      console.log('Testing URL:', url)
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('Geocoding Response:', data)
      setGeocodeTest(data)
    } catch (err) {
      console.error('Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setGeocodeTest({ error: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Google Maps API Diagnostic</h1>
      
      <div className="space-y-6">
        {/* API Key Check */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">1. Environment Variable Check</h2>
          <div className="font-mono text-sm">
            <p className="mb-2"><strong>Key Status:</strong> {apiKey ? '✅ Found' : '❌ Not Found'}</p>
            {apiKey && apiKey !== 'NOT FOUND' && (
              <>
                <p className="mb-2"><strong>Key Preview:</strong> {apiKey.substring(0, 20)}...</p>
                <p className="mb-2"><strong>Key Length:</strong> {apiKey.length} characters</p>
                <p className="mb-2"><strong>Starts with:</strong> {apiKey.substring(0, 8)}</p>
              </>
            )}
          </div>
        </div>

        {/* Geocoding Test */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">2. Geocoding API Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            This tests if your API key works with the Geocoding API
          </p>
          
          <button
            onClick={testGeocoding}
            disabled={loading || !apiKey || apiKey === 'NOT FOUND'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Geocoding API'}
          </button>

          {geocodeTest && (
            <div className="mt-4 p-4 bg-gray-50 rounded border">
              <p className="font-semibold mb-2">
                Status: <span className={geocodeTest.status === 'OK' ? 'text-green-600' : 'text-red-600'}>
                  {geocodeTest.status || geocodeTest.error}
                </span>
              </p>
              
              {geocodeTest.error_message && (
                <p className="text-red-600 mb-2">Error: {geocodeTest.error_message}</p>
              )}
              
              <details>
                <summary className="cursor-pointer text-sm text-blue-600">View Full Response</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(geocodeTest, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">💡 If You See REQUEST_DENIED:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to Google Cloud Console: <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">console.cloud.google.com</a></li>
            <li>Go to "APIs & Services" → "Credentials"</li>
            <li>Click on your API key</li>
            <li><strong>Application restrictions:</strong> Select "None" (temporarily for testing)</li>
            <li><strong>API restrictions:</strong> Select "Don't restrict key" (temporarily for testing)</li>
            <li>Click "Save"</li>
            <li>Wait 1-2 minutes for changes to take effect</li>
            <li>Come back here and test again</li>
          </ol>
        </div>

        {/* Quick Fix */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Quick Fix Steps:</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Step 1:</strong> Copy this exact API key from your Google Cloud Console</p>
            <p><strong>Step 2:</strong> Open <code className="bg-white px-2 py-1 rounded">.env.local</code></p>
            <p><strong>Step 3:</strong> Replace the line with:</p>
            <pre className="bg-white p-2 rounded mt-2">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
            </pre>
            <p><strong>Step 4:</strong> Restart the dev server (Ctrl+C, then <code>npm run dev</code>)</p>
            <p><strong>Step 5:</strong> Hard refresh this page (Ctrl+Shift+R)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
