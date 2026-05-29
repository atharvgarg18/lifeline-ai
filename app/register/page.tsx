'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ROLES = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'HOSPITAL_ADMIN', label: 'Hospital Admin' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'PATIENT' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{
      background: 'radial-gradient(circle at top left, rgba(0,217,255,.07), transparent 30%), radial-gradient(circle at bottom right, rgba(255,59,92,.06), transparent 30%), linear-gradient(180deg, #030712 0%, #020617 100%)',
    }}>
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-3xl p-8 overflow-hidden" style={{
          background: 'linear-gradient(145deg, rgba(10,20,46,0.97) 0%, rgba(5,11,23,0.99) 100%)',
          border: '1px solid rgba(30,58,95,0.8)',
          boxShadow: '0 0 60px rgba(6,182,212,0.08), 0 24px 80px rgba(0,0,0,0.6)',
        }}>
          <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{
              background: 'linear-gradient(135deg, #ff3b5c, #ef4444)',
              boxShadow: '0 0 24px rgba(239,68,68,.5)',
            }}>
              <Activity size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">LifeLine <span style={{ color: '#ff3b5c' }}>AI</span></h1>
          </div>

          <h2 className="text-lg font-bold text-white mb-5 text-center">Create your account</h2>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" required value={form.name} onChange={set('name')} placeholder="Rohan Verma"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Role</label>
              <select value={form.role} onChange={set('role')}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all appearance-none"
                style={{ ...inputStyle, color: '#f1f5f9' }}>
                {ROLES.map(r => <option key={r.value} value={r.value} style={{ background: '#0a1428' }}>{r.label}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPass ? 'text' : 'password'} required minLength={6} value={form.password} onChange={set('password')} placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-xl text-white placeholder-slate-600 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm mt-2"
              style={{
                background: loading ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg, #ff3b5c, #ef4444)',
                boxShadow: loading ? 'none' : '0 0 24px rgba(239,68,68,0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
