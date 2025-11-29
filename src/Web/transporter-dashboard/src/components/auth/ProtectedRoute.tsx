import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../../api/authApi'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate()
    const identityUrl = import.meta.env.VITE_IDENTITY_URL || 'http://localhost:5001'

    useEffect(() => {
        const isAuthenticated = authApi.isAuthenticated()

        if (!isAuthenticated) {
            // Redirect to Identity Service login with return URL
            const returnUrl = encodeURIComponent(window.location.href)
            window.location.href = `${identityUrl}/login?returnUrl=${returnUrl}`
        }
    }, [identityUrl, navigate])

    // If authenticated, render children
    if (!authApi.isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
