import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const useSignalR = (latitude?: number, longitude?: number, radiusKm: number = 50) => {
    const [connection, setConnection] = useState<HubConnection | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const connectionRef = useRef<HubConnection | null>(null)

    useEffect(() => {
        // Only connect if we have location
        if (!latitude || !longitude) return

        const token = localStorage.getItem('auth_token')
        if (!token) return

        // Create connection
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/hubs/transport`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build()

        connectionRef.current = newConnection
        setConnection(newConnection)

        // Start connection
        const startConnection = async () => {
            try {
                await newConnection.start()
                console.log('SignalR Connected!')
                setIsConnected(true)

                // Subscribe to nearby requests
                await newConnection.invoke('SubscribeToNearbyRequests', latitude, longitude, radiusKm)
                console.log(`Subscribed to nearby requests (${radiusKm}km radius)`)
            } catch (error) {
                console.error('SignalR Connection Error:', error)
                setIsConnected(false)
            }
        }

        startConnection()

        // Cleanup on unmount
        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop()
            }
        }
    }, [latitude, longitude, radiusKm])

    return { connection, isConnected }
}

// Hook for listening to new requests
export const useNewRequestNotifications = (
    connection: HubConnection | null,
    onNewRequest?: (data: any) => void
) => {
    useEffect(() => {
        if (!connection) return

        const handleNewRequest = (data: any) => {
            console.log('New Request Available:', data)

            // Show toast notification
            toast.success(
                `New Request: ${data.goodsType} (${data.weight}kg)\n${data.pickupLocation.district} → ${data.deliveryLocation.district}`,
                { duration: 5000 }
            )

            // Call callback if provided
            if (onNewRequest) {
                onNewRequest(data)
            }
        }

        connection.on('NewRequestAvailable', handleNewRequest)

        return () => {
            connection.off('NewRequestAvailable', handleNewRequest)
        }
    }, [connection, onNewRequest])
}

// Hook for listening to bid status updates
export const useBidStatusNotifications = (
    connection: HubConnection | null,
    onBidStatusUpdate?: (data: any) => void
) => {
    useEffect(() => {
        if (!connection) return

        const handleBidStatus = (data: any) => {
            console.log('Bid Status Updated:', data)

            // Show toast based on status
            if (data.status === 'Accepted') {
                toast.success(`Bid Accepted! ৳${data.bidAmount}`, { duration: 5000 })
            } else if (data.status === 'Rejected') {
                toast.error(`Bid Rejected`, { duration: 4000 })
            }

            // Call callback if provided
            if (onBidStatusUpdate) {
                onBidStatusUpdate(data)
            }
        }

        connection.on('BidStatusUpdated', handleBidStatus)

        return () => {
            connection.off('BidStatusUpdated', handleBidStatus)
        }
    }, [connection, onBidStatusUpdate])
}
