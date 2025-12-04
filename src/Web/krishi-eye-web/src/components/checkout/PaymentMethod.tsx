"use client";

import { Wallet, CreditCard, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type PaymentMethodType = "cod" | "bkash" | "nagad" | "card";

export interface PaymentMethodData {
    method: PaymentMethodType;
    cardNumber?: string;
    cardExpiry?: string;
    cardCVV?: string;
    mobileNumber?: string;
}

interface PaymentMethodProps {
    selectedMethod: PaymentMethodType;
    paymentData: PaymentMethodData;
    onMethodChange: (method: PaymentMethodType) => void;
    onPaymentDataChange: (data: Partial<PaymentMethodData>) => void;
}

export function PaymentMethod({
    selectedMethod,
    paymentData,
    onMethodChange,
    onPaymentDataChange
}: PaymentMethodProps) {
    const methods = [
        {
            id: "cod" as PaymentMethodType,
            name: "Cash on Delivery",
            icon: Wallet,
            description: "Pay when you receive",
            color: "text-green-600"
        },
        {
            id: "bkash" as PaymentMethodType,
            name: "bKash",
            icon: Smartphone,
            description: "Mobile payment",
            color: "text-pink-600"
        },
        {
            id: "nagad" as PaymentMethodType,
            name: "Nagad",
            icon: Smartphone,
            description: "Mobile payment",
            color: "text-orange-600"
        },
        {
            id: "card" as PaymentMethodType,
            name: "Credit/Debit Card",
            icon: CreditCard,
            description: "Visa, Mastercard",
            color: "text-blue-600"
        },
    ];

    return (
        <Card className="p-6 border-0 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Method</h2>

            <div className="space-y-3 mb-6">
                {methods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <button
                            key={method.id}
                            onClick={() => onMethodChange(method.id)}
                            className={cn(
                                "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                                    isSelected ? "bg-primary/10" : "bg-gray-100"
                                )}>
                                    <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : method.color)} />
                                </div>

                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{method.name}</div>
                                    <div className="text-sm text-gray-500">{method.description}</div>
                                </div>

                                <div className={cn(
                                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                                    isSelected ? "border-primary" : "border-gray-300"
                                )}>
                                    {isSelected && (
                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Card Payment Form */}
            {selectedMethod === "card" && (
                <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h3 className="font-semibold text-gray-900">Card Details</h3>

                    <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={paymentData.cardNumber || ""}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\s/g, "").match(/.{1,4}/g)?.join(" ") || e.target.value;
                                onPaymentDataChange({ cardNumber: value });
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input
                                id="cardExpiry"
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={paymentData.cardExpiry || ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").match(/.{1,2}/g)?.join("/") || e.target.value;
                                    onPaymentDataChange({ cardExpiry: value });
                                }}
                            />
                        </div>

                        <div>
                            <Label htmlFor="cardCVV">CVV</Label>
                            <Input
                                id="cardCVV"
                                type="text"
                                placeholder="123"
                                maxLength={3}
                                value={paymentData.cardCVV || ""}
                                onChange={(e) => onPaymentDataChange({ cardCVV: e.target.value.replace(/\D/g, "") })}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Payment Form */}
            {(selectedMethod === "bkash" || selectedMethod === "nagad") && (
                <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h3 className="font-semibold text-gray-900">{selectedMethod === "bkash" ? "bKash" : "Nagad"} Number</h3>

                    <div>
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                            id="mobileNumber"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={paymentData.mobileNumber || ""}
                            onChange={(e) => onPaymentDataChange({ mobileNumber: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You will receive a payment request on this number
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
}
