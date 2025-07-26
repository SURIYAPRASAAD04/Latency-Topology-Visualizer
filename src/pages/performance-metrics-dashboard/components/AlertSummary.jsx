import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertSummary = ({ alerts, onViewAll, onResolve }) => {
  const getSeverityCount = (severity) => {
    return alerts.filter(alert => alert.severity === severity).length;
  };

  const getRecentAlerts = () => {
    return alerts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const totalAlerts = alerts.length;
  const criticalCount = getSeverityCount('critical');
  const warningCount = getSeverityCount('warning');
  const infoCount = getSeverityCount('info');

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-lg
            ${criticalCount > 0 ? 'bg-error/20 border-error/30' : 
              warningCount > 0 ? 'bg-warning/20 border-warning/30': 'bg-primary/20 border-primary/30'}
          `}>
            <Icon 
              name={criticalCount > 0 ? 'AlertTriangle' : warningCount > 0 ? 'AlertCircle' : 'Shield'} 
              size={20} 
              className={
                criticalCount > 0 ? 'text-error' : 
                warningCount > 0 ? 'text-warning': 'text-primary'
              }
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground font-inter">
              Alert Summary
            </h3>
            <p className="text-sm text-muted-foreground">
              System alerts and notifications
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAll}
          iconName="ExternalLink"
          iconPosition="right"
          iconSize={14}
        >
          View All
        </Button>
      </div>

      {/* Alert Counts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground font-jetbrains-mono">
            {totalAlerts}
          </div>
          <div className="text-xs text-muted-foreground">
            Total Alerts
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-error font-jetbrains-mono">
            {criticalCount}
          </div>
          <div className="text-xs text-muted-foreground">
            Critical
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-warning font-jetbrains-mono">
            {warningCount}
          </div>
          <div className="text-xs text-muted-foreground">
            Warning
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-jetbrains-mono">
            {infoCount}
          </div>
          <div className="text-xs text-muted-foreground">
            Info
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {totalAlerts > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Alerts
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {getRecentAlerts().map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className={`p-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                  <Icon name={getSeverityIcon(alert.severity)} size={12} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground line-clamp-1">
                        {alert.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {alert.message}
                      </div>
                    </div>
                    
                    {alert.severity === 'critical' && !alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onResolve(alert.id)}
                        className="ml-2 text-xs"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground font-jetbrains-mono">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                    
                    {alert.source && (
                      <div className="text-xs text-muted-foreground">
                        {alert.source}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-success/20 border border-success/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Icon name="Shield" size={24} className="text-success" />
          </div>
          <div className="text-sm font-medium text-foreground mb-2">
            All Systems Operational
          </div>
          <div className="text-xs text-muted-foreground">
            No active alerts or issues detected
          </div>
        </div>
      )}

      {/* Alert Trends */}
      {totalAlerts > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Alert Distribution
          </h4>
          
          <div className="space-y-3">
            {criticalCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <span className="text-sm text-foreground">Critical Issues</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted/30 rounded-full h-2">
                    <div 
                      className="h-full bg-error rounded-full"
                      style={{ width: `${(criticalCount / totalAlerts) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-jetbrains-mono w-8">
                    {criticalCount}
                  </span>
                </div>
              </div>
            )}
            
            {warningCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-foreground">Warnings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted/30 rounded-full h-2">
                    <div 
                      className="h-full bg-warning rounded-full"
                      style={{ width: `${(warningCount / totalAlerts) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-jetbrains-mono w-8">
                    {warningCount}
                  </span>
                </div>
              </div>
            )}
            
            {infoCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">Information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted/30 rounded-full h-2">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(infoCount / totalAlerts) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-jetbrains-mono w-8">
                    {infoCount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSummary;