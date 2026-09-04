import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { AuditService } from '../services/auditService';
import { sendSuccess, sendError } from '../utils/response';

export class AuditController {
  static async getAuditLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const { actorId, action, status, resource, limit } = req.query;

      // If customer, restrict to own actorId
      let filterActorId = actorId as string;
      if (req.user?.role === 'CUSTOMER') {
        filterActorId = req.user.userId;
      }

      const logs = await AuditService.getAuditLogs({
        actorId: filterActorId,
        action: action as string,
        status: status as string,
        resource: resource as string,
        limit: limit ? Number(limit) : 100,
      });

      return sendSuccess(res, { count: logs.length, logs });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch audit trail', 'AUDIT_ERROR', 400);
    }
  }
}
