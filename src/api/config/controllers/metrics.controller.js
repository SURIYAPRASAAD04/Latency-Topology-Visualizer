import { getMetrics } from '../services/metrics.service.js';

export const getMetricsController = async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch metrics',
      error: error.message 
    });
  }
};