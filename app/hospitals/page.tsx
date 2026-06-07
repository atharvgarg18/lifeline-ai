'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Star,
  Navigation,
  Loader,
  AlertCircle,
  Building2,
  Clock,
  AlertTriangle,
  Shield,
  Truck,
  ExternalLink,
  Search,
  Mail,
  Globe,
} from 'lucide-react'

interface Hospital {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  website?: string
  rating?: number
  totalRatings?: number
  latitude?: number
  longitude?: number
  emergencyServices?: boolean
  specialties?: string[]
  isOpen?: boolean
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState({
    emergency: false,
    minRating: 0,
    openNow: false,
  })

  // Hospital data from https://healthcare-gamma-lake.vercel.app/hospitals
  useEffect(() => {
    const hospitalData: Hospital[] = [
      {
        id: '1',
        name: 'All India Institute of Medical Sciences (AIIMS) Bhopal',
        address: 'Saket Nagar, Bhopal, Madhya Pradesh 462020',
        phone: '+91-0755-298260',
        rating: 4.8,
        totalRatings: 2500,
        emergencyServices: true,
        specialties: ['Cardiology', 'Neurology', 'Oncology', 'Advanced Diagnostics', 'Research Centers'],
        isOpen: true,
      },
      {
        id: '2',
        name: 'Bhopal Memorial Hospital and Research Centre (BMHRC)',
        address: 'Bhopal ByPass, Raisen Road, Karond, Bhopal 462038',
        phone: '+91-755-2742212',
        rating: 4.5,
        totalRatings: 1800,
        emergencyServices: true,
        specialties: ['Respiratory Diseases', 'Eye Care', 'Psychological Support'],
        isOpen: true,
      },
      {
        id: '3',
        name: 'Government Jai Prakash District Hospital',
        address: '1250, Link Road No. 2, Tulsi Nagar, Shivaji Nagar, Bhopal 462001',
        phone: '0755-2556812',
        rating: 4.2,
        totalRatings: 1200,
        emergencyServices: true,
        specialties: ['Gynecology', 'Pediatrics', 'Nephrology', 'Blood Bank'],
        isOpen: true,
      },
      {
        id: '4',
        name: 'Bansal Hospital',
        address: 'Near Shahpura Lake, Bhopal',
        phone: '+91-0755-4086000',
        rating: 4.6,
        totalRatings: 2100,
        emergencyServices: true,
        specialties: ['Advanced Diagnostics', 'Eye Surgery', 'Multi-specialty Treatments'],
        isOpen: true,
      },
      {
        id: '5',
        name: 'ApolloSage Hospitals',
        address: 'Bawadiya Kalan, Salaiya, Bhopal 462026',
        phone: '093039 72510',
        rating: 4.7,
        totalRatings: 3200,
        emergencyServices: true,
        specialties: ['Cardiology', 'Organ Transplants', 'Neurology', 'Radiology'],
        isOpen: true,
      },
      {
        id: '6',
        name: 'Hamidia Hospital',
        address: 'Near Fatehgarh, Bhopal 462001',
        phone: '0755-2540222',
        rating: 4.3,
        totalRatings: 2800,
        emergencyServices: true,
        specialties: ['Central Pathology Lab', 'Blood Bank', 'Emergency Care'],
        isOpen: true,
      },
      {
        id: '7',
        name: "People's Hospital",
        address: 'Karond Bypass Road, Bhanpur, Bhopal 462037',
        phone: '0755-4005000',
        rating: 4.4,
        totalRatings: 1600,
        emergencyServices: true,
        specialties: ['Cardiology', 'Orthopedics', 'Multi-specialty Services'],
        isOpen: true,
      },
      {
        id: '8',
        name: 'Chirayu Medical College & Hospital',
        address: 'Bhainsakhedi, Near Bairagarh, Bhopal-Indore Highway, Bhopal 462030',
        phone: '+91-755-6679000',
        rating: 4.5,
        totalRatings: 1900,
        emergencyServices: true,
        specialties: ['Cardiology', 'Neurology', 'Modern Diagnostics', 'Medical Education'],
        isOpen: true,
      },
      {
        id: '9',
        name: 'Noble Multispeciality Hospital',
        address: 'Plot No. 269/1, Opp. Misrod Police Station, Misrod, Bhopal 462026',
        phone: '+91-755-4060000',
        rating: 4.6,
        totalRatings: 1500,
        emergencyServices: true,
        specialties: ['Cardiology', 'Orthopedics', 'Patient-centric Care'],
        isOpen: true,
      },
      {
        id: '10',
        name: 'Jawaharlal Nehru Cancer Hospital and Research Center',
        address: 'Idgah Hills, PB No-32, Bhopal 462001',
        phone: '+91-755-540374',
        rating: 4.7,
        totalRatings: 2200,
        emergencyServices: true,
        specialties: ['Chemotherapy', 'Radiation', 'Surgical Oncology', 'Cancer Research'],
        isOpen: true,
      },
    ]

    setHospitals(hospitalData)
    setFilteredHospitals(hospitalData)
    setLoading(false)
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filtered = hospitals

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Emergency filter
    if (filter.emergency) {
      filtered = filtered.filter(h => h.emergencyServices)
    }

    // Rating filter
    if (filter.minRating > 0) {
      filtered = filtered.filter(h => (h.rating || 0) >= filter.minRating)
    }

    // Open now filter
    if (filter.openNow) {
      filtered = filtered.filter(h => h.isOpen)
    }

    setFilteredHospitals(filtered)
  }, [hospitals, searchTerm, filter])

  const handleGetDirections = (hospital: Hospital) => {
    if (hospital.latitude && hospital.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
      window.open(url, '_blank')
    } else if (hospital.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`
      window.open(url, '_blank')
    }
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const stats = {
    total: filteredHospitals.length,
    emergency: filteredHospitals.filter((h) => h.emergencyServices).length,
    openNow: filteredHospitals.filter((h) => h.isOpen).length,
    avgRating: filteredHospitals.length && filteredHospitals.filter((h) => h.rating).length
      ? (filteredHospitals.reduce((sum, h) => sum + (h.rating || 0), 0) / filteredHospitals.filter((h) => h.rating).length).toFixed(1)
      : '0',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hospitals Directory</h1>
              <p className="text-gray-600 mt-2">
                Find healthcare facilities across India
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
      {!loading && filteredHospitals.length > 0 && (
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
                  <p className="text-2xl font-bold text-gray-900">{stats.openNow}</p>
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

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Hospitals</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
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
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-1" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-900 mb-2">Error Loading Hospitals</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 text-sm"
                >
                  Try Again
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
            <p className="text-gray-600">Loading hospitals...</p>
          </div>
        </div>
      )}

      {/* Hospitals List */}
      {!loading && filteredHospitals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital, index) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{hospital.name}</h3>

                  <div className="space-y-2 mb-4">
                    {hospital.address && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-2">{hospital.address}</span>
                      </div>
                    )}

                    {hospital.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{hospital.phone}</span>
                      </div>
                    )}

                    {hospital.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{hospital.email}</span>
                      </div>
                    )}

                    {hospital.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900">{hospital.rating}</span>
                        {hospital.totalRatings && (
                          <span className="text-gray-500 ml-1">({hospital.totalRatings})</span>
                        )}
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

                    {hospital.emergencyServices && (
                      <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Emergency Services
                      </div>
                    )}

                    {hospital.specialties && hospital.specialties.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                          {hospital.specialties.length > 3 && (
                            <span className="inline-block px-2 py-0.5 text-gray-500 text-xs">
                              +{hospital.specialties.length - 3} more
                            </span>
                          )}
                        </div>
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
                    {hospital.website && (
                      <button
                        onClick={() => window.open(hospital.website, '_blank')}
                        className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
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
      {!loading && filteredHospitals.length === 0 && !error && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            No hospitals found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilter({ emergency: false, minRating: 0, openNow: false })
            }}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
