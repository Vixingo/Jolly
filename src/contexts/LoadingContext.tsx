import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStoreSettings } from './StoreSettingsContext';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// We need to create a separate component for the actual provider to use the useStoreSettings hook
const LoadingProviderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Since store settings load synchronously now, we can show content immediately
  const [isLoading, setIsLoading] = useState(false);
  // Check localStorage to see if this is the first visit ever
  const isFirstLoad = useState(() => {
    return localStorage.getItem('hasVisitedBefore') !== 'true';
  });
  const location = useLocation();
  
  // Get store settings loading state (should always be false now)
  const { isLoading: isStoreSettingsLoading } = useStoreSettings();

  // Handle initial page load - minimal loading for better LCP
  useEffect(() => {
    // Store settings load synchronously now, so no need to wait
    if (isStoreSettingsLoading) {
      setIsLoading(true);
      document.body.classList.add('loading');
      return;
    }
    
    // Show content immediately for better LCP
    setIsLoading(false);
    document.body.classList.remove('loading');
    
    // Mark as visited for future loads
    if (isFirstLoad) {
      // Defer this to avoid blocking render
      setTimeout(() => {
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 100);
    }
    
    // Optional: Very brief loading for first-time visitors only
    if (isFirstLoad) {
      const handleLoad = () => {
        // Minimal delay for smooth transition
        setTimeout(() => {
          // Content is already visible, no need to change loading state
        }, 500); // Minimal delay for smooth UX
      };
      
      // Always show content immediately for better LCP
      handleLoad();
    }
  }, [isFirstLoad, isStoreSettingsLoading]);

  // No loading on navigation for better performance
  useEffect(() => {
    // Keep content visible during navigation
    setIsLoading(false);
    document.body.classList.remove('loading');
  }, [location.pathname]);

  const value = {
    isLoading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Wrapper provider that doesn't use hooks
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <LoadingProviderContent>{children}</LoadingProviderContent>;
};