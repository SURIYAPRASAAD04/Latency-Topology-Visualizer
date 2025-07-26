import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';

import ExchangeTable from './components/ExchangeTable';
import ProviderTable from './components/ProviderTable';
import ActionBar from './components/ActionBar';
import ConfigurationPanel from './components/ConfigurationPanel';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import StatsCards from './components/StatsCards';

const ExchangeAndProviderManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('exchanges');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExchanges, setSelectedExchanges] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);

  // Mock data for exchanges
  const [exchanges, setExchanges] = useState([
    {
      id: 'binance-1',
      name: 'Binance',
      symbol: 'BNB',
      logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center',
      location: 'Singapore, SG',
      apiStatus: 'connected',
      lastUpdate: new Date(Date.now() - 300000),
      monitoring: true,
      apiKey: '***************',
      apiSecret: '***************',
      alertThreshold: 50,
      coordinates: { lat: '1.3521', lng: '103.8198' }
    },
    {
      id: 'coinbase-1',
      name: 'Coinbase Pro',
      symbol: 'COIN',
      logo: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=100&h=100&fit=crop&crop=center',
      location: 'New York, US',
      apiStatus: 'connected',
      lastUpdate: new Date(Date.now() - 180000),
      monitoring: true,
      apiKey: '***************',
      apiSecret: '***************',
      alertThreshold: 75,
      coordinates: { lat: '40.7128', lng: '-74.0060' }
    },
    {
      id: 'kraken-1',
      name: 'Kraken',
      symbol: 'KRK',
      logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=center',
      location: 'London, UK',
      apiStatus: 'warning',
      lastUpdate: new Date(Date.now() - 900000),
      monitoring: true,
      apiKey: '***************',
      apiSecret: '***************',
      alertThreshold: 100,
      coordinates: { lat: '51.5074', lng: '-0.1278' }
    },
    {
      id: 'ftx-1',
      name: 'FTX',
      symbol: 'FTT',
      logo: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=100&h=100&fit=crop&crop=center',
      location: 'Tokyo, JP',
      apiStatus: 'error',
      lastUpdate: new Date(Date.now() - 3600000),
      monitoring: false,
      apiKey: '***************',
      apiSecret: '***************',
      alertThreshold: 60,
      coordinates: { lat: '35.6762', lng: '139.6503' }
    },
    {
      id: 'okx-1',
      name: 'OKX',
      symbol: 'OKB',
      logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center',
      location: 'Frankfurt, DE',
      apiStatus: 'connected',
      lastUpdate: new Date(Date.now() - 120000),
      monitoring: true,
      apiKey: '***************',
      apiSecret: '***************',
      alertThreshold: 80,
      coordinates: { lat: '50.1109', lng: '8.6821' }
    }
  ]);

  // Mock data for providers
  const [providers, setProviders] = useState([
    {
      id: 'aws-us-east-1',
      name: 'Amazon Web Services',
      type: 'aws',
      logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center',
      region: 'us-east-1',
      serverCount: 1250,
      capacity: 2500,
      capacityUnit: 'TB',
      health: 98,
      active: true,
      alertThreshold: 95,
      coordinates: { lat: '39.0458', lng: '-77.5081' }
    },
    {
      id: 'gcp-us-central1',
      name: 'Google Cloud Platform',
      type: 'gcp',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center',
      region: 'us-central1',
      serverCount: 890,
      capacity: 1800,
      capacityUnit: 'TB',
      health: 96,
      active: true,
      alertThreshold: 90,
      coordinates: { lat: '41.2619', lng: '-95.8608' }
    },
    {
      id: 'azure-eastus',
      name: 'Microsoft Azure',
      type: 'azure',
      logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=center',
      region: 'eastus',
      serverCount: 675,
      capacity: 1200,
      capacityUnit: 'TB',
      health: 94,
      active: true,
      alertThreshold: 92,
      coordinates: { lat: '37.3719', lng: '-79.8164' }
    },
    {
      id: 'aws-eu-west-1',
      name: 'Amazon Web Services',
      type: 'aws',
      logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center',
      region: 'eu-west-1',
      serverCount: 1100,
      capacity: 2200,
      capacityUnit: 'TB',
      health: 97,
      active: true,
      alertThreshold: 95,
      coordinates: { lat: '53.3498', lng: '-6.2603' }
    },
    {
      id: 'digitalocean-nyc3',
      name: 'DigitalOcean',
      type: 'digital-ocean',
      logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop&crop=center',
      region: 'nyc3',
      serverCount: 320,
      capacity: 640,
      capacityUnit: 'TB',
      health: 89,
      active: false,
      alertThreshold: 85,
      coordinates: { lat: '40.7589', lng: '-73.9851' }
    }
  ]);

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedExchanges([]);
    setSelectedProviders([]);
  };

  const handleExchangeSelect = (exchangeId) => {
    setSelectedExchanges(prev =>
      prev.includes(exchangeId)
        ? prev.filter(id => id !== exchangeId)
        : [...prev, exchangeId]
    );
  };

  const handleExchangeSelectAll = () => {
    if (selectedExchanges.length === filteredExchanges.length) {
      setSelectedExchanges([]);
    } else {
      setSelectedExchanges(filteredExchanges.map(e => e.id));
    }
  };

  const handleProviderSelect = (providerId) => {
    setSelectedProviders(prev =>
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleProviderSelectAll = () => {
    if (selectedProviders.length === filteredProviders.length) {
      setSelectedProviders([]);
    } else {
      setSelectedProviders(filteredProviders.map(p => p.id));
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setConfigPanelOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setConfigPanelOpen(true);
  };

  const handleDelete = (itemId) => {
    const item = activeTab === 'exchanges' 
      ? exchanges.find(e => e.id === itemId)
      : providers.find(p => p.id === itemId);
    
    setDeletingItem(item);
    setIsMultipleDelete(false);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    const selectedItems = activeTab === 'exchanges' ? selectedExchanges : selectedProviders;
    if (selectedItems.length === 0) return;
    
    setDeletingItem(null);
    setIsMultipleDelete(true);
    setDeleteModalOpen(true);
  };

  const handleToggleStatus = (itemId) => {
    if (activeTab === 'exchanges') {
      setExchanges(prev => prev.map(exchange =>
        exchange.id === itemId
          ? { ...exchange, monitoring: !exchange.monitoring }
          : exchange
      ));
    } else {
      setProviders(prev => prev.map(provider =>
        provider.id === itemId
          ? { ...provider, active: !provider.active }
          : provider
      ));
    }
  };

  const handleBulkToggle = () => {
    const selectedItems = activeTab === 'exchanges' ? selectedExchanges : selectedProviders;
    
    if (activeTab === 'exchanges') {
      setExchanges(prev => prev.map(exchange =>
        selectedItems.includes(exchange.id)
          ? { ...exchange, monitoring: !exchange.monitoring }
          : exchange
      ));
    } else {
      setProviders(prev => prev.map(provider =>
        selectedItems.includes(provider.id)
          ? { ...provider, active: !provider.active }
          : provider
      ));
    }
  };

  const handleSave = (formData) => {
    if (editingItem) {
      // Update existing item
      if (activeTab === 'exchanges') {
        setExchanges(prev => prev.map(exchange =>
          exchange.id === editingItem.id
            ? { ...exchange, ...formData, lastUpdate: new Date() }
            : exchange
        ));
      } else {
        setProviders(prev => prev.map(provider =>
          provider.id === editingItem.id
            ? { ...provider, ...formData }
            : provider
        ));
      }
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: `${activeTab === 'exchanges' ? 'exchange' : 'provider'}-${Date.now()}`,
        ...(activeTab === 'exchanges' ? {
          apiStatus: 'connected',
          lastUpdate: new Date(),
          logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center'
        } : {
          health: 95,
          logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop&crop=center'
        })
      };

      if (activeTab === 'exchanges') {
        setExchanges(prev => [...prev, newItem]);
      } else {
        setProviders(prev => [...prev, newItem]);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (isMultipleDelete) {
      const selectedItems = activeTab === 'exchanges' ? selectedExchanges : selectedProviders;
      
      if (activeTab === 'exchanges') {
        setExchanges(prev => prev.filter(exchange => !selectedItems.includes(exchange.id)));
        setSelectedExchanges([]);
      } else {
        setProviders(prev => prev.filter(provider => !selectedItems.includes(provider.id)));
        setSelectedProviders([]);
      }
    } else if (deletingItem) {
      if (activeTab === 'exchanges') {
        setExchanges(prev => prev.filter(exchange => exchange.id !== deletingItem.id));
      } else {
        setProviders(prev => prev.filter(provider => provider.id !== deletingItem.id));
      }
    }
  };

  const handleImport = () => {
    // Simulate CSV import
    console.log('Importing CSV data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Exchange & Provider Management - Latency Topology Visualizer</title>
        <meta name="description" content="Manage cryptocurrency exchanges and cloud provider configurations for latency monitoring" />
      </Helmet>

      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />

      <main className={`
        transition-all duration-300 pt-header
        ${sidebarCollapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar'}
      `}>
        <div className="p-6">
         

          {/* Page Header */}
          <div className="mb-8 pt-4">
            <h1 className="text-3xl font-bold text-foreground font-inter mb-2">
              Exchange & Provider Management
            </h1>
            <p className="text-muted-foreground font-inter">
              Configure and manage cryptocurrency exchanges and cloud provider settings for latency monitoring
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards exchanges={exchanges} providers={providers} />

          {/* Tab Navigation */}
          <div className="bg-card rounded-lg border border-border mb-6">
            <div className="flex border-b border-border">
              <button
                onClick={() => handleTabChange('exchanges')}
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === 'exchanges' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="TrendingUp" size={16} />
                <span>Exchanges</span>
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {exchanges.length}
                </span>
              </button>
              
              <button
                onClick={() => handleTabChange('providers')}
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === 'providers' ?'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="Server" size={16} />
                <span>Cloud Providers</span>
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {providers.length}
                </span>
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <ActionBar
            title={activeTab === 'exchanges' ? 'Exchanges' : 'Cloud Providers'}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCount={activeTab === 'exchanges' ? selectedExchanges.length : selectedProviders.length}
            onAdd={handleAdd}
            onImport={handleImport}
            onBulkDelete={handleBulkDelete}
            onBulkToggle={handleBulkToggle}
            showBulkActions={
              (activeTab === 'exchanges' && selectedExchanges.length > 0) ||
              (activeTab === 'providers' && selectedProviders.length > 0)
            }
          />

          {/* Content Tables */}
          {activeTab === 'exchanges' ? (
            <ExchangeTable
              exchanges={filteredExchanges}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              selectedItems={selectedExchanges}
              onSelectItem={handleExchangeSelect}
              onSelectAll={handleExchangeSelectAll}
            />
          ) : (
            <ProviderTable
              providers={filteredProviders}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              selectedItems={selectedProviders}
              onSelectItem={handleProviderSelect}
              onSelectAll={handleProviderSelectAll}
            />
          )}
        </div>
      </main>

      {/* Configuration Panel */}
      <ConfigurationPanel
        isOpen={configPanelOpen}
        onClose={() => setConfigPanelOpen(false)}
        item={editingItem}
        type={activeTab === 'exchanges' ? 'exchange' : 'provider'}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        item={deletingItem}
        type={activeTab === 'exchanges' ? 'exchange' : 'provider'}
        isMultiple={isMultipleDelete}
        count={activeTab === 'exchanges' ? selectedExchanges.length : selectedProviders.length}
      />
    </div>
  );
};

export default ExchangeAndProviderManagement;