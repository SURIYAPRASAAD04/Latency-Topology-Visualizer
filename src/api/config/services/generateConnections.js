export function generateConnections(exchanges, cloudRegions, count = 20) {
  const connections = [];

  for (let i = 0; i < count; i++) {
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    const region = cloudRegions[Math.floor(Math.random() * cloudRegions.length)];

    const latency = Math.floor(Math.random() * 120) + 10;
    let quality = 'Poor';
    let color = 'red';

    if (latency < 30) [quality, color] = ['Excellent', 'green'];
    else if (latency < 60) [quality, color] = ['Good', 'yellow'];
    else if (latency < 100) [quality, color] = ['Fair', 'orange'];

    connections.push({
      id: `${exchange.id}-${region.id}`,
      exchangeId: exchange.exchangeId,
      exchangeName: exchange.exchangeName,
      regionId: region.regionId,
      regionName: region.regionName,
      provider: region.provider,
      latency,
      quality,
      color,
      startLat: exchange.lat,
      startLng: exchange.lng,
      endLat: region.lat,
      endLng: region.lng
    });
  }

  return connections;
}
