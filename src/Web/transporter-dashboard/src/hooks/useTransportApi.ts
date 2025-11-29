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

export const useVehicles = () => {
    return useQuery({
        queryKey: queryKeys.vehicles,
        queryFn: () => transportApi.getVehicles(),
    })
}
