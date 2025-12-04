"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

export default function CartPage() {
    const { items, itemCount, subtotal, deliveryCharge, discount, total, updateQuantity, removeItem, applyPromoCode } = useCart();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">Shopping Cart ({itemCount})</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-8 py-8">
                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div>
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                            <p className="text-gray-600">
                                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                            </p>
                        </div>

                        {/* Cart Grid */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>

                            {/* Cart Summary */}
                            <div className="lg:col-span-1">
                                <CartSummary
                                    subtotal={subtotal}
                                    deliveryCharge={deliveryCharge}
                                    discount={discount}
                                    total={total}
                                    onApplyPromoCode={applyPromoCode}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
