import { Request, Response } from 'express';
import prisma from '../config/database';

export class BookingController {
  async index(req: Request, res: Response) {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        event: true
      }
    });

    return res.json(bookings);
  }

  async create(req: Request, res: Response) {
    const { userId, eventId } = req.body;

    // Verificar se o evento existe e tem capacidade disponível
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        bookings: true
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.bookings.length >= event.capacity) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        eventId
      },
      include: {
        user: true,
        event: true
      }
    });

    return res.status(201).json(booking);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.booking.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}
