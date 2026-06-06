'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { geolocationService, Coordinates } from '@/services/geolocation.service'
import { placesService, PlaceResult } from '@/services/places.service'
import {
  MapPin,
  Phone,
  Star,
  Navigation,
  Loader,
  AlertCircle,
  Building2,
  Clock,
  Heart,
  AlertTriangle,
  Shield,
  Truck,
  ExternalLink,
} from 'lucide-react'

export default function HospitalsPage() {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [hospitals, setHospitals] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState<string>('Detecting location...')
  const [filter, setFilter] = useState({
    radius: 10000, // 10km
    emergency: false,
    minRating: 0,
    openNow: false,
  })

  // Initialize geolocation
  useEffect(() => {
    const initLocation = async () => {
      try {
        // Check if supported
        if (!geolocationService.isSupported()) {
          setError('Geolocation is not supported by your browser')
          setLoading(false)
          return
        }

        // Request permission and get location
        const hasPermission = await geolocationService.requestPermission()

        if (hasPermission) {
          // Start continuous tracking
          geolocationService.startWatching({
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 15000,
          })

          // Subscribe to location updates
          const unsubscribe = geolocationService.subscribe(async (coords) => {
            setLocation(coords)
            setError(null)

            // Get address name
            try {
              const address = await geolocationService.getAddressFromCoords(coords)
              setLocationName(address)
            } catch (err) {
              setLocationName(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`)
            }
          })

          // Get initial position
          try {
            const current = await geolocationService.getCurrentPosition()
            setLocation(current)
            const address = await geolocationService.getAddressFromCoords(current)
            setLocationName(address)
          } catch (err: any) {
            setError(err.message)
          }

          return () => {
            unsubscribe()
            geolocationService.stopWatching()
          }
        } else {
          setError('Location permission denied. Please enable location access.')
          setLoading(false)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to get location')
        setLoading(false)
      }
    }

    initLocation()
  }, [])

  // Search hospitals when location or filters change
  useEffect(() => {
    if (!location) return

    const searchHospitals = async () => {
      setLoading(true)
      try {
        const results = await placesService.findNearbyHospitals(location, filter.radius, {
          emergency: filter.emergency,
          minRating: filter.minRating,
          openNow: filter.openNow,
        })
        setHospitals(results)
      } catch (err: any) {
        setError(err.message || 'Failed to load hospitals')
      } finally {
        setLoading(false)
      }
    }

    searchHospitals()
  }, [location, filter])

  const handleGetDirections = (hospital: PlaceResult) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`
    window.open(url, '_blank')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const stats = {
    total: hospitals.length,
    emergency: hospitals.filter((h) => h.types.includes('emergency')).length,
    available24x7: hospitals.filter((h) => h.isOpen).length,
    avgRating: hospitals.length
      ? (hospitals.reduce((sum, h) => sum + (h.rating || 0), 0) / hospitals.filter((h) => h.rating).length).toFixed(1)
      : '0',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hospitals Near You</h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                {locationName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilter({ ...filter, emergency: !filter.emergency })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter.emergency
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency Only
              </button>
              <button
                onClick={() => setFilter({ ...filter, openNow: !filter.openNow })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter.openNow
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                Open Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && hospitals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Hospitals</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.available24x7}</p>
                  <p className="text-sm text-gray-600">Open Now</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.emergency}</p>
                  <p className="text-sm text-gray-600">Emergency Care</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius</label>
              <select
                value={filter.radius}
                onChange={(e) => setFilter({ ...filter, radius: Number(e.target.value) })}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={20000}>20 km</option>
                <option value={50000}>50 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={filter.minRating}
                onChange={(e) => setFilter({ ...filter, minRating: Number(e.target.value) })}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Real-time data from OpenStreetMap (FREE!)</p>
                <p>Showing results within {filter.radius / 1000} km of your location</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Permission Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-1" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-900 mb-2">Location Access Required</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 text-sm"
                >
                  Enable Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Finding hospitals near you...</p>
          </div>
        </div>
      )}

      {/* Hospitals List */}
      {!loading && hospitals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                {hospital.photos && hospital.photos[0] && (
                  <img
                    src={hospital.photos[0]}
                    alt={hospital.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{hospital.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{hospital.address}</span>
                    </div>

                    {hospital.distance && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-primary-600">
                          {hospital.distance.toFixed(1)} km away
                        </span>
                      </div>
                    )}

                    {hospital.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">{hospital.rating}</span>
                        <span className="text-gray-500 ml-1">({hospital.totalRatings})</span>
                      </div>
                    )}

                    {hospital.isOpen !== undefined && (
                      <div className="flex items-center text-sm">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            hospital.isOpen ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className={hospital.isOpen ? 'text-green-600' : 'text-red-600'}>
                          {hospital.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGetDirections(hospital)}
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Directions
                    </button>
                    {hospital.phone && (
                      <button
                        onClick={() => handleCall(hospital.phone!)}
                        className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && hospitals.length === 0 && location && !error && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            No hospitals found within {filter.radius / 1000} km of your location.
          </p>
          <button
            onClick={() => setFilter({ ...filter, radius: filter.radius * 2 })}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Expand Search Radius
          </button>
        </div>
      )}
    </div>
  )
}
