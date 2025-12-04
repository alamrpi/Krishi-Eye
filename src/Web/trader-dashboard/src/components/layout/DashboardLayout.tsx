"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingBag, Truck, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
    isActive?: boolean;
}

function SidebarItem({ icon: Icon, label, href, isActive }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading, logout, login } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login();
        }
    }, [isLoading, isAuthenticated, login]);

    const sidebarItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: Package, label: "Products", href: "/dashboard/products" },
        { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders" },
        { icon: ShoppingBag, label: "Purchases", href: "/dashboard/purchases" },
        { icon: Truck, label: "Transport", href: "/dashboard/transport" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-white border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    Krishi<span className="text-primary">Eye</span>
                </Link>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-white hidden lg:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        Krishi<span className="text-primary">Eye</span>
                    </Link>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Sidebar (Mobile Overlay) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu} />

                    {/* Menu */}
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col animate-in slide-in-from-left">
                        <div className="h-16 flex items-center px-6 border-b">
                            <span className="font-bold text-xl">Menu</span>
                        </div>
                        <div className="flex-1 py-6 px-4 space-y-1">
                            {sidebarItems.map((item) => (
                                <div key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                    <SidebarItem
                                        icon={item.icon}
                                        label={item.label}
                                        href={item.href}
                                        isActive={pathname === item.href}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
