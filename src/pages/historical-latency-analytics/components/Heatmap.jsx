import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as Chart from 'chart.js';
import { Thermometer, Calendar, Clock, Activity, Target, Zap, TrendingUp, Globe, Server } from 'lucide-react';

Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.PointElement,
  Chart.LineElement,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend,
  Chart.Filler,
  Chart.ScatterController
);

const Heatmap = ({ 
  data = [], 
  timeRange = '24h', 
  loading = false,
  selectedExchanges = ['binance', 'coinbase', 'kraken', 'ftx'],
  selectedProviders = ['aws', 'gcp', 'azure']
}) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [animatedCells, setAnimatedCells] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [pulseEffect, setPulseEffect] = useState(0);

  const heatmapData = useMemo(() => {
    const exchanges = ['Binance', 'Coinbase', 'Kraken', 'FTX', 'Bybit', 'Huobi'];
    const providers = ['AWS US-East', 'AWS EU-West', 'GCP US-Central', 'GCP EU-West', 'Azure US-East', 'Azure EU-North'];
    const timeSlots = [];
    
    const now = new Date();
    const slots = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    const interval = timeRange === '1h' ? 5 : timeRange === '24h' ? 60 : timeRange === '7d' ? 1440 : 1440;
    
    for (let i = slots - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60000);
      timeSlots.push(timeRange === '7d' || timeRange === '30d' 
        ? time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    }

    const heatData = [];
    exchanges.forEach((exchange, exchangeIndex) => {
      providers.forEach((provider, providerIndex) => {
        timeSlots.forEach((timeSlot, timeIndex) => {
          const baseLatency = 10 + (exchangeIndex * 3) + (providerIndex * 2);
          const timeVariation = Math.sin((timeIndex / timeSlots.length) * Math.PI * 2) * 5;
          const randomVariation = (Math.random() - 0.5) * 8;
          const latency = Math.max(5, baseLatency + timeVariation + randomVariation);
          
          heatData.push({
            x: timeIndex,
            y: exchangeIndex * providers.length + providerIndex,
            v: Math.round(latency * 10) / 10,
            exchange,
            provider,
            timeSlot,
            combinedLabel: `${exchange} → ${provider}`
          });
        });
      });
    });

    return {
      data: heatData,
      exchanges,
      providers,
      timeSlots,
      yLabels: exchanges.flatMap(exchange => 
        providers.map(provider => `${exchange} → ${provider.split(' ')[0]}`)
      )
    };
  }, [timeRange, selectedExchanges, selectedProviders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => 0.3 + Math.sin(Date.now() / 1000) * 0.4);
      setPulseEffect(prev => 0.5 + Math.sin(Date.now() / 800) * 0.3);
    }, 100);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const randomCells = Array.from({ length: 8 }, () => Math.floor(Math.random() * heatmapData.data.length));
      setAnimatedCells(randomCells);
      setTimeout(() => setAnimatedCells([]), 1500);
    }, 2500);
    return () => clearInterval(interval);
  }, [heatmapData.data.length]);

  useEffect(() => {
    if (!canvasRef.current || loading) return;

  
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    

    const heatmapPlugin = {
      id: 'heatmap',
      beforeDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;

        ctx.save();

        const cellWidth = chartArea.width / heatmapData.timeSlots.length;
        const cellHeight = chartArea.height / heatmapData.yLabels.length;

        heatmapData.data.forEach((point, index) => {
          const x = chartArea.left + (point.x * cellWidth);
          const y = chartArea.top + (point.y * cellHeight);
          
          // Normalize value for color intensity (5-50ms range)
          const normalizedValue = Math.min(1, Math.max(0, (point.v - 5) / 45));
          
          const baseHue = 136; 
          const saturation = 100;
          const lightness = 30 + (normalizedValue * 50); 
          const alpha = 0.4 + (normalizedValue * 0.6);
          
          // Create neon green gradient
          const lowColor = '#00FF8820';  
          const medColor = '#00FF8860';  
          const highColor = '#00FF88';   
          
          let cellColor;
          if (normalizedValue < 0.33) {
            cellColor = `hsla(${baseHue}, ${saturation}%, ${30 + normalizedValue * 30}%, ${0.3 + normalizedValue * 0.3})`;
          } else if (normalizedValue < 0.66) {
            cellColor = `hsla(${baseHue}, ${saturation}%, ${45 + normalizedValue * 25}%, ${0.5 + normalizedValue * 0.3})`;
          } else {
            cellColor = `hsla(${baseHue}, ${saturation}%, ${60 + normalizedValue * 25}%, ${0.7 + normalizedValue * 0.3})`;
          }
          
          // Add glow effect for animated cells
          const isAnimated = animatedCells.includes(index);
          const glowRadius = isAnimated ? 20 : 0;
          
          if (glowRadius > 0) {
            const gradient = ctx.createRadialGradient(
              x + cellWidth/2, y + cellHeight/2, 0,
              x + cellWidth/2, y + cellHeight/2, glowRadius
            );
            gradient.addColorStop(0, `hsla(${baseHue}, 100%, 70%, 0.8)`);
            gradient.addColorStop(0.5, `hsla(${baseHue}, 100%, 60%, 0.4)`);
            gradient.addColorStop(1, `hsla(${baseHue}, 100%, 50%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x - glowRadius/2, y - glowRadius/2, cellWidth + glowRadius, cellHeight + glowRadius);
          }
          
          // Draw cell with neon green gradient
          const cellGradient = ctx.createLinearGradient(x, y, x + cellWidth, y + cellHeight);
          cellGradient.addColorStop(0, cellColor);
          cellGradient.addColorStop(1, `hsla(${baseHue}, ${saturation}%, ${Math.min(85, lightness + 15)}%, ${alpha * 0.8})`);
          
          ctx.fillStyle = cellGradient;
          ctx.fillRect(x, y, cellWidth, cellHeight);
          
          // Add neon border
          ctx.strokeStyle = `hsla(${baseHue}, 100%, ${70 + normalizedValue * 15}%, ${0.6 + normalizedValue * 0.4})`;
          ctx.lineWidth = isAnimated ? 2.5 : 1;
          if (isAnimated) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00FF88';
          }
          ctx.strokeRect(x, y, cellWidth, cellHeight);
          ctx.shadowBlur = 0;
          
          // Add value text for larger cells
          if (cellWidth > 35 && cellHeight > 25) {
            ctx.fillStyle = normalizedValue > 0.6 ? '#000000' : '#ffffff';
            ctx.font = `bold ${Math.min(11, cellWidth/4)}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              `${point.v}ms`, 
              x + cellWidth/2, 
              y + cellHeight/2
            );
          }
        });

        ctx.restore();
      }
    };

    // Register the plugin
    Chart.Chart.register(heatmapPlugin);

    chartRef.current = new Chart.Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          data: [],
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false,
            external: (context) => {
              const tooltipModel = context.tooltip;
              if (tooltipModel.opacity === 0) {
                setHoveredCell(null);
                return;
              }

              // Find the hovered cell
              const canvasRect = canvasRef.current.getBoundingClientRect();
              const x = tooltipModel.caretX;
              const y = tooltipModel.caretY;
              
              const cellWidth = canvasRef.current.width / heatmapData.timeSlots.length;
              const cellHeight = canvasRef.current.height / heatmapData.yLabels.length;
              
              const cellX = Math.floor(x / cellWidth);
              const cellY = Math.floor(y / cellHeight);
              
              const cellData = heatmapData.data.find(d => d.x === cellX && d.y === cellY);
              if (cellData) {
                setHoveredCell({
                  ...cellData,
                  screenX: x,
                  screenY: y
                });
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: -0.5,
            max: heatmapData.timeSlots.length - 0.5,
            ticks: {
              stepSize: 1,
              callback: (value) => heatmapData.timeSlots[value] || '',
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 11,
                weight: 'bold'
              }
            },
            grid: {
              display: false
            },
            border: {
              color: 'rgba(0, 255, 136, 0.6)'
            },
            title: {
              display: true,
              text: 'Time →',
              color: '#00FF88',
              font: {
                size: 14,
                weight: 'bold'
              },
              padding: 10
            }
          },
          y: {
            type: 'linear',
            min: -0.5,
            max: heatmapData.yLabels.length - 0.5,
            ticks: {
              stepSize: 1,
              callback: (value) => heatmapData.yLabels[value] || '',
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 11,
                weight: 'bold'
              }
            },
            grid: {
              display: false
            },
            border: {
              color: 'rgba(0, 255, 136, 0.6)'
            },
            title: {
              display: true,
              text: '← Exchange → Provider',
              color: '#00FF88',
              font: {
                size: 14,
                weight: 'bold'
              },
              padding: 15
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'point'
        },
        onHover: (event, elements) => {
          canvasRef.current.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      },
      plugins: [heatmapPlugin]
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [heatmapData, loading, animatedCells, glowIntensity]);

  const calculateStats = () => {
    const values = heatmapData.data.map(d => d.v);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      hotspots: values.filter(v => v > 30).length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="relative w-full h-[700px] overflow-hidden rounded-3xl ">
        <div 
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            border: '1px solid rgba(0, 255, 136, 0.4)'
          }}
        />
        
        <div className="relative flex flex-col items-center justify-center h-full">
          <div className="relative mb-8">
            <div 
              className="w-20 h-20 border-4 border-transparent rounded-full animate-spin"
              style={{
                borderTopColor: '#00FF88',
                borderRightColor: '#00FF88',
        
              }}
            />
            <div className="absolute inset-3 w-14 h-14 border-2 border-green-400 rounded-full animate-ping opacity-50" />
            <Thermometer 
              size={24} 
              className="absolute inset-0 m-auto text-green-400 animate-pulse" 
            />
          </div>
          
          <p className="text-xl font-bold text-white mb-3">Loading Thermal Matrix...</p>
          <p className="text-sm text-gray-300 mb-6">Analyzing latency heat signatures</p>
          
          {/* Loading grid simulation */}
          <div className="grid grid-cols-12 gap-1">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded bg-green-400/20 animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  background: `linear-gradient(45deg, rgba(0, 255, 136, ${0.1 + (i % 4) * 0.1}), rgba(0, 200, 108, ${0.05 + (i % 3) * 0.1}))`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">

      <div 
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          background: `linear-gradient(135deg, 
            rgba(0, 255, 136, ${0.12 + glowIntensity * 0.08}), 
            rgba(0, 200, 108, ${0.06 + glowIntensity * 0.04}), 
            rgba(0, 150, 80, ${0.10 + glowIntensity * 0.06})
          )`,
          border: `1px solid rgba(0, 255, 136, ${0.4 + glowIntensity * 0.2})`,
          
        }}
      />
      
      <div className="relative p-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 m-12 p12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-lg opacity-60 animate-pulse"
              />
              <div 
                className="relative w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 200, 108, 0.2))',
                  border: '2px solid rgba(0, 255, 136, 0.6)',
      
                }}
              >
                <Thermometer 
                  size={24} 
                  className="text-green-400 animate-pulse"
                />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Neural <span className="text-green-400 animate-pulse">Heatmap</span>
              </h3>
              <p className="text-sm text-gray-300">
                Real-time thermal analysis of latency distribution patterns
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Enhanced Legend */}
            <div 
              className="flex items-center gap-4 px-6 py-3 rounded-2xl backdrop-blur-xl"
              style={{
    
                border: '1px solid rgba(0, 255, 136, 0.4)',
              
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 bg-gradient-to-r from-green-200 via-green-400 to-green-300 rounded-sm "></div>
                <span className="text-sm text-white font-bold">5ms → 50ms+</span>
              </div>
            </div>

            {/* Live indicator */}
            <div 
              className="flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.25), rgba(0, 150, 80, 0.15))',
                border: '1px solid rgba(0, 255, 136, 0.5)',
  
              }}
            >
              <div 
                className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
              />
              <span className="text-sm font-bold text-white">Neural Sync</span>
              <TrendingUp size={14} className="text-green-400 " />
            </div>
          </div>
        </div>

        {/* Enhanced Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Min Latency', value: `${stats.min.toFixed(1)}ms`, icon: Target, color: 'text-green-300', bg: 'rgba(0, 255, 136, 0.2)' },
            { label: 'Max Latency', value: `${stats.max.toFixed(1)}ms`, icon: Zap, color: 'text-green-400', bg: 'rgba(0, 200, 108, 0.2)' },
            { label: 'Avg Latency', value: `${stats.avg.toFixed(1)}ms`, icon: Activity, color: 'text-green-500', bg: 'rgba(0, 150, 80, 0.2)' },
            { label: 'Heat Zones', value: stats.hotspots, icon: Thermometer, color: 'text-green-200', bg: 'rgba(0, 255, 136, 0.15)' }
          ].map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl backdrop-blur-xl border p-4 group hover:scale-105 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${stat.bg}, rgba(0, 0, 0, 0.1))`,
                border: '1px solid rgba(0, 255, 136, 0.3)',
  
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-300 mb-2 font-medium">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color} group-hover:animate-pulse`}>{stat.value}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                  <stat.icon size={20} className={`relative ${stat.color} group-hover:animate-pulse`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Axis Legend */}
        <div className="flex items-center justify-between mb-6">
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 200, 108, 0.08))',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            <Clock size={16} className="text-green-400" />
            <span className="text-sm font-bold text-white">X-Axis: Time Progression →</span>
          </div>
          
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 200, 108, 0.08))',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            <span className="text-sm font-bold text-white">↑ Y-Axis: Exchange-Provider Pairs</span>
            <Globe size={16} className="text-green-400" />
          </div>
        </div>
        
        <div 
          className="relative h-[450px] rounded-3xl backdrop-blur-xl border p-6 group"
          style={{
    
            border: '1px solid rgba(0, 255, 136, 0.4)',
           
          }}
        >
      
          
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-xl"
            style={{ background: 'transparent' }}
          />
          
  
          {hoveredCell && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: hoveredCell.screenX + 15,
                top: hoveredCell.screenY - 10,
                transform: 'translateY(-100%)'
              }}
            >
              <div 
                className="relative rounded-2xl backdrop-blur-xl p-4 border animate-pulse"
                style={{
                 
                  border: '1px solid rgba(0, 255, 136, 0.6)',
                  
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-green-400" />
                    <span className="text-xs font-bold text-white">{hoveredCell.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Server size={14} className="text-green-400 " />
                    <span className="text-xs text-gray-200">{hoveredCell.combinedLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer size={14} className="text-green-400" />
                    <span className="text-lg font-bold text-green-400">{hoveredCell.v}ms</span>
                  </div>
                  
                  {/* Latency status indicator */}
                  <div className="mt-3 pt-2 border-t border-green-400/30">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          hoveredCell.v < 15 ? 'bg-green-300' : 
                          hoveredCell.v < 30 ? 'bg-green-400' : 'bg-green-500'
                        }`}
                       
                      />
                      <span className="text-xs text-gray-300 font-medium">
                        {hoveredCell.v < 15 ? 'Optimal' : hoveredCell.v < 30 ? 'Good' : 'High Latency'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Time Range Info */}
        <div className="flex items-center justify-center mt-6">
          <div 
            className="flex items-center gap-4 px-6 py-3 rounded-2xl backdrop-blur-xl group hover:scale-105 transition-all duration-300"
            style={{
  
              border: '1px solid rgba(0, 255, 136, 0.3)',
            
            }}
          >
            <Calendar size={16} className="text-green-400" />
            <span className="text-sm text-white font-medium">
              Neural Analysis: <span className="font-bold text-green-400">{timeRange}</span> temporal window
            </span>
            <Activity size={16} className="text-green-400" />
          </div>
        </div>

        {/* Data Quality Indicators */}
        <div className="flex items-center justify-between mt-6">
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 0, 0, 0.2))',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-300">Data Quality: 99.8%</span>
          </div>
          
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 0, 0, 0.2))',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}
          >
            <Zap size={12} className="text-green-400 animate-pulse" />
            <span className="text-xs text-gray-300">Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
          
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 0, 0, 0.2))',
              border: '1px solid rgba(0, 255, 136, 0.2)'
            }}
          >
            <span className="text-xs text-gray-300">Nodes: {heatmapData.data.length}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.3;
          }
          33% { 
            transform: translateY(-20px) rotate(2deg) scale(1.1); 
            opacity: 0.6;
          }
          66% { 
            transform: translateY(10px) rotate(-2deg) scale(0.9); 
            opacity: 0.4;
          }
        }
        
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .matrix-rain {
          animation: matrix-rain 3s linear infinite;
        }
        
       
      
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0, 255, 136, 0.5); }
          50% { border-color: rgba(0, 255, 136, 0.8); }
        }
      `}</style>
    </div>
  );
};

export default Heatmap;