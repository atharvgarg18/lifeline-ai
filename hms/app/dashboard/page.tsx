'use client'

import { useEffect, useState } from 'react'
import { Bed, Users, AlertCircle, Activity } from 'lucide-react'
import { hmsApi } from '@/services/hmsApi'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    activeAdmissions: 0,
    pendingEmergencies: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setError(null)
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'

      // Load bed availability
      const bedResponse = await hmsApi.getBedAvailability(hospitalId)
      const bedData = bedResponse.data
      
      // Load recent admissions
      const admissionsResponse = await hmsApi.getAdmissions(hospitalId, {
        status: 'ADMITTED',
      })
      const admissionsData = admissionsResponse.data || {}

      // Load pending emergencies
      const emergencyResponse = await hmsApi.getPendingEmergencies(hospitalId)
      const emergencyData = emergencyResponse.data || {}

      setStats({
        totalBeds: bedData?.total || 0,
        availableBeds: bedData?.available || 0,
        occupiedBeds: bedData?.occupied || 0,
        activeAdmissions: admissionsData?.count || 0,
        pendingEmergencies: emergencyData?.count || 0,
      })

      setRecentAdmissions(admissionsData?.admissions || [])
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error)
      setError(error.message || 'Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Beds',
      value: stats.totalBeds,
      icon: Bed,
      color: 'bg-blue-500',
    },
    {
      title: 'Available Beds',
      value: stats.availableBeds,
      icon: Bed,
      color: 'bg-success-500',
    },
    {
      title: 'Active Admissions',
      value: stats.activeAdmissions,
      icon: Users,
      color: 'bg-primary-500',
    },
    {
      title: 'Pending Emergencies',
      value: stats.pendingEmergencies,
      icon: AlertCircle,
      color: 'bg-danger-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-danger-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to connect to server
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry Connection
          </button>
          <div className="mt-4 text-sm text-gray-500">
            <p>Make sure the backend server is running on:</p>
            <p className="font-mono mt-1">http://localhost:3000</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pending Emergencies Alert */}
      {stats.pendingEmergencies > 0 && (
        <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-danger-600 mr-3" />
              <p className="text-sm font-medium text-danger-800">
                You have {stats.pendingEmergencies} pending emergency{' '}
                {stats.pendingEmergencies === 1 ? 'request' : 'requests'} waiting
                for response
              </p>
            </div>
            <Link
              href="/dashboard/emergency"
              className="px-4 py-2 bg-danger-600 text-white text-sm font-medium rounded-lg hover:bg-danger-700 transition-colors"
            >
              View Requests
            </Link>
          </div>
        </div>
      )}

      {/* Recent Admissions */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Admissions
          </h3>
          <Link
            href="/dashboard/admissions"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </div>

        <div className="divide-y divide-gray-200">
          {recentAdmissions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent admissions
            </div>
          ) : (
            recentAdmissions.map((admission) => (
              <div
                key={admission.admissionId}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {admission.admissionId}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {admission.chiefComplaint}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admission.admissionType === 'EMERGENCY'
                          ? 'bg-danger-100 text-danger-800'
                          : admission.admissionType === 'IPD'
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {admission.admissionType}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(admission.admittedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bed Occupancy Chart */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bed Occupancy
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Total Capacity
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.occupiedBeds} / {stats.totalBeds}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    stats.totalBeds > 0
                      ? (stats.occupiedBeds / stats.totalBeds) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div>
              <p className="text-xs text-gray-600">Available</p>
              <p className="text-2xl font-bold text-success-600">
                {stats.availableBeds}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.occupiedBeds}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBeds > 0
                  ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
