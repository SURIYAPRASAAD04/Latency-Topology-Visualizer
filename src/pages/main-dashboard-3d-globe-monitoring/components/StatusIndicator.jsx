import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusIndicator = ({ status, lastUpdate, dataPoints, className = "" }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'text-success',
          bgColor: 'bg-success/20',
          borderColor: 'border-success/30',
          icon: 'CheckCircle',
          label: 'All Systems Operational'
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          borderColor: 'border-warning/30',
          icon: 'AlertTriangle',
          label: 'Minor Issues Detected'
        };
      case 'error':
        return {
          color: 'text-error',
          bgColor: 'bg-error/20',
          borderColor: 'border-error/30',
          icon: 'AlertCircle',
          label: 'System Issues'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20',
          borderColor: 'border-muted/30',
          icon: 'Clock',
          label: 'Connecting...'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`bg-card/95 backdrop-blur-md border border-border rounded-lg p-4 ${className}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
            <Icon 
              name={statusConfig.icon} 
              size={16} 
              className={statusConfig.color}
            />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            System Status
          </h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${statusConfig.color.replace('text-', 'bg-')} pulse-ambient`} />
          <span className="text-xs text-muted-foreground font-jetbrains-mono">
            Live
          </span>
        </div>
      </div>

      {/* Status Label */}
      <div className="mb-3">
        <p className={`text-sm font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdate}
        </p>
      </div>

      {/* Data Points */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Active Connections</span>
          <span className="text-foreground font-jetbrains-mono">
            {dataPoints.activeConnections}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Data Points/sec</span>
          <span className="text-foreground font-jetbrains-mono">
            {dataPoints.dataPointsPerSecond}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Avg Response Time</span>
          <span className="text-foreground font-jetbrains-mono">
            {dataPoints.avgResponseTime}ms
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-muted-foreground">System Health</span>
          <span className="text-foreground font-jetbrains-mono">
            {dataPoints.systemHealth}%
          </span>
        </div>
        
        <div className="w-full bg-muted/30 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              dataPoints.systemHealth > 95 ? 'bg-success' :
              dataPoints.systemHealth > 85 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${dataPoints.systemHealth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;