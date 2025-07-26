import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExchangeTable = ({ exchanges, onEdit, onDelete, onToggleStatus, selectedItems, onSelectItem, onSelectAll }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedExchanges = [...exchanges].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'error': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      default: return 'Clock';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedItems.length === exchanges.length}
                  onChange={onSelectAll}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < exchanges.length}
                />
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Exchange</span>
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-2">
                  <span>Location</span>
                  <Icon 
                    name={sortField === 'location' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">API Status</th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('lastUpdate')}
              >
                <div className="flex items-center space-x-2">
                  <span>Last Update</span>
                  <Icon 
                    name={sortField === 'lastUpdate' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Monitoring</th>
              <th className="p-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExchanges.map((exchange) => (
              <tr key={exchange.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.includes(exchange.id)}
                    onChange={() => onSelectItem(exchange.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    
                    <div>
                      <div className="font-medium text-foreground">{exchange.name}</div>
                      <div className="text-sm text-muted-foreground">{exchange.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{exchange.location}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(exchange.apiStatus)} 
                      size={16} 
                      className={getStatusColor(exchange.apiStatus)} 
                    />
                    <span className={`text-sm capitalize ${getStatusColor(exchange.apiStatus)}`}>
                      {exchange.apiStatus}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-muted-foreground font-jetbrains-mono">
                    {new Date(exchange.lastUpdate).toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleStatus(exchange.id)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${exchange.monitoring ? 'bg-primary' : 'bg-muted'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${exchange.monitoring ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(exchange)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(exchange.id)}
                      className="h-8 w-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedExchanges.map((exchange) => (
          <div key={exchange.id} className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedItems.includes(exchange.id)}
                  onChange={() => onSelectItem(exchange.id)}
                />
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={exchange.logo}
                    alt={exchange.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground">{exchange.name}</div>
                  <div className="text-sm text-muted-foreground">{exchange.symbol}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(exchange)}
                  className="h-8 w-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(exchange.id)}
                  className="h-8 w-8 text-error hover:text-error"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Location</div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} className="text-muted-foreground" />
                  <span className="text-foreground">{exchange.location}</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">API Status</div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(exchange.apiStatus)} 
                    size={16} 
                    className={getStatusColor(exchange.apiStatus)} 
                  />
                  <span className={`capitalize ${getStatusColor(exchange.apiStatus)}`}>
                    {exchange.apiStatus}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Last Update</div>
                <div className="text-foreground font-jetbrains-mono">
                  {new Date(exchange.lastUpdate).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Monitoring</div>
                <button
                  onClick={() => onToggleStatus(exchange.id)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${exchange.monitoring ? 'bg-primary' : 'bg-muted'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${exchange.monitoring ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeTable;