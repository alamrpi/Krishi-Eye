"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ServiceCard } from "@/components/home/ServiceCard";
import { Loader2 } from "lucide-react";

interface Consultant {
    id: number;
    name: string;
    serviceType: "Veterinary" | "Crop Tester" | "Consultant";
    consultantType: "Individual" | "Agency";
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    experience: string;
}

interface InfiniteScrollConsultantsProps {
    initialConsultants: Consultant[];
    query: string;
    viewMode?: "grid" | "list";
}

export function InfiniteScrollConsultants({ initialConsultants, query, viewMode = "grid" }: InfiniteScrollConsultantsProps) {
    const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
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
            const newConsultants = Array(6).fill(null).map((_, i) => ({
                id: consultants.length + i + 1,
                name: `Dr. ${query || "Sample"} ${consultants.length + i + 1}`,
                serviceType: ["Veterinary", "Crop Tester", "Consultant"][(consultants.length + i) % 3] as any,
                consultantType: (consultants.length + i) % 2 === 0 ? "Individual" : "Agency" as any,
                isVerified: (consultants.length + i) % 2 === 0,
                rating: 4.6 + ((consultants.length + i) % 5) * 0.1,
                reviewCount: 120 + (consultants.length + i) * 20,
                experience: `${10 + (consultants.length + i)}+ Years`,
            }));

            setConsultants(prev => [...prev, ...newConsultants]);
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
                {consultants.map((consultant) => (
                    <ServiceCard key={consultant.id} {...consultant} />
                ))}
            </div>

            {/* Loading Indicator */}
            {hasMore && (
                <div ref={ref} className="flex justify-center items-center py-8 col-span-full">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading more consultants...</span>
                        </div>
                    )}
                </div>
            )}

            {/* End Message */}
            {!hasMore && consultants.length > 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm col-span-full">
                    You've reached the end of the results
                </div>
            )}
        </>
    );
}
