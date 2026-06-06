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
  Truck,
  Clock,
  ExternalLink,
  Shield,
  Activity,
  Zap,
} from 'lucide-react'

export default function AmbulancesPage() {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [ambulances, setAmbulances] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState<string>('Detecting location...')
  const [filter, setFilter] = useState({
    radius: 15000, // 15km for ambulances
    minRating: 0,
  })

  // Initialize geolocation
  useEffect(() => {
    const initLocation = async () => {
      try {
        if (!geolocationService.isSupported()) {
          setError('Geolocation is not supported by your browser')
          setLoading(false)
          return
        }

        const hasPermission = await geolocationService.requestPermission()

        if (hasPermission) {
          geolocationService.startWatching({
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 15000,
          })

          const unsubscribe = geolocationService.subscribe(async (coords) => {
            setLocation(coords)
            setError(null)

            try {
              const address = await geolocationService.getAddressFromCoords(coords)
              setLocationName(address)
            } catch (err) {
              setLocationName(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`)
            }
          })

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

  // Search ambulances when location or filters change
  useEffect(() => {
    if (!location) return

    const searchAmbulances = async () => {
      setLoading(true)
      try {
        const results = await placesService.findNearbyAmbulances(location, filter.radius)
        
        // Apply rating filter
        let filtered = results
        if (filter.minRating > 0) {
          filtered = filtered.filter((a) => a.rating && a.rating >= filter.minRating)
        }
        
        setAmbulances(filtered)
      } catch (err: any) {
        setError(err.message || 'Failed to load ambulance services')
      } finally {
        setLoading(false)
      }
    }

    searchAmbulances()
  }, [location, filter])

  const handleGetDirections = (ambulance: PlaceResult) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${ambulance.location.lat},${ambulance.location.lng}`
    window.open(url, '_blank')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleEmergencyCall = () => {
    window.location.href = 'tel:108' // Indian emergency ambulance number
  }

  const stats = {
    total: ambulances.length,
    nearest: ambulances.length > 0 ? ambulances[0].distance?.toFixed(1) : '0',
    avgRating: ambulances.length
      ? (ambulances.reduce((sum, a) => sum + (a.rating || 0), 0) / ambulances.filter((a) => a.rating).length).toFixed(1)
      : '0',
    avgDistance: ambulances.length
      ? (ambulances.reduce((sum, a) => sum + (a.distance || 0), 0) / ambulances.filter((a) => a.distance).length).toFixed(1)
      : '0',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Emergency Ambulance Services</h1>
                <p className="text-red-100 mt-1">Get immediate medical transport assistance</p>
              </div>
            </div>
            <button
              onClick={handleEmergencyCall}
              className="px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold text-lg shadow-lg flex items-center gap-3 animate-pulse"
            >
              <Phone className="w-6 h-6" />
              Call 108 - Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
            Your Location: {locationName}
          </p>
        </div>
      </div>

      {/* Stats */}
      {!loading && ambulances.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Available Services</p>
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
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.nearest} km</p>
                  <p className="text-sm text-gray-600">Nearest Service</p>
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
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgDistance} km</p>
                  <p className="text-sm text-gray-600">Avg Distance</p>
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
                  <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
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
                <option value={10000}>10 km</option>
                <option value={15000}>15 km</option>
                <option value={25000}>25 km</option>
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
            <p className="text-gray-600">Finding ambulance services near you...</p>
          </div>
        </div>
      )}

      {/* Ambulances List */}
      {!loading && ambulances.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambulances.map((ambulance, index) => (
              <motion.div
                key={ambulance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                {ambulance.photos && ambulance.photos[0] && (
                  <img
                    src={ambulance.photos[0]}
                    alt={ambulance.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{ambulance.name}</h3>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Nearest
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{ambulance.address}</span>
                    </div>

                    {ambulance.distance && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-primary-600">
                          {ambulance.distance.toFixed(1)} km away
                        </span>
                        <span className="text-gray-400 ml-2">
                          (~{Math.ceil(ambulance.distance * 3)} min)
                        </span>
                      </div>
                    )}

                    {ambulance.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">{ambulance.rating}</span>
                        <span className="text-gray-500 ml-1">({ambulance.totalRatings})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGetDirections(ambulance)}
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Directions
                    </button>
                    {ambulance.phone && (
                      <button
                        onClick={() => handleCall(ambulance.phone!)}
                        className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Call Now"
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
      {!loading && ambulances.length === 0 && location && !error && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">
            No ambulance services found within {filter.radius / 1000} km of your location.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setFilter({ ...filter, radius: filter.radius * 2 })}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Expand Search Radius
            </button>
            <button
              onClick={handleEmergencyCall}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Call Emergency 108
            </button>
          </div>
        </div>
      )}
    </div>
  )
}