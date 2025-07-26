import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricCard from './components/MetricCard';
import AlertPanel from './components/AlertPanel';
import FilterControls from './components/FilterControls';
import RegionalBreakdown from './components/RegionalBreakdown';
import ProviderComparison from './components/ProviderComparison';
import AlertSummary from './components/AlertSummary';

const PerformanceMetricsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    region: 'all',
    provider: 'all'
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [metricsData, setMetricsData] = useState({
    systemUptime: {
      value: 99.97,
      unit: '%',
      trend: 'up',
      trendValue: 0.02,
      sparklineData: [99.95, 99.96, 99.94, 99.97, 99.98, 99.97, 99.99, 99.97, 99.96, 99.98, 99.97, 99.97],
      status: 'excellent'
    },
    globalLatency: {
      value: 28,
      unit: 'ms',
      trend: 'down',
      trendValue: 5.2,
      sparklineData: [32, 30, 29, 31, 28, 27, 29, 28, 26, 28, 29, 28],
      status: 'good'
    },
    activeConnections: {
      value: 1247,
      unit: '',
      trend: 'up',
      trendValue: 12.5,
      sparklineData: [1180, 1195, 1210, 1225, 1240, 1235, 1250, 1247, 1245, 1248, 1250, 1247],
      status: 'excellent'
    },
    providerAvailability: {
      value: 98.5,
      unit: '%',
      trend: 'up',
      trendValue: 1.8,
      sparklineData: [97.2, 97.8, 98.1, 98.3, 98.5, 98.2, 98.7, 98.5, 98.4, 98.6, 98.5, 98.5],
      status: 'good'
    }
  });

  // Mock regional data
  const regionalData = [
    {
      id: 'us-east',
      name: 'US East',
      code: 'USE',
      avgLatency: 15,
      exchanges: 8,
      providers: 3
    },
    {
      id: 'us-west',
      name: 'US West',
      code: 'USW',
      avgLatency: 22,
      exchanges: 6,
      providers: 3
    },
    {
      id: 'eu-west',
      name: 'EU West',
      code: 'EUW',
      avgLatency: 35,
      exchanges: 12,
      providers: 4
    },
    {
      id: 'asia-pacific',
      name: 'Asia Pacific',
      code: 'AP',
      avgLatency: 48,
      exchanges: 15,
      providers: 2
    }
  ];

  // Mock provider data
  const providerData = [
    {
      id: 'aws',
      name: 'AWS',
      avgLatency: 25,
      uptime: 99.9,
      regions: 12,
      connections: 450,
      p95Latency: 42,
      errorRate: 0.1,
      throughput: '2.5K'
    },
    {
      id: 'gcp',
      name: 'Google Cloud',
      avgLatency: 28,
      uptime: 99.8,
      regions: 8,
      connections: 320,
      p95Latency: 45,
      errorRate: 0.2,
      throughput: '1.8K'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      avgLatency: 32,
      uptime: 99.7,
      regions: 6,
      connections: 280,
      p95Latency: 52,
      errorRate: 0.3,
      throughput: '1.4K'
    },
    {
      id: 'digital-ocean',
      name: 'DigitalOcean',
      avgLatency: 38,
      uptime: 99.5,
      regions: 4,
      connections: 197,
      p95Latency: 58,
      errorRate: 0.5,
      throughput: '950'
    }
  ];

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      title: 'High Latency Detected',
      message: 'Average latency in EU-West region has exceeded 50ms threshold for the past 5 minutes.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 300000),
      source: 'EU-West Monitor',
      acknowledged: false
    },
    {
      id: 2,
      title: 'Connection Spike',
      message: 'Unusual increase in connection requests detected from Asia-Pacific region.',
      severity: 'info',
      timestamp: new Date(Date.now() - 600000),
      source: 'Traffic Monitor',
      acknowledged: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
 
      setMetricsData(prev => ({
        ...prev,
        globalLatency: {
          ...prev.globalLatency,
          value: Math.max(20, Math.min(40, prev.globalLatency.value + (Math.random() - 0.5) * 4)),
          sparklineData: [...prev.globalLatency.sparklineData.slice(1), Math.max(20, Math.min(40, prev.globalLatency.value + (Math.random() - 0.5) * 4))]
        },
        activeConnections: {
          ...prev.activeConnections,
          value: Math.max(1000, Math.min(1500, prev.activeConnections.value + Math.floor((Math.random() - 0.5) * 20))),
          sparklineData: [...prev.activeConnections.sparklineData.slice(1), Math.max(1000, Math.min(1500, prev.activeConnections.value + Math.floor((Math.random() - 0.5) * 20)))]
        }
      }));
      
      setLastUpdate(new Date());
    }, 10000); 

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCardClick = (cardType) => {
    setExpandedCard(cardType);
  };

  const handleCardClose = () => {
    setExpandedCard(null);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    console.log('Filters updated:', newFilters);
  };

  const handleExport = async (format, exportFilters) => {
    
    console.log(`Exporting ${format} with filters:`, exportFilters);
    
    
    const exportData = {
      timestamp: new Date().toISOString(),
      filters: exportFilters,
      metrics: metricsData,
      regional: regionalData,
      providers: providerData
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-metrics-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      
      const csvData = [
        ['Metric', 'Value', 'Unit', 'Trend', 'Status'],
        ['System Uptime', metricsData.systemUptime.value, metricsData.systemUptime.unit, metricsData.systemUptime.trend, metricsData.systemUptime.status],
        ['Global Latency', metricsData.globalLatency.value, metricsData.globalLatency.unit, metricsData.globalLatency.trend, metricsData.globalLatency.status],
        ['Active Connections', metricsData.activeConnections.value, metricsData.activeConnections.unit, metricsData.activeConnections.trend, metricsData.activeConnections.status],
        ['Provider Availability', metricsData.providerAvailability.value, metricsData.providerAvailability.unit, metricsData.providerAvailability.trend, metricsData.providerAvailability.status]
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-metrics-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleAlertDismiss = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleAlertAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleAlertResolve = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleViewAllAlerts = () => {
   
    console.log('Navigate to alerts page');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />

      <main className={`
        transition-all duration-300 pt-header
        ${sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar'}
      `}>
        <div className="p-6 pt-12 space-y-6 ">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-inter">
                Performance Metrics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time system health monitoring and latency statistics
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success pulse-ambient" />
                <span>Live Updates</span>
              </div>
              <div className="font-jetbrains-mono">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <FilterControls 
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
          />

          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              title="System Uptime"
              value={metricsData.systemUptime.value}
              unit={metricsData.systemUptime.unit}
              trend={metricsData.systemUptime.trend}
              trendValue={metricsData.systemUptime.trendValue}
              sparklineData={metricsData.systemUptime.sparklineData}
              status={metricsData.systemUptime.status}
              icon="Activity"
              onClick={() => handleCardClick('systemUptime')}
              isExpanded={expandedCard === 'systemUptime'}
              onClose={handleCardClose}
            />
            
            <MetricCard
              title="Global Latency"
              value={metricsData.globalLatency.value}
              unit={metricsData.globalLatency.unit}
              trend={metricsData.globalLatency.trend}
              trendValue={metricsData.globalLatency.trendValue}
              sparklineData={metricsData.globalLatency.sparklineData}
              status={metricsData.globalLatency.status}
              icon="Zap"
              onClick={() => handleCardClick('globalLatency')}
              isExpanded={expandedCard === 'globalLatency'}
              onClose={handleCardClose}
            />
            
            <MetricCard
              title="Active Connections"
              value={metricsData.activeConnections.value}
              unit={metricsData.activeConnections.unit}
              trend={metricsData.activeConnections.trend}
              trendValue={metricsData.activeConnections.trendValue}
              sparklineData={metricsData.activeConnections.sparklineData}
              status={metricsData.activeConnections.status}
              icon="Network"
              onClick={() => handleCardClick('activeConnections')}
              isExpanded={expandedCard === 'activeConnections'}
              onClose={handleCardClose}
            />
            
            <MetricCard
              title="Provider Availability"
              value={metricsData.providerAvailability.value}
              unit={metricsData.providerAvailability.unit}
              trend={metricsData.providerAvailability.trend}
              trendValue={metricsData.providerAvailability.trendValue}
              sparklineData={metricsData.providerAvailability.sparklineData}
              status={metricsData.providerAvailability.status}
              icon="Shield"
              onClick={() => handleCardClick('providerAvailability')}
              isExpanded={expandedCard === 'providerAvailability'}
              onClose={handleCardClose}
            />
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <RegionalBreakdown data={regionalData} />
            <ProviderComparison data={providerData} />
            <AlertSummary 
              alerts={alerts}
              onViewAll={handleViewAllAlerts}
              onResolve={handleAlertResolve}
            />
          </div>
        </div>
      </main>

      {/* Alert Panel */}
      <AlertPanel
        alerts={alerts.filter(alert => !alert.acknowledged)}
        onDismiss={handleAlertDismiss}
        onAcknowledge={handleAlertAcknowledge}
      />
    </div>
  );
};

export default PerformanceMetricsDashboard;