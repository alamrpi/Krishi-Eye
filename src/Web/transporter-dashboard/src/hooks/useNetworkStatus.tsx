import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { WifiIcon } from '@heroicons/react/24/outline'

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            toast.success('Internet connection restored', {
                icon: '🟢',
                duration: 3000,
            })
        }

        const handleOffline = () => {
            setIsOnline(false)
            toast.error('No internet connection', {
                icon: '🔴',
                duration: Infinity, // Stay until online
            })
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return isOnline
}

export const NetworkStatusIndicator = () => {
    const isOnline = useNetworkStatus()

    if (isOnline) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <WifiIcon className="h-5 w-5" />
                <span>No Internet Connection - Some features may not work</span>
            </div>
        </div>
    )
}
