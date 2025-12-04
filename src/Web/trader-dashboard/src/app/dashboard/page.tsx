"use client"

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { catalogService } from "@/services/catalogService";
import { transportService } from "@/services/transportService";

export default function DashboardPage() {
    const { data: orders } = useQuery({
        queryKey: ['orders', 'all'],
        queryFn: () => orderService.getOrders()
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: catalogService.getProducts
    });

    const { data: transportRequests } = useQuery({
        queryKey: ['transport-requests'],
        queryFn: transportService.getTransportRequests
    });

    const totalSales = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
    const activeListings = products?.filter(p => p.status === 'Published').length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'Pending').length || 0;
    const transportCount = transportRequests?.length || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500">Welcome back to your trading overview.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Total Sales</div>
                    <div className="text-2xl font-bold mt-2">৳ {totalSales.toLocaleString()}</div>
                </div>
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Active Listings</div>
                    <div className="text-2xl font-bold mt-2">{activeListings}</div>
                </div>
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Pending Orders</div>
                    <div className="text-2xl font-bold mt-2">{pendingOrders}</div>
                </div>
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Transport Requests</div>
                    <div className="text-2xl font-bold mt-2">{transportCount}</div>
                </div>
            </div>
        </div>
    );
}
