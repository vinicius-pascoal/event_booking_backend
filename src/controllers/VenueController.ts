import { Request, Response } from 'express';
import prisma from '../config/database';

export class VenueController {
  async index(req: Request, res: Response) {
    const venues = await prisma.venue.findMany({
      include: {
        bookings: true
      }
    });

    return res.json(venues);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            user: true
          }
        }
      }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    return res.json(venue);
  }

  async create(req: Request, res: Response) {
    const { name, description, location, capacity } = req.body;

    const venue = await prisma.venue.create({
      data: {
        name,
        description,
        location,
        capacity
      }
    });

    return res.status(201).json(venue);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, location, capacity } = req.body;

    const venue = await prisma.venue.update({
      where: { id },
      data: {
        name,
        description,
        location,
        capacity
      }
    });

    return res.json(venue);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.venue.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}
