import React from 'react';
import Icon from '../../../components/AppIcon';

const RegionalBreakdown = ({ data }) => {
  const getLatencyColor = (latency) => {
    if (latency < 20) return 'text-success';
    if (latency < 50) return 'text-warning';
    return 'text-error';
  };

  const getLatencyBg = (latency) => {
    if (latency < 20) return 'bg-success/20 border-success/30';
    if (latency < 50) return 'bg-warning/20 border-warning/30';
    return 'bg-error/20 border-error/30';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
            <Icon name="Globe" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground font-inter">
              Regional Breakdown
            </h3>
            <p className="text-sm text-muted-foreground">
              Latency by geographic region
            </p>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground font-jetbrains-mono">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="space-y-4">
        {data.map((region) => (
          <div key={region.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${getLatencyBg(region.avgLatency).split(' ')[0]}`} />
              
              <div>
                <div className="font-medium text-foreground">
                  {region.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {region.exchanges} exchanges • {region.providers} providers
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-bold font-jetbrains-mono ${getLatencyColor(region.avgLatency)}`}>
                {region.avgLatency}ms
              </div>
              <div className="text-xs text-muted-foreground">
                avg latency
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regional Map Visualization */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Global Distribution
        </h4>
        
        <div className="relative bg-muted/20 rounded-lg p-4 h-32 overflow-hidden">
          {/* Simplified world map representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-2 w-full max-w-md">
              {data.map((region, index) => (
                <div
                  key={region.id}
                  className={`
                    h-6 rounded-sm flex items-center justify-center text-xs font-medium
                    ${getLatencyBg(region.avgLatency)}
                    transition-all duration-300 hover:scale-105
                  `}
                  title={`${region.name}: ${region.avgLatency}ms`}
                >
                  {region.code}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalBreakdown;