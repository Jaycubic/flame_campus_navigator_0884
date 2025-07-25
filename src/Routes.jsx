import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import CampusMapLoading from "pages/campus-map-loading";
import LocationPermissionSetup from "pages/location-permission-setup";
import GpsSignalLost from "pages/gps-signal-lost";
import NavigationActiveMode from "pages/navigation-active-mode";
import CampusMapNavigation from "pages/campus-map-navigation";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<CampusMapLoading />} />
        <Route path="/campus-map-loading" element={<CampusMapLoading />} />
        <Route path="/location-permission-setup" element={<LocationPermissionSetup />} />
        <Route path="/gps-signal-lost" element={<GpsSignalLost />} />
        <Route path="/navigation-active-mode" element={<NavigationActiveMode />} />
        <Route path="/campus-map-navigation" element={<CampusMapNavigation />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;