import { getExchangeLocations, getCloudProviderLocations,getAllConnections } from '../services/location.service.js';
import { generateConnections } from '../services/generateConnections.js';
import Connection from '../models/connection.model.js';
export const getLocations = async (req, res) => {
  try {
    const [exchanges, providers,conn] = await Promise.all([
      getExchangeLocations(),
      getCloudProviderLocations(),
      getAllConnections()
    ]);
   
   const connections = conn;
   const connectedExchanges = Array.from(new Set(connections.map(c => c.exchangeId)))
  .map(id => exchanges.find(e => e.id === id))
  .filter(Boolean); 

const connectedCloudRegions = Array.from(new Set(connections.map(c => c.regionId)))
  .map(id => providers.find(r => r.id === id))
  .filter(Boolean);

    res.json({
      success: true,
      data: {
        exchanges,
        providers,
        conn,
        connectedExchanges,
        connectedCloudRegions
      }
    });
   
  } catch (error) {
    console.error('Error getting locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location data'
    });
  }
};