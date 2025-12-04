import { OrderTable } from "@/components/dashboard/OrderTable";
import { Order } from "@/types/order";

export default function SalesPage() {
    // Mock data
    const orders: Order[] = [
        {
            id: "1",
            orderNumber: "ORD-2024-001",
            customerName: "Rahim Uddin",
            customerEmail: "rahim@example.com",
            customerPhone: "01711111111",
            shippingAddress: "Comilla",
            date: "2024-10-25",
            status: "Pending",
            totalAmount: 1250,
            paymentStatus: "Unpaid",
            items: []
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
                <p className="text-gray-500">Overview of your sales performance.</p>
            </div>
            <OrderTable orders={orders} />
        </div>
    );
}
