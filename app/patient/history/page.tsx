'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMedicalHistory } from '@/lib/patientApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, Calendar, Pill, ChevronLeft, ChevronRight, Filter, Activity } from 'lucide-react';

const TYPE_FILTERS = ['ALL', 'EMERGENCY', 'APPOINTMENT', 'PRESCRIPTION'];

const typeStyle: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  EMERGENCY:    { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', icon: <AlertCircle size={14} /> },
  APPOINTMENT:  { bg: 'rgba(6,182,212,0.12)',  color: '#06b6d4', icon: <Calendar size={14} /> },
  PRESCRIPTION: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', icon: <Pill size={14} /> },
};

function RecordCard({ record }: { record: any }) {
  const style = typeStyle[record.type] || { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', icon: <Activity size={14} /> };
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => setExpanded(e => !e)}>
      <div className="p-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: style.bg }}>
          <span style={{ color: style.color }}>{style.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-white font-semibold text-sm truncate">
              {record.diagnosis || record.reason || record.description || record.type}
            </p>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0"
                  style={{ background: style.bg, color: style.color }}>
              {record.type}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-500 text-xs flex items-center gap-1">
              <Clock size={11} />
              {new Date(record.date || record.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            {record.doctorName && <p className="text-slate-500 text-xs">Dr. {record.doctorName}</p>}
            {record.hospitalName && <p className="text-slate-500 text-xs">· {record.hospitalName}</p>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {record.symptoms?.length > 0 && (
              <div className="pt-3">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Symptoms</p>
                <div className="flex flex-wrap gap-1">
                  {record.symptoms.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {record.medications?.length > 0 && (
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Medications</p>
                <div className="flex flex-wrap gap-1">
                  {record.medications.map((m: any, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                      {m.name || m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {record.notes && (
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Notes</p>
                <p className="text-slate-300 text-sm">{record.notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PatientHistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (page: number, type: string) => {
    setLoading(true);
    try {
      const res = await getMedicalHistory(page, 20, type === 'ALL' ? undefined : type);
      setRecords(res.data || []);
      setPagination({ page, total: res.pagination?.total || 0, limit: 20 });
    } catch { setRecords([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(1, filter); }, [filter]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#050B17' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Medical History</h1>
          <p className="text-slate-500 text-sm">Your complete health timeline</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} className="text-slate-500" />
          {TYPE_FILTERS.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: filter === t ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === t ? '#06b6d4' : '#6b7280',
                border: `1px solid ${filter === t ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              {t}
            </button>
          ))}
          <span className="ml-auto text-slate-600 text-xs">{pagination.total} records</span>
        </div>

        {/* Records */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <Activity size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r, i) => <RecordCard key={r._id || i} record={r} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => load(pagination.page - 1, filter)} disabled={pagination.page === 1}
              className="p-2 rounded-xl disabled:opacity-30 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
              <ChevronLeft size={16} />
            </button>
            <span className="text-slate-400 text-sm">Page {pagination.page} of {totalPages}</span>
            <button onClick={() => load(pagination.page + 1, filter)} disabled={pagination.page === totalPages}
              className="p-2 rounded-xl disabled:opacity-30 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
