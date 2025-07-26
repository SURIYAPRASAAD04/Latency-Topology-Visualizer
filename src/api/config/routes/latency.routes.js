import express from 'express';
import { getConnectionLatency } from '../controllers/latency.controller.js';
import { getConnectionLatencyHistory } from '../controllers/latencyHistory.controller.js';
import { getConnectionLatencymetric } from '../controllers/latencymetric.controller.js';
import { handleLatencyRequest } from '../controllers/latencylive.controller.js';

const router = express.Router();

router.get('/latency', getConnectionLatency);
router.get('/latencyhistory', getConnectionLatencyHistory);
router.get('/latencymetric', getConnectionLatencymetric);
router.get('/latencylive', handleLatencyRequest);
export default router;

