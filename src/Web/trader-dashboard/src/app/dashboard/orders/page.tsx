"use client"

import { OrderTable } from "@/components/dashboard/OrderTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";

export default function OrdersPage() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => orderService.getOrders(),
    });

    if (isLoading) return <div>Loading orders...</div>;

    const orderList = orders || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-gray-500">Manage and process your incoming orders.</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <OrderTable orders={orderList} />
                </TabsContent>
                <TabsContent value="pending">
                    <OrderTable orders={orderList.filter(o => o.status === 'Pending')} />
                </TabsContent>
                <TabsContent value="processing">
                    <OrderTable orders={orderList.filter(o => o.status === 'Processing')} />
                </TabsContent>
                <TabsContent value="shipped">
                    <OrderTable orders={orderList.filter(o => o.status === 'Shipped')} />
                </TabsContent>
                <TabsContent value="cancelled">
                    <OrderTable orders={orderList.filter(o => o.status === 'Cancelled')} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
