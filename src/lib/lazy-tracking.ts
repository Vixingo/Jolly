/**
 * Lazy loading utility for tracking scripts (GTM, etc.)
 * Defers initialization until user interaction to improve LCP
 */

import { initializeGTM } from './gtm-tracking';
import { initFacebookPixel } from '../components/FacebookPixel';

// Global flags to track initialization
let isTrackingInitialized = false;
let isInitializing = false;

// Events that trigger lazy loading
const TRIGGER_EVENTS = [
  'click',
  'scroll',
  'keydown',
  'mousemove',
  'touchstart'
];

/**
 * Initialize all tracking scripts lazily
 */
export async function initializeLazyTracking(): Promise<void> {
  // Prevent multiple initializations
  if (isTrackingInitialized || isInitializing) {
    return;
  }

  isInitializing = true;

  try {
    console.log('Initializing lazy tracking scripts...');

    // Initialize GTM
    const gtmSuccess = await initializeGTM();
    if (gtmSuccess) {
      console.log('GTM initialized successfully');
    }

    // Initialize Facebook Pixel
    if (typeof initFacebookPixel === 'function') {
      initFacebookPixel();
      console.log('Facebook Pixel initialized successfully');
    }

    isTrackingInitialized = true;
    console.log('All tracking scripts initialized');
  } catch (error) {
    console.error('Error initializing tracking scripts:', error);
  } finally {
    isInitializing = false;
  }
}

/**
 * Set up lazy loading listeners
 */
export function setupLazyTrackingListeners(): void {
  if (typeof window === 'undefined' || isTrackingInitialized) {
    return;
  }

  const handleUserInteraction = () => {
    // Remove all listeners after first interaction
    TRIGGER_EVENTS.forEach(event => {
      document.removeEventListener(event, handleUserInteraction, { passive: true } as any);
    });

    // Initialize tracking with a small delay to not block the interaction
    setTimeout(() => {
      initializeLazyTracking();
    }, 100);
  };

  // Add listeners for user interactions
  TRIGGER_EVENTS.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { passive: true } as any);
  });

  // Fallback: initialize after 10 seconds if no interaction
  setTimeout(() => {
    if (!isTrackingInitialized) {
      console.log('Fallback: Initializing tracking after timeout');
      initializeLazyTracking();
    }
  }, 10000);

  console.log('Lazy tracking listeners set up');
}

/**
 * Force initialize tracking (for admin actions or critical events)
 */
export async function forceInitializeTracking(): Promise<void> {
  await initializeLazyTracking();
}

/**
 * Check if tracking is initialized
 */
export function isTrackingReady(): boolean {
  return isTrackingInitialized;
}