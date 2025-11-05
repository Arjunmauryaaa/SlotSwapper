import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

import { signJwt } from '../utils/jwt.js';

const prisma = new PrismaClient();

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    const token = signJwt({ userId: user.id, email: user.email });
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signJwt({ userId: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

