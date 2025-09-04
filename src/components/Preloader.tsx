import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useStoreSettings } from '../contexts/StoreSettingsContext';

interface PreloaderProps {
  isLoading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading }) => {
  const [show, setShow] = useState(isLoading);
  const [initialLoad, setInitialLoad] = useState(true);
  const { isLoading: isStoreSettingsLoading } = useStoreSettings();
  
  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      // Add a small delay before hiding to allow for exit animation
      const timer = setTimeout(() => {
        setShow(false);
        setInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999] transition-opacity duration-300 ${isLoading ? 'preloader-enter-active' : 'preloader-exit-active'}`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="relative preloader-pulse mb-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-t-2 border-primary animate-ping opacity-20"></div>
        </div>
        <p className="text-xl text-primary font-medium">
          {isStoreSettingsLoading ? 'Loading store settings...' : 
           initialLoad ? 'Welcome, loading your experience...' : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default Preloader;