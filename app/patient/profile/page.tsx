'use client';

import { useEffect, useState } from 'react';
import { getProfile, upsertProfile } from '@/lib/patientApi';

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'UNKNOWN'];

type Medication = { name: string; dosage: string; frequency: string };
type Surgery = { name: string; date: string; hospital: string };
type EmergencyContact = { name: string; relation: string; phoneNumber: string; email?: string };

export default function PatientProfilePage() {
  const [bloodGroup, setBloodGroup] = useState('UNKNOWN');
  const [allergiesText, setAllergiesText] = useState('');
  const [chronicText, setChronicText] = useState('');
  const [medications, setMedications] = useState<Medication[]>([{ name: '', dosage: '', frequency: '' }]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([{ name: '', date: '', hospital: '' }]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { name: '', relation: '', phoneNumber: '', email: '' },
  ]);
  const [insurance, setInsurance] = useState({
    providerName: '',
    policyNumber: '',
    groupNumber: '',
    coverageAmount: '',
    expiryDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getProfile();
        if (!active || !data) return;
        setBloodGroup(data.bloodGroup || 'UNKNOWN');
        setAllergiesText((data.allergies || []).join(', '));
        setChronicText((data.chronicDiseases || []).join(', '));
        setMedications(
          (data.medications || []).map((m: any) => ({
            name: m.name || '',
            dosage: m.dosage || '',
            frequency: m.frequency || '',
          }))
        );
        setSurgeries(
          (data.pastSurgeries || []).map((s: any) => ({
            name: s.name || '',
            date: s.date ? String(s.date).slice(0, 10) : '',
            hospital: s.hospital || '',
          }))
        );
        setContacts(
          (data.emergencyContacts || []).map((c: any) => ({
            name: c.name || '',
            relation: c.relation || '',
            phoneNumber: c.phoneNumber || '',
            email: c.email || '',
          }))
        );
        if (data.insuranceDetails) {
          setInsurance({
            providerName: data.insuranceDetails.providerName || '',
            policyNumber: data.insuranceDetails.policyNumber || '',
            groupNumber: data.insuranceDetails.groupNumber || '',
            coverageAmount: String(data.insuranceDetails.coverageAmount ?? ''),
            expiryDate: data.insuranceDetails.expiryDate ? String(data.insuranceDetails.expiryDate).slice(0, 10) : '',
          });
        }
      } catch {
        // Ignore if profile does not exist yet
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const splitList = (value: string) =>
    value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  const updateMedication = (index: number, patch: Partial<Medication>) => {
    setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  };

  const updateSurgery = (index: number, patch: Partial<Surgery>) => {
    setSurgeries((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const updateContact = (index: number, patch: Partial<EmergencyContact>) => {
    setContacts((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        bloodGroup,
        allergies: splitList(allergiesText),
        chronicDiseases: splitList(chronicText),
        medications: medications.filter((m) => m.name && m.dosage && m.frequency),
        pastSurgeries: surgeries.filter((s) => s.name && s.date && s.hospital),
        emergencyContacts: contacts.filter((c) => c.name && c.relation && c.phoneNumber),
        insuranceDetails:
          insurance.providerName && insurance.policyNumber
            ? {
                providerName: insurance.providerName,
                policyNumber: insurance.policyNumber,
                groupNumber: insurance.groupNumber || undefined,
                coverageAmount: insurance.coverageAmount ? Number(insurance.coverageAmount) : undefined,
                expiryDate: insurance.expiryDate || undefined,
              }
            : undefined,
      };
      await upsertProfile(payload);
      setMessage('Profile saved successfully.');
    } catch (err: any) {
      setMessage(err?.response?.data?.error?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Patient Profile</h1>
      <p className="text-slate-500 mb-6">Fill in your details for a complete health profile.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Basics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-slate-600">
              Blood Group
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Allergies (comma separated)
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin, Pollen"
              />
            </label>
            <label className="text-sm text-slate-600">
              Chronic Diseases (comma separated)
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={chronicText}
                onChange={(e) => setChronicText(e.target.value)}
                placeholder="e.g. Asthma, Diabetes"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Medications</h2>
          <div className="space-y-3">
            {medications.map((m, i) => (
              <div key={`med-${i}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Medication name"
                  value={m.name}
                  onChange={(e) => updateMedication(i, { name: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Dosage"
                  value={m.dosage}
                  onChange={(e) => updateMedication(i, { dosage: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Frequency"
                  value={m.frequency}
                  onChange={(e) => updateMedication(i, { frequency: e.target.value })}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
              onClick={() => setMedications((prev) => [...prev, { name: '', dosage: '', frequency: '' }])}
            >
              + Add medication
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Past Surgeries</h2>
          <div className="space-y-3">
            {surgeries.map((s, i) => (
              <div key={`surg-${i}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Surgery name"
                  value={s.name}
                  onChange={(e) => updateSurgery(i, { name: e.target.value })}
                />
                <input
                  type="date"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={s.date}
                  onChange={(e) => updateSurgery(i, { date: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Hospital"
                  value={s.hospital}
                  onChange={(e) => updateSurgery(i, { hospital: e.target.value })}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
              onClick={() => setSurgeries((prev) => [...prev, { name: '', date: '', hospital: '' }])}
            >
              + Add surgery
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Emergency Contacts</h2>
          <div className="space-y-3">
            {contacts.map((c, i) => (
              <div key={`contact-${i}`} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => updateContact(i, { name: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Relation"
                  value={c.relation}
                  onChange={(e) => updateContact(i, { relation: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Phone"
                  value={c.phoneNumber}
                  onChange={(e) => updateContact(i, { phoneNumber: e.target.value })}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Email (optional)"
                  value={c.email || ''}
                  onChange={(e) => updateContact(i, { email: e.target.value })}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
              onClick={() => setContacts((prev) => [...prev, { name: '', relation: '', phoneNumber: '', email: '' }])}
            >
              + Add contact
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Insurance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Provider name"
              value={insurance.providerName}
              onChange={(e) => setInsurance((prev) => ({ ...prev, providerName: e.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Policy number"
              value={insurance.policyNumber}
              onChange={(e) => setInsurance((prev) => ({ ...prev, policyNumber: e.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Group number"
              value={insurance.groupNumber}
              onChange={(e) => setInsurance((prev) => ({ ...prev, groupNumber: e.target.value }))}
            />
            <input
              type="number"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Coverage amount"
              value={insurance.coverageAmount}
              onChange={(e) => setInsurance((prev) => ({ ...prev, coverageAmount: e.target.value }))}
            />
            <input
              type="date"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={insurance.expiryDate}
              onChange={(e) => setInsurance((prev) => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </div>
      </form>
    </div>
  );
}
