import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TimeRangeSelector from './components/TimeRangeSelector';
import LatencyChart from './components/LatencyChart';
import MetricsTable from './components/MetricsTable';
import FilterPanel from './components/FilterPanel';
import ExportPanel from './components/ExportPanel';
import Heatmap from './components/Heatmap';
import axios from 'axios';



const CONFIG = {
  API: {
    BASE_URL: 'http://localhost:5000/api',
    TOKEN: 'h6Uus7KL5oycLwkBzSidVCB6if0MvyqqrwvdN7CL',
    ENDPOINTS: {
      LATENCY_LIVE: '/latency/latencylive',
      LATENCY_METRIC: '/latency/latencymetric'
    }
  },
  TIME_RANGES: {
    '1h': { interval: 60 * 1000, dataPoints: 60, apiRange: '1d' },
    '24h': { interval: 10 * 60 * 1000, dataPoints: 144, apiRange: '1d' },
    '7d': { interval: 60 * 60 * 1000, dataPoints: 168, apiRange: '7d' },
    '30d': { interval: 60 * 60 * 1000, dataPoints: 720, apiRange: '30d' }
  },
  UI: {
    LOADING_DELAY: 300, 
    DEBOUNCE_DELAY: 500
  }
};

const INITIAL_STATE = {
  filters: {
    exchanges: ['KuCoin', 'OKX'],
    providers: ['US', 'IN'],
    regions: ['Japan West', 'India West']
  },
  metrics: {
    avgLatency: 0,
    peakLatency: 0,
    reliability: 0,
    totalConnections: 0
  }
};



class LatencyApiService {
  static async fetchLatencyData(location, dateRange) {
    try {
      const response = await axios.get(
        `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.LATENCY_LIVE}`,
        {
          headers: { Authorization: `Bearer ${CONFIG.API.TOKEN}` },
          params: { location, dateRange },
          timeout: 10000 
        }
      );
      return response.data?.data || [];
    } catch (error) {
      console.error(`Failed to fetch latency data for ${location}:`, error);
      return [];
    }
  }

  static async fetchLatencyMetrics() {
    try {
      const response = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.LATENCY_METRIC}`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch latency metrics:', error);
      return [];
    }
  }
}



class DataProcessor {
  static calculateMetrics(data) {
    if (!data.length) return INITIAL_STATE.metrics;

    let total = 0;
    let count = 0;
    let maxLatency = -Infinity;
    let validDataPoints = 0;
    const totalPossiblePoints = data.length * (Object.keys(data[0]).length - 1);

    data.forEach(entry => {
      Object.entries(entry).forEach(([key, value]) => {
        if (key !== "timestamp" && typeof value === "number" && !isNaN(value)) {
          total += value;
          count++;
          validDataPoints++;
          maxLatency = Math.max(maxLatency, value);
        }
      });
    });

    return {
      avgLatency: count > 0 ? (total / count).toFixed(2) : '0',
      peakLatency: maxLatency > -Infinity ? maxLatency.toFixed(2) : '0',
      reliability: ((validDataPoints / totalPossiblePoints) * 100).toFixed(2),
      totalConnections: totalPossiblePoints
    };
  }

  static generateTimestamps(timeRange) {
    const config = CONFIG.TIME_RANGES[timeRange];
    const now = new Date();
    const { interval, dataPoints } = config;

    return Array.from({ length: dataPoints }, (_, i) => {
      const time = new Date(now.getTime() - (dataPoints - 1 - i) * interval);
      return new Date(Math.floor(time.getTime() / interval) * interval).toISOString();
    });
  }

  static processLatencyData(results, timestamps, interval) {
    const mockData = timestamps.map(ts => ({ timestamp: ts }));
    const timeIndexMap = Object.fromEntries(mockData.map((entry, idx) => [entry.timestamp, idx]));

    results.forEach(({ exchange, region, data }) => {
      const key = `${exchange}_${region}`;
      
      data.forEach(item => {
        const parsedTime = new Date(item.timestamp);
        const latencyValue = parseFloat(item.p50);

        if (isNaN(parsedTime) || isNaN(latencyValue)) return;

        const rounded = new Date(Math.floor(parsedTime.getTime() / interval) * interval).toISOString();
        
        if (timeIndexMap[rounded] !== undefined) {
          mockData[timeIndexMap[rounded]][key] = latencyValue;
        }
      });
    });

    return mockData;
  }
}

class ExportService {
  static exportToCsv(data, selectedSeries, filename) {
    const headers = ['Timestamp', ...selectedSeries];
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(key =>
          key === 'Timestamp' ? row.timestamp : row[key] ?? ''
        ).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  static exportToJson(data, filename) {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json');
  }

  static downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}



const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useLatencyData = (filters, selectedTimeRange) => {
  const [chartData, setChartData] = useState([]);
  const [chartDataRegion, setChartDataRegion] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [loading, setLoading] = useState(false);
 const [isExporting, setIsExporting] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedFilters = useDebounce(filters, CONFIG.UI.DEBOUNCE_DELAY);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    try {
      const { exchanges = [], regions = [], providers = [] } = debouncedFilters;
      const minLength = Math.min(exchanges.length, regions.length, providers.length);
      
      if (minLength === 0) {
        setChartData([]);
        setSelectedSeries([]);
        return;
      }

      const timeConfig = CONFIG.TIME_RANGES[selectedTimeRange];
      const timestamps = DataProcessor.generateTimestamps(selectedTimeRange);

      const dataPromises = Array.from({ length: minLength }, async (_, i) => {
        const data = await LatencyApiService.fetchLatencyData(
          providers[i], 
          timeConfig.apiRange
        );
        return {
          exchange: exchanges[i],
          region: regions[i],
          data
        };
      });

      const [results, metricsData] = await Promise.all([
        Promise.all(dataPromises),
        LatencyApiService.fetchLatencyMetrics()
      ]);

      const processedData = DataProcessor.processLatencyData(
        results, 
        timestamps, 
        timeConfig.interval
      );

      const series = results.map(({ exchange, region }) => `${exchange}_${region}`);

      setTimeout(() => {
        setChartData(processedData);
        setSelectedSeries(series);
        setChartDataRegion(metricsData);
        setLoading(false);
      }, CONFIG.UI.LOADING_DELAY);

    } catch (error) {
      console.error('Failed to fetch latency data:', error);
      setLoading(false);
    }
  }, [debouncedFilters, selectedTimeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    chartData,
    chartDataRegion,
    selectedSeries,
    loading,
    refetch: fetchData
  };
};

const useUIState = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters(prev => !prev);
  }, []);

  return {
    sidebarCollapsed,
    showMobileFilters,
    isExporting,
    toggleSidebar,
    toggleMobileFilters,
    setIsExporting
  };
};

const LoadingState = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="relative rounded-xl p-4 backdrop-blur-md border border-white/20 animate-pulse">
        <div className="h-24 bg-white/10 rounded"></div>
      </div>
    ))}
  </div>
);

const MetricsCards = ({ metrics }) => {
  const cards = [
    {
      title: 'Avg Latency',
      value: `${metrics.avgLatency}ms`,
      icon: 'Gauge',
      color: 'text-primary',
      trend: { value: '-2.3%', type: 'success', icon: 'TrendingDown' }
    },
    {
      title: 'Peak Latency',
      value: `${metrics.peakLatency}ms`,
      icon: 'Activity',
      color: 'text-warning',
      trend: { value: '+5.1%', type: 'warning', icon: 'TrendingUp' }
    },
    {
      title: 'Reliability',
      value: `${metrics.reliability}%`,
      icon: 'Shield',
      color: 'text-success',
      trend: { value: '+0.2%', type: 'success', icon: 'TrendingUp' }
    },
    {
      title: 'Data Points',
      value: metrics.totalConnections,
      icon: 'Database',
      color: 'text-accent',
      trend: { value: 'Last updated: 2 min ago', type: 'muted', icon: 'Clock' }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-foreground font-jetbrains-mono">
                {card.value}
              </p>
            </div>
            <Icon name={card.icon} size={24} className={card.color} />
          </div>
          <div className="flex items-center mt-2 text-xs">
            <Icon name={card.trend.icon} size={12} className={`text-${card.trend.type} mr-1`} />
            <span className={`text-${card.trend.type}`}>{card.trend.value}</span>
            {card.trend.type !== 'muted' && (
              <span className="text-muted-foreground ml-1">vs last period</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const MobileFilterOverlay = ({ 
  showMobileFilters, 
  onClose, 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters 
}) => {
  if (!showMobileFilters) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal lg:hidden">
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground font-orbitron">
            Filters
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onApplyFilters={() => {
            onApplyFilters();
            onClose();
          }}
          onClearFilters={onClearFilters}
        />
      </div>
    </div>
  );
};


const HistoricalLatencyAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState(INITIAL_STATE.filters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const ui = useUIState();
  const { chartData, chartDataRegion, selectedSeries, loading } = useLatencyData(
    filters, 
    selectedTimeRange
  );

  const metrics = useMemo(() => 
    DataProcessor.calculateMetrics(chartData), 
    [chartData]
  );

  const handleTimeRangeChange = useCallback((range) => {
    setSelectedTimeRange(range);
  }, []);
  const handleApplyFilters = async () => {
    console.log('Applying filters:', filters);

  };
  const handleSeriesToggle = useCallback((seriesKey) => {
    console.log('Series toggled:', seriesKey);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    console.log(filters)
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      exchanges: [],
      providers: [],
      regions: []
    });
  }, []);

  const handleExport = useCallback((exportConfig) => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        if (exportConfig.format === 'csv') {
          ExportService.exportToCsv(chartData, selectedSeries, exportConfig.filename);
        } else if (exportConfig.format === 'json') {
          ExportService.exportToJson(chartData, exportConfig.filename);
        }
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        setIsExporting(false);
      }
    }, 1000);
  }, [chartData, selectedSeries]);

  if (loading && !chartData.length) {
    return <LoadingState />;
  }

  return (
   <div className={`min-h-screen bg-gradient-to-br`}>
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-emerald-800/10 to-teal-900/20 animate-gradient-xy"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 255, 136, 0.1) 0%, transparent 25%),
                           radial-gradient(circle at 75% 75%, rgba(0, 255, 200, 0.1) 0%, transparent 25%)`
        }}></div>
      </div>
      <Header
        onSidebarToggle={ui.toggleSidebar}
        sidebarCollapsed={ui.sidebarCollapsed}
      />

      <Sidebar
        collapsed={ui.sidebarCollapsed}
        onToggle={ui.toggleSidebar}
      />

   
  {showMobileFilters && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-modal lg:hidden transition-all duration-300 ">
          <div className="fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-md border-l border-white/20 overflow-y-auto">
            {/* Mobile Filter Header */}
            <div className="relative p-6 border-b border-white/20 overflow-hidden">
              {/* Header Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-green-800/70 to-teal-900/60"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/30 to-teal-500/20"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white font-poppins tracking-tight drop-shadow-lg">
                    Filters & Controls
                  </h2>
                  <p className="text-green-200/80 text-sm mt-1">
                    Customize your analytics view
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={() => {
                  handleApplyFilters();
                  setShowMobileFilters(false);
                }}
                onClearFilters={handleClearFilters}
              />

              <div className="mt-8 p6">
                <ExportPanel
                  onExport={handleExport}
                  isExporting={isExporting}
                />
              </div>
            </div>
          </div>
        </div>
      )}
     <main className={`
        transition-all duration-500 pt-20
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Enhanced Left Sidebar - Filters (Desktop) */}
          <div className={`hidden lg:block fixed top-20 w-80 h-[calc(100vh-80px)] border-r border-white/20 bg-black/40 backdrop-blur-md overflow-y-scroll scrollbar-neon z-30 transition-all duration-500 ${sidebarCollapsed ? 'left-16' : 'left-64'}`}>
            <div className="p-6">
              {/* Desktop Filter Header */}
              <div className="relative mb-6 p-4 rounded-xl overflow-hidden">
                {/* Header Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-green-800/70 to-teal-900/60"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/30 to-teal-500/20"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white font-poppins tracking-tight drop-shadow-lg">
                      Filters & Controls
                    </h2>
                    <p className="text-green-200/80 text-sm mt-1">
                      Customize your analytics view
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <Icon name="Filter" size={20} className="text-green-400" />
                  </div>
                </div>
              </div>
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
               onApplyFilters={() => {
                handleApplyFilters();
                setShowMobileFilters(false);
              }}
                onClearFilters={handleClearFilters}
              />

              <div className="mt-8">
                <ExportPanel
                  onExport={handleExport}
                  isExporting={isExporting}
                />
              </div>
            </div>
          </div>

         {/* Main Content Area */}
          <div className={`
            flex-1 overflow-y-auto bg-black/20 backdrop-blur-sm 
            transition-all duration-500
            ${sidebarCollapsed ? 'lg:ml-[320px]' : 'lg:ml-[320px]'}
          `}>
            <div className="p-6 space-y-8">
              {/* Enhanced Page Header */}
              <div className={`
                transition-all duration-1000 transform
    
              `}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="relative">
                    {/* Title Background Gradient */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-900/30 via-green-800/20 to-teal-900/30 rounded-2xl blur-xl opacity-50"></div>
                    
                    <div className="relative">
                      <h1 className="text-3xl lg:text-4xl font-bold text-white font-inter tracking-tight drop-shadow-2xl">
                        Historical Latency Analytics
                      </h1>
                      <p className="text-green-200/80 mt-2 text-lg drop-shadow-lg">
                        Analyze time-series latency trends and performance patterns for strategic infrastructure planning
                      </p>
                      
                      {/* Animated Underline */}
                      <div className="mt-3 h-1 w-32 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full animate-gradient-x"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Mobile Filter Button */}

              
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden"
                    iconName="Filter"
                    iconPosition="left"
                  >
                    Filters & Export
                  </Button>

                  <TimeRangeSelector
                    selectedRange={selectedTimeRange}
                    onRangeChange={handleTimeRangeChange}
                  />

                  </div>
                </div>
              </div>
                {/* Enhanced Statistics Cards */}
              <div className={`
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
                transition-all duration-1000 transform delay-200
              `}>
                {[
                  {
                    title: 'Avg Latency',
                    value: '15.2ms',
                    change: '-2.3%',
                    trend: 'down',
                    icon: 'Gauge',
                    color: 'text-green-400',
                    bgGradient: 'from-green-900/30 to-emerald-900/20'
                  },
                  {
                    title: 'Peak Latency',
                    value: '51.8ms',
                    change: '+5.1%',
                    trend: 'up',
                    icon: 'Activity',
                    color: 'text-yellow-400',
                    bgGradient: 'from-yellow-900/30 to-orange-900/20'
                  },
                  {
                    title: 'Reliability',
                    value: '99.1%',
                    change: '+0.2%',
                    trend: 'up',
                    icon: 'Shield',
                    color: 'text-emerald-400',
                    bgGradient: 'from-emerald-900/30 to-teal-900/20'
                  },
                  {
                    title: 'Data Points',
                    value: '5.7K',
                    change: 'Live',
                    trend: 'neutral',
                    icon: 'Database',
                    color: 'text-blue-400',
                    bgGradient: 'from-blue-900/30 to-cyan-900/20'
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group relative rounded-2xl backdrop-blur-md border border-white/20 bg-black/40 hover:bg-black/50 transition-all duration-500 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
                    
                    {/* Card Content */}
                    <div className="relative z-10 p-12">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-sm text-white/70 font-medium mb-1">{stat.title}</p>
                          <p className={`text-2xl lg:text-3xl font-bold ${stat.color} font-jetbrains-mono transition-all duration-300 group-hover:scale-110`}>
                            {stat.value}
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                          <Icon name={stat.icon} size={24} className={stat.color} />
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs">
                        {stat.trend !== 'neutral' && (
                          <Icon 
                            name={stat.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                            size={12} 
                            className={stat.trend === 'up' ? 'text-red-400' : 'text-green-400'} 
                          />
                        )}
                        <span className={`ml-1 font-bold ${
                          stat.trend === 'up' ? 'text-red-400' : 
                          stat.trend === 'down' ? 'text-green-400' : 
                          'text-green-400'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-white/50 ml-1">
                          {stat.trend !== 'neutral' ? 'vs last period' : 'data stream'}
                        </span>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Bottom Border Accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color.replace('text-', 'from-').replace('-400', '-400/50')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                ))}
                
              </div>

              {/* Latency Chart */}
              <div className={`
                transition-all duration-1000 transform delay-400
              `}>
                <LatencyChart
                  data={chartData}
                  selectedSeries={selectedSeries}
                  onSeriesToggle={handleSeriesToggle}
                  timeRange={selectedTimeRange}
                  loading={loading}
                />
              </div>

             
              <div className={`
                transition-all duration-1000 transform delay-600
              `}>
                <MetricsTable
                  data={chartData}
                  chartDataregion={chartDataRegion}
                  loading={loading}
                />
              </div>

             
              <div className={`
                transition-all duration-1000 transform delay-800
              `}>
                <Heatmap
                  data={chartData}
                  timeRange={selectedTimeRange}
                  loading={loading}
                  selectedExchanges={filters.exchanges}
                  selectedProviders={filters.providers}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        .scrollbar-neon {
          scrollbar-width: thin;
          scrollbar-color: #10b981 rgba(0, 0, 0, 0.2);
        }

        .scrollbar-neon::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-neon::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
        }

        .scrollbar-neon::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10b981, #059669);
          border-radius: 4px;
          box-shadow: 
            0 0 10px #10b981,
            0 0 20px #10b981,
            inset 0 0 6px rgba(16, 185, 129, 0.3);
          border: 1px solid #10b981;
        }

        .scrollbar-neon::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #34d399, #10b981);
          box-shadow: 
            0 0 15px #10b981,
            0 0 25px #10b981,
            0 0 35px #10b981,
            inset 0 0 8px rgba(16, 185, 129, 0.4);
        }

        .scrollbar-neon::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #6ee7b7, #34d399);
          box-shadow: 
            0 0 20px #10b981,
            0 0 30px #10b981,
            0 0 40px #10b981,
            inset 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>

      
    </div>
  );
};

export default HistoricalLatencyAnalytics;