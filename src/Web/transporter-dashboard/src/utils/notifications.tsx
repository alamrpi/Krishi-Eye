import toast from 'react-hot-toast'
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline'

export const notify = {
    success: (message: string, options?: any) => {
        toast.success(message, {
            duration: 4000,
            icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
            style: {
                background: '#F0FDF4',
                color: '#166534',
                border: '1px solid #86EFAC',
            },
            ...options,
        })
    },

    error: (message: string, options?: any) => {
        toast.error(message, {
            duration: 5000,
            icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
            style: {
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FCA5A5',
            },
            ...options,
        })
    },

    warning: (message: string, options?: any) => {
        toast(message, {
            duration: 4500,
            icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
            style: {
                background: '#FFFBEB',
                color: '#92400E',
                border: '1px solid #FCD34D',
            },
            ...options,
        })
    },

    info: (message: string, options?: any) => {
        toast(message, {
            duration: 4000,
            icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
            style: {
                background: '#EFF6FF',
                color: '#1E40AF',
                border: '1px solid #93C5FD',
            },
            ...options,
        })
    },

    loading: (message: string) => {
        return toast.loading(message, {
            style: {
                background: '#F3F4F6',
                color: '#374151',
            },
        })
    },
}

export const handleApiError = (error: any, fallbackMessage = 'An error occurred') => {
    const message = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        fallbackMessage

    notify.error(message)

    if (import.meta.env.MODE === 'development') {
        console.error('API Error:', error)
    }
}
