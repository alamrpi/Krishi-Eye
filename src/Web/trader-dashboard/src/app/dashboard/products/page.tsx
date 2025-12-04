"use client"

import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/catalog/ProductTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";

export default function ProductsPage() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: catalogService.getProducts,
    });

    if (isLoading) return <div>Loading products...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-gray-500">Manage your product catalog and inventory.</p>
                </div>
                <Link href="/dashboard/products/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <ProductTable products={products || []} />
        </div>
    );
}
