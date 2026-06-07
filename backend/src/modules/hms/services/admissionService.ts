import { Admission, IAdmission } from '../models/Admission.model';
import { BedService } from './bedService';
import { QRService } from './qrService';
import { AppError } from '../../../utils/AppError';

export class AdmissionService {
  /**
   * Quick admit patient (one-click from QR scan)
   */
  static async quickAdmit(data: {
    patientId: string;
    hospitalId: string;
    admittedBy: string;
    admissionType: 'OPD' | 'IPD' | 'EMERGENCY';
    bedType: string;
    symptoms: string[];
    vitals?: any;
    qrCodeId?: string;
    emergencyDetails?: any;
  }): Promise<IAdmission> {
    // Normalize bedType to uppercase
    const normalizedBedType = data.bedType.toUpperCase();
    
    // Find available bed
    const beds = await BedService.getHospitalBeds(data.hospitalId, {
      status: 'AVAILABLE',
      bedType: normalizedBedType,
    });

    if (beds.length === 0) {
      throw new AppError('NO_BEDS_AVAILABLE', 400, `No ${normalizedBedType} beds available`);
    }

    // Select first available bed
    const selectedBed = beds[0];

    // Generate admission ID
    const admissionId = `ADM-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create admission
    const admission = await Admission.create({
      admissionId,
      patientId: data.patientId,
      hospitalId: data.hospitalId,
      bedId: selectedBed.bedId,
      admissionType: data.admissionType,
      admittedAt: new Date(),
      status: 'ADMITTED',
      admittedBy: data.admittedBy,
      chiefComplaint: data.symptoms.join(', '),
      symptoms: data.symptoms,
      vitals: data.vitals ? [data.vitals] : [],
      emergencyDetails: data.emergencyDetails,
      billing: {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        charges: [
          {
            type: 'ROOM',
            description: `${selectedBed.bedType} bed (${selectedBed.ward})`,
            amount: selectedBed.pricePerDay,
            quantity: 1,
            date: new Date(),
          },
        ],
        payments: [],
      },
      notes: [],
    });

    // Allocate bed
    await BedService.allocateBed(
      selectedBed.bedId,
      data.patientId,
      admissionId
    );

    // Mark QR code as used
    if (data.qrCodeId) {
      await QRService.recordScan(
        data.qrCodeId,
        data.hospitalId,
        'Hospital Name', // TODO: Get from hospital
        true,
        admissionId
      );
    }

    // Return admission with bed details
    return {
      ...admission.toObject(),
      bedNumber: selectedBed.bedNumber,
      bedWard: selectedBed.ward,
      bedFloor: selectedBed.floor,
      bedRoom: selectedBed.room,
    } as any;
  }

  /**
   * Get admission details
   */
  static async getAdmission(admissionId: string): Promise<IAdmission | null> {
    return await Admission.findOne({ admissionId });
  }

  /**
   * Get all admissions for hospital
   */
  static async getHospitalAdmissions(
    hospitalId: string,
    filters?: {
      status?: string;
      admissionType?: string;
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<IAdmission[]> {
    const query: any = { hospitalId };

    if (filters?.status) query.status = filters.status;
    if (filters?.admissionType) query.admissionType = filters.admissionType;
    if (filters?.fromDate || filters?.toDate) {
      query.admittedAt = {};
      if (filters.fromDate) query.admittedAt.$gte = filters.fromDate;
      if (filters.toDate) query.admittedAt.$lte = filters.toDate;
    }

    return await Admission.find(query).sort({ admittedAt: -1 });
  }

  /**
   * Get patient's admission history
   */
  static async getPatientAdmissions(patientId: string): Promise<IAdmission[]> {
    return await Admission.find({ patientId }).sort({ admittedAt: -1 });
  }

  /**
   * Update vitals
   */
  static async updateVitals(
    admissionId: string,
    vitals: {
      bloodPressure: string;
      heartRate: number;
      temperature: number;
      oxygenLevel: number;
      respiratoryRate: number;
    }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    admission.vitals.push({
      ...vitals,
      recordedAt: new Date(),
    });

    await admission.save();
    return admission;
  }

  /**
   * Add prescription
   */
  static async addPrescription(
    admissionId: string,
    prescription: {
      medicineId: string;
      medicineName: string;
      dosage: string;
      frequency: string;
      duration: number;
      prescribedBy: string;
      notes?: string;
    }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    const prescriptionId = `PRE-${Date.now()}`;

    admission.prescriptions.push({
      prescriptionId,
      ...prescription,
      prescribedAt: new Date(),
    });

    await admission.save();
    return admission;
  }

  /**
   * Order lab test
   */
  static async orderLabTest(
    admissionId: string,
    test: {
      testName: string;
      orderedBy: string;
    }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    const testId = `TST-${Date.now()}`;

    admission.labTests.push({
      testId,
      testName: test.testName,
      orderedBy: test.orderedBy,
      orderedAt: new Date(),
      status: 'PENDING',
    });

    // Add to billing
    admission.billing.charges.push({
      type: 'LAB',
      description: test.testName,
      amount: 500, // TODO: Get from test pricing
      quantity: 1,
      date: new Date(),
    });

    await admission.save();
    return admission;
  }

  /**
   * Add billing charge
   */
  static async addCharge(
    admissionId: string,
    charge: {
      type: string;
      description: string;
      amount: number;
      quantity: number;
    }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    admission.billing.charges.push({
      ...charge,
      date: new Date(),
    });

    await admission.save();
    return admission;
  }

  /**
   * Record payment
   */
  static async recordPayment(
    admissionId: string,
    payment: {
      amount: number;
      paymentMode: string;
      transactionId?: string;
    }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    const paymentId = `PAY-${Date.now()}`;

    admission.billing.payments.push({
      paymentId,
      ...payment,
      paidAt: new Date(),
    });

    admission.billing.paidAmount += payment.amount;

    await admission.save();
    return admission;
  }

  /**
   * Discharge patient
   */
  static async dischargePatient(
    admissionId: string,
    dischargeSummary: {
      finalDiagnosis: string;
      treatmentGiven: string;
      dischargeAdvice: string;
      followUpDate?: Date;
      dischargedBy: string;
      dischargeType: 'NORMAL' | 'LAMA' | 'ABSCONDED' | 'REFERRED' | 'EXPIRED';
    }
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    if (admission.status !== 'ADMITTED') {
      throw new AppError('PATIENT_NOT_ADMITTED', 400, 'Patient is not currently admitted');
    }

    // Update admission
    admission.status = 'DISCHARGED';
    admission.dischargedAt = new Date();
    admission.dischargeSummary = {
      ...dischargeSummary,
      dischargedAt: new Date(),
    };

    await admission.save();

    // Release bed
    await BedService.releaseBed(admission.bedId);

    return admission;
  }

  /**
   * Add note to admission
   */
  static async addNote(
    admissionId: string,
    note: string,
    addedBy: string
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    admission.notes.push({
      note,
      addedBy,
      addedAt: new Date(),
    });

    await admission.save();
    return admission;
  }

  /**
   * Transfer patient to another hospital
   */
  static async transferPatient(
    admissionId: string,
    targetHospitalId: string,
    reason: string,
    transferredBy: string
  ): Promise<IAdmission> {
    const admission = await Admission.findOne({ admissionId });

    if (!admission) {
      throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
    }

    admission.status = 'TRANSFERRED';
    admission.notes.push({
      note: `Patient transferred to hospital ${targetHospitalId}. Reason: ${reason}`,
      addedBy: transferredBy,
      addedAt: new Date(),
    });

    await admission.save();

    // Release bed
    await BedService.releaseBed(admission.bedId);

    return admission;
  }
}
