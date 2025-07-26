import React, { useState ,useEffect} from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ filters, onFiltersChange, onApplyFilters, onClearFilters }) => {
  const [latencyRange, setLatencyRange] = useState([0, 100]);
  
    const [exchanges, setExchanges] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMetrics = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/locations/locations');
          const data = await response.json();
          setExchanges(data.data.connectedExchanges);
          setRegions(data.data.connectedCloudRegions);
         
         
          setLoading(false);
        } catch (error) {
          console.error('Error fetching metrics:', error);
          setLoading(false);
        }
      };
  
      fetchMetrics();
    }, []);
     if (loading) {
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative rounded-xl p-4 backdrop-blur-md border border-white/20 animate-pulse">
              <div className="h-24 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      );
    }
  



  const providers = [
    {
      id: 'aws',
      name: 'Amazon Web Services',
      shortName: 'AWS',
      logo: 'https://www.paubox.com/hubfs/What%20is%20AWS.jpg',
      regions: 12
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      shortName: 'GCP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/archive/c/c1/20230305195326%21Google_%22G%22_logo.svg',
      regions: 8
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      shortName: 'Azure',
      logo: 'https://swimburger.net/media/ppnn3pcl/azure.png',
      regions: 6
    }
  ];




  const handleExchangeToggle = (exchangename, codecountry) => {
  const updatedExchanges = filters.exchanges.includes(exchangename)
    ? filters.exchanges.filter(name => name !== exchangename)
    : [...filters.exchanges, exchangename];
  const updatedProviders = [...filters.providers, codecountry];
  onFiltersChange(prevFilters => ({
    ...prevFilters,
    exchanges: updatedExchanges,
    providers: updatedProviders
  }));
};

  const handleProviderToggle = (providerId) => {
    const updatedProviders = filters.providers.includes(providerId)
      ? filters.providers.filter(id => id !== providerId)
      : [...filters.providers, providerId];
    
    onFiltersChange({ ...filters, providers: updatedProviders });
  };

  const handleRegionToggle = (regionId) => {
    const updatedRegions = filters.regions.includes(regionId)
      ? filters.regions.filter(region => region !== regionId)
      : [...filters.regions, regionId];
     onFiltersChange(prevFilters => ({
    ...prevFilters,
    regions: updatedRegions,
  
  }));
 
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'offline': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header with Green Gradient */}
     
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8">
          
          {/* Exchanges Filter */}
          <div className="relative">
            {/* Section Header with Glassmorphism */}
            <div className="sticky top-0 z-20 backdrop-blur-md bg-black/60 border border-white/10 rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center mr-3 border border-green-400/30">
                  <Icon name="Building2" size={16} className="text-green-400" />
                </div>
                Exchanges
                <span className="ml-auto text-xs bg-gradient-to-r from-green-400/20 to-emerald-500/20 px-2 py-1 rounded-full border border-green-400/30 text-green-300">
                  {filters.exchanges.length} 
                </span>
              </h4>
            </div>
            
            {/* Scrollable Exchange List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar-thin bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="p-4 space-y-3">
                {exchanges.map((exchange, index) => (
                  <div 
                    key={exchange.id} 
                    className={`group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/30 transition-all duration-300 transform hover:scale-[1.02] ${
                      filters.exchanges.includes(exchange.id) ? 'ring-1 ring-green-400/50 bg-green-400/10' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Checkbox
                      checked={filters.exchanges.includes(exchange.name)}
                      onChange={() => handleExchangeToggle(exchange.name, exchange.code)}
                      label={
                        <div className="flex items-center space-x-3 ml-3">
                          <div className="relative">
                            <Image
                              src={exchange.logo}
                              alt={`${exchange.name} logo`}
                              className="w-8 h-8 rounded-full border border-white/20 shadow-lg"
                            />
                           
                          </div>
                          <div>
                            <span className="text-white font-medium text-sm">{exchange.name}</span>
                            
                          </div>
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cloud Providers Filter */}
          <div className="relative">
            {/* Section Header with Glassmorphism */}
            <div className="sticky top-0 z-20 backdrop-blur-md bg-black/60 border border-white/10 rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center mr-3 border border-green-400/30">
                  <Icon name="Cloud" size={16} className="text-green-400" />
                </div>
                Cloud Providers
                <span className="ml-auto text-xs bg-gradient-to-r from-green-400/20 to-emerald-500/20 px-2 py-1 rounded-full border border-green-400/30 text-green-300">
                  {filters.providers.length} 
                </span>
              </h4>
            </div>
            
            {/* Scrollable Provider List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar-thin bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="p-4 space-y-3">
                {providers.map((provider, index) => (
                  <div 
                    key={provider.id} 
                    className={`group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/30 transition-all duration-300 transform hover:scale-[1.02] ${
                      filters.providers.includes(provider.id) ? 'ring-1 ring-green-400/50 bg-green-400/10' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Checkbox
                      checked={filters.providers.includes(provider.id)}
                       
                      label={
                        <div className="flex items-center space-x-3 ml-3">
                          <Image
                            src={provider.logo}
                            alt={`${provider.name} logo`}
                            className="w-8 h-8 rounded-lg border border-white/20 shadow-lg"
                          />
                          <div>
                            <div className="text-white font-medium text-sm">{provider.shortName}</div>
                            
                          </div>
                        </div>
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <div className="text-xs bg-gradient-to-r from-green-400/20 to-emerald-500/20 px-2 py-1 rounded-full border border-green-400/30 text-green-300">
                        {provider.regions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic Regions Filter */}
          <div className="relative">
            {/* Section Header with Glassmorphism */}
            <div className="sticky top-0 z-20 backdrop-blur-md bg-black/60 border border-white/10 rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center mr-3 border border-green-400/30">
                  <Icon name="MapPin" size={16} className="text-green-400" />
                </div>
                Geographic Regions
                <span className="ml-auto text-xs bg-gradient-to-r from-green-400/20 to-emerald-500/20 px-2 py-1 rounded-full border border-green-400/30 text-green-300">
                  {filters.regions.length} 
                </span>
              </h4>
            </div>
            
            {/* Scrollable Region List */}
            <div className="max-h-64 overflow-y-auto custom-scrollbar-thin bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="p-4 space-y-3">
                {regions.map((region, index) => (
                  <div 
                    key={region.id}
                    className={`group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/30 transition-all duration-300 transform hover:scale-[1.02] ${
                      filters.regions.includes(region.id) ? 'ring-1 ring-green-400/50 bg-green-400/10' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Checkbox
                      checked={filters.regions.includes(region.id)}
                      onChange={() => handleRegionToggle(region.id)}
                      label={
                        <div className="ml-3">
                          <div className="text-white font-medium text-sm flex items-center">
                            <Icon name="Globe" size={14} className="mr-2 text-green-400" />
                            {region.name}
                          </div>
                          <div className="text-xs text-green-300/70 font-jetbrains-mono mt-1 pl-5">
                            {region.code}
                          </div>
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions with Green Gradient */}
      <div className="relative p-6 border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-green-800/40 to-teal-900/40"></div>
        <div className="relative z-10 space-y-4">
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            
            <Button
              variant="default"
              size="sm"
              onClick={onApplyFilters}
              className="flex-1  bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-400/40 transition-all duration-300 transform hover:scale-105 rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-xl"
              iconName="Filter"
              iconPosition="left"
            >
              Apply Filters
            </Button>
          </div>

  
          
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #34d399, #10b981);
        }
        
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 6px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #34d399, #10b981);
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;