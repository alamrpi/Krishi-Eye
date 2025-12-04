"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // We don't strictly need useAuth here if we just set localStorage, 
    // but it's good practice to ensure context updates if we were using state directly.
    // However, since AuthContext reads from localStorage on mount/update, 
    // we might need to trigger a reload or expose a setToken method.
    // For simplicity, we'll write to localStorage and force a hard navigation or reload.

    useEffect(() => {
        const token = searchParams.get("token")
        if (token) {
            localStorage.setItem("authToken", token)
            // Redirect to dashboard
            window.location.href = "/dashboard"
        } else {
            // Handle error or missing token
            console.error("No token found in callback")
            router.push("/")
        }
    }, [searchParams, router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
                <p className="text-gray-600">Please wait while we log you in.</p>
            </div>
        </div>
    )
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    )
}
