import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';

const bookingRoutes = Router();
const bookingController = new BookingController();

bookingRoutes.get('/', bookingController.index);
bookingRoutes.post('/', bookingController.create);
bookingRoutes.delete('/:id', bookingController.delete);

export default bookingRoutes;
