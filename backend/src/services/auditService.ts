import prisma from '../config/database';
import { sanitizeUtf8ForDb, sanitizeObjectForDb } from '../utils/sanitize';

export interface CreateAuditLogParams {
  actorId: string;
  actorType: 'CUSTOMER' | 'MERCHANT' | 'ADMIN' | 'AI_AGENT' | 'SYSTEM';
  action: string;
  resource: string;
  resourceId?: string;
  amount?: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REJECTED';
  reason?: string;
  metadata?: any;
}

export class AuditService {
  static async log(params: CreateAuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          actorType: params.actorType,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          amount: params.amount,
          status: params.status,
          reason: params.reason ? sanitizeUtf8ForDb(params.reason) : undefined,
          metadata: params.metadata ? sanitizeObjectForDb(params.metadata) : {},
        },
      });
    } catch (error) {
      console.error('⚠️ Failed to create audit log entry:', error);
      return null;
    }
  }

  static async getAuditLogs(params: {
    actorId?: string;
    action?: string;
    status?: string;
    resource?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (params.actorId) where.actorId = params.actorId;
    if (params.action) where.action = { contains: params.action, mode: 'insensitive' };
    if (params.status) where.status = params.status;
    if (params.resource) where.resource = params.resource;

    return prisma.auditLog.findMany({
      where,
      take: params.limit || 50,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
