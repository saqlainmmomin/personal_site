import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from '@/pages/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)

void import('./fight/launch') // tiny lazy chunk: adds the stickman to the nav on desktop; the game itself loads on click
