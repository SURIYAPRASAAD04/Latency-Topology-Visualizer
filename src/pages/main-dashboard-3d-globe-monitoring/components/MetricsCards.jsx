import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';


const MetricsCards = ({ className = "" }) => {
  const [metrics, setMetrics] = useState({
    averageLatency: 0,
    latencyChange: 0,
    activeExchanges: 0,
    exchangeChange: 0,
    cloudRegions: 0,
    regionChange: 0,
    systemHealth: 0,
    healthChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/metrics');
        const data = await response.json();
        setMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
    
    
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative rounded-xl p-4 backdrop-blur-md border border-white/20 animate-pulse">
            <div className="h-24 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'latency',
      title: 'Avg Latency',
      value: `${metrics.averageLatency}ms`,
      change: metrics.latencyChange,
      icon: 'Zap',
      color: metrics.averageLatency < 30 ? 'text-green-300' : 
             metrics.averageLatency < 60 ? 'text-yellow-300' : 'text-red-300'
    },
    {
      id: 'exchanges',
      title: 'Active Exchanges',
      value: metrics.activeExchanges,
      change: metrics.exchangeChange,
      icon: 'Building2',
      color: 'text-green-300'
    },
    {
      id: 'regions',
      title: 'Cloud Regions',
      value: metrics.cloudRegions,
      change: metrics.regionChange,
      icon: 'Globe',
      color: 'text-emerald-300'
    },
    {
      id: 'status',
      title: 'System Health',
      value: `${metrics.systemHealth}%`,
      change: metrics.healthChange,
      icon: 'Activity',
      color: metrics.systemHealth > 95 ? 'text-green-300' : 
             metrics.systemHealth > 85 ? 'text-yellow-300' : 'text-red-300'
    }
  ];

  const formatChange = (change) => {
    if (change === 0) return { text: 'No change', color: 'text-white/60' };
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? 'text-green-300' : 'text-red-300';
    return { text: `${sign}${change}%`, color };
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cards.map((card) => {
        const changeInfo = formatChange(card.change);
        
        return (
          <div
            key={card.id}
            className="relative rounded-xl p-4 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 group overflow-hidden"
          >
            {/* Transparent Green Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-800/25 to-teal-900/20 animate-gradient-x"></div>
            
            {/* Glass overlay for extra depth */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-md ${card.color} transition-all duration-300 group-hover:bg-white/15`}>
                  <Icon name={card.icon} size={20} />
                </div>
                <div className={`text-xs font-jetbrains-mono ${changeInfo.color} font-medium`}>
                  {changeInfo.text}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white font-poppins tracking-tight">
                  {card.value}
                </h3>
                <p className="text-sm text-green-200/80 font-medium">
                  {card.title}
                </p>
              </div>

              {/* Pulse indicator for real-time data */}
              <div className="flex items-center mt-3 pt-3 border-t border-white/20">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 absolute"></div>
                <span className="text-xs text-green-200/80 font-jetbrains-mono font-medium">
                  Live
                </span>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Bottom border glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;