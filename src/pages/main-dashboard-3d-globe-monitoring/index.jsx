import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GlobeVisualization from './components/GlobeVisualization';
import MetricsCards from './components/MetricsCards';
import FilterPanel from './components/FilterPanel';
import LayerControls from './components/LayerControls';
import StatusIndicator from './components/StatusIndicator';

const MainDashboard3DGlobeMonitoring = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [layerControlsVisible, setLayerControlsVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [connections, setConnections] = useState([]);
  const [cloudRegions, setCloudRegions] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const [filters, setFilters] = useState({
    exchanges: ["",""],
    providers: [],
    latencyRange: [0, 200],
    regions: []
  });


  const [layers, setLayers] = useState({
    exchanges: true,
    cloudRegions: true,
    connections: true,
    heatmap: false,
    dataFlow: true,
    atmosphere: true
  });




 
  const providers = [
    {
      id: 'aws',
      name: 'Amazon Web Services',
      logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
      regionCount: 12,
      avgLatency: 15
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
      regionCount: 8,
      avgLatency: 18
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
      regionCount: 6,
      avgLatency: 22
    }
  ];

 
  const [metrics, setMetrics] = useState({
    averageLatency: 18,
    latencyChange: -2.5,
    activeExchanges: 4,
    exchangeChange: 0,
    cloudRegions: 26,
    regionChange: 1.2,
    systemHealth: 97,
    healthChange: 0.8
  });


  const [statusData, setStatusData] = useState({
    status: 'online',
    lastUpdate: new Date().toLocaleTimeString(),
    dataPoints: {
      activeConnections: 1247,
      dataPointsPerSecond: 156,
      avgResponseTime: 12,
      systemHealth: 97
    }
  });
  const getFilters = () => {
    return filters;
  };

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed]);


  const handleLocationHover = useCallback((location, type) => {
    setSelectedLocation({ ...location, type });
  }, []);

  const handleLocationClick = useCallback((location, type) => {
    console.log('Location clicked:', location, type);
  }, []);


  const handleLayerToggle = useCallback((layerId, enabled) => {
    setLayers(prev => ({
      ...prev,
      [layerId]: enabled
    }));
  }, []);
const [refreshKey, setRefreshKey] = useState(0);
  const handleApplyFilters = async () => {
    console.log('Applying filters:', filters);
    setRefreshKey(prev => prev + 1);

  };
    const handleClearFilters = () => {
    setFilters({
     exchanges: [],
    providers: [],
    latencyRange: [0, 200],
    regions: []
    });
  };
const PROVIDERS = ["aws", "azure", "gcp"];
 const [selectedText, setSelectedText] = useState('');

  const handleSelect = (value) => {
    console.log('Selected:', value);
    setSelectedText(value);
  const lowerVal = value.toLowerCase();

 
  if (PROVIDERS.includes(lowerVal)) {
 
    setFilters({
      exchanges: [],
      providers: [value],
      latencyRange: [0, 200],
      regions: []
    });
  } else {
   
    setFilters({
      exchanges: [value],
      providers: [],
      latencyRange: [0, 200],
      regions: []
    });
  }
   setRefreshKey(prev => prev + 1);
};

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/locations/locations');
        const data = await response.json();
        setExchanges(data.data.exchanges);
        setCloudRegions(data.data.providers);
        setConnections(data.data.conn);
       
       
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();


    const interval = setInterval(() => {
     
      setMetrics(prev => ({
        ...prev,
        averageLatency: Math.max(10, prev.averageLatency + (Math.random() - 0.5) * 2),
        systemHealth: Math.max(85, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2))
      }));

      setStatusData(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString(),
        dataPoints: {
          ...prev.dataPoints,
          activeConnections: prev.dataPoints.activeConnections + Math.floor((Math.random() - 0.5) * 10),
          dataPointsPerSecond: Math.max(100, prev.dataPoints.dataPointsPerSecond + Math.floor((Math.random() - 0.5) * 20)),
          avgResponseTime: Math.max(8, prev.dataPoints.avgResponseTime + (Math.random() - 0.5) * 2)
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);
   if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative rounded-xl p-4 backdrop-blur-md border border-white/20 animate-pulse">
            <div className="h-24 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  


  return (
    <>
      <Helmet>
        <title>Main Dashboard - 3D Globe Monitoring | Latency Topology Visualizer</title>
        <meta name="description" content="Real-time cryptocurrency exchange latency monitoring through interactive 3D globe visualization with cloud provider regions and connection analysis." />
        <meta name="keywords" content="cryptocurrency, latency monitoring, 3D visualization, trading infrastructure, cloud providers" />
      </Helmet>

      <div className="h-screen bg-background overflow-hidden">
        {/* Header */}
        <Header 
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
           connections={connections} onSelect={handleSelect}
        />

        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />

        {/* Main Content */}
        <main className={`
          h-[calc(100vh-60px)] overflow-hidden
          transition-all duration-300
          ${sidebarCollapsed ? 'main-offset-collapsed' : 'main-offset'}
        `}>
          <div className="relative h-full w-full">
            {/* 3D Globe Visualization */}
            <div className="h-screen w-full">
              <GlobeVisualization
              key={refreshKey}
                exchanges={exchanges}
                cloudRegions={cloudRegions}
                connections={connections}
                filters={filters}
                getFilters={getFilters}
                onLocationHover={handleLocationHover}
                onLocationClick={handleLocationClick}
              />
            </div>

          

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={() => {
                handleApplyFilters();
              
              }}
              onClearFilters={handleClearFilters}
              exchanges={exchanges}
              providers={providers}
              isVisible={filterPanelVisible}
              onToggle={() => setFilterPanelVisible(!filterPanelVisible)}
            />

            {/* Bottom Metrics - Desktop */}
            <div className="hidden lg:block absolute bottom-4 left-4 right-4 pointer-events-none">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 pointer-events-auto">
                <div className="xl:col-span-4">
                  <MetricsCards metrics={metrics} />
                </div>
              </div>
            </div>

            {/* Bottom Metrics - Mobile/Tablet */}
            <div className="lg:hidden absolute bottom-4 left-4 right-4 max-h-[40vh] overflow-y-auto pointer-events-none">
              <div className="space-y-4 pointer-events-auto">
                <MetricsCards metrics={metrics} />
              </div>
            </div>

            {/* Selected Location Info */}
            {selectedLocation && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border rounded-lg p-4 max-w-sm z-30 pointer-events-none">
                <div className="flex items-center space-x-2 mb-2">
                  <img 
                    src={selectedLocation.logo} 
                    alt={selectedLocation.name}
                    className="w-6 h-6 rounded"
                  />
                  <h3 className="font-semibold text-foreground">
                    {selectedLocation.name}
                  </h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">{selectedLocation.location}</p>
                  {selectedLocation.latency && (
                    <p className="text-primary font-jetbrains-mono">
                      {selectedLocation.latency}ms avg latency
                    </p>
                  )}
                  {selectedLocation.serverCount && (
                    <p className="text-muted-foreground">
                      {selectedLocation.serverCount} servers
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default MainDashboard3DGlobeMonitoring;