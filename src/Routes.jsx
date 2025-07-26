import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import MainDashboard3dGlobeMonitoring from "pages/main-dashboard-3d-globe-monitoring";
import HistoricalLatencyAnalytics from "pages/historical-latency-analytics";
import NetworkTopologyVisualization from "pages/network-topology-visualization";
import PerformanceMetricsDashboard from "pages/performance-metrics-dashboard";
import ExchangeAndProviderManagement from "pages/exchange-and-provider-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<MainDashboard3dGlobeMonitoring />} />
        <Route path="/main-dashboard-3d-globe-monitoring" element={<MainDashboard3dGlobeMonitoring />} />
        <Route path="/historical-latency-analytics" element={<HistoricalLatencyAnalytics />} />
        <Route path="/network-topology-visualization" element={<NetworkTopologyVisualization />} />
        <Route path="/performance-metrics-dashboard" element={<PerformanceMetricsDashboard />} />
        <Route path="/exchange-and-provider-management" element={<ExchangeAndProviderManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;