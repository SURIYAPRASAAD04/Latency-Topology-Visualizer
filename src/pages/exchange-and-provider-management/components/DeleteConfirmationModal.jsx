import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  item, 
  type,
  isMultiple = false,
  count = 0
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Confirm Deletion
            </h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {isMultiple ? (
              <div>
                <p className="text-foreground mb-2">
                  Are you sure you want to delete {count} selected {type}s?
                </p>
                <div className="bg-muted/30 rounded-lg p-3 border border-border">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Info" size={16} />
                    <span>
                      All monitoring data and configurations for these {type}s will be permanently removed.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-foreground mb-2">
                  Are you sure you want to delete this {type}?
                </p>
                
                {item && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon 
                          name={type === 'exchange' ? 'TrendingUp' : 'Server'} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {type === 'exchange' ? item.location : item.region}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-error/10 rounded-lg p-3 border border-error/30">
                  <div className="flex items-start space-x-2 text-sm">
                    <Icon name="AlertTriangle" size={16} className="text-error mt-0.5 flex-shrink-0" />
                    <div className="text-error">
                      <div className="font-medium mb-1">Warning:</div>
                      <ul className="space-y-1 text-xs">
                        <li>• All historical monitoring data will be lost</li>
                        <li>• API configurations will be permanently removed</li>
                        <li>• Active connections will be terminated</li>
                        {type === 'exchange' && <li>• Trading latency data will be deleted</li>}
                        {type === 'provider' && <li>• Server capacity metrics will be removed</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isDeleting}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;