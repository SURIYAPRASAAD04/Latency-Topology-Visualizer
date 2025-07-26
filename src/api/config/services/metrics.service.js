import CloudProvider from '../models/cloudProvider.model.js';
import ExchangeServer from '../models/exchangeServer.model.js';
import ServerLocation from '../models/serverLocation.model.js';


export const getMetrics = async () => {
  try {
    const [activeExchanges, cloudRegions, serverLocations] = await Promise.all([
      ExchangeServer.countDocuments(),
      CloudProvider.countDocuments({ isActive: true }), 
      ServerLocation.countDocuments()
    ]);

    return {
      averageLatency: Math.floor(Math.random() * 100) + 10,
      latencyChange: Math.floor(Math.random() * 10) - 5,
      activeExchanges,
      exchangeChange: Math.floor(Math.random() * 5) - 2,
      cloudRegions,
      regionChange: Math.floor(Math.random() * 3) - 1,
      serverLocations, 
      systemHealth: Math.floor(Math.random() * 20) + 80,
      healthChange: Math.floor(Math.random() * 5) - 2
    };
  } catch (error) {
    console.error('Error in metrics service:', error);
    throw error;
  }
};