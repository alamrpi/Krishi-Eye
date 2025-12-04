"use client";

import { useState } from "react";
import { Grid3x3, List, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/home/ItemCard";
import { PriceRangeFilter } from "@/components/search/PriceRangeFilter";
import { InfiniteScrollProducts } from "@/components/search/InfiniteScrollProducts";

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Mock data - Replace with actual API calls
    const mockProducts = Array(16).fill(null).map((_, i) => ({
        id: i + 100,
        title: [
            "Premium Rice Seeds (BRRI-28)",
            "Organic Fertilizer Mix",
            "Hybrid Corn Seeds",
            "Pesticide Sprayer",
            "Wheat Seeds (High Yield)",
            "NPK Fertilizer",
            "Irrigation Pump",
            "Vegetable Seeds Bundle",
        ][i % 8],
        price: 500 + i * 150,
        regularPrice: i % 3 === 0 ? 600 + i * 150 : 0,
        unit: ["kg", "bag", "pack", "piece"][i % 4],
        sellerName: `Seller ${(i % 5) + 1}`,
        isVerified: i % 2 === 0,
        rating: 4.0 + (i % 10) * 0.1,
        reviewCount: 50 + i * 15,
        imageUrl: [
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600&auto=format&fit=crop",
        ][i % 4],
        productType: ["Seeds", "Fertilizer", "Equipment", "Pesticides"][i % 4],
        discountPercentage: i % 3 === 0 ? 10 : 0,
        transportIncluded: i % 4 === 0,
    }));

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
                        <span className="font-medium text-gray-900">All Products</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Products</h1>
                        <p className="text-gray-600">{mockProducts.length}+ products available</p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "grid" ? "default" : "outline"}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent">
                                    Clear all
                                </Button>
                            </div>

                            <div className="space-y-6 text-sm">
                                {/* Product Type */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">Product Type</h4>
                                    <div className="space-y-2">
                                        {["Seeds", "Fertilizer", "Equipment", "Pesticides"].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="border-t pt-4">
                                    <PriceRangeFilter />
                                </div>

                                {/* Category */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3 text-gray-900">Category</h4>
                                    <div className="space-y-2">
                                        {["Rice", "Wheat", "Corn", "Vegetables"].map((category) => (
                                            <label key={category} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-gray-700 group-hover:text-gray-900">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3 text-gray-900">Rating</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                            <span className="text-gray-700 group-hover:text-gray-900">4★ & above</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                            <span className="text-gray-700 group-hover:text-gray-900">3★ & above</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Other Filters */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3 text-gray-900">Other Filters</h4>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2 group">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-gray-700 group-hover:text-gray-900">Verified Sellers</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-gray-700 group-hover:text-gray-900">Transport Available</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "flex flex-col gap-4"
                        }>
                            {mockProducts.map((product) => (
                                <ItemCard
                                    key={product.id}
                                    {...product}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
