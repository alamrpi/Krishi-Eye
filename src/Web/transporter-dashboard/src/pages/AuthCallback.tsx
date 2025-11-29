import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        // Get token from URL query parameter
        const token = searchParams.get('token')

        if (token) {
            // Store token in localStorage
            localStorage.setItem('auth_token', token)

            // Redirect to dashboard
            navigate('/', { replace: true })
        } else {
            // No token, redirect to home (will trigger login redirect)
            navigate('/', { replace: true })
        }
    }, [searchParams, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing login...</p>
            </div>
        </div>
    )
}
