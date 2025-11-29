"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TransporterCard } from "@/components/home/TransporterCard";
import { Loader2 } from "lucide-react";

interface Transporter {
    id: number;
    name: string;
    vehicleCount: number;
    vehicleTypes: string[];
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    location: string;
}

interface InfiniteScrollTransportersProps {
    initialTransporters: Transporter[];
    query: string;
    viewMode?: "grid" | "list";
}

export function InfiniteScrollTransporters({ initialTransporters, query, viewMode = "grid" }: InfiniteScrollTransportersProps) {
    const [transporters, setTransporters] = useState<Transporter[]>(initialTransporters);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const loadMore = () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newTransporters = Array(6).fill(null).map((_, i) => ({
                id: transporters.length + i + 1,
                name: `${query || "Sample"} Transport ${transporters.length + i + 1}`,
                vehicleCount: 5 + (transporters.length + i) * 3,
                vehicleTypes: ["Truck", "Pickup Van", "Covered Van"].slice(0, ((transporters.length + i) % 3) + 1),
                isVerified: (transporters.length + i) % 2 === 0,
                rating: 4.3 + ((transporters.length + i) % 5) * 0.1,
                reviewCount: 80 + (transporters.length + i) * 15,
                location: ["Dhaka", "Chattogram", "Sylhet"][(transporters.length + i) % 3] + ", Bangladesh",
            }));

            setTransporters(prev => [...prev, ...newTransporters]);
            setPage(prev => prev + 1);
            setIsLoading(false);

            if (page >= 4) {
                setHasMore(false);
            }
        }, 1000);
    };

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMore();
        }
    }, [inView, hasMore, isLoading]);

    return (
        <>
            <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-4"
            }>
                {transporters.map((transporter) => (
                    <TransporterCard key={transporter.id} {...transporter} />
                ))}
            </div>

            {/* Loading Indicator */}
            {hasMore && (
                <div ref={ref} className="flex justify-center items-center py-8 col-span-full">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading more transporters...</span>
                        </div>
                    )}
                </div>
            )}

            {/* End Message */}
            {!hasMore && transporters.length > 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm col-span-full">
                    You've reached the end of the results
                </div>
            )}
        </>
    );
}
