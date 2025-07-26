import { fetchLatencyData } from '../services/latency.service.js';

export async function handleLatencyRequest(req, res) {
  const { location, dateRange } = req.query;

  if (!location || !dateRange) {
    return res.status(400).json({ error: 'Missing location or dateRange' });
  }

  try {
    const data = await fetchLatencyData(location, dateRange);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Latency API Error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch latency data' });
  }
}
