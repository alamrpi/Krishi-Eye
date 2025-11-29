import apiClient from './client'

// Types
export interface TransportRequest {
    id: string
    requesterId: string
    goodsType: string
    weight: number
    pickupLocation: {
        village: string
        thana: string
        district: string
        division: string
        latitude: number
        longitude: number
    }
    deliveryLocation: {
        village: string
        thana: string
        district: string
        division: string
        latitude: number
        longitude: number
    }
    scheduledPickupTime: string
    paymentMethod: 'Cash' | 'Online'
    status: string
    createdAt: string
}

export interface Bid {
    id: string
    requestId: string
    transporterId: string
    bidAmount: number
    note?: string
    status: 'Pending' | 'Accepted' | 'Rejected'
    submittedAt: string
}

export interface Job {
    id: string
    requestId: string
    status: 'Assigned' | 'InTransit' | 'Completed'
    startedAt?: string
    completedAt?: string
    currentLocation?: {
        latitude: number
        longitude: number
    }
}

// API Service
export const transportApi = {
    // Get nearby transport requests
    getNearbyRequests: async (latitude: number, longitude: number, radiusKm: number = 50) => {
        const response = await apiClient.get('/transport/requests/nearby', {
            params: { latitude, longitude, radiusKm }
        })
        return response.data
    },

    // Get request details
    getRequestDetails: async (requestId: string) => {
        const response = await apiClient.get(`/transport/requests/${requestId}`)
        return response.data
    },

    // Submit a bid
    submitBid: async (data: { requestId: string; bidAmount: number; note?: string; driverId: string; vehicleId: string }) => {
        const response = await apiClient.post('/transport/bids', data)
        return response.data
    },

    // Get my bids
    getMyBids: async () => {
        const response = await apiClient.get('/transport/bids/my-bids')
        return response.data
    },

    // Get bid details
    getBidDetails: async (bidId: string) => {
        const response = await apiClient.get(`/transport/bids/${bidId}`)
        return response.data
    },

    // Start transit
    startTransit: async (requestId: string) => {
        const response = await apiClient.post(`/transport/jobs/${requestId}/start-transit`)
        return response.data
    },

    // Update location
    updateLocation: async (requestId: string, latitude: number, longitude: number) => {
        const response = await apiClient.post(`/transport/jobs/${requestId}/location`, {
            latitude,
            longitude
        })
        return response.data
    },

    // Complete delivery
    completeDelivery: async (requestId: string, markCashReceived: boolean = true) => {
        const response = await apiClient.post(`/transport/jobs/${requestId}/complete`, {
            markCashReceived
        })
        return response.data
    },

    // Get earnings report
    getEarningsReport: async () => {
        const response = await apiClient.get('/transport/transporters/earnings-report')
        return response.data
    },

    // Get transporter profile
    getProfile: async () => {
        const response = await apiClient.get('/transport/transporters/profile')
        return response.data
    },

    // Get drivers
    getDrivers: async () => {
        const response = await apiClient.get('/transport/transporters/drivers')
        return response.data
    },

    // Add driver
    addDriver: async (data: { name: string; licenseNumber: string; phoneNumber: string }) => {
        const response = await apiClient.post('/transport/transporters/drivers', data)
        return response.data
    },

    // Get vehicles
    getVehicles: async () => {
        const response = await apiClient.get('/transport/transporters/vehicles')
        return response.data
    },

    // Add vehicle
    addVehicle: async (data: { registrationNumber: string; vehicleType: string; capacity: number }) => {
        const response = await apiClient.post('/transport/transporters/vehicles', data)
        return response.data
    },
}

export default transportApi
