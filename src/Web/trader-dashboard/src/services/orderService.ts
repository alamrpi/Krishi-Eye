import api from '@/lib/api';
import { Order } from '@/types/order';

export const orderService = {
    getOrders: async (status?: string): Promise<Order[]> => {
        const params = status && status !== 'all' ? { status } : {};
        const response = await api.get<Order[]>('/ordering/orders', { params });
        return response.data;
    },
    getOrder: async (id: string): Promise<Order> => {
        const response = await api.get<Order>(`/ordering/orders/${id}`);
        return response.data;
    },
    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        await api.patch(`/ordering/orders/${id}/status`, { status });
        // Fetch updated order to return
        const response = await api.get<Order>(`/ordering/orders/${id}`);
        return response.data;
    },
};
