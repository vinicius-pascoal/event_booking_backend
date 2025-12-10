import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthController {
  // Validação para registro
  static registerValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter pelo menos 6 caracteres'),
  ];

  // Validação para login
  static loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ];

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      // Verificar se usuário já existe
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          provider: 'local',
        },
      });

      // Gerar tokens
      const token = generateToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        user: userWithoutPassword,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verificar se é usuário local (tem senha)
      if (user.provider !== 'local' || !user.password) {
        return res.status(401).json({
          error: `Please login with ${user.provider}`,
        });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Gerar tokens
      const token = generateToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        user: userWithoutPassword,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
      // Verificar refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Gerar novos tokens
      const newToken = generateToken(user.id, user.email);
      const newRefreshToken = generateRefreshToken(user.id, user.email);

      return res.json({
        token: newToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: {
          bookings: {
            include: {
              venue: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Me error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Placeholder para futura implementação do Google OAuth
  async googleAuth(req: Request, res: Response) {
    return res.status(501).json({
      message: 'Google OAuth will be implemented in the future',
    });
  }

  async googleCallback(req: Request, res: Response) {
    return res.status(501).json({
      message: 'Google OAuth callback will be implemented in the future',
    });
  }
}
