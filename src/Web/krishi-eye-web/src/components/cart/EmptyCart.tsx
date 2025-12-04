import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="mb-6 h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>

            <h2 className="text-3xl font-bold mb-3 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                Looks like you haven&apos;t added any items to your cart yet. Start shopping to find amazing agricultural products!
            </p>

            <Link href="/">
                <Button size="lg" className="gap-2 rounded-full px-8 shadow-lg">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>

            {/* Featured suggestions could go here */}
            <div className="mt-12 w-full max-w-4xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Seeds", "Fertilizers", "Equipment", "Services"].map((category) => (
                        <Link
                            key={category}
                            href={`/products?category=${category.toLowerCase()}`}
                            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center font-medium text-gray-700 hover:text-primary"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
