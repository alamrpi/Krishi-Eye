"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CapacityRangeFilter() {
    const [range, setRange] = useState([0, 20]); // 0 to 20 Tons
    const [minInput, setMinInput] = useState("0");
    const [maxInput, setMaxInput] = useState("20");

    const handleSliderChange = (value: number[]) => {
        setRange(value);
        setMinInput(value[0].toString());
        setMaxInput(value[1].toString());
    };

    const handleInputChange = (index: 0 | 1, value: string) => {
        if (index === 0) setMinInput(value);
        else setMaxInput(value);

        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            const newRange = [...range];
            newRange[index] = numValue;
            // Ensure min <= max
            if (index === 0 && numValue <= range[1]) setRange(newRange);
            if (index === 1 && numValue >= range[0]) setRange(newRange);
        }
    };

    const handleBlur = () => {
        let min = parseInt(minInput) || 0;
        let max = parseInt(maxInput) || 20;

        if (min < 0) min = 0;
        if (max > 50) max = 50;
        if (min > max) min = max;

        setRange([min, max]);
        setMinInput(min.toString());
        setMaxInput(max.toString());
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Capacity (Ton)</h4>
                <span className="text-xs text-muted-foreground">
                    {range[0]} - {range[1]} Ton
                </span>
            </div>

            <Slider
                defaultValue={[0, 20]}
                value={range}
                max={50}
                step={0.5}
                onValueChange={handleSliderChange}
                className="py-2"
            />

            <div className="flex items-center gap-2">
                <div className="space-y-1">
                    <Label htmlFor="min-capacity" className="text-[10px] text-muted-foreground">Min</Label>
                    <div className="relative">
                        <Input
                            id="min-capacity"
                            value={minInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(0, e.target.value)}
                            onBlur={handleBlur}
                            className="h-8 text-xs pr-8"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">T</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="max-capacity" className="text-[10px] text-muted-foreground">Max</Label>
                    <div className="relative">
                        <Input
                            id="max-capacity"
                            value={maxInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(1, e.target.value)}
                            onBlur={handleBlur}
                            className="h-8 text-xs pr-8"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">T</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
