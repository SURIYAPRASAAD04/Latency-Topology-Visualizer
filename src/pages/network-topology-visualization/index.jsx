import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NetworkGraph from './components/NetworkGraph';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import TopologyHeader from './components/TopologyHeader';

const NetworkTopologyVisualization = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('force');
  const [showLatencyHeatmap, setShowLatencyHeatmap] = useState(false);
  const [showTrafficVolume, setShowTrafficVolume] = useState(true);
  const [showConnectionHealth, setShowConnectionHealth] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    providers: ['aws', 'gcp', 'azure'],
    exchanges: ['binance', 'coinbase', 'kraken'],
    maxLatency: 500
  });

  // Mock real-time stats
  const [stats, setStats] = useState({
    connectionCount: 24,
    avgLatency: 28,
    healthScore: 94
  });

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        connectionCount: prev.connectionCount + Math.floor(Math.random() * 3) - 1,
        avgLatency: Math.max(10, prev.avgLatency + Math.floor(Math.random() * 6) - 3),
        healthScore: Math.max(80, Math.min(100, prev.healthScore + Math.floor(Math.random() * 4) - 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleControlPanelToggle = () => {
    setControlPanelOpen(!controlPanelOpen);
  };

  const handleInfoPanelToggle = () => {
    setInfoPanelOpen(!infoPanelOpen);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    // Auto-open info panel on mobile when node is selected
    if (window.innerWidth < 1024) {
      setInfoPanelOpen(true);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleLatencyHeatmapToggle = (checked) => {
    setShowLatencyHeatmap(checked);
  };

  const handleTrafficVolumeToggle = (checked) => {
    setShowTrafficVolume(checked);
  };

  const handleConnectionHealthToggle = (checked) => {
    setShowConnectionHealth(checked);
  };

  const handleFilterChange = (filterType, value, checked) => {
    if (filterType === 'reset') {
      setSelectedFilters({
        providers: ['aws', 'gcp', 'azure'],
        exchanges: ['binance', 'coinbase', 'kraken'],
        maxLatency: 500
      });
      return;
    }

    if (filterType === 'maxLatency') {
      setSelectedFilters(prev => ({
        ...prev,
        maxLatency: checked
      }));
      return;
    }

    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter(item => item !== value)
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-6">
      {/* Header */}
      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />

        {/* Main Content Area */}
        <main className={`
          flex-1 transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar'}
          mt-header
        `}>
          <div className="h-[calc(100vh-60px)] flex flex-col lg:flex-row">
            {/* Control Panel */}
            <div className="lg:w-80 flex-shrink-0">
              <ControlPanel
                isOpen={controlPanelOpen}
                onToggle={handleControlPanelToggle}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                showLatencyHeatmap={showLatencyHeatmap}
                onLatencyHeatmapToggle={handleLatencyHeatmapToggle}
                showTrafficVolume={showTrafficVolume}
                onTrafficVolumeToggle={handleTrafficVolumeToggle}
                showConnectionHealth={showConnectionHealth}
                onConnectionHealthToggle={handleConnectionHealthToggle}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Main Visualization Area */}
            <div className="flex-1 flex flex-col">
              {/* Topology Header */}
              <TopologyHeader
                onControlPanelToggle={handleControlPanelToggle}
                onInfoPanelToggle={handleInfoPanelToggle}
                selectedNode={selectedNode}
                connectionCount={stats.connectionCount}
                avgLatency={stats.avgLatency}
                healthScore={stats.healthScore}
              />

              {/* Network Graph */}
              <div className="flex-1 p-4">
                <NetworkGraph
                  selectedFilters={selectedFilters}
                  selectedNode={selectedNode}
                  onNodeSelect={handleNodeSelect}
                  viewMode={viewMode}
                  showLatencyHeatmap={showLatencyHeatmap}
                  showTrafficVolume={showTrafficVolume}
                  showConnectionHealth={showConnectionHealth}
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:w-80 flex-shrink-0">
              <InfoPanel
                selectedNode={selectedNode}
                isOpen={infoPanelOpen}
                onToggle={handleInfoPanelToggle}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NetworkTopologyVisualization;