import axios, { AxiosError, AxiosRequestConfig } from 'axios'

// API Base URL - using API Gateway
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Maximum retry attempts
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // ms

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
})

// Retry logic with exponential backoff
const retryRequest = async (error: AxiosError, retryCount = 0): Promise<any> => {
    const config = error.config as AxiosRequestConfig & { _retry?: number }

    // Don't retry if max retries reached
    if (retryCount >= MAX_RETRIES) {
        return Promise.reject(error)
    }

    // Don't retry for certain status codes
    const noRetryStatuses = [400, 401, 403, 404, 422]
    if (error.response && noRetryStatuses.includes(error.response.status)) {
        return Promise.reject(error)
    }

    // Calculate delay with exponential backoff
    const delay = RETRY_DELAY * Math.pow(2, retryCount)

    console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms...`)

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay))

    // Increment retry count
    if (!config._retry) {
        config._retry = 0
    }
    config._retry++

    return apiClient.request(config)
}

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle errors with retry
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number }

        // Check if this is a network error or server error (5xx)
        const isNetworkError = !error.response
        const isServerError = error.response && error.response.status >= 500

        // Retry for network errors and server errors
        if ((isNetworkError || isServerError) && config) {
            const retryCount = config._retry || 0
            return retryRequest(error, retryCount)
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export default apiClient
