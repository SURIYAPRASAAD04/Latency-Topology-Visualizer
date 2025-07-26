import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.config.js';
import metricsRouter from './routes/metrics.routes.js';
import LatencyRouter from './routes/latency.routes.js';
import dataRouter from './routes/data.routes.js';
import locationRoutes from '../config/routes/location.routes.js';
import './services/latencyUpdater.js'; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:4028',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/metrics', metricsRouter);
app.use('/api/data', dataRouter);
app.use('/api/locations', locationRoutes);
app.use('/api/latency', LatencyRouter);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;