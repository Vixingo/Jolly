import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // Check localStorage to see if this is the first visit ever
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    return localStorage.getItem('hasVisitedBefore') !== 'true';
  });
  const location = useLocation();

  // Handle initial page load
  useEffect(() => {
    if (isFirstLoad) {
      // Show preloader for initial page load
      setIsLoading(true);
      // Add loading class to body to prevent scrolling
      document.body.classList.add('loading');
      
      // Wait for the page to fully load
      const handleLoad = () => {
        // Add a slight delay to ensure content is rendered
        setTimeout(() => {
          setIsLoading(false);
          setIsFirstLoad(false);
          // Remove loading class from body
          document.body.classList.remove('loading');
          // Set flag in localStorage so preloader won't show on future visits
          localStorage.setItem('hasVisitedBefore', 'true');
        }, 1500); // Longer time for initial load
      };
      
      // If document is already loaded, call handleLoad immediately
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    } else {
      // If not first load, make sure content is visible immediately
      setIsLoading(false);
    }
  }, [isFirstLoad]);

  // We don't want to show loading on page navigation, only on first visit
  // This effect is intentionally empty to override the previous implementation
  useEffect(() => {
    // No loading indicator for subsequent navigation
    // This is intentionally left empty
  }, [location.pathname, isFirstLoad]);

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