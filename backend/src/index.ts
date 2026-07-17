import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import pexelsRouter from './routes/pexels';
import { securityHeaders } from './middleware/security';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());
app.use(securityHeaders);

app.use('/pexels', pexelsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
