"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function AreaFilterMap() {
    const [radius, setRadius] = useState([5]); // 5km default
    const [location, setLocation] = useState("");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Area Filter</h4>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location" className="text-xs text-muted-foreground">Location</Label>
                <div className="relative">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="location"
                        placeholder="Enter location"
                        className="pl-8 h-9 text-sm"
                        value={location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Radius</span>
                    <span className="font-medium">{radius} km</span>
                </div>
                <Slider
                    defaultValue={[5]}
                    value={radius}
                    max={50}
                    step={1}
                    onValueChange={setRadius}
                    className="py-2"
                />
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full h-40 bg-muted/50 rounded-md border border-border/40 overflow-hidden flex flex-col items-center justify-center text-muted-foreground gap-2 group cursor-pointer hover:bg-muted/70 transition-colors">
                <MapPin className="h-8 w-8 opacity-50" />
                <span className="text-xs font-medium">View on Map</span>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Mock Map Grid Lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs">
                Apply Area Filter
            </Button>
        </div>
    );
}
