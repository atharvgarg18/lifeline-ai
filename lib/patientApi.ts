import api from './api';

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboard = () =>
  api.get('/patient/dashboard').then(r => r.data.data?.data ?? r.data.data ?? {});

// ── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = () =>
  api.get('/patient/profile').then(r => r.data.data?.data ?? r.data.data ?? null);

export const upsertProfile = (body: any) =>
  api.post('/patient/profile', body).then(r => r.data);

// ── Medical History ──────────────────────────────────────────────────────────
export const getMedicalHistory = (page = 1, limit = 20, type?: string) => {
  const params: any = { page, limit };
  if (type) params.type = type;
  return api.get('/patient/medical-history', { params }).then(r => r.data);
};

// ── QR Code ──────────────────────────────────────────────────────────────────
export const getQrCode = () =>
  api.get('/patient/qr-code').then(r => r.data.data?.data ?? r.data.data ?? {});

// ── Analytics ────────────────────────────────────────────────────────────────
export const getAnalytics = (range = 12) =>
  api.get('/patient/analytics', { params: { range } }).then(r => r.data.data?.data ?? r.data.data ?? {});

// ── Appointments ──────────────────────────────────────────────────────────────
export const getMyAppointments = (page = 1, limit = 10, status?: string) => {
  const params: any = { page, limit };
  if (status) params.status = status;
  return api.get('/appointments/my', { params }).then(r => r.data);
};

export const bookAppointment = (body: any) =>
  api.post('/appointments/book', body).then(r => r.data);

export const cancelAppointment = (id: string) =>
  api.put(`/appointments/${id}/cancel`).then(r => r.data);

export const startVideoCall = (id: string) =>
  api.post(`/appointments/${id}/start-video-call`).then(r => r.data.data?.data ?? r.data.data ?? {});

// ── Doctor Recommendation ────────────────────────────────────────────────────
export const recommendDoctors = (params: {
  specialization?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
}) => api.get('/appointments/recommend-doctor', { params }).then(r => r.data.data?.data?.recommendations ?? r.data.data?.recommendations ?? []);
