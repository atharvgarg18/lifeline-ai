'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDashboard, getQrCode, getProfile } from '@/lib/patientApi';
import { motion } from 'framer-motion';
import {
  Activity, Heart, Calendar, Pill, AlertTriangle,
  QrCode, BarChart3, Video, User, ChevronRight,
  Clock, Shield, Download, RefreshCw, Copy, Check,
  Stethoscope, ClipboardList,
} from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [dash, setDash] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.allSettled([getDashboard(), getProfile()])
      .then(([d, p]) => {
        if (d.status === 'fulfilled') setDash(d.value);
        if (p.status === 'fulfilled') setProfile(p.value);
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchQR = async () => {
    setQrLoading(true);
    try { const q = await getQrCode(); setQrData(q); } catch { setQrData(null); }
    setQrLoading(false);
  };

  useEffect(() => { fetchQR(); }, []);

  const downloadQR = () => {
    const src = qrData?.qrCodeBase64 || qrData?.qrCodeDataUrl;
    if (!src) return;
    const a = document.createElement('a'); a.href = src;
    a.download = `lifeline-qr-${qrData.healthIdNumber || 'code'}.png`; a.click();
  };

  const copyId = () => {
    if (qrData?.healthIdNumber) {
      navigator.clipboard.writeText(qrData.healthIdNumber);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickLinks = [
    { label: 'Medical History',  icon: <ClipboardList size={20} />, href: '/patient/history',      color: '#06b6d4' },
    { label: 'Health Analytics', icon: <BarChart3 size={20} />,     href: '/patient/analytics',    color: '#10b981' },
    { label: 'Appointments',     icon: <Calendar size={20} />,      href: '/patient/appointments', color: '#f59e0b' },
    { label: 'Video Consult',    icon: <Video size={20} />,         href: '/patient/appointments', color: '#3b82f6' },
    { label: 'Find Doctor',      icon: <Stethoscope size={20} />,   href: '/patient/find-doctor',  color: '#a855f7' },
  ];

  // Stat numbers from dashboard or fallback
  const upcomingCount  = dash?.upcomingAppointments?.length ?? dash?.stats?.totalAppointments ?? '—';
  const emergencyCount = dash?.stats?.totalEmergencies ?? '0';
  const profilePct     = dash?.stats?.profileCompletionPercent ?? (profile?.profileCompleted ? 100 : 0);

  const stats = [
    { label: 'Upcoming Appts',  value: loading ? '…' : upcomingCount,  icon: <Calendar size={18} />,      color: '#06b6d4' },
    { label: 'Emergency Events', value: loading ? '…' : emergencyCount, icon: <AlertTriangle size={18} />,  color: '#ef4444' },
    { label: 'Profile Complete', value: loading ? '…' : `${profilePct}%`, icon: <Shield size={18} />,     color: '#10b981' },
    { label: 'Health Score',    value: '—',                              icon: <Activity size={18} />,      color: '#a855f7' },
  ];

  const qrSrc = qrData?.qrCodeBase64 || qrData?.qrCodeDataUrl;

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#050B17' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Welcome header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 24px rgba(6,182,212,0.4)' }}>
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Welcome back, <span style={{ color: '#06b6d4' }}>{user?.name?.split(' ')[0] || 'Patient'}</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {profile?.healthIdNumber
                  ? `Health ID: ${profile.healthIdNumber}`
                  : qrData?.healthIdNumber
                  ? `Health ID: ${qrData.healthIdNumber}`
                  : 'Complete your profile to get your Health ID'}
                {(profile?.bloodGroup || qrData?.bloodGroup) && (
                  <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    {profile?.bloodGroup || qrData?.bloodGroup}
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="text-slate-400 text-xs font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Main grid: QR left, quick links right ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* QR Code card */}
          <div className="rounded-3xl p-6 flex flex-col items-center"
               style={{ background: 'linear-gradient(145deg,rgba(6,182,212,0.08),rgba(168,85,247,0.06))', border: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 0 40px rgba(6,182,212,0.08)' }}>
            <div className="flex items-center justify-between w-full mb-4">
              <div>
                <h2 className="text-white font-bold text-base">My Health QR</h2>
                <p className="text-slate-500 text-xs">Scan at hospital for instant access</p>
              </div>
              <button onClick={fetchQR} disabled={qrLoading}
                className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <RefreshCw size={14} className={`text-slate-400 ${qrLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {qrLoading ? (
              <div className="w-40 h-40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : qrSrc ? (
              <>
                <div className="p-3 rounded-2xl mb-3" style={{ background: 'white', boxShadow: '0 0 30px rgba(6,182,212,0.25)' }}>
                  <img src={qrSrc} alt="Health QR" className="w-36 h-36 block" />
                </div>
                {qrData?.healthIdNumber && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white text-sm font-mono font-bold tracking-widest">
                      {qrData.healthIdNumber}
                    </span>
                    <button onClick={copyId} className="p-1 rounded"
                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                      {copied
                        ? <Check size={12} style={{ color: '#10b981' }} />
                        : <Copy size={12} className="text-slate-400" />}
                    </button>
                  </div>
                )}
                {qrData?.expiresAt && (
                  <p className="text-slate-600 text-[11px] mb-3">
                    Expires {new Date(qrData.expiresAt).toLocaleDateString('en-IN')}
                  </p>
                )}
                <button onClick={downloadQR}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white w-full justify-center"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>
                  <Download size={13} /> Download QR
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <QrCode size={36} className="mx-auto text-slate-700 mb-3" />
                <p className="text-slate-500 text-xs">Complete your profile to generate your QR code</p>
                <Link href="/patient/profile"
                  className="mt-3 inline-block px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  Set Up Profile
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-white font-bold text-base mb-3">Quick Access</h2>
            <div className="space-y-3">
              {quickLinks.map(q => (
                <Link href={q.href} key={q.label}>
                  <motion.div whileHover={{ scale: 1.01, x: 4 }}
                    className="p-4 rounded-2xl cursor-pointer flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${q.color}18` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                           style={{ background: `${q.color}18` }}>
                        <span style={{ color: q.color }}>{q.icon}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{q.label}</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-600" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Profile Completion alert ── */}
        {!profile?.profileCompleted && !qrSrc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-2xl flex items-center justify-between mb-6"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-amber-400" />
              <div>
                <p className="text-amber-300 font-semibold text-sm">Complete your health profile</p>
                <p className="text-amber-400/70 text-xs">Add blood group, allergies and emergency contacts for instant QR</p>
              </div>
            </div>
            <Link href="/patient/profile"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }}>
              Complete Now
            </Link>
          </motion.div>
        )}

        {/* ── Upcoming Appointments ── */}
        {dash?.upcomingAppointments?.length > 0 && (
          <div>
            <h2 className="text-white font-bold text-base mb-3">Upcoming Appointments</h2>
            <div className="space-y-3">
              {dash.upcomingAppointments.map((apt: any) => (
                <div key={apt._id} className="p-4 rounded-2xl flex items-center justify-between"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                         style={{ background: apt.type === 'VIDEO_CALL' ? 'rgba(59,130,246,0.15)' : 'rgba(6,182,212,0.15)' }}>
                      {apt.type === 'VIDEO_CALL'
                        ? <Video size={15} style={{ color: '#3b82f6' }} />
                        : <Calendar size={15} style={{ color: '#06b6d4' }} />}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{apt.specialization || apt.type}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(apt.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
