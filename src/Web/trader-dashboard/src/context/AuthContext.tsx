"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: any | null
    token: string | null
    login: () => void
    logout: () => void
    isAuthenticated: boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Force HTTP for localhost to avoid SSL errors in development
    const rawUrl = process.env.NEXT_PUBLIC_IDENTITY_URL || "http://localhost:5001"
    const IDENTITY_URL = rawUrl.replace("https://localhost", "http://localhost").replace(/\/$/, "")

    useEffect(() => {
        // Check for token in localStorage on mount
        const storedToken = localStorage.getItem("authToken")
        if (storedToken) {
            setToken(storedToken)
            // TODO: Decode token to get user info or fetch profile
            setUser({ name: "Trader User" }) // Placeholder
        }
        setIsLoading(false)
    }, [])

    const login = () => {
        const callbackUrl = `${window.location.origin}/auth/callback`
        window.location.href = `${IDENTITY_URL}/login?callback=${encodeURIComponent(callbackUrl)}`
    }

    const logout = () => {
        localStorage.removeItem("authToken")
        setToken(null)
        setUser(null)
        router.push("/")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
