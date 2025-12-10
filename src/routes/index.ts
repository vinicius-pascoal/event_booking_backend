import { Router } from 'express';
import eventRoutes from './event.routes';
import bookingRoutes from './booking.routes';
import userRoutes from './user.routes';

const routes = Router();

routes.use('/events', eventRoutes);
routes.use('/bookings', bookingRoutes);
routes.use('/users', userRoutes);

export default routes;
