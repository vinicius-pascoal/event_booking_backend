import { Request, Response } from 'express';
import prisma from '../config/database';

export class EventController {
  async index(req: Request, res: Response) {
    const events = await prisma.event.findMany({
      include: {
        bookings: true
      }
    });

    return res.json(events);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            user: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json(event);
  }

  async create(req: Request, res: Response) {
    const { title, description, date, location, capacity } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity
      }
    });

    return res.status(201).json(event);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, date, location, capacity } = req.body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        capacity
      }
    });

    return res.json(event);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}
