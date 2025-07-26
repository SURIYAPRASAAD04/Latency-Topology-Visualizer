import ExchangeServer from '../models/exchangeServer.model.js';
import CloudProvider from '../models/cloudProvider.model.js';
import Connection from '../models/connection.model.js';
export const getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.find().lean(); 
    return connections.map(conn => ({
      id: conn.id,
      exchangeId: conn.exchangeId,
      exchangeName: conn.exchangeName,
      regionId: conn.regionId,
      regionName: conn.regionName,
      provider: conn.provider,
      latency: conn.latency,
      quality: conn.quality,
      startLat: conn.startLat,
      startLng: conn.startLng,
      endLat: conn.endLat,
      endLng: conn.endLng
    }));
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connection data'
    });
  }
};
export const getExchangeLocations = async () => {
  const statusOptions = ['online', 'offline', 'warning'];
const providerOptions = ['AWS', 'Azure', 'GCP'];

function getRandomValue(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
  try {
    const exchanges = await ExchangeServer.find({}).lean();
     return exchanges.map(exchange => ({
  id: exchange.exchangeId,
  name: exchange.exchangeName,
  code:exchange.baseCountry,
  location: exchange.baseCountry,
  lat: exchange.coordinates.lat,
  lng: exchange.coordinates.lng,
  logo: exchange.logoUrl,
  latency: Math.floor(Math.random() * 50) + 10, 
  provider: exchange.provider || getRandomValue(providerOptions),
  status: exchange.status || getRandomValue(statusOptions)
}));
    
   
  } catch (error) {
    console.error('Error fetching exchange locations:', error);
    return [];
  }
};

export const getCloudProviderLocations = async () => {
  try {
    const providers = await CloudProvider.find({ isActive: true }).lean();
   return providers.map(provider => {
  const providerKey = provider.providerName.toLowerCase();

  const logoMap = {
    aws: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
    gcp: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
    azure: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center'
  };

  const defaultLogo = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center';

  return {
    id: provider.regionCode,
    name: provider.regionName,
    location: `${provider.city}, ${provider.country}`,
    lat: provider.coordinates.lat,
    lng: provider.coordinates.lng,
    code:provider.alpha2,
    type: 'provider',
    logo: logoMap[providerKey] || defaultLogo,
    provider: providerKey,
    region: provider.regionName,
    capacity: provider.availableCapacity,
    serverCount: Math.floor(Math.random() * (1000 - 100 + 1)) + 100
  };
});

 
  } catch (error) {
    console.error('Error fetching cloud provider locations:', error);
    return [];
  }
};