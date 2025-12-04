"use client";

import Image from "next/image";
import { MapPin, Phone, CreditCard, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { CartItem } from "@/contexts/CartContext";
import type { ShippingFormData } from "./ShippingForm";
import type { PaymentMethodData } from "./PaymentMethod";

interface OrderReviewProps {
    items: CartItem[];
    shippingInfo: ShippingFormData;
    paymentInfo: PaymentMethodData;
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    agreedToTerms: boolean;
    onAgreeTerms: (agreed: boolean) => void;
    onPlaceOrder: () => void;
    isProcessing: boolean;
}

export function OrderReview({
    items,
    shippingInfo,
    paymentInfo,
    subtotal,
    deliveryCharge,
    discount,
    total,
    agreedToTerms,
    onAgreeTerms,
    onPlaceOrder,
    isProcessing,
}: OrderReviewProps) {
    const paymentMethodNames = {
        cod: "Cash on Delivery",
        bkash: "bKash",
        nagad: "Nagad",
        card: "Credit/Debit Card",
    };

    return (
        <div className="space-y-6">
            {/* Order Items */}
            <Card className="p-6 border-0 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">Order Items ({items.length})</h2>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-3 border-b last:border-0">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="font-semibold text-primary">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6 border-0 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>

                <div className="space-y-2 text-gray-700">
                    <p className="font-semibold text-gray-900">{shippingInfo.fullName}</p>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{shippingInfo.phone}</span>
                    </div>
                    {shippingInfo.email && (
                        <p className="text-sm text-gray-600">{shippingInfo.email}</p>
                    )}
                    <p className="text-sm">
                        {shippingInfo.address}, {shippingInfo.upazila}, {shippingInfo.district}, {shippingInfo.division}
                    </p>
                </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6 border-0 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <p className="font-medium text-gray-900">{paymentMethodNames[paymentInfo.method]}</p>

                {paymentInfo.method === "card" && paymentInfo.cardNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                        Card ending in {paymentInfo.cardNumber.slice(-4)}
                    </p>
                )}

                {(paymentInfo.method === "bkash" || paymentInfo.method === "nagad") && paymentInfo.mobileNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                        {paymentInfo.mobileNumber}
                    </p>
                )}
            </Card>

            {/* Price Summary */}
            <Card className="p-6 border-0 shadow-sm bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">৳{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                        <span>Delivery Charge</span>
                        <span className="font-medium text-gray-900">
                            {deliveryCharge === 0 ? (
                                <span className="text-green-600">FREE</span>
                            ) : (
                                `৳${deliveryCharge}`
                            )}
                        </span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">-৳{discount.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="border-t pt-3">
                        <div className="flex justify-between text-xl font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-primary">৳{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Terms and Place Order */}
            <Card className="p-6 border-0 shadow-sm">
                <div className="space-y-4">
                    <div className="flex items-start gap-2">
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onChange={(e) => onAgreeTerms((e.target as HTMLInputElement).checked)}
                        />
                        <label htmlFor="terms" className="text-sm cursor-pointer select-none">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
                            {" "}and{" "}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <Button
                        size="lg"
                        className="w-full rounded-full shadow-lg"
                        onClick={onPlaceOrder}
                        disabled={!agreedToTerms || isProcessing}
                    >
                        {isProcessing ? "Processing..." : "Place Order"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                        By placing your order, you agree to our terms and conditions
                    </p>
                </div>
            </Card>
        </div>
    );
}
