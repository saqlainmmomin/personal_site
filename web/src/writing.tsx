import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Writing from '@/pages/Writing'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Writing />
  </StrictMode>,
)

void import('./fight/launch') // the stickman in the nav, as on the homepage
