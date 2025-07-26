import { getAllConnectionsWithLatencyHistory} from '../services/latency.service.js';

export const getConnectionLatencyHistory = async (req, res) => {
  try {
     const { exchangeName, provider, regionName, minLatency, maxLatency } = req.query;

    const filters = {};

    if (exchangeName) {
      filters.exchangeName = { $regex: new RegExp(`^${exchangeName}$`, 'i') };
    }
    if (provider) {
      filters.provider = { $regex: new RegExp(`^${provider}$`, 'i') };
    }
    if (regionName) {
        filters.regionName = { $regex: new RegExp(regionName, 'i') };
     
    }

    if (minLatency || maxLatency) {
      filters.latencyRange = {
        ...(minLatency && { $gte: Number(minLatency) }),
        ...(maxLatency && { $lte: Number(maxLatency) }),
      };
    }
    const result = await getAllConnectionsWithLatencyHistory(filters);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching connection latency:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};