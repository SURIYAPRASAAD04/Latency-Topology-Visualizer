import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCards = ({ exchanges, providers }) => {
  const exchangeStats = {
    total: exchanges.length,
    connected: exchanges.filter(e => e.apiStatus === 'connected').length,
    monitoring: exchanges.filter(e => e.monitoring).length,
    errors: exchanges.filter(e => e.apiStatus === 'error').length
  };

  const providerStats = {
    total: providers.length,
    active: providers.filter(p => p.active).length,
    totalServers: providers.reduce((sum, p) => sum + p.serverCount, 0),
    avgHealth: Math.round(providers.reduce((sum, p) => sum + p.health, 0) / providers.length)
  };

  const cards = [
    {
      title: 'Total Exchanges',
      value: exchangeStats.total,
      subtitle: `${exchangeStats.connected} connected`,
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/20'
    },
    {
      title: 'Active Monitoring',
      value: exchangeStats.monitoring,
      subtitle: `${exchangeStats.errors} with errors`,
      icon: 'Activity',
      color: 'text-success',
      bgColor: 'bg-success/20'
    },
    {
      title: 'Cloud Providers',
      value: providerStats.total,
      subtitle: `${providerStats.active} active`,
      icon: 'Server',
      color: 'text-accent',
      bgColor: 'bg-accent/20'
    },
    {
      title: 'Total Servers',
      value: providerStats.totalServers.toLocaleString(),
      subtitle: `${providerStats.avgHealth}% avg health`,
      icon: 'Database',
      color: 'text-warning',
      bgColor: 'bg-warning/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-4 hover:neon-glow transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                {card.title}
              </div>
              <div className="text-2xl font-bold text-foreground font-jetbrains-mono">
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <Icon 
                name={card.icon} 
                size={24} 
                className={card.color} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;