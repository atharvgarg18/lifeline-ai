/**
 * RBAC — Role-Based Access Control Middleware
 * Use authorize() after authenticate() on protected routes
 *
 * Usage:
 *   router.get('/dashboard', authenticate, authorize('PATIENT'), controller.getDashboard)
 *   router.get('/admin', authenticate, authorize('SYSTEM_ADMIN', 'HOSPITAL_ADMIN'), controller.getAdmin)
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'AMBULANCE_DRIVER'
  | 'HOSPITAL_ADMIN'
  | 'SYSTEM_ADMIN'
  | 'GOVERNMENT_OFFICIAL';

/**
 * authorize — middleware factory that checks if req.user.role is in allowedRoles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('UNAUTHORIZED', 401, 'Authentication required'));
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      next(
        new AppError(
          'FORBIDDEN',
          403,
          `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${userRole}`
        )
      );
      return;
    }

    next();
  };
};

/**
 * authorizeOwnerOrAdmin — ensures patient can only access their own resources
 * unless they are SYSTEM_ADMIN or HOSPITAL_ADMIN
 *
 * Usage: router.get('/patient/:patientId', authenticate, authorizeOwnerOrAdmin('patientId'))
 */
export const authorizeOwnerOrAdmin = (idParamName: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('UNAUTHORIZED', 401, 'Authentication required'));
      return;
    }

    const adminRoles: UserRole[] = ['SYSTEM_ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR', 'GOVERNMENT_OFFICIAL'];

    if (adminRoles.includes(req.user.role as UserRole)) {
      next();
      return;
    }

    const resourceId = req.params[idParamName];
    if (req.user.id !== resourceId) {
      next(new AppError('FORBIDDEN', 403, 'You can only access your own resources'));
      return;
    }

    next();
  };
};
