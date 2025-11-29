import { Heart, CheckCircle2, User, Building2, Star, Calendar, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
    id: number;
    name: string;
    serviceType: "Veterinary" | "Crop Tester" | "Consultant";
    consultantType: "Individual" | "Agency";
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    experience: string;
    viewMode?: "grid" | "list";
}

export function ServiceCard({
    id,
    name,
    serviceType,
    consultantType,
    isVerified,
    rating,
    reviewCount,
    experience,
    viewMode = "grid",
}: ServiceCardProps) {
    const isIndividual = consultantType === "Individual";

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

                {/* Avatar Section */}
                <div className="relative w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
                    <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-white">
                        {isIndividual ? (
                            <User className="h-10 w-10 text-green-600" />
                        ) : (
                            <Building2 className="h-10 w-10 text-green-600" />
                        )}
                    </div>
                    {isVerified && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm border border-green-100">
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
                                <Badge variant="outline" className="text-xs font-normal border-primary/20 text-primary bg-primary/5">
                                    {serviceType}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                    <span className="font-medium text-foreground">{rating}</span>
                                    <span>({reviewCount} reviews)</span>
                                </div>
                                <span className="text-border">|</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {experience} Exp.
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <Badge variant={isIndividual ? "secondary" : "default"} className="mb-1">
                                {consultantType}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/50 pt-4 mt-auto">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium text-xs">Available Today</span>
                            </div>
                            <div className="sm:hidden">
                                <Badge variant="outline">{consultantType}</Badge>
                            </div>
                        </div>

                        <Button className="w-full sm:w-auto gap-2 shadow-sm bg-green-600 hover:bg-green-700">
                            Book Consultation
                            <ArrowRight className="h-4 w-4" />
                        </Button>
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

            <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center border-b border-border/50">
                <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center border-2 border-white group-hover:scale-105 transition-transform duration-300">
                    {isIndividual ? (
                        <User className="h-10 w-10 text-green-600" />
                    ) : (
                        <Building2 className="h-10 w-10 text-green-600" />
                    )}
                </div>
                {isVerified && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm border border-green-100">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs font-normal border-primary/20 text-primary bg-primary/5">
                        {serviceType}
                    </Badge>
                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 border border-yellow-100 shrink-0">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {rating}
                    </div>
                </div>

                <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>{consultantType}</span>
                    <span className="text-border">•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {experience}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border/50">
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm" size="sm">
                        Book Now
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
