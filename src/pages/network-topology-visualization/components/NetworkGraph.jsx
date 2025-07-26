import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import Icon from '../../../components/AppIcon';

const NetworkGraph = ({ 
  selectedFilters, 
  selectedNode, 
  onNodeSelect, 
  viewMode,
  showLatencyHeatmap,
  showTrafficVolume,
  showConnectionHealth 
}) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [simulation, setSimulation] = useState(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);


  const networkData = {
    nodes: [
      // Exchanges (larger nodes)
      {
        id: 'binance-us',
        type: 'exchange',
        name: 'Binance US',
        region: 'us-east-1',
        capacity: 95,
        status: 'online',
        coordinates: { x: 200, y: 150 },
        connections: 8,
        avgLatency: 12
      },
      {
        id: 'coinbase-pro',
        type: 'exchange',
        name: 'Coinbase Pro',
        region: 'us-west-2',
        capacity: 88,
        status: 'online',
        coordinates: { x: 150, y: 200 },
        connections: 6,
        avgLatency: 15
      },
      {
        id: 'kraken',
        type: 'exchange',
        name: 'Kraken',
        region: 'eu-west-1',
        capacity: 82,
        status: 'warning',
        coordinates: { x: 400, y: 180 },
        connections: 5,
        avgLatency: 28
      },
      {
        id: 'ftx',
        type: 'exchange',
        name: 'FTX',
        region: 'ap-southeast-1',
        capacity: 0,
        status: 'offline',
        coordinates: { x: 600, y: 250 },
        connections: 0,
        avgLatency: 999
      },
      // Cloud Provider Regions
      {
        id: 'aws-us-east-1',
        type: 'provider',
        name: 'AWS US East 1',
        provider: 'aws',
        region: 'us-east-1',
        serverCount: 24,
        capacity: 92,
        status: 'online',
        coordinates: { x: 180, y: 120 },
        avgLatency: 8
      },
      {
        id: 'aws-us-west-2',
        type: 'provider',
        name: 'AWS US West 2',
        provider: 'aws',
        region: 'us-west-2',
        serverCount: 18,
        capacity: 87,
        status: 'online',
        coordinates: { x: 120, y: 180 },
        avgLatency: 11
      },
      {
        id: 'gcp-eu-west-1',
        type: 'provider',
        name: 'GCP Europe West 1',
        provider: 'gcp',
        region: 'eu-west-1',
        serverCount: 16,
        capacity: 78,
        status: 'online',
        coordinates: { x: 380, y: 150 },
        avgLatency: 22
      },
      {
        id: 'azure-ap-southeast-1',
        type: 'provider',
        name: 'Azure Asia Pacific',
        provider: 'azure',
        region: 'ap-southeast-1',
        serverCount: 12,
        capacity: 65,
        status: 'warning',
        coordinates: { x: 580, y: 220 },
        avgLatency: 35
      }
    ],
    links: [
      {
        source: 'binance-us',
        target: 'aws-us-east-1',
        latency: 12,
        bandwidth: 95,
        packetLoss: 0.1,
        jitter: 2.1,
        status: 'healthy'
      },
      {
        source: 'binance-us',
        target: 'gcp-eu-west-1',
        latency: 85,
        bandwidth: 78,
        packetLoss: 0.3,
        jitter: 4.2,
        status: 'healthy'
      },
      {
        source: 'coinbase-pro',
        target: 'aws-us-west-2',
        latency: 15,
        bandwidth: 88,
        packetLoss: 0.2,
        jitter: 1.8,
        status: 'healthy'
      },
      {
        source: 'coinbase-pro',
        target: 'azure-ap-southeast-1',
        latency: 125,
        bandwidth: 65,
        packetLoss: 0.8,
        jitter: 8.5,
        status: 'degraded'
      },
      {
        source: 'kraken',
        target: 'gcp-eu-west-1',
        latency: 28,
        bandwidth: 82,
        packetLoss: 0.4,
        jitter: 3.2,
        status: 'healthy'
      },
      {
        source: 'kraken',
        target: 'aws-us-east-1',
        latency: 95,
        bandwidth: 72,
        packetLoss: 0.6,
        jitter: 5.8,
        status: 'warning'
      }
    ]
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'aws': return '#FF9900';
      case 'gcp': return '#4285F4';
      case 'azure': return '#0078D4';
      default: return 'var(--color-primary)';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'offline': return 'var(--color-error)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  const initializeSimulation = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

  
    svg.selectAll('*').remove();

    // Create main group for zoom/pan
    const g = svg.append('g').attr('class', 'main-group');

    // Create simulation
    const sim = d3.forceSimulation(networkData.nodes)
      .force('link', d3.forceLink(networkData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.type === 'exchange' ? 35 : 25));

    // Create links
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(networkData.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', d => {
        if (showConnectionHealth) {
          return d.status === 'healthy' ? 'var(--color-success)' : 
                 d.status === 'warning' ? 'var(--color-warning)' : 'var(--color-error)';
        }
        return 'var(--color-border)';
      })
      .attr('stroke-width', d => showTrafficVolume ? Math.max(1, d.bandwidth / 20) : 2)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(networkData.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => d.type === 'exchange' ? 20 + (d.capacity / 10) : 15 + (d.serverCount / 3))
      .attr('fill', d => {
        if (d.type === 'exchange') {
          return getStatusColor(d.status);
        }
        return getProviderColor(d.provider);
      })
      .attr('stroke', 'var(--color-background)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        onNodeSelect(d);
      });

    // Add node labels
    const labels = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(networkData.nodes)
      .enter().append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'exchange' ? 35 : 25)
      .attr('fill', 'var(--color-foreground)')
      .attr('font-size', '12px')
      .attr('font-family', 'var(--font-jetbrains-mono)')
      .text(d => d.name);

    // Add latency heatmap overlay if enabled
    if (showLatencyHeatmap) {
      nodes.attr('fill', d => {
        const latency = d.avgLatency;
        if (latency < 20) return 'var(--color-success)';
        if (latency < 50) return 'var(--color-warning)';
        return 'var(--color-error)';
      });
    }

    // Simulation tick function
    sim.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setTransform(event.transform);
      });

    svg.call(zoom);

    setSimulation(sim);

    return () => {
      sim.stop();
    };
  }, [dimensions, showLatencyHeatmap, showTrafficVolume, showConnectionHealth, onNodeSelect]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize simulation when dimensions change
  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  // Handle node selection highlighting
  useEffect(() => {
    if (!svgRef.current || !selectedNode) return;

    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll('.node');
    const links = svg.selectAll('.link');

    // Reset all nodes and links
    nodes.attr('opacity', 0.3);
    links.attr('opacity', 0.1);

    // Highlight selected node and its connections
    nodes.filter(d => d.id === selectedNode.id).attr('opacity', 1);
    
    const connectedNodeIds = networkData.links
      .filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id)
      .map(l => l.source.id === selectedNode.id ? l.target.id : l.source.id);

    nodes.filter(d => connectedNodeIds.includes(d.id)).attr('opacity', 0.8);
    links.filter(d => 
      d.source.id === selectedNode.id || d.target.id === selectedNode.id
    ).attr('opacity', 0.8);

  }, [selectedNode]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom().transform,
      transform.scale(transform.k * 1.5)
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom().transform,
      transform.scale(transform.k / 1.5)
    );
  };

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom().transform,
      d3.zoomIdentity
    );
  };

  return (
    <div className="relative w-full h-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Graph Container */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Icon name="Plus" size={16} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Icon name="Minus" size={16} />
        </button>
        <button
          onClick={handleResetZoom}
          className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Icon name="RotateCcw" size={16} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Exchanges</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF9900' }} />
            <span className="text-xs text-muted-foreground">AWS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4285F4' }} />
            <span className="text-xs text-muted-foreground">GCP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0078D4' }} />
            <span className="text-xs text-muted-foreground">Azure</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!simulation && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Initializing network topology...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;