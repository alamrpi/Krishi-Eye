export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    date: string;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
    paymentStatus: 'Paid' | 'Unpaid' | 'COD';
}
