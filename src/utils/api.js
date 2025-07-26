export const fetchMetrics = async () => {
  const PORT = process.env.API_PORT || 5001;
  try {
    const response = await fetch(`http://localhost:${PORT}/api/metrics`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.success ? data.data : {
      averageLatency: 0,
      activeExchanges: 0,
      cloudRegions: 0,
      systemHealth: 0,
      latencyChange: 0,
      exchangeChange: 0,
      regionChange: 0,
      healthChange: 0,
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return {
      averageLatency: 0,
      activeExchanges: 0,
      cloudRegions: 0,
      systemHealth: 0,
      latencyChange: 0,
      exchangeChange: 0,
      regionChange: 0,
      healthChange: 0,
    };
  }
};