import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter, X, Search, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { combineSlices } from '@reduxjs/toolkit';

const InnovativeFilterUI = ({ filters, onFiltersChange, onApplyFilters, onClearFilters }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    exchanges: true,
    providers: true,
    latency: true,
    regions: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [data, setData] = useState({
    exchanges: [],
    providers: [],
    regions: [],
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const API_BASE = 'http://localhost:5000/api/data';
      
      const [exchangesRes, providersRes, regionsRes] = await Promise.all([
        fetch(`${API_BASE}/exchanges`),
        fetch(`${API_BASE}/providers`),
        fetch(`${API_BASE}/regions`)
      ]);

      if (!exchangesRes.ok) throw new Error(`Exchanges API failed: ${exchangesRes.status}`);
      if (!providersRes.ok) throw new Error(`Providers API failed: ${providersRes.status}`);
      if (!regionsRes.ok) throw new Error(`Regions API failed: ${regionsRes.status}`);

      const [exchanges, providers, regions] = await Promise.all([
        exchangesRes.json(),
        providersRes.json(),
        regionsRes.json()
      ]);
      
      const allowedProviders = ["AWS", "Azure", "GCP"];
      setData({
        exchanges: exchanges.map(ex => ({
          id: ex.exchangeCode || ex.exchangeId,
          name: ex.exchangeName,
          location: ex.baseCountry,
          logo: ex.logoUrl || `https://ui-avatars.com/api/?name=${ex.exchangeName.charAt(0)}&background=random`,
          status: ex.status || 'online',
          latency: ex.latency || Math.floor(Math.random() * 100) + 10
        })),
      
        providers: allowedProviders.map(providerName => ({
          id: `${providerName.toLowerCase()}`,
          name: providerName,
          regionName: `${providerName}`,
          country: "USA", 
          regionCount: 1,
          avgLatency: Math.floor(Math.random() * 50) + 10 
        })),
         
        regions: regions.map(reg => ({
          id: reg.locationId,
          name: reg.name,
          flag: getFlagEmoji(reg.alpha2),
          subregion: reg.subregion,
          latency: Math.floor(Math.random() * 100) + 10
        })),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({
        exchanges: [],
        providers: [],
        regions: [],
        loading: false,
        error: error.message
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getFlagEmoji = useCallback((countryCode) => {
    if (!countryCode) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const toggleFilter = useCallback((category, id) => {
    let current = filters[category] || [];
    const updated = current.includes(id)
      ? current.filter(x => x !== id)  
      : [...current, id];              
    onFiltersChange(prevFilters => ({
      ...prevFilters,
      [category]: updated  
    }));
  }, [filters, onFiltersChange]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'offline': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  }, []);

  const getLatencyColor = useCallback((latency) => {
    if (latency <= 20) return 'text-green-400';
    if (latency <= 50) return 'text-yellow-400';
    return 'text-red-400';
  }, []);

  const filteredExchanges = useMemo(() => {
    return data.exchanges.filter(exchange =>
      exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.exchanges, searchQuery]);

  const CustomCheckbox = useCallback(({ id, checked, onChange, children }) => (
    <label 
      htmlFor={`checkbox-${id}`}
      className="group flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:via-emerald-500/10 hover:to-teal-500/10 hover:backdrop-blur-md"
    >
      <div className="relative">
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          className="sr-only"
          checked={checked}
          onChange={() => onChange(id)}
        />
        <div className={`
          w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
          ${checked 
            ? 'border-green-400 bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'border-white/30 group-hover:border-green-400/50'
          }
        `}>
          {checked && <CheckCircle2 size={12} className="text-white" />}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </label>
  ), []);

  const FilterSection = useCallback(({ title, isExpanded, onToggle, children, count, scrollable = false }) => (
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
              {count}
            </span>
          )}
        </div>
        <div className="text-white/60 group-hover:text-green-300 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
      `}>
        <div className={`space-y-2 ${scrollable ? 'max-h-[300px] overflow-y-auto custom-scrollbar' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  ), []);

  if (data.loading && !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group shadow-2xl"
      >
        <Filter size={24} className="text-white group-hover:text-green-300 transition-colors" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">...</span>
        </div>
      </button>
    );
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-gradient-to-r hover:from-green-500/20 hover:via-emerald-500/20 hover:to-teal-500/20 hover:border-green-400/50 transition-all duration-300 group shadow-2xl"
      >
        <Filter size={24} className="text-white group-hover:text-green-300 transition-colors" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">
            {filters.exchanges.length + filters.providers.length + filters.regions.length}
          </span>
        </div>
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

      {/* Main Filter Panel */}
      <div className="fixed top-20 right-4 w-full max-w-md lg:max-w-lg max-h-[calc(100vh-400px)] z-50">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Animated Header */}
          <div className="relative p-6 bg-gradient-to-r from-emerald-900/50 via-green-800/50 to-teal-900/50">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-green-800/30 to-teal-900/30 animate-pulse"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-0.5 shadow-lg shadow-green-500/30">
                  <div className="w-full h-full rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center">
                    <Filter size={20} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Smart Filters
                  </h2>
                  <p className="text-green-200/80 text-sm">
                    {data.loading ? 'Loading real-time data...' : 'Real-time Network Filtering'}
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
                placeholder="Search exchanges, regions, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none rounded-2xl"
              />
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {data.error ? (
              <div className="text-red-400 p-4 bg-red-900/20 rounded-xl">
                Error loading data: {data.error}
                <button 
                  onClick={() => fetchData()}
                  className="ml-2 px-3 py-1 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : data.loading ? (
              <div className="flex flex-col items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-400 mb-4"></div>
                <p className="text-green-400">Loading real-time data...</p>
              </div>
            ) : (
              <>
                {/* Latency Range */}
                <FilterSection 
                  title="Latency Range" 
                  isExpanded={expandedSections.latency}
                  onToggle={() => toggleSection('latency')}
                >
                  <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-white/80 text-sm mb-2 block">Min (ms)</label>
                        <input
                          type="number"
                          value={filters.latencyRange[0]}
                          onChange={(e) => {
                            const min = parseInt(e.target.value) || 0;
                            const max = filters.latencyRange[1];
                            onFiltersChange({ ...filters, latencyRange: [min, max] });
                          }}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-green-400/50 transition-all duration-300"
                          min="0"
                          max="500"
                        />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm mb-2 block">Max (ms)</label>
                        <input
                          type="number"
                          value={filters.latencyRange[1]}
                          onChange={(e) => {
                            const max = parseInt(e.target.value) || 200;
                            const min = filters.latencyRange[0];
                            onFiltersChange({ ...filters, latencyRange: [min, max] });
                          }}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-green-400/50 transition-all duration-300"
                          min="0"
                          max="500"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-green-400 font-mono text-sm">
                        {filters.latencyRange[0]}ms - {filters.latencyRange[1]}ms
                      </span>
                    </div>
                  </div>
                </FilterSection>

                {/* Exchanges */}
                {data.exchanges.length > 0 && (
                  <FilterSection 
                    title="Exchanges" 
                    isExpanded={expandedSections.exchanges}
                    onToggle={() => toggleSection('exchanges')}
                    count={filters.exchanges.length}
                    scrollable={true}
                  >
                    {filteredExchanges.map((exchange) => (
                      <CustomCheckbox
                        key={exchange.id}
                        id={exchange.id}
                        checked={filters.exchanges.includes(exchange.id)}
                        onChange={(id) => toggleFilter('exchanges', id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {exchange.logo.startsWith('http') ? (
                              <img 
                                src={exchange.logo} 
                                alt={exchange.name}
                                className="w-6 h-6 object-contain rounded-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${exchange.name.charAt(0)}&background=random&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                {exchange.logo}
                              </div>
                            )}
                            <div>
                              <div className="text-white font-medium">{exchange.name}</div>
                              <div className="text-white/60 text-sm">{exchange.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-mono ${getLatencyColor(exchange.latency)}`}>
                              {exchange.latency}ms
                            </span>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(exchange.status)} shadow-lg`}></div>
                          </div>
                        </div>
                      </CustomCheckbox>
                    ))}
                  </FilterSection>
                )}

                {/* Cloud Providers */}
                {data.providers.length > 0 && (
                  <FilterSection 
                    title="Cloud Providers" 
                    isExpanded={expandedSections.providers}
                    onToggle={() => toggleSection('providers')}
                    count={filters.providers.length}
                    scrollable={true}
                  >
                    {data.providers.map((provider) => (
                      <CustomCheckbox
                        key={provider.id}
                        id={provider.id}
                        checked={filters.providers.includes(provider.id)}
                        onChange={(id) => toggleFilter('providers', id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                              {provider.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-medium">{provider.name}</div>
                              <div className="text-white/60 text-sm">{provider.regionName}</div>
                            </div>
                          </div>
                          <span className={`text-sm font-mono ${getLatencyColor(provider.avgLatency)}`}>
                            {provider.avgLatency}ms
                          </span>
                        </div>
                      </CustomCheckbox>
                    ))}
                  </FilterSection>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-white/5 via-white/5 to-white/5 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  onClearFilters(); 
                }}
                className="p-4 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-300 transition-all duration-300 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  onApplyFilters(); 
                  console.log("Applied Filters:", filters);
                  setIsVisible(false);
                }}
                className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white transition-all duration-300 font-medium shadow-lg shadow-green-500/30"
              >
                Apply Filters
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

export default InnovativeFilterUI;