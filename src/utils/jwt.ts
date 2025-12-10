import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ userId, email }, secret, { expiresIn });
};

export const generateRefreshToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  return jwt.sign({ userId, email }, secret, { expiresIn });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key';
  return jwt.verify(token, secret) as TokenPayload;
};
