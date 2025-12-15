import React from "react";

export const GoogleMap = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="google-map">{children}</div>
);

export const Marker = () => <div data-testid="marker" />;

export const StandaloneSearchBox = ({
  children,
  onPlacesChanged,
}: {
  children: React.ReactNode;
  onPlacesChanged?: () => void;
}) => (
  <div
    data-testid="search-box"
    onClick={() => onPlacesChanged?.()}
  >
    {children}
  </div>
);

export const LoadScript = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

// eslint-disable-next-line react-refresh/only-export-components
export const useJsApiLoader = () => ({
  isLoaded: true,
  loadError: undefined,
});