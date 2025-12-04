"use client"

import { Order } from "@/types/order"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Truck, XCircle, Printer } from "lucide-react"
import { InvoiceTemplate } from "./InvoiceTemplate"
import { useRef } from "react"

interface OrderDetailsProps {
    order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-print');
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.outerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-500">{new Date(order.date).toLocaleString()}</span>
                        <Badge variant="outline">{order.status}</Badge>
                        <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{order.paymentStatus}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                    </Button>
                    {order.status === 'Pending' && (
                        <>
                            <Button variant="destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Order
                            </Button>
                        </>
                    )}
                    {order.status === 'Processing' && (
                        <Button>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark as Shipped
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Name:</span>
                            <span className="font-medium">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-medium">{order.customerEmail}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Phone:</span>
                            <span className="font-medium">{order.customerPhone}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-sm text-gray-500">{item.quantity} x {item.unit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">৳{item.total}</p>
                                    <p className="text-sm text-gray-500">৳{item.price} / unit</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>৳{order.totalAmount}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden Invoice for Printing */}
            <div className="hidden">
                <InvoiceTemplate order={order} />
            </div>
        </div>
    )
}
