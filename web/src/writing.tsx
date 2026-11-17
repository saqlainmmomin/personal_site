import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Writing from '@/pages/Writing'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Writing />
  </StrictMode>,
)
