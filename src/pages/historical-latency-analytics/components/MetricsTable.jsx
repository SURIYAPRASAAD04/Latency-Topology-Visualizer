import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Building2, Server, Clock, Zap, Shield, Database } from 'lucide-react';

const MetricsTable = ({ data,chartDataregion, loading, className = "" }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'avgLatency', direction: 'asc' });



  const providerLogos = {
    'aws': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
    'gcp': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
    'azure': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center'
  };

   

  const tableData = useMemo(() => {
    const mockData =chartDataregion;
   
    return mockData.sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={14} className="text-white/60" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-green-300" />
      : <ArrowDown size={14} className="text-green-300" />;
  };

  const getReliabilityColor = (reliability) => {
    if (reliability >= 99.5) return 'text-green-300';
    if (reliability >= 98.5) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getLatencyColor = (latency) => {
    if (latency < 20) return 'text-green-300';
    if (latency < 40) return 'text-yellow-300';
    return 'text-red-300';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="mb-6">
          <div className="h-6 bg-white/10 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative rounded-xl p-6 backdrop-blur-md border border-white/20 animate-pulse">
              <div className="h-32 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortOptions = [
    { key: 'exchange', label: 'Exchange', icon: Building2 },
    { key: 'provider', label: 'Provider', icon: Server },
    { key: 'avgLatency', label: 'Avg Latency', icon: Clock },
    { key: 'peakLatency', label: 'Peak Latency', icon: Zap },
    { key: 'reliability', label: 'Reliability', icon: Shield },
    { key: 'dataPoints', label: 'Data Points', icon: Database }
  ];

return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="relative rounded-xl p-6 backdrop-blur-md border border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-800/25 to-teal-900/20"></div>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white font-poppins tracking-tight mb-2">
            Detailed Metrics
          </h3>
          <p className="text-green-200/80 mb-4">
            Performance statistics for selected time range
          </p>
          
          {/* Sort Controls */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-green-200/80 font-medium mr-2">Sort by:</span>
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = sortConfig.key === option.key;
              
              return (
                <button
                  key={option.key}
                  onClick={() => handleSort(option.key)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg backdrop-blur-md transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-500/30 border border-green-400/50 text-green-300' 
                      : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <IconComponent size={12} />
                  <span className="text-xs font-medium">{option.label}</span>
                  {isActive && getSortIcon(option.key)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tableData.map((row) => (
          <div
            key={row.id}
            className="relative rounded-xl backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 group overflow-hidden bg-black/40"
          >
            {/* Content */}
            <div className="relative z-10">
              {/* Exchange Header with Gradient Background */}
              <div className="relative p-6 pb-4 mb-4 overflow-hidden">
                {/* Gradient Background for Title Area Only */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-green-800/70 to-teal-900/60"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/30 to-teal-500/20"></div>
                
                <div className="relative z-10 flex items-center space-x-3">
                  <img
                    src={row.logo}
                    alt={`${row.exchange} logo`}
                    className="w-10 h-10 rounded-full ring-2 ring-white/30"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white font-poppins drop-shadow-lg">
                      {row.exchange}
                    </h4>
                    <p className="text-xs text-green-100/90 font-jetbrains-mono drop-shadow">
                      {row.region}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rest of the content with transparent dark background */}
              <div className="px-6 pb-6 space-y-4">
                {/* Provider */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Provider</span>
                  <div className="flex items-center space-x-2">
                    <img
                      src={providerLogos[row.provider]}
                      alt={`${row.provider} logo`}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-medium text-white">
                      {row.provider}
                    </span>
                  </div>
                </div>

                {/* Latency Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
                    <div className={`text-lg font-bold font-jetbrains-mono ${getLatencyColor(row.avgLatency)}`}>
                      {row.avgLatency}ms
                    </div>
                    <div className="text-xs text-gray-400">Avg Latency</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
                    <div className={`text-lg font-bold font-jetbrains-mono ${getLatencyColor(row.peakLatency)}`}>
                      {row.peakLatency}ms
                    </div>
                    <div className="text-xs text-gray-400">Peak Latency</div>
                  </div>
                </div>

                {/* Reliability */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Reliability</span>
                  <span className={`text-lg font-bold ${getReliabilityColor(row.reliability)}`}>
                    {row.reliability}%
                  </span>
                </div>

                {/* Data Points */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Data Points</span>
                  <span className="text-sm font-jetbrains-mono text-white">
                    {row.dataPoints.toLocaleString()}
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center pt-3 border-t border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-ping"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2 absolute"></div>
                  <span className="text-xs text-gray-300 font-jetbrains-mono font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Bottom border glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsTable;

