import express from 'express';
import { getMetricsController } from '../controllers/metrics.controller.js';

const router = express.Router();

router.get('/', getMetricsController);

export default router;