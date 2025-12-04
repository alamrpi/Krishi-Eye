import api from '@/lib/api';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

export const identityService = {
    getUserProfile: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>('/identity/user/profile');
        return response.data;
    },
};
