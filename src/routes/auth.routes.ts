import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const authRoutes = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               name:
 *                 type: string
 *                 example: João Silva
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
authRoutes.post('/register', AuthController.registerValidation, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
authRoutes.post('/login', AuthController.loginValidation, authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renovar token de acesso
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 */
authRoutes.post('/refresh-token', authController.refreshToken);

// Rotas protegidas

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autenticado
 */
authRoutes.get('/me', authMiddleware, authController.me);

// Placeholders para OAuth (implementação futura)
authRoutes.get('/google', authController.googleAuth);
authRoutes.get('/google/callback', authController.googleCallback);

export default authRoutes;
