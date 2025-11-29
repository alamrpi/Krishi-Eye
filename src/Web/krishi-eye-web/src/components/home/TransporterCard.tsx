import { Heart, CheckCircle2, Truck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";

interface TransporterCardProps {
    name: string;
    vehicleCount: number;
    vehicleTypes: string[]; // Array of vehicle types like ["Truck", "Pickup Van"]
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    location: string;
}

export function TransporterCard({
    name,
    vehicleCount,
    vehicleTypes,
    isVerified,
    rating,
    reviewCount,
    location,
}: TransporterCardProps) {
    return (
        <Card className="group border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-lg overflow-hidden flex flex-col h-full">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h3 className="font-semibold text-base text-foreground">{name}</h3>
                                {isVerified && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary fill-primary/10" aria-label="Verified Transporter" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{location}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Heart className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Vehicle Count */}
                <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Total Vehicles</p>
                    <p className="font-bold text-lg text-primary">{vehicleCount} Vehicles</p>
                </div>

                {/* Vehicle Types as Badges */}
                <div className="mb-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Vehicle Types</p>
                    <div className="flex flex-wrap gap-1.5">
                        {vehicleTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-[10px] py-0.5 px-2">
                                {type}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Rating rating={rating} count={reviewCount} className="text-xs" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Button className="w-full rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all h-8 text-xs">
                    Contact Now
                </Button>
            </CardFooter>
        </Card>
    );
}
