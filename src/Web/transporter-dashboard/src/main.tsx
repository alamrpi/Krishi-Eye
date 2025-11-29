import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import { NetworkStatusIndicator } from './hooks/useNetworkStatus'
import './index.css'
import App from './App.tsx'

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <NetworkStatusIndicator />
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: 'font-medium',
                        duration: 4000,
                    }}
                />
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>,
)
