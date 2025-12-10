import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const authRoutes = Router();
const authController = new AuthController();

// Rotas públicas
authRoutes.post('/register', AuthController.registerValidation, authController.register);
authRoutes.post('/login', AuthController.loginValidation, authController.login);
authRoutes.post('/refresh-token', authController.refreshToken);

// Rotas protegidas
authRoutes.get('/me', authMiddleware, authController.me);

// Placeholders para OAuth (implementação futura)
authRoutes.get('/google', authController.googleAuth);
authRoutes.get('/google/callback', authController.googleCallback);

export default authRoutes;
