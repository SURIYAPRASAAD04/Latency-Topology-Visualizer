import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProviderTable = ({ providers, onEdit, onDelete, onToggleStatus, selectedItems, onSelectItem, onSelectAll }) => {
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

  const sortedProviders = [...providers].sort((a, b) => {
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

  const getHealthColor = (health) => {
    if (health >= 95) return 'text-success';
    if (health >= 80) return 'text-warning';
    return 'text-error';
  };

  const getHealthIcon = (health) => {
    if (health >= 95) return 'CheckCircle';
    if (health >= 80) return 'AlertTriangle';
    return 'XCircle';
  };

  const formatCapacity = (capacity) => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}k`;
    }
    return capacity.toString();
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
                  checked={selectedItems.length === providers.length}
                  onChange={onSelectAll}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < providers.length}
                />
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Provider</span>
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('region')}
              >
                <div className="flex items-center space-x-2">
                  <span>Region</span>
                  <Icon 
                    name={sortField === 'region' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('serverCount')}
              >
                <div className="flex items-center space-x-2">
                  <span>Servers</span>
                  <Icon 
                    name={sortField === 'serverCount' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('capacity')}
              >
                <div className="flex items-center space-x-2">
                  <span>Capacity</span>
                  <Icon 
                    name={sortField === 'capacity' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </div>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Health</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProviders.map((provider) => (
              <tr key={provider.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems.includes(provider.id)}
                    onChange={() => onSelectItem(provider.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    
                    <div>
                      <div className="font-medium text-foreground">{provider.name}</div>
                      <div className="text-sm text-muted-foreground">{provider.type}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Globe" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground font-jetbrains-mono">{provider.region}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-foreground font-jetbrains-mono">
                    {provider.serverCount.toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-foreground font-jetbrains-mono">
                      {formatCapacity(provider.capacity)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {provider.capacityUnit}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getHealthIcon(provider.health)} 
                      size={16} 
                      className={getHealthColor(provider.health)} 
                    />
                    <span className={`text-sm font-jetbrains-mono ${getHealthColor(provider.health)}`}>
                      {provider.health}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleStatus(provider.id)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${provider.active ? 'bg-primary' : 'bg-muted'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${provider.active ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(provider)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(provider.id)}
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
        {sortedProviders.map((provider) => (
          <div key={provider.id} className="bg-muted/20 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedItems.includes(provider.id)}
                  onChange={() => onSelectItem(provider.id)}
                />
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground">{provider.name}</div>
                  <div className="text-sm text-muted-foreground">{provider.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(provider)}
                  className="h-8 w-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(provider.id)}
                  className="h-8 w-8 text-error hover:text-error"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Region</div>
                <div className="flex items-center space-x-2">
                  <Icon name="Globe" size={14} className="text-muted-foreground" />
                  <span className="text-foreground font-jetbrains-mono">{provider.region}</span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Servers</div>
                <div className="text-foreground font-jetbrains-mono">
                  {provider.serverCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Capacity</div>
                <div className="flex items-center space-x-2">
                  <span className="text-foreground font-jetbrains-mono">
                    {formatCapacity(provider.capacity)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {provider.capacityUnit}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Health</div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getHealthIcon(provider.health)} 
                    size={16} 
                    className={getHealthColor(provider.health)} 
                  />
                  <span className={`font-jetbrains-mono ${getHealthColor(provider.health)}`}>
                    {provider.health}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">Status</div>
              <button
                onClick={() => onToggleStatus(provider.id)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${provider.active ? 'bg-primary' : 'bg-muted'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${provider.active ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderTable;