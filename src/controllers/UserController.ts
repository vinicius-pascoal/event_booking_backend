import { Request, Response } from 'express';
import prisma from '../config/database';

export class UserController {
  async index(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      include: {
        bookings: {
          include: {
            event: true
          }
        }
      }
    });

    return res.json(users);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            event: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  }

  async create(req: Request, res: Response) {
    const { email, name } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    });

    return res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name
      }
    });

    return res.json(user);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}
