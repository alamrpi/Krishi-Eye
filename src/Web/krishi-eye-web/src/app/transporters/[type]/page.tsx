"use client";

import { useState } from "react";
import { Grid3x3, List, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CapacityRangeFilter } from "@/components/search/CapacityRangeFilter";
import { AreaFilterMap } from "@/components/search/AreaFilterMap";
import { InfiniteScrollTransporters } from "@/components/search/InfiniteScrollTransporters";

interface TransporterTypePageProps {
    params: {
        type: string;
    };
}

export default function TransporterTypePage({ params }: TransporterTypePageProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const { type } = params;

    // Format type name  
    const typeName = type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    // Mock data - Will be replaced with API call
    const mockTransporters = Array(12).fill(null).map((_, i) => ({
        id: i + 200,
        name: `${typeName} Transport ${i + 1}`,
        vehicleCount: 5 + i * 2,
        vehicleTypes: [typeName],
        isVerified: i % 2 === 0,
        rating: 4.2 + (i % 8) * 0.1,
        reviewCount: 100 + i * 25,
        location: ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal"][i % 6] + ", Bangladesh",
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
                        <Link href="/transporters" className="text-gray-500 hover:text-primary">
                            All Transporters
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{typeName}</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{typeName}</h1>
                        <p className="text-gray-600">{mockTransporters.length}+ verified {typeName.toLowerCase()} transporters</p>
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
                                {/* Vehicle Type */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">Vehicle Type</h4>
                                    <div className="space-y-2">
                                        {["Truck", "Pickup Van", "Covered Van", "Refrigerated Van"].map((vehicleType) => (
                                            <label key={vehicleType} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-gray-700 group-hover:text-gray-900">{vehicleType}</span>
                                            </label>
                                        ))}
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
                                    <h4 className="font-medium mb-3 text-gray-900">Other Filters</h4>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2 group">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-gray-700 group-hover:text-gray-900">Verified Transporters</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-gray-700 group-hover:text-gray-900">Available Now</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Transporters Grid with Infinite Scroll */}
                    <div className="flex-1">
                        <InfiniteScrollTransporters initialTransporters={mockTransporters} query={typeName} viewMode={viewMode} />
                    </div>
                </div>
            </div>
        </div>
    );
}
