import React from 'react';
import Icon from '../../../components/AppIcon';

const ProviderComparison = ({ data }) => {
  const maxLatency = Math.max(...data.map(p => p.avgLatency));
  
  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'aws': return 'Cloud';
      case 'gcp': return 'CloudRain';
      case 'azure': return 'CloudSnow';
      case 'digital-ocean': return 'Droplets';
      default: return 'Server';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider.toLowerCase()) {
      case 'aws': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'gcp': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'azure': return 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30';
      case 'digital-ocean': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default: return 'text-primary bg-primary/20 border-primary/30';
    }
  };

  const getUptimeColor = (uptime) => {
    if (uptime >= 99.9) return 'text-success';
    if (uptime >= 99.5) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
            <Icon name="BarChart3" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground font-inter">
              Provider Comparison
            </h3>
            <p className="text-sm text-muted-foreground">
              Performance across cloud providers
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((provider) => (
          <div key={provider.id} className="space-y-3">
            {/* Provider Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getProviderColor(provider.name)}`}>
                  <Icon name={getProviderIcon(provider.name)} size={16} />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {provider.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {provider.regions} regions • {provider.connections} connections
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-foreground font-jetbrains-mono">
                  {provider.avgLatency}ms
                </div>
                <div className={`text-xs font-medium ${getUptimeColor(provider.uptime)}`}>
                  {provider.uptime}% uptime
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Latency Performance</span>
                <span>{provider.avgLatency}ms / {maxLatency}ms</span>
              </div>
              
              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    provider.avgLatency < 30 ? 'bg-success' :
                    provider.avgLatency < 60 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${(provider.avgLatency / maxLatency) * 100}%` }}
                />
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-sm font-bold text-foreground font-jetbrains-mono">
                  {provider.p95Latency}ms
                </div>
                <div className="text-xs text-muted-foreground">
                  95th percentile
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-bold text-foreground font-jetbrains-mono">
                  {provider.errorRate}%
                </div>
                <div className="text-xs text-muted-foreground">
                  error rate
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-bold text-foreground font-jetbrains-mono">
                  {provider.throughput}
                </div>
                <div className="text-xs text-muted-foreground">
                  req/sec
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Rankings */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Performance Rankings
        </h4>
        
        <div className="space-y-2">
          {data
            .sort((a, b) => a.avgLatency - b.avgLatency)
            .map((provider, index) => (
              <div key={provider.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-success text-success-foreground' :
                      index === 1 ? 'bg-warning text-warning-foreground' :
                      index === 2 ? 'bg-orange-500 text-white': 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {provider.name}
                  </span>
                </div>
                
                <div className="text-sm font-jetbrains-mono text-muted-foreground">
                  {provider.avgLatency}ms avg
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderComparison;