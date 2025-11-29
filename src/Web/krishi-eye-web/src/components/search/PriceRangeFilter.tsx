"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function PriceRangeFilter() {
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

    return (
        <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-3">
                {/* Slider */}
                <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    step={100}
                    className="w-full"
                />

                {/* Min/Max Inputs */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]);
                        }}
                        placeholder="Min"
                        className="w-full px-2 py-1.5 border border-border rounded-md text-sm"
                    />
                    <span className="text-muted-foreground text-sm">-</span>
                    <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 10000;
                            setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                        }}
                        placeholder="Max"
                        className="w-full px-2 py-1.5 border border-border rounded-md text-sm"
                    />
                </div>

                {/* Display Values */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>৳{priceRange[0].toLocaleString()}</span>
                    <span>৳{priceRange[1].toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
