import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, 
  Network, 
  Activity, 
  TrendingUp, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  X,
  BarChart3,
  Layers,
  CheckCircle2
} from 'lucide-react';

const GlassmorphicSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigationSections = [
    {
      title: 'Live Monitoring',
      icon: Activity,
      items: [
        {
          label: 'Main Dashboard',
          path: '/main-dashboard-3d-globe-monitoring',
          icon: Globe,
          tooltip: '3D Globe Visualization',
          gradient: 'from-green-500 to-emerald-500'
        },
        {
          label: 'Historical Analytics',
          path: '/historical-latency-analytics',
          icon: TrendingUp,
          tooltip: 'Trend Analysis & Planning',
          gradient: 'from-cyan-500 to-blue-500'
        }
      ]
    },
    {
      title: 'Future Planning',
      subtitle: 'Layout Only – v2 Ahead',
      icon: TrendingUp,
      items: [
        {
          label: 'Network Topology',
          path: '/network-topology-visualization',
          icon: Network,
          tooltip: 'Connection Analysis',
          gradient: 'from-emerald-500 to-teal-500'
        },
        {
          label: 'Performance Metrics',
          path: '/performance-metrics-dashboard',
          icon: BarChart3,
          tooltip: 'System Health Monitoring',
          gradient: 'from-teal-500 to-cyan-500'
        },
        {
          label: 'Manage Exchanges',
          path: '/exchange-and-provider-management',
          icon: Settings,
          tooltip: 'Configuration & Setup',
          gradient: 'from-blue-500 to-indigo-500'
        }
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-20 left-0 h-[calc(100vh-65px)] z-50 
        transition-all duration-700 ease-in-out transform 
        ${collapsed ? 'w-20' : 'w-65'}  
        ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `}>
        {/* Glassmorphic Panel */}
        <div className="h-full relative overflow-hidden  ">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl border-r border-white/10">
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-teal-900/20 opacity-60"></div>
            
            {/* Inner glow effect */}
            <div className="absolute inset-0 shadow-inner shadow-white/5"></div>
            
            {/* Floating orbs for extra depth */}
            <div className="absolute top-20 left-4 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-4 w-24 h-24 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              {!collapsed && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-white/20 p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center justify-center">
                        <Layers size={20} className="text-emerald-300" />
                      </div>
                    </div>
                    {/* Pulsing dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight font-['Inter']">
                      Navigation
                    </h2>
                    <p className="text-emerald-200/70 text-xs font-medium">
                      Quick Access
                    </p>
                  </div>
                </div>
              )}
              
              <button
                onClick={onToggle}
                className="group relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 backdrop-blur-md overflow-hidden"
              >
                {/* Button background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/0 to-emerald-900/0 group-hover:from-emerald-900/20 group-hover:to-teal-900/20 transition-all duration-500"></div>
                
                <div className="relative">
                  {collapsed ? (
                    <ChevronRight size={16} className="text-white/70 group-hover:text-emerald-300 transition-colors duration-300" />
                  ) : (
                    <ChevronLeft size={16} className="text-white/70 group-hover:text-emerald-300 transition-colors duration-300" />
                  )}
                </div>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
              {navigationSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  {!collapsed && (
                    <div className="px-3 mb-4">
                      <div className="flex items-center space-x-2 text-white/50 text-xs font-bold uppercase tracking-wider font-['Inter']">
                        <section.icon size={14} />
                        <span>{section.title}</span>
                      </div>
                      {section.subtitle && (
                        <div className="text-orange-300/70 text-xs mt-1.5 ml-5 italic font-medium">
                          {section.subtitle}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isItemActive = isActive(item.path);
                      const isHovered = hoveredItem === `${sectionIndex}-${itemIndex}`;
                      const itemKey = `${sectionIndex}-${itemIndex}`;
                      
                      return (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          className={`
                            group relative flex items-center rounded-2xl transition-all duration-500 overflow-hidden w-full text-left
                            ${collapsed ? 'p-4 justify-center' : 'p-4'}
                            ${isItemActive 
                              ? 'bg-gradient-to-r from-emerald-900/60 via-green-800/60 to-teal-900/60 border-emerald-400/50 shadow-lg shadow-emerald-500/20' 
                              : 'hover:bg-gradient-to-r hover:from-emerald-900/40 hover:via-green-800/40 hover:to-teal-900/40 hover:border-emerald-400/30'
                            }
                            border ${isItemActive ? 'border-emerald-400/50' : 'border-white/10 hover:border-emerald-400/20'}
                            backdrop-blur-md
                          `}
                          title={collapsed ? item.tooltip : ''}
                          onMouseEnter={() => setHoveredItem(itemKey)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {/* Animated background gradient for active/hover states */}
                          <div className={`
                            absolute inset-0 transition-all duration-700
                            ${isItemActive 
                              ? 'bg-gradient-to-r from-emerald-900/30 via-green-800/30 to-teal-900/30 opacity-100' 
                              : isHovered 
                                ? 'bg-gradient-to-r from-emerald-900/20 via-green-800/20 to-teal-900/20 opacity-100'
                                : 'opacity-0'
                            }
                          `}></div>
                          
                          {/* Neon glow effect */}
                          {(isItemActive || isHovered) && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 blur-xl"></div>
                          )}
                          
                          {/* Icon Container */}
                          <div className={`
                            relative flex-shrink-0 transition-all duration-300
                            ${isItemActive || isHovered ? 'scale-110' : 'scale-100'}
                          `}>
                            <div className={`
                              w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 backdrop-blur-md
                              ${isItemActive 
                                ? `bg-gradient-to-r ${item.gradient} border border-emerald-400/40 shadow-lg shadow-emerald-500/30` 
                                : isHovered 
                                  ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20' 
                                  : 'bg-white/5 border border-white/10'
                              }
                            `}>
                              <Icon 
                                size={20} 
                                className={`
                                  transition-all duration-300
                                  ${isItemActive 
                                    ? 'text-white' 
                                    : isHovered 
                                      ? 'text-emerald-400' 
                                      : 'text-white/70'
                                  }
                                `}
                              />
                            </div>
                            
                            {/* Active pulse indicator */}
                            {isItemActive && (
                              <>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black/40"></div>
                              </>
                            )}
                          </div>
                          
                          {!collapsed && (
                            <div className="ml-4 flex-1 relative">
                              <span className={`
                                font-semibold transition-all duration-300 font-['Inter'] text-sm
                                ${isItemActive 
                                  ? 'text-white' 
                                  : isHovered 
                                    ? 'text-emerald-100' 
                                    : 'text-white/80'
                                }
                              `}>
                                {item.label}
                              </span>
                              <div className={`
                                text-xs transition-all duration-300 mt-1 font-medium
                                ${isItemActive 
                                  ? 'text-emerald-200/90' 
                                  : isHovered 
                                    ? 'text-emerald-300/80' 
                                    : 'text-white/40'
                                }
                              `}>
                                {item.tooltip}
                              </div>
                            </div>
                          )}
                          
                          {/* Collapsed state tooltip */}
                          {collapsed && (
                            <div className="absolute left-full ml-6 px-4 py-3 bg-black/80 backdrop-blur-xl text-white text-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-50 border border-white/20 shadow-2xl">
                              <div className="font-semibold font-['Inter']">{item.label}</div>
                              <div className="text-xs text-white/60 mt-1">{item.tooltip}</div>
                              {/* Tooltip arrow */}
                              <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black/80"></div>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Section - System Status */}
            {!collapsed && (
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-900/20 to-teal-900/20 backdrop-blur-md border border-emerald-400/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm font-medium font-['Inter']">System Online</span>
                  </div>
                  <div className="text-emerald-300/80 text-xs font-mono">
                    99.9%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.4));
          border-radius: 3px;
          backdrop-filter: blur(10px);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(16, 185, 129, 0.6), rgba(5, 150, 105, 0.6));
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </>
  );
};

export default GlassmorphicSidebar;