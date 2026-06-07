'use client'

import { useEffect, useState } from 'react'
import { hmsApi } from '@/services/hmsApi'
import { Bed, Filter, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BedsPage() {
  const [beds, setBeds] = useState<any[]>([])
  const [availability, setAvailability] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState({
    bedType: 'ALL',
    status: 'ALL',
    floor: 'ALL',
  })

  useEffect(() => {
    loadBeds()
    loadAvailability()
  }, [selectedFilter])

  const loadBeds = async () => {
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      const filters: any = { hospitalId }

      if (selectedFilter.bedType !== 'ALL') filters.bedType = selectedFilter.bedType
      if (selectedFilter.status !== 'ALL') filters.status = selectedFilter.status
      if (selectedFilter.floor !== 'ALL') filters.floor = parseInt(selectedFilter.floor)

      const result = await hmsApi.getBeds(hospitalId, filters)
      setBeds(result.data.beds)
    } catch (error) {
      console.error('Failed to load beds:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAvailability = async () => {
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      const result = await hmsApi.getBedAvailability(hospitalId)
      setAvailability(result.data)
    } catch (error) {
      console.error('Failed to load availability:', error)
    }
  }

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-success-100 text-success-800 border-success-200'
      case 'OCCUPIED':
        return 'bg-danger-100 text-danger-800 border-danger-200'
      case 'MAINTENANCE':
        return 'bg-warning-100 text-warning-800 border-warning-200'
      case 'RESERVED':
        return 'bg-primary-100 text-primary-800 border-primary-200'
      case 'CLEANING':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Availability Summary */}
      {availability && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Total Beds</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {availability.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Available</p>
            <p className="text-3xl font-bold text-success-600 mt-2">
              {availability.available}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Occupied</p>
            <p className="text-3xl font-bold text-danger-600 mt-2">
              {availability.occupied}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Maintenance</p>
            <p className="text-3xl font-bold text-warning-600 mt-2">
              {availability.maintenance}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600">Reserved</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {availability.reserved}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            
            <select
              value={selectedFilter.bedType}
              onChange={(e) =>
                setSelectedFilter({ ...selectedFilter, bedType: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Types</option>
              <option value="ICU">ICU</option>
              <option value="NICU">NICU</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="GENERAL">General</option>
            </select>

            <select
              value={selectedFilter.status}
              onChange={(e) =>
                setSelectedFilter({ ...selectedFilter, status: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RESERVED">Reserved</option>
              <option value="CLEANING">Cleaning</option>
            </select>

            <select
              value={selectedFilter.floor}
              onChange={(e) =>
                setSelectedFilter({ ...selectedFilter, floor: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>
          </div>

          <button
            onClick={() => {
              loadBeds()
              loadAvailability()
              toast.success('Refreshed bed list')
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bed Grid */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Bed List ({beds.length} beds)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
          {beds.map((bed) => (
            <div
              key={bed.bedId}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getBedStatusColor(
                bed.status
              )}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5" />
                  <span className="font-bold text-lg">{bed.bedNumber}</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
                  {bed.bedType}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Ward:</span> {bed.ward}
                </p>
                <p>
                  <span className="font-medium">Floor:</span> {bed.floor}
                </p>
                <p>
                  <span className="font-medium">Room:</span> {bed.room}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {bed.status}
                </p>
              </div>

              {bed.features && bed.features.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium mb-1">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {bed.features.map((feature: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-0.5 bg-white rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {bed.currentPatient && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium mb-1">Current Patient:</p>
                  <p className="text-sm">{bed.currentPatient.patientId}</p>
                </div>
              )}

              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium">
                  ₹{bed.pricePerDay.toLocaleString()}/day
                </p>
              </div>
            </div>
          ))}
        </div>

        {beds.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <Bed className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No beds found matching the filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
