import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InfoPanel = ({ selectedNode, isOpen, onToggle }) => {
  if (!selectedNode) {
    return (
      <div className={`
        fixed top-header right-0 h-[calc(100vh-60px)] w-80 bg-card/95 backdrop-blur-md 
        border-l border-border transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:relative lg:top-0 lg:h-full lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground font-inter">
              Node Details
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
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Icon name="MousePointer" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select a Node
              </h3>
              <p className="text-sm text-muted-foreground">
                Click on any exchange or provider node to view detailed information and connection metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock connection data for selected node
  const getConnectionData = (node) => {
    const connections = [
      {
        id: 'conn-1',
        target: node.type === 'exchange' ? 'AWS US East 1' : 'Binance US',
        latency: 12,
        bandwidth: 95,
        packetLoss: 0.1,
        jitter: 2.1,
        status: 'healthy',
        uptime: 99.9
      },
      {
        id: 'conn-2',
        target: node.type === 'exchange' ? 'GCP Europe West' : 'Coinbase Pro',
        latency: 28,
        bandwidth: 82,
        packetLoss: 0.4,
        jitter: 3.2,
        status: 'healthy',
        uptime: 99.7
      },
      {
        id: 'conn-3',
        target: node.type === 'exchange' ? 'Azure Asia Pacific' : 'Kraken',
        latency: 125,
        bandwidth: 65,
        packetLoss: 0.8,
        jitter: 8.5,
        status: 'degraded',
        uptime: 98.2
      }
    ];
    return connections;
  };

  const connections = getConnectionData(selectedNode);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'degraded': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'degraded': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Info Panel */}
      <div className={`
        fixed top-header right-0 h-[calc(100vh-60px)] w-80 bg-card/95 backdrop-blur-md 
        border-l border-border z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:relative lg:top-0 lg:h-full lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground font-inter">
              Node Details
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
            {/* Node Overview */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${selectedNode.type === 'exchange' ? 'bg-success/20' : 'bg-primary/20'}
                `}>
                  <Icon 
                    name={selectedNode.type === 'exchange' ? 'Building2' : 'Cloud'} 
                    size={24}
                    className={selectedNode.type === 'exchange' ? 'text-success' : 'text-primary'}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedNode.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedNode.type === 'exchange' ? 'Cryptocurrency Exchange' : 'Cloud Provider Region'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(selectedNode.status)} 
                  size={16} 
                  className={getStatusColor(selectedNode.status)}
                />
                <span className={`text-sm font-medium capitalize ${getStatusColor(selectedNode.status)}`}>
                  {selectedNode.status}
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Key Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {selectedNode.type === 'exchange' ? 'Capacity' : 'Server Count'}
                  </div>
                  <div className="text-lg font-bold text-foreground font-jetbrains-mono">
                    {selectedNode.type === 'exchange' ? `${selectedNode.capacity}%` : selectedNode.serverCount}
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Avg Latency</div>
                  <div className="text-lg font-bold text-foreground font-jetbrains-mono">
                    {selectedNode.avgLatency}ms
                  </div>
                </div>
                {selectedNode.type === 'exchange' && (
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Connections</div>
                    <div className="text-lg font-bold text-foreground font-jetbrains-mono">
                      {selectedNode.connections}
                    </div>
                  </div>
                )}
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Region</div>
                  <div className="text-sm font-medium text-foreground">
                    {selectedNode.region}
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Details */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Active Connections
              </h4>
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div key={connection.id} className="bg-background/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {connection.target}
                      </span>
                      <Icon 
                        name={getStatusIcon(connection.status)} 
                        size={14} 
                        className={getStatusColor(connection.status)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Latency:</span>
                        <span className="ml-1 font-jetbrains-mono text-foreground">
                          {connection.latency}ms
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bandwidth:</span>
                        <span className="ml-1 font-jetbrains-mono text-foreground">
                          {connection.bandwidth}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Packet Loss:</span>
                        <span className="ml-1 font-jetbrains-mono text-foreground">
                          {connection.packetLoss}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Jitter:</span>
                        <span className="ml-1 font-jetbrains-mono text-foreground">
                          {connection.jitter}ms
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-jetbrains-mono text-foreground">
                          {connection.uptime}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Performance */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                24h Performance Trend
              </h4>
              <div className="bg-background/50 rounded-lg p-3">
                <div className="h-20 flex items-end justify-between space-x-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-primary/60 rounded-t"
                      style={{
                        height: `${Math.random() * 60 + 20}%`,
                        width: '3px'
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>24:00</span>
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
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPanel;