import apiClient from './client'

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        email: string
        name: string
        role: string
    }
}

export interface RegisterRequest {
    email: string
    password: string
    name: string
    phoneNumber: string
}

export const authApi = {
    // Login
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/identity/auth/login', credentials)
        const { token } = response.data

        // Store token
        localStorage.setItem('auth_token', token)

        return response.data
    },

    // Register
    register: async (data: RegisterRequest) => {
        const response = await apiClient.post('/identity/auth/register', data)
        return response.data
    },

    // Logout
    logout: () => {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await apiClient.get('/identity/auth/me')
        return response.data
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('auth_token')
    },
}

export default authApi
