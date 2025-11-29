import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
    rating: number; // 0 to 5
    count?: number;
    className?: string;
}

export function Rating({ rating, count, className }: RatingProps) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "h-4 w-4",
                            star <= rating ? "fill-accent text-accent" : "fill-muted text-muted-foreground"
                        )}
                    />
                ))}
            </div>
            {count !== undefined && (
                <span className="text-xs text-muted-foreground">({count})</span>
            )}
        </div>
    );
}
