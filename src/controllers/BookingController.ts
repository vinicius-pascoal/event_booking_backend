import { Request, Response } from 'express';
import prisma from '../config/database';

export class BookingController {
  async index(req: Request, res: Response) {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        venue: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    return res.json(bookings);
  }

  async create(req: Request, res: Response) {
    const { userId, venueId, eventName, description, date, startTime, endTime } = req.body;

    // Validar que startTime é antes de endTime
    const start = new Date(startTime);
    const end = new Date(endTime);
    const eventDate = new Date(date);

    if (start >= end) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }

    // Verificar se o local existe e tem capacidade disponível
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        bookings: true
      }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Verificar conflitos de horário no mesmo dia
    // Um conflito ocorre quando:
    // - É o mesmo local (venueId)
    // - É a mesma data
    // - Os horários se sobrepõem: (newStart < existingEnd) AND (newEnd > existingStart)
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        venueId,
        date: eventDate,
        status: {
          not: 'cancelled'
        },
        AND: [
          {
            startTime: {
              lt: end
            }
          },
          {
            endTime: {
              gt: start
            }
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(409).json({
        error: 'Time slot conflict',
        message: 'This venue already has a booking during the requested time',
        conflictingBookings: conflictingBookings.map(b => ({
          id: b.id,
          eventName: b.eventName,
          date: b.date,
          startTime: b.startTime,
          endTime: b.endTime
        }))
      });
    }

    // Verificar capacidade do local para o mesmo dia (não pode ultrapassar a capacidade total)
    const sameTimeBookings = await prisma.booking.findMany({
      where: {
        venueId,
        date: eventDate,
        status: {
          not: 'cancelled'
        },
        AND: [
          {
            startTime: {
              lt: end
            }
          },
          {
            endTime: {
              gt: start
            }
          }
        ]
      }
    });

    if (sameTimeBookings.length >= venue.capacity) {
      return res.status(400).json({ error: 'Venue is at full capacity for this time slot' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId,
        eventName,
        description,
        date: eventDate,
        startTime: start,
        endTime: end
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        venue: true
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

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    // Apenas permitir atualização do status (confirmed, cancelled, pending)
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        venue: true
      }
    });

    return res.json(booking);
  }
}
