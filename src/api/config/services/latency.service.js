import Connection from '../models/connection.model.js';
import LatencyTracking from '../models/latency.model.js';
import ExchangeServer from '../models/exchangeServer.model.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/radar/quality/iqi/timeseries_groups';
const API_TOKEN = process.env.CF_API_TOKEN;

export const getAllConnectionsWithLatencyHistory  = async (filters) => {
  const { exchangeName, provider, regionName, minLatency, maxLatency } = filters;

  const connectionQuery = {};
  if (exchangeName) connectionQuery.exchangeName = exchangeName;
  if (provider) connectionQuery.provider = provider;
  if (regionName) connectionQuery.regionName = regionName;

  const connections = await Connection.find(connectionQuery).lean();

  const connectionIds = connections.map(c => c.id);

  const latencyQuery = { connectionId: { $in: connectionIds } };
  if (minLatency !== undefined || maxLatency !== undefined) {
    latencyQuery.latency = {};
    if (minLatency !== undefined) latencyQuery.latency.$gte = minLatency;
    if (maxLatency !== undefined) latencyQuery.latency.$lte = maxLatency;
  }

  const allLatencies = await LatencyTracking.find(latencyQuery).sort({ timestamp: 1 }).lean();

  const latencyHistoryMap = {};
  allLatencies.forEach((lat) => {
    if (!latencyHistoryMap[lat.connectionId]) {
      latencyHistoryMap[lat.connectionId] = {};
    }
    const timeKey = new Date(lat.timestamp).toISOString();
    latencyHistoryMap[lat.connectionId][timeKey] = lat.latency;
  });

  return connections.map((conn) => ({
 
    latencyHistory: latencyHistoryMap[conn.id] || {}
  }));
};



export const getAllConnectionsWithLatencymetric  = async () => {
 

  const connections = await Connection.find({});

  const connectionIds = connections.map(c => c.id);
const minLatency=0;
const maxLatency=200;
  const latencyQuery = { connectionId: { $in: connectionIds } };
  if (minLatency !== undefined || maxLatency !== undefined) {
    latencyQuery.latency = {};
    if (minLatency !== undefined) latencyQuery.latency.$gte = minLatency;
    if (maxLatency !== undefined) latencyQuery.latency.$lte = maxLatency;
  }

  const allLatencies = await LatencyTracking.find(latencyQuery).sort({ timestamp: 1 }).lean();
const exchanges = await ExchangeServer.find({}).lean();
 
  const latencyHistoryMap = {};
  allLatencies.forEach((lat) => {
    if (!latencyHistoryMap[lat.connectionId]) {
      latencyHistoryMap[lat.connectionId] = {};
    }
    const timeKey = new Date(lat.timestamp).toISOString();
    latencyHistoryMap[lat.connectionId][timeKey] = lat.latency;
  });
   return connections.map(conn => {
    const latencies = Object.values(latencyHistoryMap[conn.id] || []);
    
    const sum = latencies.reduce((a, b) => a + b, 0);
    const avgLatency = latencies.length > 0 ? parseFloat((sum / latencies.length).toFixed(2)) : 0;
    const peakLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
    const reliability = 100; 
    const dataPoints = latencies.length;
  const exchange = exchanges.find(e => e.exchangeName === conn.exchangeName);

  const logoUrl = exchange?.logoUrl || 'https://via.placeholder.com/40';
 
    return {
      id: conn.id,
      exchange: conn.exchangeName,
      provider: conn.provider,
      region: conn.regionName,
      logo: logoUrl,
      avgLatency,
      peakLatency,
      reliability,
      dataPoints
    };
  });
};


export const getLatestConnectionLatencies = async () => {
 
  const connections = await Connection.find({});

 
  const latencyDocs = await LatencyTracking.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$connectionId',
        latency: { $first: '$latency' },
        quality: { $first: '$quality' },
        timestamp: { $first: '$timestamp' }
      }
    }
  ]);

  const latencyMap = {};
  latencyDocs.forEach(doc => {
    latencyMap[doc._id] = {
      latency: doc.latency,
      quality: doc.quality
    };
  });

 
  return connections.map(conn => ({
    id: conn.id,
    exchangeId: conn.exchangeId,
    exchangeName: conn.exchangeName,
    regionId: conn.regionId,
    regionName: conn.regionName,
    provider: conn.provider,
    startLat: conn.startLat,
    startLng: conn.startLng,
    endLat: conn.endLat,
    endLng: conn.endLng,
    latency: latencyMap[conn.id]?.latency ?? null,
    quality: latencyMap[conn.id]?.quality ?? 'Unknown'
  }));
};


export async function fetchLatencyData(location = 'IN', dateRange = '1d') {
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`
  };

  const params = {
    metric: 'LATENCY',
    location,     
    dateRange     
  };

  try {
    const response = await axios.get(CLOUDFLARE_API_URL, {
      headers,
      params
    });


    const series = response.data.result.serie_0;
    
 
   const flatData = series.timestamps.map((timestamp, i) => ({
  timestamp,
 
  p50: series.p50?.[i] ?? null,
 
}));

    return {
   
      data: flatData
    };
  } catch (error) {
    console.error('Latency API Error:', error.response?.data || error.message);
    throw error;
  }
}
