import React, { useState, useEffect } from 'react';
import { Layers, X, Search, ChevronDown, ChevronUp, Building2, Cloud, Zap, Thermometer, Activity, Sun, Info, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ModernLayerControls = ({ layers, onLayerToggle, headerHeight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    infrastructure: true,
    visualization: true,
    effects: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const layerConfig = [
    {
      id: 'exchanges',
      label: 'Exchange Locations',
      icon: Building2,
      description: 'Show cryptocurrency exchange server locations',
      color: 'from-blue-500 to-cyan-400',
      category: 'infrastructure',
      performance: 'low',
      type: 'data'
    },
    {
      id: 'cloudRegions',
      label: 'Cloud Regions',
      icon: Cloud,
      description: 'Display AWS, GCP, and Azure regions',
      color: 'from-purple-500 to-violet-400',
      category: 'infrastructure',
      performance: 'low',
      type: 'data'
    },
    {
      id: 'connections',
      label: 'Latency Connections',
      icon: Zap,
      description: 'Animated connections showing latency data',
      color: 'from-yellow-500 to-orange-400',
      category: 'visualization',
      performance: 'medium',
      type: 'animation'
    },
    {
      id: 'heatmap',
      label: 'Latency Heatmap',
      icon: Thermometer,
      description: 'Color-coded latency overlay on globe surface',
      color: 'from-red-500 to-pink-400',
      category: 'visualization',
      performance: 'high',
      type: 'overlay'
    },
    {
      id: 'dataFlow',
      label: 'Data Flow Animation',
      icon: Activity,
      description: 'Real-time data stream visualization',
      color: 'from-green-500 to-emerald-400',
      category: 'visualization',
      performance: 'high',
      type: 'animation'
    },
    {
      id: 'atmosphere',
      label: 'Atmosphere Effect',
      icon: Sun,
      description: 'Cyberpunk atmosphere glow around globe',
      color: 'from-indigo-500 to-purple-400',
      category: 'effects',
      performance: 'medium',
      type: 'effect'
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceIcon = (performance) => {
    switch (performance) {
      case 'low': return '●';
      case 'medium': return '●●';
      case 'high': return '●●●';
      default: return '●';
    }
  };

  const filteredLayers = layerConfig.filter(layer =>
    layer.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    layer.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedLayers = {
    infrastructure: filteredLayers.filter(layer => layer.category === 'infrastructure'),
    visualization: filteredLayers.filter(layer => layer.category === 'visualization'),
    effects: filteredLayers.filter(layer => layer.category === 'effects')
  };

  const CustomCheckbox = ({ checked, onChange, children }) => (
    <label className="group flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:via-emerald-500/10 hover:to-teal-500/10 hover:backdrop-blur-md">
      <div className="relative">
        <div className={`
          w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
          ${checked 
            ? 'border-green-400 bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'border-white/30 group-hover:border-green-400/50'
          }
        `}>
          {checked && <CheckCircle2 size={12} className="text-white" />}
        </div>
        {checked && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
        )}
      </div>
      <div className="flex-1">{children}</div>
    </label>
  );

  const FilterSection = ({ title, isExpanded, onToggle, children, count }) => (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-gradient-to-r hover:from-green-500/10 hover:via-emerald-500/10 hover:to-teal-500/10 hover:border-green-400/30 transition-all duration-300 group"
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
            {title}
          </h3>
          {count !== undefined && (
            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium">
              {count} active
            </span>
          )}
        </div>
        <div className="text-white/60 group-hover:text-green-300 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}
      `}>
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );

  const activeLayersCount = Object.values(layers || {}).filter(Boolean).length;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-44 right-6 z-50 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group shadow-2xl"
      >
        <Layers size={24} className="text-white group-hover:text-green-300 transition-colors" />
        {activeLayersCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">
              {activeLayersCount}
            </span>
          </div>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={() => setIsVisible(false)}
      />

      {/* Main Layer Control Panel - Positioned on Right Side */}
      <div className="fixed top-44 right-4 w-full max-w-md lg:max-w-lg max-h-[calc(100vh-500px)] z-50">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Animated Header */}
          <div className="relative p-6 bg-gradient-to-r from-emerald-900/50 via-green-800/50 to-teal-900/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-green-800/30 to-teal-900/30 animate-pulse"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-0.5 shadow-lg shadow-green-500/30">
                  <div className="w-full h-full rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center">
                    <Layers size={20} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Visualization Layers
                  </h2>
                  <p className="text-green-200/80 text-sm">
                    Real-time Globe Control Panel
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:border-red-400/50 border border-white/20 transition-all duration-300 group"
              >
                <X size={20} className="text-white group-hover:text-red-300" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-white/10">
            <div className={`
              relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/20
              transition-all duration-300 ${isSearchFocused ? 'bg-white/10 border-green-400/50 shadow-lg shadow-green-500/20' : ''}
            `}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className={`transition-colors duration-300 ${isSearchFocused ? 'text-green-400' : 'text-white/60'}`} />
              </div>
              
              <input
                type="text"
                placeholder="Search layers, effects, data sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none rounded-2xl"
              />
            </div>
          </div>

          {/* Layer Content */}
          <div className="p-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
            
            {/* Infrastructure Layers */}
            <FilterSection 
              title="Infrastructure" 
              isExpanded={expandedSections.infrastructure}
              onToggle={() => toggleSection('infrastructure')}
              count={groupedLayers.infrastructure.filter(layer => layers[layer.id]).length}
            >
              {groupedLayers.infrastructure.map((layer) => (
                <CustomCheckbox
                  key={layer.id}
                  checked={layers[layer.id] || false}
                  onChange={() => onLayerToggle(layer.id, !layers[layer.id])}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${layer.color} bg-opacity-20`}>
                        <layer.icon size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{layer.label}</div>
                        <div className="text-white/60 text-xs">{layer.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono ${getPerformanceColor(layer.performance)}`}>
                        {getPerformanceIcon(layer.performance)}
                      </span>
                      <span className="text-white/40 text-xs uppercase tracking-wide">
                        {layer.type}
                      </span>
                    </div>
                  </div>
                </CustomCheckbox>
              ))}
            </FilterSection>

            {/* Visualization Layers */}
            <FilterSection 
              title="Visualization" 
              isExpanded={expandedSections.visualization}
              onToggle={() => toggleSection('visualization')}
              count={groupedLayers.visualization.filter(layer => layers[layer.id]).length}
            >
              {groupedLayers.visualization.map((layer) => (
                <CustomCheckbox
                  key={layer.id}
                  checked={layers[layer.id] || false}
                  onChange={() => onLayerToggle(layer.id, !layers[layer.id])}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${layer.color} bg-opacity-20`}>
                        <layer.icon size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{layer.label}</div>
                        <div className="text-white/60 text-xs">{layer.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono ${getPerformanceColor(layer.performance)}`}>
                        {getPerformanceIcon(layer.performance)}
                      </span>
                      <span className="text-white/40 text-xs uppercase tracking-wide">
                        {layer.type}
                      </span>
                    </div>
                  </div>
                </CustomCheckbox>
              ))}
            </FilterSection>

            {/* Effects Layers */}
            <FilterSection 
              title="Effects" 
              isExpanded={expandedSections.effects}
              onToggle={() => toggleSection('effects')}
              count={groupedLayers.effects.filter(layer => layers[layer.id]).length}
            >
              {groupedLayers.effects.map((layer) => (
                <CustomCheckbox
                  key={layer.id}
                  checked={layers[layer.id] || false}
                  onChange={() => onLayerToggle(layer.id, !layers[layer.id])}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${layer.color} bg-opacity-20`}>
                        <layer.icon size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{layer.label}</div>
                        <div className="text-white/60 text-xs">{layer.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono ${getPerformanceColor(layer.performance)}`}>
                        {getPerformanceIcon(layer.performance)}
                      </span>
                      <span className="text-white/40 text-xs uppercase tracking-wide">
                        {layer.type}
                      </span>
                    </div>
                  </div>
                </CustomCheckbox>
              ))}
            </FilterSection>

            {/* Performance Info */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-start space-x-3">
                <Info size={16} className="text-green-400 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">Performance Impact</h4>
                  <p className="text-white/60 text-xs mb-2">
                    Some layers may impact rendering performance on lower-end devices.
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="text-green-400">●</span>
                      <span className="text-white/60">Low</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">●●</span>
                      <span className="text-white/60">Medium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-400">●●●</span>
                      <span className="text-white/60">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-white/5 via-white/5 to-white/5 border-t border-white/10">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  layerConfig.forEach(layer => {
                    onLayerToggle(layer.id, false);
                  });
                }}
                className="p-3 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-300 transition-all duration-300 font-medium text-sm flex items-center justify-center space-x-1"
              >
                <EyeOff size={16} />
                <span>Hide All</span>
              </button>
              <button
                onClick={() => {
                  layerConfig.forEach(layer => {
                    onLayerToggle(layer.id, true);
                  });
                }}
                className="p-3 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-green-500/20 hover:border-green-400/50 hover:text-green-300 transition-all duration-300 font-medium text-sm flex items-center justify-center space-x-1"
              >
                <Eye size={16} />
                <span>Show All</span>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white transition-all duration-300 font-medium shadow-lg shadow-green-500/30 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </>
  );
};

export default ModernLayerControls;