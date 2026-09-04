import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CommerceAIAgent } from '../ai/agent';
import { sendSuccess, sendError } from '../utils/response';

export class AIController {
  static async chat(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user || { userId: 'guest_user_demo', role: 'CUSTOMER', email: 'guest@demo.com' };
      const { userQuery, conversationId, cartId, history } = req.body;

      if (!userQuery || typeof userQuery !== 'string') {
        return sendError(res, 'User query string is required', 'INVALID_INPUT', 400);
      }

      const agentResponse = await CommerceAIAgent.processQuery({
        userId: user.userId,
        userQuery,
        conversationId,
        cartId,
        history,
      });

      return sendSuccess(res, agentResponse, 'AI response generated successfully');
    } catch (error: any) {
      console.error('AI Controller Error:', error);
      return sendError(res, error.message || 'AI processing error', 'AI_ERROR', 500);
    }
  }
}
