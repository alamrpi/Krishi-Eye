"use client";

import { useState } from "react";
import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartSummaryProps {
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    onApplyPromoCode: (code: string) => boolean;
}

export function CartSummary({
    subtotal,
    deliveryCharge,
    discount,
    total,
    onApplyPromoCode,
}: CartSummaryProps) {
    const [promoCode, setPromoCode] = useState("");
    const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return;

        const isValid = onApplyPromoCode(promoCode);

        if (isValid) {
            setPromoMessage({ type: "success", text: "Promo code applied successfully!" });
            setPromoCode("");
        } else {
            setPromoMessage({ type: "error", text: "Invalid promo code. Try again." });
        }

        setTimeout(() => setPromoMessage(null), 3000);
    };

    return (
        <Card className="border-0 shadow-sm sticky top-24">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

                <div className="space-y-4 mb-6">
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

                    {subtotal > 0 && deliveryCharge > 0 && (
                        <div className="text-xs text-gray-500 bg-green-50 p-2 rounded-lg">
                            💡 Add ৳{(5000 - subtotal).toLocaleString()} more to get FREE delivery!
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-primary">৳{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Have a promo code?
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Enter code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim()}
                        >
                            Apply
                        </Button>
                    </div>
                    {promoMessage && (
                        <p className={`text-xs mt-2 ${promoMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                            {promoMessage.text}
                        </p>
                    )}
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                    <Button size="lg" className="w-full gap-2 rounded-full shadow-lg">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>

                {/* Security badges or additional info */}
                <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
                    <p>🔒 Secure checkout</p>
                    <p className="mt-1">💳 Multiple payment options available</p>
                </div>
            </div>
        </Card>
    );
}
