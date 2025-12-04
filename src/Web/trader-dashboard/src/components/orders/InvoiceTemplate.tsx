import { Order } from "@/types/order";

interface InvoiceTemplateProps {
    order: Order;
}

export function InvoiceTemplate({ order }: InvoiceTemplateProps) {
    return (
        <div className="p-8 bg-white text-black font-sans max-w-3xl mx-auto border" id="invoice-print">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">INVOICE</h1>
                    <p className="text-sm text-gray-500">#{order.orderNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-green-600">Krishi Eye</h2>
                    <p className="text-sm">Dhaka, Bangladesh</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-bold mb-2">Bill To:</h3>
                    <p>{order.customerName}</p>
                    <p>{order.customerEmail}</p>
                    <p>{order.customerPhone}</p>
                    <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <span className="font-bold">Date:</span> {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div>
                        <span className="font-bold">Status:</span> {order.paymentStatus}
                    </div>
                </div>
            </div>

            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2">Item</th>
                        <th className="text-center py-2">Qty</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2">
                                <div className="font-medium">{item.productName}</div>
                                <div className="text-xs text-gray-500">{item.unit}</div>
                            </td>
                            <td className="text-center py-2">{item.quantity}</td>
                            <td className="text-right py-2">৳{item.price}</td>
                            <td className="text-right py-2">৳{item.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-1/2">
                    <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>৳{order.totalAmount}</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
            </div>
        </div>
    );
}
