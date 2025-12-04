"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { Order } from "@/types/order"

interface OrderTableProps {
    orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "secondary";
            case "Processing": return "default"; // Blue-ish usually
            case "Shipped": return "default";
            case "Delivered": return "outline"; // Green-ish ideally, but outline for now
            case "Cancelled": return "destructive";
            default: return "secondary";
        }
    };

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>৳ {order.totalAmount}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/orders/${order.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
