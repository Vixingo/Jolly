import React, { Suspense, lazy } from 'react';

// Example of how to lazy load heavy components
const EventTrackingExample = lazy(() => import('./EventTrackingExample'));

// Loading fallback for heavy components
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm text-muted-foreground">Loading component...</span>
  </div>
);

// Example usage in a page or component
export const LazyEventTrackingPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Event Tracking Demo</h1>
      
      <Suspense fallback={<ComponentLoader />}>
        <EventTrackingExample />
      </Suspense>
    </div>
  );
};

// Example of conditional lazy loading
export const ConditionalLazyComponent: React.FC<{ showTracking: boolean }> = ({ showTracking }) => {
  return (
    <div>
      <h2>Main Content</h2>
      
      {showTracking && (
        <Suspense fallback={<ComponentLoader />}>
          <EventTrackingExample />
        </Suspense>
      )}
    </div>
  );
};

export default LazyEventTrackingPage;