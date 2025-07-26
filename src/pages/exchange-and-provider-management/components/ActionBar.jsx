import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ActionBar = ({ 
  title, 
  searchQuery, 
  onSearchChange, 
  selectedCount, 
  onAdd, 
  onImport, 
  onBulkDelete, 
  onBulkToggle,
  showBulkActions = false 
}) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      onImport();
    }, 2000);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <h2 className="text-lg font-semibold text-foreground font-inter">
            {title}
          </h2>
          
          <div className="relative w-full sm:w-80">
            <Input
              type="search"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Bulk Actions */}
          {showBulkActions && selectedCount > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-muted/30 rounded-lg border border-border">
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <div className="h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkToggle}
                iconName="ToggleLeft"
                iconPosition="left"
                iconSize={14}
              >
                Toggle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkDelete}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
                className="text-error hover:text-error"
              >
                Delete
              </Button>
            </div>
          )}

          {/* Primary Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleImport}
              loading={isImporting}
              iconName="Upload"
              iconPosition="left"
              iconSize={16}
              className="flex-1 sm:flex-none"
            >
              Import CSV
            </Button>
            
            <Button
              variant="default"
              onClick={onAdd}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              className="flex-1 sm:flex-none neon-glow"
            >
              Add New
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      {searchQuery && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex items-center space-x-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
            <Icon name="Search" size={12} />
            <span>"{searchQuery}"</span>
            <button
              onClick={() => onSearchChange('')}
              className="ml-1 hover:bg-primary/30 rounded-full p-0.5"
            >
              <Icon name="X" size={10} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionBar;