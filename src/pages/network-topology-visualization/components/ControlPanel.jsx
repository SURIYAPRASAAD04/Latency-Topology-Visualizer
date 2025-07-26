import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ControlPanel = ({
  isOpen,
  onToggle,
  viewMode,
  onViewModeChange,
  showLatencyHeatmap,
  onLatencyHeatmapToggle,
  showTrafficVolume,
  onTrafficVolumeToggle,
  showConnectionHealth,
  onConnectionHealthToggle,
  selectedFilters,
  onFilterChange
}) => {
  const viewModes = [
    { id: 'force', label: 'Force Layout', icon: 'Network' },
    { id: 'circular', label: 'Circular Layout', icon: 'Circle' },
    { id: 'hierarchical', label: 'Hierarchical', icon: 'GitBranch' }
  ];

  const layerToggles = [
    {
      id: 'latencyHeatmap',
      label: 'Latency Heatmap',
      description: 'Color-code nodes by latency performance',
      checked: showLatencyHeatmap,
      onChange: onLatencyHeatmapToggle,
      icon: 'Thermometer'
    },
    {
      id: 'trafficVolume',
      label: 'Traffic Volume',
      description: 'Connection thickness shows bandwidth usage',
      checked: showTrafficVolume,
      onChange: onTrafficVolumeToggle,
      icon: 'Activity'
    },
    {
      id: 'connectionHealth',
      label: 'Connection Health',
      description: 'Color-code connections by health status',
      checked: showConnectionHealth,
      onChange: onConnectionHealthToggle,
      icon: 'Heart'
    }
  ];

  const providers = [
    { id: 'aws', label: 'Amazon Web Services', color: '#FF9900' },
    { id: 'gcp', label: 'Google Cloud Platform', color: '#4285F4' },
    { id: 'azure', label: 'Microsoft Azure', color: '#0078D4' }
  ];

  const exchanges = [
    { id: 'binance', label: 'Binance', status: 'online' },
    { id: 'coinbase', label: 'Coinbase Pro', status: 'online' },
    { id: 'kraken', label: 'Kraken', status: 'warning' },
    { id: 'ftx', label: 'FTX', status: 'offline' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Control Panel */}
      <div className={`
        fixed top-header left-0 h-[calc(100vh-60px)] w-80 bg-card/95 backdrop-blur-md 
        border-r border-border z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:top-0 lg:h-full lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground font-inter">
              Topology Controls
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* View Mode Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Layout" size={16} className="mr-2" />
                Layout Mode
              </h3>
              <div className="space-y-2">
                {viewModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onViewModeChange(mode.id)}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-lg border transition-all
                      ${viewMode === mode.id 
                        ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon name={mode.icon} size={16} />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Toggles */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Layers" size={16} className="mr-2" />
                Visualization Layers
              </h3>
              <div className="space-y-4">
                {layerToggles.map((layer) => (
                  <div key={layer.id} className="space-y-2">
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <Icon name={layer.icon} size={14} />
                          <span className="text-sm font-medium">{layer.label}</span>
                        </div>
                      }
                      checked={layer.checked}
                      onChange={layer.onChange}
                    />
                    <p className="text-xs text-muted-foreground ml-6">
                      {layer.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Filters */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Cloud" size={16} className="mr-2" />
                Cloud Providers
              </h3>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: provider.color }}
                          />
                          <span className="text-sm">{provider.label}</span>
                        </div>
                      }
                      checked={selectedFilters.providers?.includes(provider.id) || false}
                      onChange={(checked) => onFilterChange('providers', provider.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Exchange Filters */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Building2" size={16} className="mr-2" />
                Exchanges
              </h3>
              <div className="space-y-3">
                {exchanges.map((exchange) => (
                  <div key={exchange.id} className="flex items-center justify-between">
                    <Checkbox
                      label={
                        <div className="flex items-center space-x-2">
                          <div className={`
                            w-2 h-2 rounded-full
                            ${exchange.status === 'online' ? 'bg-success' : 
                              exchange.status === 'warning' ? 'bg-warning' : 'bg-error'}
                          `} />
                          <span className="text-sm">{exchange.label}</span>
                        </div>
                      }
                      checked={selectedFilters.exchanges?.includes(exchange.id) || false}
                      onChange={(checked) => onFilterChange('exchanges', exchange.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Latency Range Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Timer" size={16} className="mr-2" />
                Latency Range
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">0ms</span>
                  <span className="text-muted-foreground">500ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={selectedFilters.maxLatency || 500}
                  onChange={(e) => onFilterChange('maxLatency', null, parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center">
                  <span className="text-sm font-jetbrains-mono text-primary">
                    Max: {selectedFilters.maxLatency || 500}ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onFilterChange('reset')}
              >
                Reset Filters
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;