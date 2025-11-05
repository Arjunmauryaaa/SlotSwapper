import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export async function listEvents(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const events = await prisma.event.findMany({ where: { ownerId: userId }, orderBy: { startTime: 'asc' } });
    return res.json({ events });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function createEvent(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { title, startTime, endTime, status } = req.body as { title: string; startTime: string; endTime: string; status?: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING' };
  if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
  try {
    const event = await prisma.event.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: status ?? 'BUSY',
        ownerId: userId,
      },
    });
    return res.status(201).json({ event });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateEvent(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { title, startTime, endTime, status } = req.body as { title?: string; startTime?: string; endTime?: string; status?: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING' };
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== userId) return res.status(404).json({ message: 'Event not found' });
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        startTime: startTime ? new Date(startTime) : existing.startTime,
        endTime: endTime ? new Date(endTime) : existing.endTime,
        status: status ?? (existing.status as any),
      },
    });
    return res.json({ event });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteEvent(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== userId) return res.status(404).json({ message: 'Event not found' });
    await prisma.event.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getSwappableSlots(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.userId;
  try {
    const events = await prisma.event.findMany({
      where: { status: 'SWAPPABLE', NOT: { ownerId: userId } },
      orderBy: { startTime: 'asc' },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    return res.json({ events });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}

