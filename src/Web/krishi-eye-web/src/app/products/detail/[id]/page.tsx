import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { mockProduct } from "@/data/mockProduct";
import { ChevronRight, Home, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // In a real app, we would fetch product data based on id
    // const product = await fetchProduct(id);
    const product = mockProduct;

    return (
        <div className="min-h-screen bg-white pb-24 sm:pb-12">
            <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-6">
                {/* Breadcrumbs - Hidden on Mobile */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">
                        <Home className="h-4 w-4" />
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/search" className="hover:text-primary transition-colors">
                        Products
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">
                        {product.title}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 lg:gap-12 mb-12">
                    {/* Left Column: Gallery */}
                    <div>
                        <ProductGallery images={product.images} title={product.title} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="px-4 sm:px-0 pt-6 sm:pt-0">
                        <ProductInfo product={product} />
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="px-4 sm:px-0 mb-12">
                    <ProductTabs product={product} />
                </div>

                {/* Related Products */}
                <div className="border-t border-gray-100">
                    <div className="container mx-auto">
                        <RelatedProducts />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 sm:hidden z-50 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button variant="outline" className="flex-1 rounded-full border-primary text-primary hover:bg-primary/5">
                    Add to Cart
                </Button>
                <Button className="flex-1 rounded-full shadow-lg shadow-primary/20">
                    Buy Now
                </Button>
            </div>
        </div>
    );
}
