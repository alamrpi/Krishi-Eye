import { Heart, CheckCircle2, Truck, MapPin, Star, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TransporterCardProps {
    id: number;
    name: string;
    vehicleCount: number;
    vehicleTypes: string[];
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    location: string;
    viewMode?: "grid" | "list";
}

export function TransporterCard({
    id,
    name,
    vehicleCount,
    vehicleTypes,
    isVerified,
    rating,
    reviewCount,
    location,
    viewMode = "grid",
}: TransporterCardProps) {
    if (viewMode === "list") {
        return (
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row w-full border-border/50 relative">
                {/* Favorite Button - Always Visible */}
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full z-10"
                >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
                </Button>

                {/* Icon/Image Section */}
                <div className="relative w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        <Truck className="h-8 w-8 text-primary" />
                    </div>
                    {isVerified && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm border border-blue-100">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                    {name}
                                </h3>
                                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 border border-yellow-100">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    {rating}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {location}
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-xs text-muted-foreground mb-1">Total Fleet</div>
                            <div className="font-bold text-lg text-primary">{vehicleCount} Vehicles</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/50 pt-4 mt-auto">
                        <div className="flex flex-wrap gap-2">
                            {vehicleTypes.map((type) => (
                                <Badge key={type} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-secondary-foreground font-normal">
                                    {type}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="sm:hidden flex-1">
                                <span className="text-xs text-muted-foreground">Fleet: </span>
                                <span className="font-bold text-primary">{vehicleCount}</span>
                            </div>
                            <Button className="flex-1 sm:flex-none gap-2 shadow-sm">
                                <Phone className="h-4 w-4" />
                                Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Grid View
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border-border/50 relative">
            {/* Favorite Button - Always Visible */}
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full z-10"
            >
                <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
            </Button>

            <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-b border-border/50">
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Truck className="h-10 w-10 text-primary" />
                </div>
                {isVerified && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm border border-blue-100">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 border border-yellow-100 shrink-0">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {rating}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {vehicleTypes.slice(0, 3).map((type) => (
                        <Badge key={type} variant="secondary" className="bg-secondary/50 font-normal text-xs">
                            {type}
                        </Badge>
                    ))}
                    {vehicleTypes.length > 3 && (
                        <Badge variant="secondary" className="bg-secondary/50 font-normal text-xs">
                            +{vehicleTypes.length - 3}
                        </Badge>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Available</p>
                        <p className="font-bold text-primary">{vehicleCount} Vehicles</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-9 px-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                        Contact
                    </Button>
                </div>
            </div>
        </Card>
    );
}
