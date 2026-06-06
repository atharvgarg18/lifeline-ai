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
  Pill,
  Clock,
  Building2,
  ExternalLink,
  Clock3,
  Shield,
} from 'lucide-react'

export default function PharmacyPage() {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [pharmacies, setPharmacies] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationName, setLocationName] = useState<string>('Detecting location...')
  const [filter, setFilter] = useState({
    radius: 5000, // 5km
    open24Hours: false,
    minRating: 0,
    openNow: false,
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

  // Search pharmacies when location or filters change
  useEffect(() => {
    if (!location) return

    const searchPharmacies = async () => {
      setLoading(true)
      try {
        const results = await placesService.findNearbyPharmacies(location, filter.radius, {
          open24Hours: filter.open24Hours,
          minRating: filter.minRating,
        })
        
        // Apply additional filters
        let filtered = results
        if (filter.openNow) {
          filtered = filtered.filter((p) => p.isOpen)
        }
        
        setPharmacies(filtered)
      } catch (err: any) {
        setError(err.message || 'Failed to load pharmacies')
      } finally {
        setLoading(false)
      }
    }

    searchPharmacies()
  }, [location, filter])

  const handleGetDirections = (pharmacy: PlaceResult) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location.lat},${pharmacy.location.lng}`
    window.open(url, '_blank')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const stats = {
    total: pharmacies.length,
    open24Hours: pharmacies.filter((p) => p.types.includes('24_hours') || p.name.toLowerCase().includes('24')).length,
    openNow: pharmacies.filter((p) => p.isOpen).length,
    avgRating: pharmacies.length
      ? (pharmacies.reduce((sum, p) => sum + (p.rating || 0), 0) / pharmacies.filter((p) => p.rating).length).toFixed(1)
      : '0',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pharmacies Near You</h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                {locationName}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilter({ ...filter, open24Hours: !filter.open24Hours })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter.open24Hours
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                }`}
              >
                <Clock3 className="w-4 h-4" />
                24 Hours
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
      {!loading && pharmacies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Pharmacies</p>
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.open24Hours}</p>
                  <p className="text-sm text-gray-600">24/7 Available</p>
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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.openNow}</p>
                  <p className="text-sm text-gray-600">Open Now</p>
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
                <option value={2000}>2 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={20000}>20 km</option>
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
            <p className="text-gray-600">Finding pharmacies near you...</p>
          </div>
        </div>
      )}

      {/* Pharmacies List */}
      {!loading && pharmacies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                {pharmacy.photos && pharmacy.photos[0] && (
                  <img
                    src={pharmacy.photos[0]}
                    alt={pharmacy.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{pharmacy.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{pharmacy.address}</span>
                    </div>

                    {pharmacy.distance && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-primary-600">
                          {pharmacy.distance.toFixed(1)} km away
                        </span>
                      </div>
                    )}

                    {pharmacy.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">{pharmacy.rating}</span>
                        <span className="text-gray-500 ml-1">({pharmacy.totalRatings})</span>
                      </div>
                    )}

                    {pharmacy.isOpen !== undefined && (
                      <div className="flex items-center text-sm">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            pharmacy.isOpen ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className={pharmacy.isOpen ? 'text-green-600' : 'text-red-600'}>
                          {pharmacy.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGetDirections(pharmacy)}
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Directions
                    </button>
                    {pharmacy.phone && (
                      <button
                        onClick={() => handleCall(pharmacy.phone!)}
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
      {!loading && pharmacies.length === 0 && location && !error && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            No pharmacies found within {filter.radius / 1000} km of your location.
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
