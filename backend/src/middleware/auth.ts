import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../services/supabaseService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token, allow through as guest / anonymous demo user
    req.user = { id: 'anonymous-user', email: 'guest@travelgenie.local' };
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  const client = SupabaseService.getClient();

  if (client) {
    try {
      const { data: { user }, error } = await client.auth.getUser(token);
      if (error || !user) {
        req.user = { id: 'anonymous-user', email: 'guest@travelgenie.local' };
      } else {
        req.user = { id: user.id, email: user.email };
      }
    } catch {
      req.user = { id: 'anonymous-user', email: 'guest@travelgenie.local' };
    }
  } else {
    // In dev / demo fallback, decode dummy JWT or use demo user
    req.user = { id: 'demo-user-123', email: 'demo@travelgenie.local' };
  }

  next();
};

