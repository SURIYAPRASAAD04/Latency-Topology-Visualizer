import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Clock, Calendar, TrendingUp, Zap } from 'lucide-react';

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredRange, setHoveredRange] = useState(null);

  const timeRanges = [
    { 
      value: '1h', 
      label: '1H', 
      description: 'Last Hour',
      icon: Zap,
      color: 'from-green-400 to-emerald-400',
      stats: '60 points'
    },
    { 
      value: '24h', 
      label: '24H', 
      description: 'Last 24 Hours',
      icon: Clock,
      color: 'from-emerald-400 to-teal-400',
      stats: '144 points'
    },
    { 
      value: '7d', 
      label: '7D', 
      description: 'Last 7 Days',
      icon: Calendar,
      color: 'from-teal-400 to-cyan-400',
      stats: '168 points'
    },
    { 
      value: '30d', 
      label: '30D', 
      description: 'Last 30 Days',
      icon: TrendingUp,
      color: 'from-cyan-400 to-blue-400',
      stats: '720 points'
    }
  ];

  return (
    <div 
      className="flex items-center space-x-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     
      {/* Enhanced Button Container */}
      <div className="relative rounded-2xl backdrop-blur-md border border-white/20 bg-black/40 hover:bg-black/50 transition-all duration-500 group overflow-hidden">
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-green-800/20 to-teal-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Button Grid */}
        <div className="relative z-10 flex p-2 space-x-1">
          {timeRanges.map((range, index) => {
            const IconComponent = range.icon;
            const isSelected = selectedRange === range.value;
            const isHoveredRange = hoveredRange === range.value;
            
            return (
              <div key={range.value} className="relative group/btn">
                <button
                  onClick={() => onRangeChange(range.value)}
                  onMouseEnter={() => setHoveredRange(range.value)}
                  onMouseLeave={() => setHoveredRange(null)}
                  className={`
                    relative px-4 py-3 text-sm font-bold transition-all duration-300 rounded-xl border overflow-hidden
                    ${isSelected 
                      ? 'text-white shadow-lg shadow-green-500/30 border-green-400/50 scale-105' 
                      : 'text-white/70 hover:text-white border-white/20 hover:border-green-400/30 hover:scale-102'
                    }
                  `}
                  title={range.description}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Selected Button Background */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 animate-gradient-x"></div>
                  )}
                  
                  {/* Hover Background */}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  {/* Button Content */}
                  <div className="relative z-10 flex items-center space-x-2">
                    <IconComponent 
                      size={14} 
                      className={`transition-all duration-300 ${
                        isSelected ? 'text-white scale-110' : 'text-white/60 group-hover/btn:text-white/90 group-hover/btn:scale-105'
                      }`} 
                    />
                    <span className="font-jetbrains-mono tracking-wider">
                      {range.label}
                    </span>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>

                  {/* Glow Effect for Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 animate-pulse"></div>
                  )}
                </button>

                {/* Enhanced Tooltip */}
                {isHoveredRange && (
                  <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="relative rounded-xl backdrop-blur-md border border-white/30 bg-black/80 p-4 shadow-2xl shadow-green-500/20 min-w-max">
                      {/* Tooltip Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-green-800/40 to-teal-900/60 rounded-xl"></div>
                      
                      <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <IconComponent size={16} className="text-green-400" />
                          <h4 className="text-sm font-bold text-white">
                            {range.description}
                          </h4>
                        </div>
                        <div className="text-xs text-green-200/80 mb-2">
                          Data Resolution: {range.stats}
                        </div>
                        <div className={`text-xs font-bold bg-gradient-to-r ${range.color} bg-clip-text text-transparent`}>
                          {range.label} View
                        </div>
                      </div>

                      {/* Tooltip Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/80 border-t border-l border-white/30 rotate-45 rounded-tl"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Container Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Live Data Indicator */}
      <div className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 text-xs">
        <div className="relative">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full absolute top-0"></div>
        </div>
        <span className="text-green-300 font-medium">Live</span>
        <div className="w-px h-3 bg-white/30"></div>
        <span className="text-white/60 font-jetbrains-mono">
          {new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>

      {/* Mobile Live Indicator */}
      <div className="flex lg:hidden items-center space-x-2 text-xs">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300 font-medium">Live</span>
      </div>
    </div>
  );
};

export default TimeRangeSelector;