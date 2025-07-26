
import { getAllConnectionsWithLatencymetric} from '../services/latency.service.js';

export const getConnectionLatencymetric = async (req, res) => {
  try {
    const result = await getAllConnectionsWithLatencymetric();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching connection latency:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
