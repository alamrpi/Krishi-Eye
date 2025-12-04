"use client";

import { useState } from "react";
import { Grid3x3, List, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/home/ServiceCard";
import { AreaFilterMap } from "@/components/search/AreaFilterMap";
import { InfiniteScrollConsultants } from "@/components/search/InfiniteScrollConsultants";

export default function ConsultantsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Mock data - Replace with actual API calls
    const mockConsultants = Array(12).fill(null).map((_, i) => ({
        id: i + 300,
        name: [
            "Dr. Rahim Uddin",
            "GreenLeaf Lab",
            "AgriConsult BD",
            "Dr. Fatima Akter",
            "SoilCare Solutions",
            "Dr. Kamal Hossain",
        ][i % 6],
        serviceType: ["Veterinary", "Crop Tester", "Consultant"][i % 3] as "Veterinary" | "Crop Tester" | "Consultant",
        consultantType: (i % 2 === 0 ? "Individual" : "Agency") as "Individual" | "Agency",
        isVerified: i % 2 === 0,
        rating: 4.3 + (i % 7) * 0.1,
        reviewCount: 80 + i * 20,
        experience: `${10 + (i % 6)}+ Years`,
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
                        <span className="font-medium text-gray-900">All Consultants</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Expert Consultants</h1>
                        <p className="text-gray-600">{mockConsultants.length}+ expert consultants</p>
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
                                {/* Service Type */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">Service Type</h4>
                                    <div className="space-y-2">
                                        {["Veterinary", "Crop Tester", "Consultant"].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                                <span className="text-gray-700 group-hover:text-gray-900">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Area Filter (Map) */}
                                <div className="border-t pt-4">
                                    <AreaFilterMap />
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
                                        <span className="text-gray-700 group-hover:text-gray-900">Verified Consultants</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-gray-700 group-hover:text-gray-900">Available Now</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Consultants Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mockConsultants.map((consultant) => (
                                <ServiceCard key={consultant.id} {...consultant} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
