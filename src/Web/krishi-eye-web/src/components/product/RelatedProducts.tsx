"use client";

import { ItemCard } from "@/components/home/ItemCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Mock data for related products (reusing structure)
const relatedProducts = [
    {
        id: 2,
        title: "Organic Fertilizer (25kg)",
        price: 1200,
        regularPrice: 1500,
        unit: "Bag",
        sellerName: "Green Earth Agro",
        isVerified: true,
        rating: 4.5,
        reviewCount: 85,
        imageUrl: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1000&auto=format&fit=crop",
        productType: "Fertilizer",
        discountPercentage: 20,
        transportIncluded: false,
    },
    {
        id: 3,
        title: "Hybrid Corn Seeds",
        price: 850,
        regularPrice: 850,
        unit: "Packet",
        sellerName: "Agro Seeds Ltd",
        isVerified: true,
        rating: 4.9,
        reviewCount: 200,
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop",
        productType: "Seeds",
        discountPercentage: 0,
        transportIncluded: true,
    },
    {
        id: 4,
        title: "Pesticide Sprayer",
        price: 2500,
        regularPrice: 3000,
        unit: "Piece",
        sellerName: "Farm Tools Co",
        isVerified: false,
        rating: 4.2,
        reviewCount: 45,
        imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1000&auto=format&fit=crop",
        productType: "Equipment",
        discountPercentage: 16,
        transportIncluded: false,
    },
    {
        id: 5,
        title: "Fresh Potatoes (10kg)",
        price: 400,
        regularPrice: 450,
        unit: "Sack",
        sellerName: "Rangpur Farmers",
        isVerified: true,
        rating: 4.7,
        reviewCount: 150,
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
        productType: "Vegetables",
        discountPercentage: 11,
        transportIncluded: true,
    },
];

export function RelatedProducts() {
    return (
        <div className="py-8">
            <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">You Might Also Like</h2>
                <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                    View All <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Mobile: Horizontal Scroll, Desktop: Grid */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 sm:px-0 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible scrollbar-hide">
                {relatedProducts.map((product) => (
                    <div key={product.id} className="min-w-[280px] sm:min-w-0 snap-center">
                        <ItemCard {...product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
