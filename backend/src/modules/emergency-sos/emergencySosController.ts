/**
 * Emergency SOS Controller
 * Handles HTTP requests for emergency SOS operations
 * Pattern: Controller → Service → Repository
 */

import type { Request, Response, NextFunction } from 'express';
import { emergencySosService } from './emergencySosService';
import { validateRequest } from '@middleware/validation';
import type { EmergencySOS, TriggerSOSRequest } from '../../../shared/types';

export class EmergencySosController {
  /**
   * Trigger a new emergency SOS
   * POST /api/v1/emergency/sos/trigger
   */
  public async triggerSOS(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const payload: TriggerSOSRequest = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
            statusCode: 401,
          },
        });
        return;
      }

      const emergency = await emergencySosService.triggerSOS(userId, payload);

      res.status(201).json({
        success: true,
        data: emergency,
        message: 'Emergency SOS triggered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get emergency details
   * GET /api/v1/emergency/:emergencyId
   */
  public async getEmergency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emergencyId } = req.params;
      const emergency = await emergencySosService.getEmergency(emergencyId);

      if (!emergency) {
        res.status(404).json({
          success: false,
          error: {
            code: 'EMERGENCY_NOT_FOUND',
            message: `Emergency with ID ${emergencyId} not found`,
            statusCode: 404,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update emergency status
   * POST /api/v1/emergency/:emergencyId/status
   */
  public async updateEmergencyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emergencyId } = req.params;
      const { status } = req.body;

      const updated = await emergencySosService.updateStatus(emergencyId, status);

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Emergency status updated',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel emergency
   * POST /api/v1/emergency/:emergencyId/cancel
   */
  public async cancelEmergency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emergencyId } = req.params;
      const result = await emergencySosService.cancelEmergency(emergencyId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Emergency cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get emergency timeline
   * GET /api/v1/emergency/:emergencyId/timeline
   */
  public async getEmergencyTimeline(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { emergencyId } = req.params;
      const timeline = await emergencySosService.getTimeline(emergencyId);

      res.status(200).json({
        success: true,
        data: timeline,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const emergencySosController = new EmergencySosController();
