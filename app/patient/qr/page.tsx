'use client';

import { useEffect, useState } from 'react';
import { getQrCode } from '@/lib/patientApi';
import { motion } from 'framer-motion';
import { QrCode, Download, RefreshCw, Shield, Heart, Phone, AlertCircle, Copy, Check } from 'lucide-react';

export default function PatientQRPage() {
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQR = async () => {
    setRefreshing(true);
    try {
      const data = await getQrCode();
      setQrData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchQR(); }, []);

  const copyHealthId = () => {
    if (qrData?.healthIdNumber) {
      navigator.clipboard.writeText(qrData.healthIdNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (!qrData?.qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrData.qrCodeDataUrl;
    a.download = `lifeline-qr-${qrData.healthIdNumber}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-slate-50">
      <div className="max-w-lg mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-1">My Health QR</h1>
          <p className="text-slate-500 text-sm">Scan at any hospital for instant access to your health data</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !qrData ? (
          <div className="text-center py-20">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-slate-500">Could not generate QR code. Please complete your profile first.</p>
          </div>
        ) : (
          <>
            {/* QR Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl overflow-hidden mb-6 bg-white border border-slate-200 shadow-sm">

              {/* QR Code */}
              <div className="flex flex-col items-center p-8">
                 <div className="relative p-3 rounded-2xl mb-4 bg-white shadow-sm">
                  {qrData.qrCodeDataUrl ? (
                    <img src={qrData.qrCodeDataUrl} alt="Patient QR Code"
                         className="w-48 h-48 block" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-xl">
                      <QrCode size={64} className="text-gray-400" />
                    </div>
                  )}
                  {/* LifeLine watermark */}
                     <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                       style={{ background: '#0f172a', color: '#38bdf8' }}>LifeLine AI</div>
                </div>

                {/* Health ID */}
                <div className="text-center mb-2">
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Health ID</p>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 text-xl font-black tracking-widest">{qrData.healthIdNumber}</p>
                    <button onClick={copyHealthId}
                      className="p-1.5 rounded-lg transition-all bg-slate-100">
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />}
                    </button>
                  </div>
                </div>

                <p className="text-slate-500 text-xs">
                  Expires: {qrData.expiresAt ? new Date(qrData.expiresAt).toLocaleDateString('en-IN') : 'N/A'}
                </p>
              </div>

              {/* Info chips */}
              <div className="px-6 pb-6 grid grid-cols-3 gap-3">
                {qrData.bloodGroup && (
                  <div className="flex flex-col items-center p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <Heart size={16} className="mb-1 text-rose-500" />
                    <p className="text-slate-900 font-bold text-sm">{qrData.bloodGroup}</p>
                    <p className="text-slate-500 text-[10px]">Blood Group</p>
                  </div>
                )}
                {qrData.allergies?.length > 0 && (
                  <div className="flex flex-col items-center p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertCircle size={16} className="mb-1 text-amber-500" />
                    <p className="text-slate-900 font-bold text-sm">{qrData.allergies.length}</p>
                    <p className="text-slate-500 text-[10px]">Allergies</p>
                  </div>
                )}
                {qrData.emergencyContacts?.length > 0 && (
                  <div className="flex flex-col items-center p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                    <Phone size={16} className="mb-1 text-cyan-500" />
                    <p className="text-slate-900 font-bold text-sm">{qrData.emergencyContacts.length}</p>
                    <p className="text-slate-500 text-[10px]">Emergency</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Security Note */}
            <div className="flex items-start gap-3 p-4 rounded-2xl mb-6 bg-emerald-50 border border-emerald-200">
              <Shield size={16} className="flex-shrink-0 mt-0.5 text-emerald-500" />
              <p className="text-emerald-700 text-xs">This QR code is encrypted and time-limited. Only authorized healthcare providers can access your full medical data.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={downloadQR}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500">
                <Download size={16} /> Download
              </button>
              <button onClick={fetchQR} disabled={refreshing}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
