import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { checkFacebookSettings } from '../lib/facebook-settings-check';

declare global {
  interface Window {
    fbq: any;
  }
}

// Initialize Facebook Pixel
const initFacebookPixel = async () => {
  try {
    console.log('Initializing Facebook Pixel...');
    const { isConfigured, settings, error } = await checkFacebookSettings();
    console.log('Facebook settings check result:', { isConfigured, settings, error });
    
    if (!isConfigured || !settings) {
      console.warn(`Facebook Pixel not initialized: ${error || 'Unknown error'}`);
      return;
    }

    const { fb_pixel_id: pixel_id } = settings;
    console.log('Using Facebook Pixel ID:', pixel_id);

    // Initialize Facebook Pixel
    if (!(window as any).fbq) {
      const f = window;
      const b = document;
      const e = 'script';
      const v = 'https://connect.facebook.net/en_US/fbevents.js';
      
      (window as any).fbq = function() {
        const fbq = (window as any).fbq;
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      
      if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq;
      (window as any).fbq.push = (window as any).fbq;
      (window as any).fbq.loaded = true;
      (window as any).fbq.version = '2.0';
      (window as any).fbq.queue = [];
      
      const scriptElement = b.createElement(e);
      scriptElement.async = true;
      scriptElement.src = v;
      
      const firstScript = b.getElementsByTagName(e)[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(scriptElement, firstScript);
      }
    }

    // Initialize with pixel ID
    window.fbq('init', pixel_id);
    
    // Log PageView event
    window.fbq('track', 'PageView');
    
    console.log('Facebook Pixel initialized with ID:', pixel_id);
  } catch (error) {
    console.error('Error initializing Facebook Pixel:', error);
  }
};

const FacebookPixel: React.FC = () => {
  const location = useLocation();

  // Initialize Facebook Pixel on component mount
  useEffect(() => {
    initFacebookPixel();
  }, []);

  // Track page views when route changes
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
      console.log('Tracked PageView on route change');
    } else {
      console.warn('Facebook Pixel not initialized, cannot track PageView');
    }
  }, [location]);

  // Create noscript element for Facebook Pixel
  useEffect(() => {
    const createNoScriptElement = async () => {
      const { isConfigured, settings } = await checkFacebookSettings();
      if (!isConfigured || !settings || !settings.fb_pixel_id) return;
      
      const pixelId = settings.fb_pixel_id;
      
      // Create noscript element
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
      
      noscript.appendChild(img);
      document.body.appendChild(noscript);
      
      console.log('Added Facebook Pixel noscript tag with ID:', pixelId);
    };
    
    createNoScriptElement();
  }, []);

  return null; // This component doesn't render anything
};

export default FacebookPixel;