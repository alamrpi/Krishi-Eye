import api from '@/lib/api';
import { Product, MeasurementUnit } from '@/types/catalog';

export const catalogService = {
    // Products
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/catalog/user/products');
        return response.data;
    },
    getProduct: async (id: string): Promise<Product> => {
        const response = await api.get<Product>(`/catalog/products/${id}`);
        return response.data;
    },
    createProduct: async (data: Partial<Product>): Promise<Product> => {
        const response = await api.post<Product>('/catalog/user/products', data);
        return response.data;
    },
    updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
        // Using PUT for full update as per controller
        const response = await api.put<Product>(`/catalog/user/products/${id}`, data);
        // The endpoint returns NoContent (204), so we might need to fetch the updated product or return the data passed in.
        // Ideally the backend should return the updated resource, but for now we'll assume success and return the data merged with id.
        return { ...data, id } as Product;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/catalog/user/products/${id}`);
    },
    publishProduct: async (id: string): Promise<void> => {
        await api.patch(`/catalog/user/products/${id}/publish`);
    },
    unpublishProduct: async (id: string): Promise<void> => {
        await api.patch(`/catalog/user/products/${id}/unpublish`);
    },

    // Units
    getUnits: async (): Promise<MeasurementUnit[]> => {
        const response = await api.get<MeasurementUnit[]>('/catalog/user/units');
        return response.data;
    },
    createUnit: async (data: Partial<MeasurementUnit>): Promise<MeasurementUnit> => {
        const response = await api.post<MeasurementUnit>('/catalog/user/units', data);
        return response.data;
    },

    // Categories
    getCategories: async (): Promise<{ id: string; name: string }[]> => {
        const response = await api.get<{ id: string; name: string }[]>('/catalog/categories');
        return response.data;
    },
    requestCategory: async (name: string): Promise<void> => {
        await api.post('/catalog/categories/request', { name });
    }
};
