import { getLatestConnectionLatencies} from '../services/latency.service.js';

export const getConnectionLatency = async (req, res) => {
  try {
    const result = await getLatestConnectionLatencies();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching connection latency:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
