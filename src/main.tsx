import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupLazyTrackingListeners } from './lib/lazy-tracking'

// Set up lazy loading for tracking scripts
setupLazyTrackingListeners();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
