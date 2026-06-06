/**
 * HMS Module
 * Hospital Management System
 */

export * from './models/Hospital.model';
export * from './models/Bed.model';
export * from './models/Admission.model';
export * from './models/EmergencyRequest.model';
export * from './models/QRCode.model';

export * from './services/qrService';
export * from './services/bedService';
export * from './services/admissionService';
export * from './services/emergencyDispatchService';

export * from './controllers/hmsController';
export { default as hmsRoutes } from './routes/hmsRoutes';
