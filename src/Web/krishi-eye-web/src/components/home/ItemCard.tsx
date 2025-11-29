import { Heart, CheckCircle2, ShoppingCart, Truck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import Image from "next/image";

interface ItemCardProps {
    title: string;
    price: number;
    regularPrice?: number;
    unit: string;
    sellerName: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    productType?: string;
    discountPercentage?: number;
    transportIncluded?: boolean;
}

export function ItemCard({
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
}: ItemCardProps) {
    return (
        <Card className="group border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-lg overflow-hidden flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-white p-2">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Discount Badge */}
                {discountPercentage && discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-md">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Product Type Badge */}
                {productType && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs py-0">
                            {productType}
                        </Badge>
                    </div>
                )}

                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white shadow-md hover:bg-red-50 hover:text-red-500 text-muted-foreground translate-y-2 group-hover:translate-y-0"
                >
                    <Heart className="h-4 w-4" />
                </Button>
            </div>

            <CardContent className="p-3 flex-1 flex flex-col">
                {/* Product Type & Transport Badge - Always Visible */}
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {productType && (
                        <Badge variant="outline" className="w-fit text-[10px] border-primary/30 text-primary py-0 px-1.5">
                            {productType}
                        </Badge>
                    )}
                    {transportIncluded !== undefined && (
                        <Badge
                            variant={transportIncluded ? "default" : "secondary"}
                            className={`w-fit text-[10px] py-0 px-1.5 flex items-center gap-0.5 ${transportIncluded
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-muted text-muted-foreground"
                                }`}
                        >
                            <Truck className="h-2.5 w-2.5" />
                            {transportIncluded ? "Transport" : "No Transport"}
                        </Badge>
                    )}
                </div>

                <div className="mb-1.5">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
                        {title}
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <span className="truncate max-w-[120px]">{sellerName}</span>
                    {isVerified && (
                        <CheckCircle2 className="h-3 w-3 text-primary fill-primary/10" aria-label="Verified Seller" />
                    )}
                </div>

                <div className="mt-auto">
                    <div className="flex items-end gap-1.5 mb-1.5">
                        <span className="text-lg font-bold text-primary">৳{price}</span>
                        {regularPrice && regularPrice > price && (
                            <span className="text-xs text-muted-foreground line-through mb-0.5">৳{regularPrice}</span>
                        )}
                        <span className="text-xs text-muted-foreground mb-0.5">/{unit}</span>
                    </div>
                    <Rating rating={rating} count={reviewCount} className="mb-0 text-xs" />
                </div>
            </CardContent>

            <CardFooter className="p-3 pt-0">
                <Button className="w-full rounded-md bg-primary text-white hover:bg-primary/90 font-semibold shadow-sm hover:shadow transition-all h-8 text-xs">
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
