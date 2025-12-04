import { OrderDetails } from "@/components/orders/OrderDetails";
import { Order } from "@/types/order";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mock fetch
    const order: Order = {
        id,
        orderNumber: "ORD-2024-001",
        customerName: "Rahim Uddin",
        customerEmail: "rahim@example.com",
        customerPhone: "01711111111",
        shippingAddress: "123 Village Road, Comilla",
        date: "2024-10-25",
        status: "Pending",
        totalAmount: 1250,
        paymentStatus: "Unpaid",
        items: [
            { id: "i1", productId: "p1", productName: "Fresh Potatoes", quantity: 50, unit: "kg", price: 25, total: 1250 }
        ]
    };

    return (
        <div className="max-w-5xl mx-auto">
            <OrderDetails order={order} />
        </div>
    );
}
