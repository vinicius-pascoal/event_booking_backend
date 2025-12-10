import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer') {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
