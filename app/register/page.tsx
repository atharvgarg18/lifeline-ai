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
    background: '#ffffff',
    border: '1px solid #e2e8f0',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-50">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-3xl p-8 overflow-hidden bg-white border border-slate-200 shadow-lg">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-red-500 shadow-sm">
              <Activity size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">LifeLine <span className="text-red-500">AI</span></h1>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-5 text-center">Create your account</h2>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-4 bg-red-50 border border-red-200">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required value={form.name} onChange={set('name')} placeholder="Rohan Verma"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#60a5fa'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#60a5fa'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#60a5fa'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Role</label>
              <select value={form.role} onChange={set('role')}
                className="w-full px-4 py-3 rounded-xl text-slate-900 text-sm outline-none transition-all appearance-none"
                style={inputStyle}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} required minLength={6} value={form.password} onChange={set('password')} placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#60a5fa'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-white text-sm mt-2 bg-red-500 hover:bg-red-600 disabled:opacity-60"
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
