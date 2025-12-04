"use client";

import { useState } from "react";
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


interface ProductInfoProps {
    product: any;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const discountPercentage = Math.round(
        ((product.regularPrice - product.price) / product.regularPrice) * 100
    );

    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-none rounded-full px-3 font-normal">
                        {product.unit}
                    </Badge>
                    {product.stock > 0 ? (
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                            In Stock
                        </span>
                    ) : (
                        <span className="text-xs font-medium text-red-600 flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-full">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            Out of Stock
                        </span>
                    )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.title}</h1>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">{product.rating}</span>
                        <span className="text-gray-500">({product.reviewCount} reviews)</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center gap-1 text-gray-500">
                        <span>Sold by</span>
                        <span className="font-medium text-gray-900 underline decoration-dotted underline-offset-4">
                            {product.seller.name}
                        </span>
                        {product.seller.isVerified && (
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-baseline gap-3">
                <div className="text-3xl sm:text-4xl font-bold text-primary">৳{product.price}</div>
                {discountPercentage > 0 && (
                    <>
                        <div className="text-lg text-gray-400 line-through">
                            ৳{product.regularPrice}
                        </div>
                        <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-md">
                            -{discountPercentage}%
                        </Badge>
                    </>
                )}
            </div>

            <p className="text-gray-600 leading-relaxed">
                {product.description}
            </p>

            {/* Features / Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.transportIncluded && (
                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            <Truck className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">Free Transport Included</span>
                    </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Verified Quality Product</span>
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Desktop Actions (Hidden on Mobile) */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-gray-50 rounded-full h-12 w-fit p-1">
                    <button
                        onClick={decrementQuantity}
                        className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-600"
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <div className="h-full px-4 flex items-center justify-center font-bold text-gray-900 min-w-[3rem]">
                        {quantity}
                    </div>
                    <button
                        onClick={incrementQuantity}
                        className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-600"
                        disabled={quantity >= product.stock}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <Button className="flex-1 h-12 rounded-full text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                </Button>

                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shrink-0 border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50">
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            {/* Mobile Sticky Bar Placeholder (Actual bar will be in page.tsx) */}
        </div>
    );
}
