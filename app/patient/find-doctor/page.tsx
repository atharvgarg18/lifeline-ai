'use client';

import { useEffect, useState } from 'react';
import { recommendDoctors, bookAppointment } from '@/lib/patientApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Star, Clock, MapPin, Video, Calendar,
  ChevronRight, Loader, CheckCircle, X, Zap, User, Search,
} from 'lucide-react';

const SPECIALIZATIONS = [
  'All', 'General Physician', 'Cardiologist', 'Dermatologist',
  'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist',
  'Gynecologist', 'Ophthalmologist', 'ENT', 'Oncologist',
];

const APPOINTMENT_TYPES = [
  { value: 'IN_PERSON', label: 'In Person', icon: <User size={14} /> },
  { value: 'VIDEO_CALL', label: 'Video Call', icon: <Video size={14} /> },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11}
          fill={i <= Math.round(rating) ? '#f59e0b' : 'transparent'}
          style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#4b5563' }} />
      ))}
      <span className="text-slate-400 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function BookModal({ doctor, onClose, onBooked }: { doctor: any; onClose: () => void; onBooked: () => void }) {
  const [form, setForm] = useState({
    type: 'VIDEO_CALL',
    reason: '',
    scheduledAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Default to next slot: tomorrow 10am
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    setForm(f => ({ ...f, scheduledAt: d.toISOString().slice(0, 16) }));
  }, []);

  const submit = async () => {
    if (!form.reason.trim()) { setError('Please describe your reason for consultation'); return; }
    if (!form.scheduledAt) { setError('Please select a date and time'); return; }
    setError('');
    setLoading(true);
    try {
      await bookAppointment({
        doctorId: doctor.doctorId,
        type: form.type,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        reason: form.reason,
        specialization: doctor.specialization,
        recommendationScore: doctor.recommendationScore,
        recommendationReason: doctor.recommendationReason,
      });
      setSuccess(true);
      setTimeout(() => { onBooked(); onClose(); }, 1800);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Booking failed. Please try another slot.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#0a1428,#050B17)', border: '1px solid rgba(6,182,212,0.25)' }}
        onClick={e => e.stopPropagation()}>

        <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{doctor.name}</h3>
              <p className="text-slate-400 text-sm">{doctor.specialization}</p>
              <StarRating rating={doctor.rating} />
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={20} /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="text-center py-8">
              <CheckCircle size={48} className="mx-auto mb-3" style={{ color: '#10b981' }} />
              <p className="text-white font-bold text-lg">Appointment Booked!</p>
              <p className="text-slate-400 text-sm mt-1">You'll get a confirmation shortly</p>
            </motion.div>
          ) : (
            <>
              {/* Appointment Type */}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Type</label>
                <div className="flex gap-2">
                  {APPOINTMENT_TYPES.map(t => (
                    <button key={t.value} onClick={() => setForm(f => ({ ...f, type: t.value }))}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: form.type === t.value ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.type === t.value ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        color: form.type === t.value ? '#06b6d4' : '#6b7280',
                      }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date/Time */}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Date & Time</label>
                <input type="datetime-local" value={form.scheduledAt}
                  onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
              </div>

              {/* Reason */}
              <div>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Reason</label>
                <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <X size={14} /> {error}
                </p>
              )}

              <motion.button onClick={submit} disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{
                  background: loading ? 'rgba(6,182,212,0.3)' : 'linear-gradient(135deg,#06b6d4,#3b82f6)',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(6,182,212,0.35)',
                }}>
                {loading ? <Loader size={16} className="animate-spin" /> : <Calendar size={16} />}
                {loading ? 'Booking...' : 'Confirm Booking'}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DoctorCard({ doc, onBook }: { doc: any; onBook: (doc: any) => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="p-5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>
          <User size={20} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white font-bold text-sm">{doc.name}</h3>
            {/* AI Score */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                 style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>
              <Zap size={10} style={{ color: '#a855f7' }} />
              <span className="text-xs font-bold" style={{ color: '#a855f7' }}>
                {Math.round(doc.recommendationScore * 100)}%
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-xs mb-2">{doc.specialization}</p>
          <StarRating rating={doc.rating} />

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {doc.distance > 0 && (
              <span className="text-slate-500 text-xs flex items-center gap-1">
                <MapPin size={11} /> {doc.distance} km
              </span>
            )}
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <Clock size={11} /> ~{doc.responseTime}min response
            </span>
            <span className="text-slate-500 text-xs">{doc.totalConsultations} consultations</span>
          </div>

          {doc.hospital?.name && (
            <p className="text-slate-600 text-xs mt-1">📍 {doc.hospital.name}</p>
          )}

          {/* AI Reason */}
          <div className="mt-3 flex items-start gap-2">
            <Zap size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#a855f7' }} />
            <p className="text-slate-400 text-xs italic">{doc.recommendationReason}</p>
          </div>

          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 rounded-lg text-[11px] font-medium"
                  style={{ background: doc.availableSlots > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                           color: doc.availableSlots > 0 ? '#10b981' : '#ef4444' }}>
              {doc.availableSlots > 0 ? `${doc.availableSlots} slots free` : 'Busy'}
            </span>
            <button onClick={() => onBook(doc)}
              className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 16px rgba(6,182,212,0.3)' }}>
              Book <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FindDoctorPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState('All');
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [booked, setBooked] = useState(false);

  const search = async (overrideSpec?: string) => {
    setLoading(true);
    setHasSearched(true);
    const s = overrideSpec ?? spec;
    try {
      const params: any = { limit: 10 };
      if (s !== 'All') params.specialization = s;
      if (location) { params.latitude = location.lat; params.longitude = location.lng; }
      const results = await recommendDoctors(params);
      setDoctors(results);
    } catch { setDoctors([]); } finally { setLoading(false); }
  };

  const useMyLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  useEffect(() => { search(); }, []);

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#050B17' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Find a Doctor</h1>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            <Zap size={13} style={{ color: '#a855f7' }} />
            AI-powered recommendations personalised for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <select value={spec} onChange={e => setSpec(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={useMyLocation} disabled={locating}
            className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{ background: location ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                     border: `1px solid ${location ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                     color: location ? '#10b981' : '#9ca3af' }}>
            <MapPin size={14} />
            {locating ? 'Locating…' : location ? 'Located' : 'Near Me'}
          </button>
          <button onClick={() => search()}
            className="px-5 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
            <Search size={16} />
          </button>
        </div>

        {/* Specialization Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {SPECIALIZATIONS.slice(0, 8).map(s => (
            <button key={s} onClick={() => { setSpec(s); search(s); }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background: spec === s ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                color: spec === s ? '#06b6d4' : '#6b7280',
                border: `1px solid ${spec === s ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Finding the best doctors for you…</p>
          </div>
        ) : doctors.length === 0 && hasSearched ? (
          <div className="text-center py-20">
            <Stethoscope size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No doctors available with selected filters</p>
            <button onClick={() => { setSpec('All'); search('All'); }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doc, i) => (
              <DoctorCard key={doc.doctorId || i} doc={doc} onBook={setSelectedDoc} />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <BookModal
            doctor={selectedDoc}
            onClose={() => setSelectedDoc(null)}
            onBooked={() => setBooked(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
