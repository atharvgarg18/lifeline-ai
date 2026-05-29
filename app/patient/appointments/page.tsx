'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMyAppointments, cancelAppointment, startVideoCall } from '@/lib/patientApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Video, Clock, X, ChevronLeft, ChevronRight, ExternalLink, Loader, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const STATUS_FILTERS = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const statusStyle: Record<string, { bg: string; color: string }> = {
  SCHEDULED:   { bg: 'rgba(6,182,212,0.12)',  color: '#06b6d4' },
  IN_PROGRESS: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  COMPLETED:   { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  CANCELLED:   { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
};

function VideoCallModal({ session, onClose }: { session: any; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#0a1428,#050B17)', border: '1px solid rgba(59,130,246,0.3)' }}
        onClick={e => e.stopPropagation()}>

        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(59,130,246,0.2)' }}>
              <Video size={18} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h3 className="text-white font-bold">Video Consultation Ready</h3>
              <p className="text-slate-500 text-xs">Powered by {session.provider === 'daily' ? 'Daily.co' : 'Jitsi Meet'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-slate-400 text-xs mb-1">Room ID</p>
            <p className="text-white text-sm font-mono">{session.roomId}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-slate-400 text-xs mb-1">Expires at</p>
            <p className="text-white text-sm">{new Date(session.expiresAt).toLocaleString('en-IN')}</p>
          </div>

          <a href={session.videoCallUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}>
            <Video size={18} /> Join Video Call <ExternalLink size={14} />
          </a>

          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-400 text-sm"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AppointmentCard({ apt, onCancel, onJoinVideo }: { apt: any; onCancel: (id: string) => void; onJoinVideo: (id: string) => void }) {
  const style = statusStyle[apt.status] || { bg: 'rgba(255,255,255,0.08)', color: '#9ca3af' };
  const isVideoCall = apt.type === 'VIDEO_CALL';
  const canJoin = isVideoCall && ['SCHEDULED', 'IN_PROGRESS'].includes(apt.status);
  const canCancel = ['SCHEDULED'].includes(apt.status);

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: isVideoCall ? 'rgba(59,130,246,0.15)' : 'rgba(6,182,212,0.15)' }}>
          {isVideoCall ? <Video size={16} style={{ color: '#3b82f6' }} /> : <Calendar size={16} style={{ color: '#06b6d4' }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-white font-semibold text-sm">{apt.reason || apt.specialization}</p>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0"
                  style={{ background: style.bg, color: style.color }}>
              {apt.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            <p className="text-slate-500 text-xs flex items-center gap-1">
              <Clock size={11} />
              {new Date(apt.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
            <p className="text-slate-500 text-xs">{apt.durationMinutes}min</p>
            {apt.specialization && <p className="text-slate-500 text-xs">· {apt.specialization}</p>}
          </div>

          <div className="flex gap-2">
            {canJoin && (
              <button onClick={() => onJoinVideo(apt._id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white', boxShadow: '0 0 16px rgba(59,130,246,0.35)' }}>
                <Video size={12} /> Join Call
              </button>
            )}
            {canCancel && (
              <button onClick={() => onCancel(apt._id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                <X size={12} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 });
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [videoSession, setVideoSession] = useState<any>(null);
  const [videoLoading, setVideoLoading] = useState('');

  const load = useCallback(async (page: number, status: string) => {
    setLoading(true);
    try {
      const res = await getMyAppointments(page, 10, status === 'ALL' ? undefined : status);
      setAppointments(res.data || []);
      setPagination({ page, total: res.pagination?.total || 0, limit: 10 });
    } catch { setAppointments([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(1, filter); }, [filter]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      load(pagination.page, filter);
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || 'Failed to cancel');
    }
  };

  const handleJoinVideo = async (id: string) => {
    setVideoLoading(id);
    try {
      const session = await startVideoCall(id);
      setVideoSession(session);
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || 'Failed to start video call');
    } finally { setVideoLoading(''); }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#050B17' }}>
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">My Appointments</h1>
            <p className="text-slate-500 text-sm">Manage your consultations</p>
          </div>
          <Link href="/patient/find-doctor"
            className="px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
            + New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: filter === s ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === s ? '#06b6d4' : '#6b7280',
                border: `1px solid ${filter === s ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 mb-4">No appointments found</p>
            <Link href="/patient/find-doctor"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white inline-block"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(apt => (
              <AppointmentCard key={apt._id} apt={apt}
                onCancel={handleCancel} onJoinVideo={handleJoinVideo} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => load(pagination.page - 1, filter)} disabled={pagination.page === 1}
              className="p-2 rounded-xl disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
              <ChevronLeft size={16} />
            </button>
            <span className="text-slate-400 text-sm">Page {pagination.page} of {totalPages}</span>
            <button onClick={() => load(pagination.page + 1, filter)} disabled={pagination.page === totalPages}
              className="p-2 rounded-xl disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Video Call Modal */}
      <AnimatePresence>
        {videoSession && <VideoCallModal session={videoSession} onClose={() => setVideoSession(null)} />}
      </AnimatePresence>
    </div>
  );
}
