import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'globe.gl';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Info, ChevronUp, ChevronDown, X, Zap, Activity, Building2, Cloud } from 'lucide-react';

const GlobeVisualization = ({ 
  exchanges, 
  cloudRegions, 
  connections: initialConnections,
  filters,
  getFilters,
  onLocationHover,
  onLocationClick 
}) => {
  const containerRef = useRef(null);
  const globeInstanceRef = useRef(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [legendVisible, setLegendVisible] = useState(false);
  const [globeDimensions, setGlobeDimensions] = useState({ width: 0, height: 0 });
  const [hoverInfo, setHoverInfo] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const [connections, setConnections] = useState(initialConnections || []);
  const [selectedFilters, setselectedFilters] = useState(filters || []);

 
 
  const updateGlobeDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    setGlobeDimensions({ width: containerWidth, height: containerHeight });
    
    if (globeInstanceRef.current) {
      globeInstanceRef.current
        .width(containerWidth)
        .height(containerHeight);
    }
  }, []);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/latency/latency');
        const data = await response.json();
        setConnections(data.data);
        const currentFilters = typeof getFilters === 'function'
      ? getFilters()
      : filters; 
        setselectedFilters(currentFilters)
     
        

       
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
    
    const interval = setInterval(fetchMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateGlobeDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    updateGlobeDimensions();
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateGlobeDimensions]);


  const safeGlobeOperation = (operation) => {
    if (!containerRef.current || !globeInstanceRef.current) {
      console.warn('Globe container or instance not ready');
      return false;
    }
    try {
      operation();
      return true;
    } catch (error) {
      console.error('Globe operation failed:', error);
      return false;
    }
  };

  useEffect(() => {
    if (initializationAttempted || !containerRef.current) return;

    try {
      setInitializationAttempted(true);
      setIsLoading(true);

    
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;


      const newGlobeInstance = Globe()(containerRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .showGlobe(true)
        .showAtmosphere(true)
        .atmosphereColor('#00FF88')
        .atmosphereAltitude(0.1)
        .enablePointerInteraction(true)
        .width(containerWidth)
        .height(containerHeight);

      
      const controls = newGlobeInstance.controls();
      controls.autoRotate = isAutoRotating;
      controls.autoRotateSpeed = 0.5;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      
      
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.minDistance = 100;
      controls.maxDistance = 2000;

      
      newGlobeInstance.onPointHover(point => {
        if (point) {
          setHoverInfo(point);
          if (onLocationHover) onLocationHover(point, point.type);
        } else {
          setHoverInfo(null);
        }
      });

      
      newGlobeInstance.onPointClick(point => {
        if (point) {
          setActivePoint(point);
          if (onLocationClick) onLocationClick(point, point.type);
        }
      });

      globeInstanceRef.current = newGlobeInstance;
      setIsLoading(false);
    } catch (error) {
      console.error('Globe initialization failed:', error);
      setIsLoading(false);
    }

    return () => {
      
      if (globeInstanceRef.current) {
        try {
          if (globeInstanceRef.current.renderer) {
            globeInstanceRef.current.renderer().dispose();
          }
          globeInstanceRef.current = null;
        } catch (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
      }
    };
  }, [initializationAttempted, isAutoRotating]);

  
  useEffect(() => {
    if (!globeInstanceRef.current || !exchanges || !cloudRegions) return;

    safeGlobeOperation(() => {
      
      const exchangesWithType = exchanges.map(ex => ({
        ...ex,
        type: 'exchange',
        color: '#00FF88',
        altitude: 0.1,
        radius: window.innerWidth < 768 ? 0.6 : 0.8
      }));

      
      const regionsWithType = cloudRegions.map(reg => ({
        ...reg,
        type: 'region',
        color: getProviderColor(reg.provider),
        altitude: 0.15,
        radius: window.innerWidth < 768 ? 0.8 : 1.0
      }));

      
      const allPoints = [...exchangesWithType, ...regionsWithType];

      // Filter points based on selected filters
      const filteredPoints = allPoints.filter(point => {
        if (point.type === 'exchange') {
          return selectedFilters.exchanges.length === 0 || 
                 selectedFilters.exchanges.includes(point.exchangeName);
        } else {
          return selectedFilters.providers.length === 0 || 
                 selectedFilters.providers.includes(point.provider);
        }
      });

      
      globeInstanceRef.current
        .pointsData(filteredPoints)
        .pointAltitude(d => d.altitude)
        .pointRadius(d => d.radius)
        .pointColor(d => d.color)
        .pointLabel(point => generateTooltip(point));
    });
  }, [exchanges, cloudRegions, selectedFilters]);

  
  useEffect(() => {
    if (!globeInstanceRef.current || !connections) return;
 console.log(selectedFilters)
    safeGlobeOperation(() => {
      const filteredConnections = connections.filter(conn => {
  const exchangeMatch =
    selectedFilters.exchanges.length === 0 ||
    selectedFilters.exchanges.some(f =>
      f.toLowerCase() === conn.exchangeName.toLowerCase()
    );

  const providerMatch =
    selectedFilters.providers.length === 0 ||
    selectedFilters.providers.some(f =>
      f.toLowerCase() === conn.provider.toLowerCase()
    );

  return exchangeMatch && providerMatch;
});

console.log(filteredConnections);
      globeInstanceRef.current
        .arcsData(filteredConnections)
        .arcColor(d => {
          const latency = d.latency;
          if (latency < 20) return '#00FF88';
          if (latency < 50) return '#FFB800';
          return '#FF3366';
        })
        .arcAltitude(0.4)
        .arcStroke(window.innerWidth < 768 ? 0.3 : 0.5)
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(2000)
        .arcLabel(d => generateConnectionTooltip(d));
    });
  }, [connections, selectedFilters]);

 
  const getProviderColor = (provider) => {
    switch(provider) {
      case 'aws': return '#FF9900';
      case 'gcp': return '#4285F4';
      case 'azure': return '#90EE90';
      default: return '#00FFFF';
    }
  };


  const generateTooltip = (point) => {
    if (point.type === 'exchange') {
      return `
        <div class="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 max-w-xs">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <img src="${point.logo}" alt="${point.name}" class="w-8 h-8 rounded-full" />
              <h3 class="font-bold text-foreground text-lg">${point.name}</h3>
            </div>
            <div class="px-2 py-1 bg-green-500/20 rounded-full">
              <span class="text-green-300 text-xs font-jetbrains-mono">Exchange</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="bg-gradient-to-br from-emerald-900/20 to-green-800/25 p-3 rounded-lg">
              <p class="text-muted-foreground text-xs">Location</p>
              <p class="text-white font-medium">${point.location}</p>
            </div>
            <div class="bg-gradient-to-br from-emerald-900/20 to-green-800/25 p-3 rounded-lg">
              <p class="text-muted-foreground text-xs">Avg Latency</p>
              <p class="text-primary font-jetbrains-mono">${point.latency}ms</p>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-emerald-900/20 to-green-800/25 p-3 rounded-lg mb-3">
            <p class="text-muted-foreground text-xs">Connected Regions</p>
            <div class="flex flex-wrap gap-1 mt-1">
              ${point.connectedRegions?.slice(0, 3).map(region => `
                <span class="px-2 py-1 bg-emerald-900/40 text-xs rounded-full">
                  ${region}
                </span>
              `).join('')}
              ${point.connectedRegions?.length > 3 ? `
                <span class="px-2 py-1 bg-emerald-900/40 text-xs rounded-full">
                  +${point.connectedRegions.length - 3} more
                </span>
              ` : ''}
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
              <span class="text-xs text-green-300">Live</span>
            </div>
            <span class="text-xs text-muted-foreground">Click for details</span>
          </div>
        </div>
      `;
    } else {
      
      return `
        <div class="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 max-w-xs">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${getProviderColor(point.provider)};">
                <span class="text-white font-bold">${point.provider.charAt(0)}</span>
              </div>
              <h3 class="font-bold text-foreground text-lg">${point.name}</h3>
            </div>
            <div class="px-2 py-1 bg-blue-500/20 rounded-full">
              <span class="text-blue-300 text-xs font-jetbrains-mono">Cloud Region</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="bg-gradient-to-br from-blue-900/20 to-indigo-800/25 p-3 rounded-lg">
              <p class="text-muted-foreground text-xs">Location</p>
              <p class="text-white font-medium">${point.location}</p>
            </div>
            <div class="bg-gradient-to-br from-blue-900/20 to-indigo-800/25 p-3 rounded-lg">
              <p class="text-muted-foreground text-xs">Servers</p>
              <p class="text-primary font-jetbrains-mono">${point.serverCount}</p>
            </div>
          </div>
          
          <div class="mb-3">
            <div class="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Capacity</span>
              <span>${point.capacity}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" 
                   style="width: ${point.capacity}%"></div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-blue-900/20 to-indigo-800/25 p-3 rounded-lg">
            <p class="text-muted-foreground text-xs">Connected Exchanges</p>
            <div class="flex flex-wrap gap-1 mt-1">
              ${point.connectedExchanges?.slice(0, 3).map(exchange => `
                <span class="px-2 py-1 bg-blue-900/40 text-xs rounded-full">
                  ${exchange}
                </span>
              `).join('')}
              ${point.connectedExchanges?.length > 3 ? `
                <span class="px-2 py-1 bg-blue-900/40 text-xs rounded-full">
                  +${point.connectedExchanges.length - 3} more
                </span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  };

  
  const generateConnectionTooltip = (connection) => {
    return `
      <div class="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 max-w-xs">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-foreground">Connection</h3>
          <div class="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/25 rounded-full">
            <span class="text-xs" style="color: ${connection.latency < 20 ? '#00FF88' : connection.latency < 50 ? '#FFB800' : '#FF3366'}">
              ${connection.latency}ms
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between mb-4">
          <div class="text-center">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-1">
              <span class="text-white text-xs">E</span>
            </div>
            <p class="text-xs text-white truncate max-w-[80px]">${connection.exchangeName}</p>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="w-8 h-0.5 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 mb-1"></div>
            <div class="text-xs text-muted-foreground">${connection.distance} km</div>
          </div>
          
          <div class="text-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1" style="background-color: ${getProviderColor(connection.provider)}">
              <span class="text-white text-xs">${connection.provider.charAt(0)}</span>
            </div>
            <p class="text-xs text-white truncate max-w-[80px]">${connection.regionName}</p>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-muted-foreground">Data Transfer</span>
            <span class="text-xs font-jetbrains-mono">${connection.dataTransfer} Gbps</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-muted-foreground">Packet Loss</span>
            <span class="text-xs font-jetbrains-mono ${connection.packetLoss < 0.5 ? 'text-green-400' : 'text-yellow-400'}">
              ${connection.packetLoss}%
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-muted-foreground">Uptime</span>
            <span class="text-xs font-jetbrains-mono ${connection.uptime > 99.9 ? 'text-green-400' : 'text-yellow-400'}">
              ${connection.uptime}%
            </span>
          </div>
        </div>
      </div>
    `;
  };

  
  const toggleAutoRotation = useCallback(() => {
    safeGlobeOperation(() => {
      const controls = globeInstanceRef.current.controls();
      controls.autoRotate = !isAutoRotating;
      controls.autoRotateSpeed = 0.5;
      setIsAutoRotating(!isAutoRotating);
    });
  }, [isAutoRotating]);

  const zoomIn = useCallback(() => {
    safeGlobeOperation(() => {
      const currentPOV = globeInstanceRef.current.pointOfView();
      const newAltitude = Math.max(currentPOV.altitude * 0.8, 0.5);
      globeInstanceRef.current.pointOfView(
        { ...currentPOV, altitude: newAltitude },
        500
      );
    });
  }, []);

  const zoomOut = useCallback(() => {
    safeGlobeOperation(() => {
      const currentPOV = globeInstanceRef.current.pointOfView();
      const newAltitude = Math.min(currentPOV.altitude * 1.2, 10);
      globeInstanceRef.current.pointOfView(
        { ...currentPOV, altitude: newAltitude },
        500
      );
    });
  }, []);

  const resetView = useCallback(() => {
    safeGlobeOperation(() => {
      globeInstanceRef.current.pointOfView(
        { lat: 0, lng: 0, altitude: 2.5 },
        1000
      );
    });
  }, []);

 
  const ModernLegend = () => {
    const legendItems = [
      {
        id: 'exchanges',
        label: 'Exchanges',
        icon: Building2,
        color: '#00FF88',
        description: 'Trading platforms'
      },
      {
        id: 'aws',
        label: 'AWS Regions',
        icon: Cloud,
        color: '#FF9900',
        description: 'Amazon Web Services'
      },
      {
        id: 'gcp',
        label: 'GCP Regions',
        icon: Cloud,
        color: '#4285F4',
        description: 'Google Cloud Platform'
      },
      {
        id: 'azure',
        label: 'Azure Regions',
        icon: Cloud,
        color: '#90EE90',
        description: 'Microsoft Azure'
      }
    ];

    const latencyItems = [
      { label: '< 20ms Excellent', color: '#00FF88', icon: '●' },
      { label: '20-50ms Good', color: '#FFB800', icon: '●●' },
      { label: '> 50ms Poor', color: '#FF3366', icon: '●●●' }
    ];

    if (!legendVisible) {
      return (
        <button
          onClick={() => setLegendVisible(true)}
          className="fixed bottom-4 right-4 p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group shadow-2xl"
          style={{ zIndex: 9999 }}
        >
          <Info size={20} className="text-white group-hover:text-green-300 transition-colors" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
        </button>
      );
    }

    return (
      <>
        {/* Mobile Overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden"
          style={{ zIndex: 9998 }}
          onClick={() => setLegendVisible(false)}
        />

        {/* Legend Panel */}
        <div 
          className="fixed bottom-4 right-4 w-full max-w-xs sm:max-w-sm"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="relative p-4 sm:p-6 bg-gradient-to-r from-emerald-900/50 via-green-800/50 to-teal-900/50">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-green-800/30 to-teal-900/30 animate-pulse"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 p-0.5 shadow-lg shadow-green-500/30">
                    <div className="w-full h-full rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center">
                      <Info size={16} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Legend
                    </h2>
                    <p className="text-green-200/80 text-xs sm:text-sm">
                      Globe Data Guide
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setLegendVisible(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:border-red-400/50 border border-white/20 transition-all duration-300 group"
                >
                  <X size={16} className="text-white group-hover:text-red-300" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              
              {/* Data Sources */}
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm sm:text-base flex items-center space-x-2">
                  <Activity size={16} className="text-green-400" />
                  <span>Data Sources</span>
                </h3>
                <div className="space-y-2">
                  {legendItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500/10 hover:via-emerald-500/10 hover:to-teal-500/10 transition-all duration-300 group cursor-pointer"
                    >
                      <div 
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}50` }}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <item.icon size={14} className="text-white/60 group-hover:text-green-300 transition-colors" />
                        <div>
                          <span className="text-white text-xs sm:text-sm font-medium group-hover:text-green-300 transition-colors">
                            {item.label}
                          </span>
                          <p className="text-white/50 text-xs hidden sm:block">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Latency Indicators */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-semibold mb-3 text-sm sm:text-base flex items-center space-x-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span>Latency</span>
                </h3>
                <div className="space-y-2">
                  {latencyItems.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-1">
                        <span 
                          className="text-xs font-mono transition-all duration-300 group-hover:scale-110"
                          style={{ color: item.color }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <span className="text-white/80 text-xs sm:text-sm group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 640px) {
            .fixed.bottom-4.right-4 {
              bottom: 1rem;
              right: 1rem;
              left: 1rem;
              max-width: none;
            }
          }
        `}</style>
      </>
    );
  };

  
  const FloatingControls = () => (
    <div className="fixed top-4 right-4 flex flex-col space-y-2 z-10">
      <button 
        onClick={toggleAutoRotation}
        className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group"
      >
        {isAutoRotating ? (
          <Icon name="Pause" className="text-white group-hover:text-green-300" />
        ) : (
          <Icon name="Play" className="text-white group-hover:text-green-300" />
        )}
      </button>
      <button 
        onClick={zoomIn}
        className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group"
      >
        <ChevronUp className="text-white group-hover:text-green-300" />
      </button>
      <button 
        onClick={zoomOut}
        className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group"
      >
        <ChevronDown className="text-white group-hover:text-green-300" />
      </button>
      <button 
        onClick={resetView}
        className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group"
      >
        <Icon name="Compass" className="text-white group-hover:text-green-300" />
      </button>
    </div>
  );


  const ActivePointPanel = () => {
    if (!activePoint) return null;
    
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-10">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-gradient-to-r from-emerald-900/50 via-green-800/50 to-teal-900/50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                {activePoint.name}
              </h3>
              <button onClick={() => setActivePoint(null)}>
                <X className="text-white hover:text-red-300" />
              </button>
            </div>
            <p className="text-green-200/80 text-sm">
              {activePoint.type === 'exchange' ? 'Exchange' : 'Cloud Region'}
            </p>
          </div>
          
          <div className="p-4">
            {activePoint.type === 'exchange' ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={activePoint.logo} alt={activePoint.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="text-white font-medium">{activePoint.location}</p>
                    <p className="text-green-300 font-jetbrains-mono">{activePoint.latency}ms avg latency</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-emerald-900/20 to-green-800/25 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-green-300 font-jetbrains-mono">{activePoint.uptime || '99.99'}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-900/20 to-green-800/25 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-green-300 font-jetbrains-mono">${(activePoint.volume || 0).toLocaleString()}/day</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-900/20 to-green-800/25 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Connected Regions</p>
                  <div className="flex flex-wrap gap-1">
                    {activePoint.connectedRegions?.map(region => (
                      <span key={region} className="px-2 py-1 bg-emerald-900/40 text-xs rounded-full">
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: getProviderColor(activePoint.provider) }}>
                    <span className="text-white font-bold text-lg">{activePoint.provider.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{activePoint.location}</p>
                    <p className="text-blue-300 font-jetbrains-mono">{activePoint.serverCount} servers</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-900/20 to-indigo-800/25 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="text-blue-300 font-jetbrains-mono">{activePoint.capacity}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-indigo-800/25 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="text-blue-300 font-jetbrains-mono">{activePoint.avgLatency || 25}ms</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-800/25 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Connected Exchanges</p>
                  <div className="flex flex-wrap gap-1">
                    {activePoint.connectedExchanges?.map(exchange => (
                      <span key={exchange} className="px-2 py-1 bg-blue-900/40 text-xs rounded-full">
                        {exchange}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Globe Container - Responsive */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ 
          minHeight: '300px',
          height: '100%',
          width: '100%'
        }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
          <div className="text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-jetbrains-mono text-sm sm:text-base">
              Initializing 3D Globe...
            </p>
          </div>
        </div>
      )}

      
      {/* Legend */}
      <ModernLegend />
      
     
    </div>
  );
};

export default GlobeVisualization;