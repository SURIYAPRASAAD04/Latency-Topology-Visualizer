import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  sparklineData, 
  status, 
  icon, 
  onClick,
  isExpanded = false,
  onClose
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'excellent': return 'bg-success/20 border-success/30';
      case 'good': return 'bg-primary/20 border-primary/30';
      case 'warning': return 'bg-warning/20 border-warning/30';
      case 'critical': return 'bg-error/20 border-error/30';
      default: return 'bg-muted/20 border-border';
    }
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getStatusColor()}`}>
                <Icon name={icon} size={24} className="text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground font-orbitron">
                  {title} - Detailed View
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring and historical trends
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Value */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Current Status
                </h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-foreground font-jetbrains-mono">
                    {animatedValue.toLocaleString()}{unit}
                  </div>
                  <div className={`flex items-center space-x-2 mt-2 ${getTrendColor()}`}>
                    <Icon name={getTrendIcon()} size={16} />
                    <span className="text-sm font-medium">
                      {trendValue}% from last hour
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  24-Hour Trend
                </h4>
                <div className="bg-muted/50 rounded-lg p-4 h-32 flex items-end space-x-1">
                  {sparklineData.map((point, index) => (
                    <div
                      key={index}
                      className="bg-primary/60 rounded-t-sm flex-1 transition-all duration-300"
                      style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Detailed Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Peak (24h)</div>
                    <div className="text-xl font-bold text-foreground font-jetbrains-mono">
                      {Math.max(...sparklineData).toLocaleString()}{unit}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Average (24h)</div>
                    <div className="text-xl font-bold text-foreground font-jetbrains-mono">
                      {Math.round(sparklineData.reduce((a, b) => a + b, 0) / sparklineData.length).toLocaleString()}{unit}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Low (24h)</div>
                    <div className="text-xl font-bold text-foreground font-jetbrains-mono">
                      {Math.min(...sparklineData).toLocaleString()}{unit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-card border border-border rounded-lg p-6 cursor-pointer
        transition-all duration-300 hover:border-primary/50 hover:neon-glow
        ${isHighlighted ? 'border-primary neon-glow' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${getStatusColor()}`}>
          <Icon name={icon} size={20} className="text-foreground" />
        </div>
        <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={12} />
          <span className="font-medium">{trendValue}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <div className="text-2xl font-bold text-foreground font-jetbrains-mono">
          {animatedValue.toLocaleString()}{unit}
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="mt-4 h-8 flex items-end space-x-1">
        {sparklineData.slice(-12).map((point, index) => (
          <div
            key={index}
            className="bg-primary/40 rounded-t-sm flex-1 transition-all duration-300"
            style={{ height: `${(point / Math.max(...sparklineData)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricCard;