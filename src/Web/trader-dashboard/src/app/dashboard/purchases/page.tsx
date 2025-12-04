import { OrderTable } from "@/components/dashboard/OrderTable";
import { Order } from "@/types/order";

export default function PurchasesPage() {
    // Mock data
    const orders: Order[] = [
        {
            id: "5",
            orderNumber: "ORD-005",
            customerName: "Agro Seeds Co.",
            customerEmail: "contact@agroseeds.com",
            customerPhone: "01900000000",
            shippingAddress: "Dhaka",
            date: "2023-10-20",
            status: "Delivered",
            totalAmount: 12500,
            paymentStatus: "Paid",
            items: []
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
                <p className="text-gray-500">Track your orders and purchase history.</p>
            </div>
            <OrderTable orders={orders} />
        </div>
    );
}
