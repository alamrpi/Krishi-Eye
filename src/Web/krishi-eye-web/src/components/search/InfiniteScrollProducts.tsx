"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ItemCard } from "@/components/home/ItemCard";
import { Loader2 } from "lucide-react";

interface Product {
    id: number;
    title: string;
    price: number;
    regularPrice: number;
    unit: string;
    sellerName: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    productType: string;
    discountPercentage: number;
    transportIncluded: boolean;
}

interface InfiniteScrollProductsProps {
    initialProducts: Product[];
    query: string;
    viewMode?: "grid" | "list";
}

export function InfiniteScrollProducts({ initialProducts, query, viewMode = "grid" }: InfiniteScrollProductsProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
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

        // Simulate API call - Replace with actual API
        setTimeout(() => {
            const newProducts = Array(8).fill(null).map((_, i) => ({
                id: products.length + i + 1,
                title: `Product ${products.length + i + 1} - ${query || "Sample"}`,
                price: 500 + (products.length + i) * 100,
                regularPrice: 600 + (products.length + i) * 100,
                unit: "kg",
                sellerName: `Seller ${products.length + i + 1}`,
                isVerified: (products.length + i) % 2 === 0,
                rating: 4.5 + ((products.length + i) % 5) * 0.1,
                reviewCount: 100 + (products.length + i) * 10,
                imageUrl: `https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop`,
                productType: ["Seeds", "Fertilizer", "Equipment"][(products.length + i) % 3],
                discountPercentage: (products.length + i) % 2 === 0 ? 10 : 0,
                transportIncluded: (products.length + i) % 3 === 0,
            }));

            setProducts(prev => [...prev, ...newProducts]);
            setPage(prev => prev + 1);
            setIsLoading(false);

            // Stop loading after 5 pages (40 products)
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
                {products.map((product) => (
                    <ItemCard key={product.id} {...product} viewMode={viewMode} />
                ))}
            </div>

            {/* Loading Indicator */}
            {hasMore && (
                <div ref={ref} className="flex justify-center items-center py-8 col-span-full">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading more products...</span>
                        </div>
                    )}
                </div>
            )}

            {/* End Message */}
            {!hasMore && products.length > 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm col-span-full">
                    You've reached the end of the results
                </div>
            )}
        </>
    );
}
