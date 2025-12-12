import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';

const bookingRoutes = Router();
const bookingController = new BookingController();

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gerenciamento de reservas de locais
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Listar todas as reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
bookingRoutes.get('/', bookingController.index);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Criar nova reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - venueId
 *               - eventName
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               venueId:
 *                 type: string
 *                 format: uuid
 *               eventName:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       409:
 *         description: Conflito de horário
 */
bookingRoutes.post('/', bookingController.create);
bookingRoutes.put('/:id', bookingController.update);
bookingRoutes.delete('/:id', bookingController.delete);

export default bookingRoutes;
