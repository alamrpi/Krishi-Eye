"use client";

import { Minus, Plus, Trash2, CheckCircle2, Truck } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const itemTotal = item.price * item.quantity;
    const hasDiscount = item.regularPrice > item.price;

    return (
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 p-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                    {hasDiscount && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs">
                            SALE
                        </Badge>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <Badge variant="secondary" className="mb-1 text-xs">
                                    {item.productType}
                                </Badge>
                                <h3 className="font-semibold text-base md:text-lg line-clamp-2 text-gray-900">
                                    {item.title}
                                </h3>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                onClick={() => onRemove(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="line-clamp-1">{item.sellerName}</span>
                            {item.isVerified && <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />}
                        </div>

                        {item.transportIncluded && (
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium mb-2">
                                <Truck className="h-3 w-3" />
                                <span>Transport Included</span>
                            </div>
                        )}
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-12 text-center font-semibold text-gray-900">
                                {item.quantity}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stockAvailable}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            <div className="font-bold text-lg text-primary">
                                ৳{itemTotal.toLocaleString()}
                            </div>
                            {hasDiscount && (
                                <div className="text-xs text-gray-500 line-through">
                                    ৳{(item.regularPrice * item.quantity).toLocaleString()}
                                </div>
                            )}
                            <div className="text-xs text-gray-500">
                                ৳{item.price}/{item.unit}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
