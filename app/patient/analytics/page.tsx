'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/patientApi';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Activity, Calendar, AlertTriangle, Pill } from 'lucide-react';

const RANGES = [3, 6, 12];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-20 flex flex-col justify-end items-center gap-1 w-8">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full rounded-t-md"
        style={{ background: color, minHeight: value > 0 ? 4 : 0 }}
      />
      <span className="text-[10px] text-slate-600">{value}</span>
    </div>
  );
}

export default function PatientAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [range, setRange] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnalytics(range)
      .then(d => setAnalytics(d))
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, [range]);

  const trends = analytics?.trends || [];
  const maxEmergencies = Math.max(...trends.map((t: any) => t.emergencies || 0), 1);
  const maxAppointments = Math.max(...trends.map((t: any) => t.appointments || 0), 1);

  const statCards = [
    {
      label: 'Total Appointments',
      value: analytics?.totalAppointments ?? '—',
      icon: <Calendar size={18} />,
      color: '#06b6d4',
      sub: `${analytics?.completedAppointments ?? 0} completed`,
    },
    {
      label: 'Emergency Events',
      value: analytics?.totalEmergencies ?? '—',
      icon: <AlertTriangle size={18} />,
      color: '#ef4444',
      sub: analytics?.resolvedEmergencies !== undefined ? `${analytics.resolvedEmergencies} resolved` : '',
    },
    {
      label: 'Active Prescriptions',
      value: analytics?.activePrescriptions ?? '—',
      icon: <Pill size={18} />,
      color: '#a855f7',
      sub: `${analytics?.totalPrescriptions ?? 0} total`,
    },
    {
      label: 'Health Score',
      value: analytics?.healthScore !== undefined ? `${analytics.healthScore}%` : '—',
      icon: <Activity size={18} />,
      color: '#10b981',
      sub: analytics?.healthScoreTrend === 'up' ? '↑ Improving' : analytics?.healthScoreTrend === 'down' ? '↓ Declining' : 'Stable',
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#050B17' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Health Analytics</h1>
            <p className="text-slate-500 text-sm">Insights into your health patterns</p>
          </div>
          <div className="flex gap-2">
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: range === r ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                  color: range === r ? '#06b6d4' : '#6b7280',
                  border: `1px solid ${range === r ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {r}M
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map(s => (
                <motion.div key={s.label} whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-slate-400 text-xs">{s.label}</span>
                  </div>
                  <p className="text-2xl font-black text-white mb-1">{s.value}</p>
                  <p className="text-xs text-slate-600">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            {trends.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Appointments Trend */}
                <div className="p-5 rounded-2xl"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={16} style={{ color: '#06b6d4' }} />
                    <p className="text-white font-semibold text-sm">Appointments Over Time</p>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {trends.map((t: any, i: number) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <MiniBar value={t.appointments || 0} max={maxAppointments} color="#06b6d4" />
                        <span className="text-[9px] text-slate-700">{t.month?.slice(0, 3) || t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Trend */}
                <div className="p-5 rounded-2xl"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                    <p className="text-white font-semibold text-sm">Emergency Events</p>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {trends.map((t: any, i: number) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <MiniBar value={t.emergencies || 0} max={maxEmergencies} color="#ef4444" />
                        <span className="text-[9px] text-slate-700">{t.month?.slice(0, 3) || t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chronic Conditions */}
            {analytics?.chronicConditions?.length > 0 && (
              <div className="p-5 rounded-2xl mb-6"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-white font-semibold text-sm mb-3">Chronic Conditions Tracked</p>
                <div className="flex flex-wrap gap-2">
                  {analytics.chronicConditions.map((c: string) => (
                    <span key={c} className="px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!analytics && (
              <div className="text-center py-20">
                <BarChart3 size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500">Analytics will appear as you use the platform</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
