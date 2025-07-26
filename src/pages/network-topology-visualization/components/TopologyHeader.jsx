import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopologyHeader = ({ 
  onControlPanelToggle, 
  onInfoPanelToggle,
  selectedNode,
  connectionCount,
  avgLatency,
  healthScore 
}) => {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="bg-card/95 backdrop-blur-md border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Title and Status */}
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-xl font-bold text-foreground font-inter">
              Network Topology
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time infrastructure connection mapping
            </p>
          </div>

          {/* Quick Stats */}

        </div>

        {/* Right Section - Controls and Actions */}
        <div className="flex items-center space-x-3">
          {/* Real-time Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-background rounded-lg border border-border">
            <div className="w-2 h-2 bg-success rounded-full pulse-ambient" />
            <span className="text-xs font-jetbrains-mono text-muted-foreground">
              Live • {currentTime}
            </span>
          </div>

          {/* Mobile Panel Toggles */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onControlPanelToggle}
            className="lg:hidden"
          >
            <Icon name="Settings" size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onInfoPanelToggle}
            className="lg:hidden"
          >
            <Icon name="Info" size={20} />
          </Button>

          {/* Export Options */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
          </div>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
          >
            <Icon name="RefreshCw" size={20} />
          </Button>
        </div>
      </div>

      {/* Selected Node Info Bar */}
      {selectedNode && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={selectedNode.type === 'exchange' ? 'Building2' : 'Cloud'} 
                size={16} 
                className="text-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  {selectedNode.name}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {selectedNode.region}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div>
                <span className="text-muted-foreground">Latency: </span>
                <span className="font-jetbrains-mono text-foreground">
                  {selectedNode.avgLatency}ms
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Status: </span>
                <span className={`
                  font-medium capitalize
                  ${selectedNode.status === 'online' ? 'text-success' : 
                    selectedNode.status === 'warning' ? 'text-warning' : 'text-error'}
                `}>
                  {selectedNode.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopologyHeader;