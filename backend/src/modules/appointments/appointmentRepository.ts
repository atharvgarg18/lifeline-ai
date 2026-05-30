/**
 * Appointment Repository
 * All MongoDB operations for the appointments module
 */

import mongoose from 'mongoose';
import { AppointmentModel, IAppointment } from './models/Appointment.model';

export class AppointmentRepository {

  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    const appointment = new AppointmentModel(data);
    return appointment.save();
  }

  async findById(appointmentId: string): Promise<IAppointment | null> {
    return AppointmentModel.findById(appointmentId).exec();
  }

  async findByPatient(
    patientId: string,
    options: { status?: string; page: number; limit: number }
  ): Promise<{ appointments: IAppointment[]; total: number }> {
    const query: any = { patientId: new mongoose.Types.ObjectId(patientId) };
    if (options.status) query.status = options.status;

    const [appointments, total] = await Promise.all([
      AppointmentModel.find(query)
        .sort({ scheduledAt: -1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .populate('doctorId', 'userId specialization rating')
        .lean()
        .exec(),
      AppointmentModel.countDocuments(query),
    ]);

    return { appointments: appointments as IAppointment[], total };
  }

  async findByDoctor(
    doctorId: string,
    options: { status?: string; page: number; limit: number }
  ): Promise<{ appointments: IAppointment[]; total: number }> {
    const query: any = { doctorId: new mongoose.Types.ObjectId(doctorId) };
    if (options.status) query.status = options.status;

    const [appointments, total] = await Promise.all([
      AppointmentModel.find(query)
        .sort({ scheduledAt: 1 })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .lean()
        .exec(),
      AppointmentModel.countDocuments(query),
    ]);

    return { appointments: appointments as IAppointment[], total };
  }

  /**
   * Check if a doctor has any appointment in the given time slot
   */
  async hasConflict(
    doctorId: string,
    scheduledAt: Date,
    durationMinutes: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const endTime = new Date(scheduledAt.getTime() + durationMinutes * 60 * 1000);

    const query: any = {
      doctorId: new mongoose.Types.ObjectId(doctorId),
      status: { $nin: ['CANCELLED', 'NO_SHOW'] },
      $or: [
        // New appointment starts during existing
        { scheduledAt: { $gte: scheduledAt, $lt: endTime } },
        // New appointment ends during existing
        { scheduledAt: { $lt: scheduledAt, $gt: new Date(scheduledAt.getTime() - durationMinutes * 60 * 1000) } },
      ],
    };

    if (excludeAppointmentId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeAppointmentId) };
    }

    const conflict = await AppointmentModel.findOne(query).lean().exec();
    return Boolean(conflict);
  }

  /**
   * Get doctor's booked slots for a given day (for availability calculation)
   */
  async getDoctorSlotsForDay(doctorId: string, date: Date): Promise<IAppointment[]> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return AppointmentModel.find({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      scheduledAt: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['CANCELLED', 'NO_SHOW'] },
    })
      .select('scheduledAt durationMinutes')
      .lean()
      .exec() as Promise<IAppointment[]>;
  }

  async updateStatus(appointmentId: string, status: IAppointment['status']): Promise<IAppointment | null> {
    return AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: { status } },
      { new: true }
    ).exec();
  }

  async updateVideoCall(
    appointmentId: string,
    videoData: {
      videoCallRoomId: string;
      videoCallUrl: string;
      videoCallToken: string;
      doctorVideoToken: string;
      videoCallExpiresAt: Date;
      videoCallProvider: 'daily' | 'jitsi';
    }
  ): Promise<IAppointment | null> {
    return AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: { ...videoData, status: 'IN_PROGRESS' } },
      { new: true }
    ).exec();
  }

  /**
   * Check if patient already had an appointment with this doctor (familiarity)
   */
  async hasPreviousAppointment(patientId: string, doctorId: string): Promise<boolean> {
    const result = await AppointmentModel.findOne({
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      status: 'COMPLETED',
    })
      .lean()
      .exec();
    return Boolean(result);
  }
}

export const appointmentRepository = new AppointmentRepository();
