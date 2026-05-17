import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initTheme } from './theme'
import { updateViewportHeight } from './helpers/updateViewportHeight'
import { App } from './App'
import { DEV } from './config'
import './index.css'

const queryClient = new QueryClient()

initTheme()
updateViewportHeight()
window.addEventListener('resize', updateViewportHeight)

createRoot(document.getElementById('root')!).render(
  DEV 
    ? (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    ) : (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>
    )
)
