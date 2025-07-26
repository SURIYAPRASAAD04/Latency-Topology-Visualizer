import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertPanel = ({ alerts, onDismiss, onAcknowledge }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (alerts.length > 0) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setVisibleAlerts(alerts);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setVisibleAlerts([]);
      setIsSliding(false);
    }
  }, [alerts]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-error bg-error/10';
      case 'warning': return 'border-warning bg-warning/10';
      case 'info': return 'border-primary bg-primary/10';
      default: return 'border-border bg-muted/10';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className={`
      fixed right-4 top-20 w-96 max-w-[calc(100vw-2rem)] z-dropdown
      transform transition-transform duration-300 ease-cyber
      ${isSliding ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {visibleAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              bg-card border rounded-lg p-4 shadow-lg backdrop-blur-md
              ${getSeverityColor(alert.severity)}
              animate-in slide-in-from-right duration-300
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-1 rounded-full
                ${alert.severity === 'critical' ? 'text-error' : 
                  alert.severity === 'warning' ? 'text-warning' : 'text-primary'}
              `}>
                <Icon name={getSeverityIcon(alert.severity)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    {alert.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 -mt-1 -mr-1"
                    onClick={() => onDismiss(alert.id)}
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {alert.message}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={10} />
                    <span className="font-jetbrains-mono">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {alert.severity === 'critical' && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onAcknowledge(alert.id)}
                      className="text-xs"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;