import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterControls = ({ onFiltersChange, onExport }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [region, setRegion] = useState('all');
  const [provider, setProvider] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu-west', label: 'EU West' },
    { value: 'asia-pacific', label: 'Asia Pacific' }
  ];

  const providerOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'aws', label: 'Amazon Web Services' },
    { value: 'gcp', label: 'Google Cloud Platform' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'digital-ocean', label: 'DigitalOcean' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { timeRange, region, provider };
    newFilters[key] = value;
    
    if (key === 'timeRange') setTimeRange(value);
    if (key === 'region') setRegion(value);
    if (key === 'provider') setProvider(value);
    
    onFiltersChange(newFilters);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(format, { timeRange, region, provider });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={(value) => handleFilterChange('timeRange', value)}
              className="w-full sm:w-40"
            />
            
            <Select
              options={regionOptions}
              value={region}
              onChange={(value) => handleFilterChange('region', value)}
              className="w-full sm:w-40"
            />
            
            <Select
              options={providerOptions}
              value={provider}
              onChange={(value) => handleFilterChange('provider', value)}
              className="w-full sm:w-48"
            />
          </div>
        </div>

        {/* Export Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground hidden sm:block">
            Export:
          </span>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              iconName="Download"
              iconPosition="left"
              iconSize={14}
            >
              CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              disabled={isExporting}
              iconName="FileText"
              iconPosition="left"
              iconSize={14}
            >
              JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              iconName="FileImage"
              iconPosition="left"
              iconSize={14}
            >
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(timeRange !== '24h' || region !== 'all' || provider !== 'all') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            
            {timeRange !== '24h' && (
              <div className="filter-chip active">
                <Icon name="Clock" size={12} className="mr-1" />
                {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
                <button
                  onClick={() => handleFilterChange('timeRange', '24h')}
                  className="ml-1 hover:text-error"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            )}
            
            {region !== 'all' && (
              <div className="filter-chip active">
                <Icon name="MapPin" size={12} className="mr-1" />
                {regionOptions.find(opt => opt.value === region)?.label}
                <button
                  onClick={() => handleFilterChange('region', 'all')}
                  className="ml-1 hover:text-error"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            )}
            
            {provider !== 'all' && (
              <div className="filter-chip active">
                <Icon name="Cloud" size={12} className="mr-1" />
                {providerOptions.find(opt => opt.value === provider)?.label}
                <button
                  onClick={() => handleFilterChange('provider', 'all')}
                  className="ml-1 hover:text-error"
                >
                  <Icon name="X" size={10} />
                </button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setTimeRange('24h');
                setRegion('all');
                setProvider('all');
                onFiltersChange({ timeRange: '24h', region: 'all', provider: 'all' });
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;