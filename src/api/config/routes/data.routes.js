import express from 'express';
import { getExchanges, getProviders, getRegions } from '../controllers/data.controller.js';

const router = express.Router();

router.get('/exchanges', getExchanges);
router.get('/providers', getProviders);
router.get('/regions', getRegions);

export default router;