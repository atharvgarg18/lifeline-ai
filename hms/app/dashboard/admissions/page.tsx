'use client'

import { useEffect, useState } from 'react'
import { hmsApi } from '@/services/hmsApi'
import { formatDistanceToNow } from 'date-fns'
import { Users, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ADMITTED')

  useEffect(() => {
    loadAdmissions()
  }, [statusFilter])

  const loadAdmissions = async () => {
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      const result = await hmsApi.getAdmissions(hospitalId, {
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      })
      setAdmissions(result.data.admissions)
    } catch (error) {
      console.error('Failed to load admissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAdmissions = admissions.filter((admission) =>
    admission.admissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAdmissionTypeColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return 'bg-danger-100 text-danger-800'
      case 'IPD':
        return 'bg-primary-100 text-primary-800'
      case 'OPD':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, patient, or complaint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ADMITTED">Active</option>
              <option value="DISCHARGED">Discharged</option>
              <option value="ALL">All Status</option>
            </select>
          </div>

          <Link
            href="/dashboard/qr-scanner"
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Scan QR to Admit
          </Link>
        </div>
      </div>

      {/* Admissions List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Admissions ({filteredAdmissions.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAdmissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">No admissions found</p>
            </div>
          ) : (
            filteredAdmissions.map((admission) => (
              <Link
                key={admission.admissionId}
                href={`/dashboard/admissions/${admission.admissionId}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="text-sm font-bold text-gray-900">
                        {admission.admissionId}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAdmissionTypeColor(
                          admission.admissionType
                        )}`}
                      >
                        {admission.admissionType}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admission.status === 'ADMITTED'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {admission.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-900 mb-1">
                      Patient: {admission.patientId}
                    </p>

                    <p className="text-sm text-gray-600 mb-2">
                      {admission.chiefComplaint}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Bed: {admission.bedId}</span>
                      {admission.assignedDoctor && (
                        <span>Doctor: {admission.assignedDoctor}</span>
                      )}
                      <span>
                        Admitted{' '}
                        {formatDistanceToNow(new Date(admission.admittedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {admission.billing && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          ₹{admission.billing.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Pending: ₹
                          {admission.billing.pendingAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
