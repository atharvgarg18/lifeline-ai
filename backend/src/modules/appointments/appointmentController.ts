/**
 * Appointment Controller
 */

import type { Request, Response, NextFunction } from 'express';
import { appointmentService } from './appointmentService';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response';

export class AppointmentController {

  /** GET /api/v1/appointments/recommend-doctor */
  async recommendDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientId = req.user!.id;
      const {
        specialization,
        latitude,
        longitude,
        limit,
      } = req.query as Record<string, string>;

      const recommendations = await appointmentService.recommendDoctors(patientId, {
        specialization,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        limit: limit ? parseInt(limit) : 5,
      });

      sendSuccess(res, { data: { recommendations, total: recommendations.length } });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/appointments/book */
  async bookAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientId = req.user!.id;
      const appointment = await appointmentService.bookAppointment(patientId, req.body);
      sendCreated(res, appointment, 'Appointment booked successfully');
    } catch (err) { next(err); }
  }

  /** GET /api/v1/appointments/my */
  async getMyAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientId = req.user!.id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
      const status = req.query.status as string | undefined;

      const { appointments, total } = await appointmentService.getMyAppointments(
        patientId,
        { status, page, limit }
      );

      sendPaginated(res, { data: appointments, page, limit, total });
    } catch (err) { next(err); }
  }

  /** GET /api/v1/appointments/:appointmentId */
  async getAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);
      sendSuccess(res, { data: appointment });
    } catch (err) { next(err); }
  }

  /** POST /api/v1/appointments/:appointmentId/start-video-call */
  async startVideoCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user!.id;
      const { appointmentId } = req.params;
      const session = await appointmentService.startVideoCall(appointmentId, requesterId);
      sendSuccess(res, { data: session });
    } catch (err) { next(err); }
  }

  /** PUT /api/v1/appointments/:appointmentId/cancel */
  async cancelAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user!.id;
      const { appointmentId } = req.params;
      const appointment = await appointmentService.cancelAppointment(appointmentId, requesterId);
      sendSuccess(res, { data: appointment, message: 'Appointment cancelled' });
    } catch (err) { next(err); }
  }
}

export const appointmentController = new AppointmentController();
