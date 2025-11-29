"use client";

import { Suspense, useState } from "react";
import { Search as SearchIcon, Grid3x3, List, SlidersHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TransporterCard } from "@/components/home/TransporterCard";
import { ServiceCard } from "@/components/home/ServiceCard";
import { PriceRangeFilter } from "@/components/search/PriceRangeFilter";
import { InfiniteScrollProducts } from "@/components/search/InfiniteScrollProducts";
import { CapacityRangeFilter } from "@/components/search/CapacityRangeFilter";
import { AreaFilterMap } from "@/components/search/AreaFilterMap";
import { InfiniteScrollTransporters } from "@/components/search/InfiniteScrollTransporters";
import { InfiniteScrollConsultants } from "@/components/search/InfiniteScrollConsultants";

interface SearchPageProps {
    searchParams: {
        q?: string;
        type?: string;
    };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || "";
    const activeTab = searchParams.type || "products";
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Mock data - Replace with actual API calls
    const mockProducts = Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Product ${i + 1} - ${query || "Sample"}`,
        price: 500 + i * 100,
        regularPrice: 600 + i * 100,
        unit: "kg",
        sellerName: `Seller ${i + 1}`,
        isVerified: i % 2 === 0,
        rating: 4.5 + (i % 5) * 0.1,
        reviewCount: 100 + i * 10,
        imageUrl: `https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop`,
        productType: ["Seeds", "Fertilizer", "Equipment"][i % 3],
        discountPercentage: i % 2 === 0 ? 10 : 0,
        transportIncluded: i % 3 === 0,
    }));

    const mockTransporters = Array(6).fill(null).map((_, i) => ({
        id: i + 1,
        name: `${query || "Sample"} Transport ${i + 1}`,
        vehicleCount: 5 + i * 3,
        vehicleTypes: ["Truck", "Pickup Van", "Covered Van"].slice(0, (i % 3) + 1),
        isVerified: i % 2 === 0,
        rating: 4.3 + (i % 5) * 0.1,
        reviewCount: 80 + i * 15,
        location: ["Dhaka", "Chattogram", "Sylhet"][i % 3] + ", Bangladesh",
    }));

    const mockConsultants = Array(6).fill(null).map((_, i) => ({
        id: i + 1,
        name: `Dr. ${query || "Sample"} ${i + 1}`,
        serviceType: ["Veterinary", "Crop Tester", "Consultant"][i % 3] as any,
        consultantType: i % 2 === 0 ? "Individual" : "Agency" as any,
        isVerified: i % 2 === 0,
        rating: 4.6 + (i % 5) * 0.1,
        reviewCount: 120 + i * 20,
        experience: `${10 + i}+ Years`,
    }));

    const resultCounts = {
        products: mockProducts.length,
        transporters: mockTransporters.length,
        consultants: mockConsultants.length,
    };

    return (
        <div className="min-h-screen bg-muted/10">
            <div className="container px-4 md:px-8 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <SearchIcon className="h-4 w-4" />
                        <span>Search results for: </span>
                        <span className="font-semibold text-foreground">{query || "All items"}</span>
                    </div>
                    <h1 className="text-3xl font-bold">
                        {resultCounts[activeTab as keyof typeof resultCounts] || 0}+ Results Found
                    </h1>
                </div>

                {/* Tabs */}
                <Tabs defaultValue={activeTab} className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-white border border-border/40">
                            <TabsTrigger value="products" className="gap-2">
                                Products
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {resultCounts.products}+
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="transporters" className="gap-2">
                                Transporters
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {resultCounts.transporters}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="consultants" className="gap-2">
                                Consultants
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {resultCounts.consultants}
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        {/* View Toggle & Filters */}
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
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="gap-2 md:hidden">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Products Tab - With Infinite Scroll */}
                    <TabsContent value="products" className="mt-0">
                        <div className="flex gap-6">
                            {/* Filters Sidebar */}
                            <aside className="hidden md:block w-64 shrink-0">
                                <div className="bg-white rounded-lg border border-border/40 p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Filters</h3>
                                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Clear all
                                        </Button>
                                    </div>
                                    <div className="space-y-4 text-sm">
                                        {/* Product Type */}
                                        <div>
                                            <h4 className="font-medium mb-2">Product Type</h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Seeds</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Fertilizer</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Equipment</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Pesticides</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Price Range - Interactive Component */}
                                        <PriceRangeFilter />

                                        {/* Category */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Category</h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Rice</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Wheat</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Corn</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Vegetables</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Rating Filter */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Rating</h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>4★ & above</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>3★ & above</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Other Filters */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Other Filters</h4>
                                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                                <input type="checkbox" className="rounded" />
                                                <span>Verified Sellers</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded" />
                                                <span>Transport Available</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Products Grid with Infinite Scroll */}
                            <div className="flex-1">
                                <InfiniteScrollProducts initialProducts={mockProducts} query={query} viewMode={viewMode} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Transporters Tab */}
                    <TabsContent value="transporters" className="mt-0">
                        <div className="flex gap-6">
                            <aside className="hidden md:block w-64 shrink-0">
                                <div className="bg-white rounded-lg border border-border/40 p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Filters</h3>
                                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Clear all
                                        </Button>
                                    </div>
                                    <div className="space-y-6 text-sm">
                                        {/* Vehicle Type */}
                                        <div>
                                            <h4 className="font-medium mb-2">Vehicle Type</h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Truck</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Pickup Van</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Covered Van</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Refrigerated Van</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Capacity Filter */}
                                        <div className="border-t pt-4">
                                            <CapacityRangeFilter />
                                        </div>

                                        {/* Area Filter (Map) */}
                                        <div className="border-t pt-4">
                                            <AreaFilterMap />
                                        </div>

                                        {/* Other Filters */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Other Filters</h4>
                                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                                <input type="checkbox" className="rounded" />
                                                <span>Verified Transporters</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded" />
                                                <span>Available Now</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            <div className="flex-1">
                                <InfiniteScrollTransporters initialTransporters={mockTransporters} query={query} viewMode={viewMode} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Consultants Tab */}
                    <TabsContent value="consultants" className="mt-0">
                        <div className="flex gap-6">
                            <aside className="hidden md:block w-64 shrink-0">
                                <div className="bg-white rounded-lg border border-border/40 p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Filters</h3>
                                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Clear all
                                        </Button>
                                    </div>
                                    <div className="space-y-6 text-sm">
                                        {/* Service Type */}
                                        <div>
                                            <h4 className="font-medium mb-2">Service Type</h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Veterinary</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Crop Tester</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>Consultant</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Area Filter (Map) */}
                                        <div className="border-t pt-4">
                                            <AreaFilterMap />
                                        </div>

                                        {/* Rating Filter */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Rating</h4>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>4★ & above</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" className="rounded" />
                                                    <span>3★ & above</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Other Filters */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Other Filters</h4>
                                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                                <input type="checkbox" className="rounded" />
                                                <span>Verified Consultants</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="rounded" />
                                                <span>Available Now</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            <div className="flex-1">
                                <InfiniteScrollConsultants initialConsultants={mockConsultants} query={query} viewMode={viewMode} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
