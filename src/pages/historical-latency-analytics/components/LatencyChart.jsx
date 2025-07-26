import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, EyeOff, Activity, Zap, Globe, Server } from 'lucide-react';

const LatencyChart = ({ data, selectedSeries, onSeriesToggle, timeRange, loading }) => {
   const [animatedData, setAnimatedData] = useState([]);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
   useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => 0.3 + Math.sin(Date.now() / 1000) * 0.4);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
   
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        ...(timeRange === '7d' || timeRange === '30d' ? { 
          month: 'short', 
          day: 'numeric' 
        } : {})
      })
    }));
  }, [data, timeRange]);
  const generateRandomColor = () => {

  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

  const getSeriesConfigFromSelection = (series) => {
  return selectedSeries.map(key => ({
    key,
    name: key.replace(/_/g, ' → '), 
    color: generateRandomColor(),
    strokeWidth: 2
  }));
};

     const seriesConfig = getSeriesConfigFromSelection(selectedSeries);
   


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative">
          {/* Glassmorphism background */}
          <div 
            className="absolute inset-0 rounded-2xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 200, 108, 0.05))',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              boxShadow: `0 8px 32px rgba(0, 255, 136, ${glowIntensity * 0.4}), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            }}
          />
          <div className="relative p-4 rounded-2xl">
            <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-green-400" />
              {label}
            </p>
            {payload.map((entry, index) => {
              const seriesInfo = seriesConfig.find(s => s.key === entry.dataKey);
              const IconComponent = seriesInfo?.icon || Activity;
              
              return (
                <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          background: seriesInfo?.gradient || entry.color,
                          boxShadow: `0 0 12px ${entry.color}60`
                        }}
                      />
                      <div className="absolute inset-0 rounded-full animate-ping opacity-50"
                           style={{ backgroundColor: entry.color }} />
                    </div>
                    <IconComponent size={12} style={{ color: entry.color }} />
                    <span className="text-xs text-gray-300 font-medium">
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-bold px-2 py-1 rounded-lg backdrop-blur-sm"
                      style={{ 
                        color: entry.color,
                        background: `${entry.color}20`,
                        border: `1px solid ${entry.color}40`
                      }}
                    >
                      {entry.value}ms
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {payload.map((entry, index) => {
        const seriesInfo = seriesConfig.find(s => s.key === entry.dataKey);
        const IconComponent = seriesInfo?.icon || Activity;
        const isSelected = selectedSeries.includes(entry.dataKey);
        
        return (
          <button
            key={index}
            onClick={() => onSeriesToggle(entry.dataKey)}
            className="group relative overflow-hidden transition-all duration-300 hover:scale-105"
          >
            {/* Glassmorphism background */}
            <div 
              className={`absolute inset-0 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
              }`}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${entry.color}20, ${entry.color}10)`
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                border: `1px solid ${isSelected ? entry.color + '60' : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: isSelected 
                  ? `0 8px 32px ${entry.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                  : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            />
            
            <div className="relative flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <div 
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    isSelected ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    background: seriesInfo?.gradient || entry.color,
                    boxShadow: isSelected ? `0 0 16px ${entry.color}80` : `0 0 8px ${entry.color}40`
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-50"
                       style={{ backgroundColor: entry.color }} />
                )}
              </div>
              
              <IconComponent 
                size={14} 
                style={{ color: entry.color }}
                className={isSelected ? 'animate-pulse' : ''}
              />
              
              <span 
                className={`text-sm font-bold transition-colors duration-300 ${
                  isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                }`}
              >
                {entry.value}
              </span>
              
              {isSelected ? (
                <Eye size={12} style={{ color: entry.color }} className="animate-pulse" />
              ) : (
                <EyeOff size={12} className="text-gray-500 group-hover:text-gray-400" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="relative w-full h-96 overflow-hidden rounded-3xl">
        {/* Animated background */}
        <div 
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 200, 108, 0.05), rgba(0, 150, 80, 0.08))',
            border: '1px solid rgba(0, 255, 136, 0.3)'
          }}
        />
        
        <div className="relative flex flex-col items-center justify-center h-full">
          <div className="relative mb-6">
            <div 
              className="w-16 h-16 border-4 border-transparent rounded-full animate-spin"
              style={{
                borderTopColor: '#00FF88',
                borderRightColor: '#00FF88',
                filter: 'drop-shadow(0 0 20px #00FF88)'
              }}
            />
            <div className="absolute inset-2 w-12 h-12 border-2 border-green-400 rounded-full animate-ping opacity-50" />
          </div>
          
          <p className="text-lg font-bold text-white mb-2">Loading Chart Data...</p>
          <p className="text-sm text-gray-400">Fetching real-time latency metrics</p>
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60"
              style={{
                left: `${20 + i * 12}%`,
                top: `${40 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-3xl">
      {/* Main glassmorphism background */}
      <div 
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 200, 108, 0.05), rgba(0, 150, 80, 0.08))',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          boxShadow: `0 8px 32px rgba(0, 255, 136, ${glowIntensity * 0.3}), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
        }}
      />
      
      <div className="relative p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <TrendingUp 
                size={24} 
                className="text-green-400"
                style={{ filter: `drop-shadow(0 0 8px #00FF88)` }}
              />
              <div className="absolute inset-0 animate-ping opacity-50">
                <TrendingUp size={24} className="text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Latency <span className="text-green-400">Trends</span>
            </h3>
          </div>
          
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 200, 108, 0.08))',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              boxShadow: '0 4px 16px rgba(0, 255, 136, 0.2)'
            }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">Real-time</span>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
              <defs>
                {seriesConfig.map((series) => (
                  <linearGradient key={series.key} id={`gradient-${series.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={series.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={series.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="rgba(0, 255, 136, 0.2)"
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="timestamp" 
                stroke="rgba(255, 255, 255, 0.6)"
                fontSize={11}
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                axisLine={{ stroke: 'rgba(0, 255, 136, 0.4)' }}
                tickLine={{ stroke: 'rgba(0, 255, 136, 0.4)' }}
              />
              
              <YAxis 
                stroke="rgba(255, 255, 255, 0.6)"
                fontSize={11}
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                axisLine={{ stroke: 'rgba(0, 255, 136, 0.4)' }}
                tickLine={{ stroke: 'rgba(0, 255, 136, 0.4)' }}
                label={{ 
                  value: 'Latency (ms)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              
              {seriesConfig.map((series) => (
                selectedSeries.includes(series.key) && (
                  <Line
                    key={series.key}
                    type="monotone"
                    dataKey={series.key}
                    stroke={series.color}
                    strokeWidth={series.strokeWidth}
                    dot={{ 
                      fill: series.color, 
                      strokeWidth: 0, 
                      r: 4,
                      filter: `drop-shadow(0 0 6px ${series.color})`
                    }}
                    activeDot={{ 
                      r: 6, 
                      fill: series.color,
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      filter: `drop-shadow(0 0 12px ${series.color})`
                    }}
                    name={series.name}
                    filter={`drop-shadow(0 0 4px ${series.color}60)`}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LatencyChart;