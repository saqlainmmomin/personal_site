import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import YozoraPage from './YozoraPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YozoraPage />
  </StrictMode>,
)
