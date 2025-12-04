import { Heart, CheckCircle2, ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";

interface ItemCardProps {
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
    viewMode?: "grid" | "list";
}

export function ItemCard({
    id,
    title,
    price,
    regularPrice,
    unit,
    sellerName,
    isVerified,
    rating,
    reviewCount,
    imageUrl,
    productType,
    discountPercentage,
    transportIncluded,
    viewMode = "grid",
}: ItemCardProps) {
    if (viewMode === "list") {
        return (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-row h-48 w-full border-0 shadow-sm">
                {/* Image Section */}
                <div className="relative w-48 shrink-0 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {discountPercentage > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{discountPercentage}%
                        </Badge>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-4 justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <Badge variant="secondary" className="mb-2 text-xs">
                                    {productType}
                                </Badge>
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {title}
                                </h3>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-xl text-primary">
                                    ৳{price}
                                    <span className="text-sm font-normal text-muted-foreground">/{unit}</span>
                                </div>
                                {discountPercentage > 0 && (
                                    <div className="text-sm text-muted-foreground line-through">
                                        ৳{regularPrice}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="font-medium text-foreground">{rating}</span>
                                <span>({reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>{sellerName}</span>
                                {isVerified && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                            </div>
                        </div>

                        {transportIncluded && (
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <Truck className="h-3 w-3" />
                                <span>Transport Included</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button className="gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Link href={ROUTES.product(id)} className="block h-full">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full border-0 shadow-sm relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {discountPercentage > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{discountPercentage}%
                        </Badge>
                    )}

                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => {
                            e.preventDefault();
                            // Add to wishlist logic
                        }}
                    >
                        <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="mb-2 text-xs">
                            {productType}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs font-medium">
                            <span className="text-yellow-500">★</span>
                            {rating} ({reviewCount})
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <span className="line-clamp-1">{sellerName}</span>
                        {isVerified && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                    </div>

                    <div className="mt-auto pt-3 border-t flex items-center justify-between">
                        <div>
                            <div className="font-bold text-lg text-primary">
                                ৳{price}
                                <span className="text-sm font-normal text-muted-foreground">/{unit}</span>
                            </div>
                            {discountPercentage > 0 && (
                                <div className="text-xs text-muted-foreground line-through">
                                    ৳{regularPrice}
                                </div>
                            )}
                        </div>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-colors z-10"
                            onClick={(e) => {
                                e.preventDefault();
                                // Add to cart logic
                            }}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
