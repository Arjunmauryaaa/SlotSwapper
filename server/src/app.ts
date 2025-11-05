import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import swapRoutes from './routes/swap.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api', eventsRoutes);
app.use('/api', swapRoutes);

export default app;

