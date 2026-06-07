'use client'

import { useState } from 'react'

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    try {
      // Test location: Jabalpur, India
      const lat = 23.2002
      const lng = 79.8815
      const radius = 10000 // 10km

      console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND')
      
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&key=${apiKey}`
      
      console.log('Calling URL:', url.replace(apiKey!, 'API_KEY_HIDDEN'))
      
      const response = await fetch(url)
      const data = await response.json()
      
      console.log('Response:', data)
      setResult(data)
      
      if (data.error_message) {
        setError(data.error_message)
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testCORS = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Test if we can reach Google at all
      const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=23.2002,79.8815&radius=5000&type=hospital&key=' + process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      const data = await response.json()
      console.log('CORS Test Result:', data)
      setResult(data)
    } catch (err: any) {
      console.error('CORS Error:', err)
      setError('CORS Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Google Maps API Diagnostic</h1>
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
        <div className="space-y-2 font-mono text-sm">
          <p>
            <strong>API Key Present:</strong>{' '}
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ YES' : '❌ NO'}
          </p>
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <p>
              <strong>API Key Preview:</strong>{' '}
              {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 15)}...
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={testAPI}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Places API (Nearby Search)'}
        </button>
        
        <button
          onClick={testCORS}
          disabled={loading}
          className="ml-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test CORS'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-900 mb-2">Error:</h3>
          <p className="text-red-700 font-mono text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">API Response:</h3>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong>{' '}
              <span className={result.status === 'OK' ? 'text-green-600' : 'text-red-600'}>
                {result.status}
              </span>
            </div>
            
            {result.error_message && (
              <div>
                <strong className="text-red-600">Error Message:</strong>
                <p className="text-red-600 mt-1">{result.error_message}</p>
              </div>
            )}
            
            {result.results && (
              <div>
                <strong>Results Found:</strong> {result.results.length}
                {result.results.length > 0 && (
                  <div className="mt-2">
                    <strong>First Result:</strong>
                    <pre className="mt-2 p-4 bg-white rounded border text-xs overflow-auto">
                      {JSON.stringify(result.results[0], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Full Response (Click to expand)</summary>
              <pre className="mt-2 p-4 bg-white rounded border text-xs overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}
