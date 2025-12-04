"use client"

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-zinc-900 dark:to-black p-4">
      <main className="flex flex-col items-center text-center gap-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Krishi<span className="text-green-600">Eye</span> <br />
            <span className="text-3xl sm:text-5xl text-gray-600 dark:text-gray-300">Trader Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Manage your agricultural listings, track sales, and coordinate transport all in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={login}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <LayoutDashboard className="w-5 h-5" />
            Login to Dashboard
          </button>
          <Link
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} KrishiEye. All rights reserved.
      </footer>
    </div>
  );
}
