import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = ({ onExport, isExporting }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportRange, setExportRange] = useState('current');
  const [isHovered, setIsHovered] = useState(false);
  const exportFormats = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values', icon: 'FileText' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation', icon: 'Code' },
    { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel format', icon: 'FileSpreadsheet' }
  ];

  const exportRanges = [
    { value: 'current', label: 'Current View', description: 'Export currently displayed data' },
    { value: 'all', label: 'All Data', description: 'Export complete dataset' },
    { value: 'custom', label: 'Custom Range', description: 'Select specific time range' }
  ];

  const handleExport = () => {
    const exportConfig = {
      format: exportFormat,
      range: exportRange,
      timestamp: new Date().toISOString(),
      filename: `latency-analytics-${exportRange}-${new Date().toISOString().split('T')[0]}.${exportFormat}`
    };
    
    onExport(exportConfig);
  };

  return (
   <div 
      className="relative rounded-2xl backdrop-blur-md border border-white/20 overflow-hidden bg-black/40 hover:bg-black/50 transition-all duration-500 group"
    >
      
      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Header with Enhanced Styling */}
        <div className="relative mb-6 p-4 rounded-xl overflow-hidden">
          {/* Header Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-green-800/70 to-teal-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/30 to-teal-500/20"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-poppins tracking-tight drop-shadow-lg">
                Export Data
              </h3>
              <p className="text-green-200/80 text-sm mt-1">
                Download analytics in your preferred format
              </p>
            </div>
            <div className={`p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
              <Icon name="Download" size={24} className="text-green-400" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Format Selection
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {exportFormats.map((format, index) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={`
                    group/format relative flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 overflow-hidden
                    ${exportFormat === format.value
                      ? 'border-green-400/50 bg-green-500/10 text-green-300 shadow-lg shadow-green-500/20' 
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-green-400/30 hover:bg-white/10'
                    }
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Background Gradient for Selected */}
                  {exportFormat === format.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-teal-500/20"></div>
                  )}
                  
                  <div className="relative z-10 flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                      exportFormat === format.value 
                        ? 'bg-green-500/20 border-green-400/50' 
                        : 'bg-white/10 border-white/20 group-hover/format:bg-white/20'
                    }`}>
                      <Icon name={format.icon} size={18} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold">{format.label}</div>
                      <div className="text-xs opacity-70">{format.description}</div>
                    </div>
                    {exportFormat === format.value && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Check" size={16} className="text-green-400" />
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

 


          {/* Enhanced Export Button */}
          <div className="relative">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`
                w-full relative overflow-hidden rounded-xl p-4 font-semibold text-white transition-all duration-500 group/btn
                ${isExporting 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 active:scale-[0.98] shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
                }
              `}
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Preparing Export...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Download" size={18} />
                    <span>Export {exportFormat.toUpperCase()}</span>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  </>
                )}
              </div>
            </button>
          </div>

         
        </div>
      </div>

      {/* Subtle Border Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ExportPanel;