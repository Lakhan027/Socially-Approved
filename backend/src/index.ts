import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import pexelsRouter from './routes/pexels';
import { securityHeaders } from './middleware/security';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = env.PORT;

const allowedOrigins = env.CLIENT_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  })
);
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
