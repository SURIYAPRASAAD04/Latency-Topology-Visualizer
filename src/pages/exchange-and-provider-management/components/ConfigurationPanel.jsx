import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfigurationPanel = ({ 
  isOpen, 
  onClose, 
  item, 
  type, 
  onSave 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      
      setFormData(type === 'exchange' ? {
        name: '',
        symbol: '',
        location: '',
        apiKey: '',
        apiSecret: '',
        monitoring: true,
        alertThreshold: 100,
        coordinates: { lat: '', lng: '' }
      } : {
        name: '',
        type: 'aws',
        region: '',
        serverCount: 0,
        capacity: 0,
        capacityUnit: 'GB',
        active: true,
        alertThreshold: 95,
        coordinates: { lat: '', lng: '' }
      });
    }
    setErrors({});
  }, [item, type]);

  const exchangeOptions = [
    { value: 'binance', label: 'Binance' },
    { value: 'coinbase', label: 'Coinbase Pro' },
    { value: 'ftx', label: 'FTX' },
    { value: 'okx', label: 'OKX' },
    { value: 'bybit', label: 'Bybit' }
  ];

  const providerOptions = [
    { value: 'aws', label: 'Amazon Web Services' },
    { value: 'gcp', label: 'Google Cloud Platform'},
    { value: 'azure', label: 'Microsoft Azure' }
  ];

  const capacityUnitOptions = [
    { value: 'GB', label: 'Gigabytes' },
    { value: 'TB', label: 'Terabytes' },
    { value: 'PB', label: 'Petabytes' }
  ];

  const locationOptions = [
    { value: 'New York, US', label: 'New York, US' },
    { value: 'London, UK', label: 'London, UK' },
    { value: 'Tokyo, JP', label: 'Tokyo, JP' },
    { value: 'Singapore, SG', label: 'Singapore, SG' },
    { value: 'Frankfurt, DE', label: 'Frankfurt, DE' },
    { value: 'Sydney, AU', label: 'Sydney, AU' }
  ];

  const regionOptions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU West (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCoordinateChange = (coord, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [coord]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (type === 'exchange') {
      if (!formData.symbol?.trim()) {
        newErrors.symbol = 'Symbol is required';
      }
      if (!formData.location?.trim()) {
        newErrors.location = 'Location is required';
      }
      if (!formData.apiKey?.trim()) {
        newErrors.apiKey = 'API Key is required';
      }
    } else {
      if (!formData.region?.trim()) {
        newErrors.region = 'Region is required';
      }
      if (!formData.serverCount || formData.serverCount < 1) {
        newErrors.serverCount = 'Server count must be at least 1';
      }
      if (!formData.capacity || formData.capacity < 1) {
        newErrors.capacity = 'Capacity must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground font-inter">
            {item ? 'Edit' : 'Add New'} {type === 'exchange' ? 'Exchange' : 'Provider'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Basic Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />
                
                {type === 'exchange' ? (
                  <Input
                    label="Symbol"
                    type="text"
                    value={formData.symbol || ''}
                    onChange={(e) => handleInputChange('symbol', e.target.value)}
                    error={errors.symbol}
                    required
                    placeholder="e.g., BTC"
                  />
                ) : (
                  <Select
                    label="Provider Type"
                    options={providerOptions}
                    value={formData.type || ''}
                    onChange={(value) => handleInputChange('type', value)}
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {type === 'exchange' ? (
                  <Select
                    label="Location"
                    options={locationOptions}
                    value={formData.location || ''}
                    onChange={(value) => handleInputChange('location', value)}
                    error={errors.location}
                    required
                    searchable
                  />
                ) : (
                  <Select
                    label="Region"
                    options={regionOptions}
                    value={formData.region || ''}
                    onChange={(value) => handleInputChange('region', value)}
                    error={errors.region}
                    required
                    searchable
                  />
                )}
                
                {type === 'provider' && (
                  <Input
                    label="Server Count"
                    type="number"
                    value={formData.serverCount || ''}
                    onChange={(e) => handleInputChange('serverCount', parseInt(e.target.value) || 0)}
                    error={errors.serverCount}
                    required
                    min="1"
                  />
                )}
              </div>
            </div>

            {/* API Configuration (Exchange only) */}
            {type === 'exchange' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  API Configuration
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="API Key"
                    type="password"
                    value={formData.apiKey || ''}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    error={errors.apiKey}
                    required
                    placeholder="Enter API key"
                  />
                  
                  <Input
                    label="API Secret"
                    type="password"
                    value={formData.apiSecret || ''}
                    onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                    placeholder="Enter API secret"
                  />
                </div>
              </div>
            )}

            {/* Capacity Configuration (Provider only) */}
            {type === 'provider' && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Capacity Configuration
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    label="Capacity"
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    error={errors.capacity}
                    required
                    min="1"
                  />
                  
                  <Select
                    label="Unit"
                    options={capacityUnitOptions}
                    value={formData.capacityUnit || 'GB'}
                    onChange={(value) => handleInputChange('capacityUnit', value)}
                  />
                </div>
              </div>
            )}

            {/* Geographic Coordinates */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Geographic Coordinates
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  value={formData.coordinates?.lat || ''}
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  placeholder="e.g., 40.7128"
                  step="0.0001"
                />
                
                <Input
                  label="Longitude"
                  type="number"
                  value={formData.coordinates?.lng || ''}
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  placeholder="e.g., -74.0060"
                  step="0.0001"
                />
              </div>
            </div>

            {/* Monitoring Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Monitoring Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={`Alert Threshold (${type === 'exchange' ? 'ms' : '%'})`}
                  type="number"
                  value={formData.alertThreshold || ''}
                  onChange={(e) => handleInputChange('alertThreshold', parseInt(e.target.value) || 0)}
                  min="1"
                  max={type === 'exchange' ? '1000' : '100'}
                />
                
                <div className="flex items-center space-x-3 pt-6">
                  <Checkbox
                    label={type === 'exchange' ? 'Enable Monitoring' : 'Active Status'}
                    checked={type === 'exchange' ? formData.monitoring : formData.active}
                    onChange={(e) => handleInputChange(
                      type === 'exchange' ? 'monitoring' : 'active', 
                      e.target.checked
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
            className="neon-glow"
          >
            {item ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;