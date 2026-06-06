'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  QrCode,
  Siren,
  Bed,
  Users,
  FileText,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useEmergencyStore } from '@/store/emergencyStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'QR Scanner', href: '/dashboard/qr-scanner', icon: QrCode },
  { name: 'Emergency Requests', href: '/dashboard/emergency', icon: Siren },
  { name: 'Bed Management', href: '/dashboard/beds', icon: Bed },
  { name: 'Admissions', href: '/dashboard/admissions', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { connect, disconnect } = useWebSocket()
  const pendingEmergencies = useEmergencyStore((state) => state.pendingRequests)

  useEffect(() => {
    // Connect to WebSocket on mount
    connect()

    // Disconnect on unmount
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">
              LifeLine HMS
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.name}</span>
                  {item.name === 'Emergency Requests' &&
                    pendingEmergencies.length > 0 && (
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-danger-500 rounded-full emergency-alert">
                        {pendingEmergencies.length}
                      </span>
                    )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Hospital Admin
                </p>
                <p className="text-xs text-gray-500">Apollo Hospital</p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {navigation.find((item) => item.href === pathname)?.name ||
                'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
              {pendingEmergencies.length > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
              )}
            </button>

            {/* Connection status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
