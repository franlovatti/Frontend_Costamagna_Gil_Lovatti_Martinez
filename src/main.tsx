import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../bootstrap.css';
import App from './App.tsx'

// Cargar Google Maps API
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.error('ERROR: VITE_GOOGLE_MAPS_API_KEY no está definida en .env');
} else {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
