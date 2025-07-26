import Connection from '../models/connection.model.js';
import LatencyTracking from '../models/latency.model.js';

function generateLatency() {
  const latency = Math.floor(Math.random() * 200); 
  let quality = 'Poor';
  if (latency < 50) quality = 'Good';
  else if (latency < 100) quality = 'Average';
  return { latency, quality };
}

async function updateLatencies() {
  const connections = await Connection.find();

  for (const conn of connections) {
    const { latency, quality } = generateLatency();

    conn.latency = latency;
    conn.quality = quality;
    await conn.save();

    const trackingEntry = new LatencyTracking({
      connectionId: conn.id,
      latency,
      quality
    });
    await trackingEntry.save();
  }

  console.log('Latency values updated and logged at', new Date().toISOString());
}
setInterval(updateLatencies, 5000);
