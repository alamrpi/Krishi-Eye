import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import transportApi from '../api/transportApi'
import { notify, handleApiError } from '../utils/notifications'

export const queryKeys = {
    nearbyRequests: (lat: number, lng: number, radius: number) => ['nearbyRequests', lat, lng, radius],
    requestDetails: (id: string) => ['requestDetails', id],
    myBids: ['myBids'],
    bidDetails: (id: string) => ['bidDetails', id],
    earningsReport: ['earningsReport'],
    profile: ['profile'],
    drivers: ['drivers'],
    vehicles: ['vehicles'],
}

export const useNearbyRequests = (latitude: number, longitude: number, radiusKm: number = 50) => {
    return useQuery({
        queryKey: queryKeys.nearbyRequests(latitude, longitude, radiusKm),
        queryFn: () => transportApi.getNearbyRequests(latitude, longitude, radiusKm),
        enabled: !!latitude && !!longitude,
    })
}

export const useMyBids = () => {
    return useQuery({
        queryKey: queryKeys.myBids,
        queryFn: () => transportApi.getMyBids(),
    })
}

export const useSubmitBid = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: transportApi.submitBid,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.myBids })
            notify.success('Bid submitted successfully! 🎉')
        },
        onError: (error: any) => {
            handleApiError(error, 'Failed to submit bid')
        },
    })
}

export const useEarningsReport = () => {
    return useQuery({
        queryKey: queryKeys.earningsReport,
        queryFn: () => transportApi.getEarningsReport(),
    })
}

export const useDrivers = () => {
    return useQuery({
        queryKey: queryKeys.drivers,
        queryFn: () => transportApi.getDrivers(),
    })
}

export const useAddDriver = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: {
            fullName: string
            phone: string
            nidNumber: string
            licenseNumber: string
            licenseExpiryDate: string
            licenseImageUrl: string
        }) => transportApi.addDriver(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.drivers })
            notify.success('Driver added successfully! 👨‍✈️')
        },
        onError: (error: any) => {
            handleApiError(error, 'Failed to add driver')
        },
    })
}

export const useVehicles = () => {
    return useQuery({
        queryKey: queryKeys.vehicles,
        queryFn: () => transportApi.getVehicles(),
    })
}

export const useAddVehicle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: {
            type: number
            registrationNumber: string
            capacityTon: number
            model?: string
            manufactureYear?: number
            fitnessExpiryDate: string
        }) => transportApi.addVehicle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.vehicles })
            notify.success('Vehicle added successfully! 🚛')
        },
        onError: (error: any) => {
            handleApiError(error, 'Failed to add vehicle')
        },
    })
}
