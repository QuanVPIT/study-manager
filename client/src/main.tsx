import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter watches the URL in the address bar so we can show different pages */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
