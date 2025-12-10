import { Router } from 'express';
import authRoutes from './auth.routes';
import venueRoutes from './venue.routes';
import bookingRoutes from './booking.routes';
import userRoutes from './user.routes';
import { authMiddleware } from '../middlewares/auth';

const routes = Router();

// Rotas públicas
routes.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
routes.use('/venues', authMiddleware, venueRoutes);
routes.use('/bookings', authMiddleware, bookingRoutes);
routes.use('/users', authMiddleware, userRoutes);

export default routes;
