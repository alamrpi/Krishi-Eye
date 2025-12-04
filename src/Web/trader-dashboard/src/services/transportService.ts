import api from '@/lib/api';

export interface TransportRequest {
    id: string;
    requesterId: string;
    scheduledTime: string;
    pickupAddress: string;
    dropAddress: string;
    goodsType: string;
    weightKg: number;
    status: 'Open' | 'Bidding' | 'Confirmed' | 'InTransit' | 'Completed' | 'Cancelled';
    paymentMethod: 'Cash' | 'Online';
    winnerBidId?: string;
}

export interface CreateTransportRequestDto {
    scheduledTime: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    pickupDivision: string;
    pickupDistrict: string;
    pickupThana: string;
    pickupPostalCode: string;
    dropAddress: string;
    dropLat: number;
    dropLng: number;
    dropDivision: string;
    dropDistrict: string;
    dropThana: string;
    dropPostalCode: string;
    goodsType: string;
    weightKg: number;
    paymentMethod: 'Cash' | 'Online';
}

export const transportService = {
    getTransportRequests: async (): Promise<TransportRequest[]> => {
        const response = await api.get<TransportRequest[]>('/transport/transportrequests');
        return response.data;
    },
    getRequestDetails: async (id: string): Promise<TransportRequest> => {
        const response = await api.get<TransportRequest>(`/transport/transportrequests/${id}`);
        return response.data;
    },
    createRequest: async (data: CreateTransportRequestDto): Promise<string> => {
        const response = await api.post<string>('/transport/transportrequests', data);
        return response.data;
    }
};
