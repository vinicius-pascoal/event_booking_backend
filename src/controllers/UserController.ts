import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export class UserController {
  async index(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
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
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
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
    const { email, name, password } = req.body;

    // Verificar se usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash da senha se fornecida
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        provider: 'local',
      },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, name, password } = req.body;

    // Preparar dados para atualização
    const updateData: any = {
      email,
      name,
    };

    // Se senha foi fornecida, fazer hash
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
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
