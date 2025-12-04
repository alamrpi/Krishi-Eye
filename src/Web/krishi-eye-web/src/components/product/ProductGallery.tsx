"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

// Helper function to check if URL is a YouTube video
const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
};

// Extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&]+)/,
        /(?:youtube\.com\/embed\/)([^?]+)/,
        /(?:youtu\.be\/)([^?]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const currentMedia = images[selectedImage];
    const isVideo = isYouTubeUrl(currentMedia);
    const videoId = isVideo ? getYouTubeVideoId(currentMedia) : null;

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setIsZoomed(false); // Reset zoom when changing images
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setIsZoomed(false); // Reset zoom when changing images
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !imageContainerRef.current) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setMousePosition({ x, y });
    };

    const toggleZoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isVideo) {
            setIsZoomed(!isZoomed);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image/Video Container */}
            <div
                ref={imageContainerRef}
                className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden bg-gray-50 sm:rounded-2xl group",
                    !isVideo && (isZoomed ? "cursor-zoom-out" : "cursor-zoom-in")
                )}
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {isVideo && videoId ? (
                    <div className="w-full h-full">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                ) : (
                    <Image
                        src={currentMedia}
                        alt={title}
                        fill
                        className={cn(
                            "object-contain object-center transition-all duration-300",
                            isZoomed && "scale-[2.5]"
                        )}
                        style={
                            isZoomed
                                ? {
                                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                }
                                : undefined
                        }
                        priority
                    />
                )}

                {/* Navigation Arrows (Desktop & Mobile) - Hidden when zoomed */}
                {!isZoomed && (
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm pointer-events-auto"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm pointer-events-auto"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                )}

                {/* Zoom Hint Badge */}
                {!isVideo && !isZoomed && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <ZoomIn className="h-3.5 w-3.5" />
                        Click to Zoom
                    </div>
                )}

                {/* Zoom Out Hint Badge */}
                {!isVideo && isZoomed && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5 transition-opacity pointer-events-none">
                        <ZoomOut className="h-3.5 w-3.5" />
                        Click to Zoom Out
                    </div>
                )}

                {/* Mobile Dots Indicator - Hidden when zoomed */}
                {!isZoomed && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:hidden pointer-events-none">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                    selectedImage === index ? "w-6 bg-primary" : "w-1.5 bg-white/60"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Thumbnails */}
            <div className="hidden sm:flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((media, index) => {
                    const isThumbnailVideo = isYouTubeUrl(media);
                    const thumbnailVideoId = isThumbnailVideo ? getYouTubeVideoId(media) : null;

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "relative aspect-square w-20 min-w-[5rem] overflow-hidden rounded-lg bg-gray-50 transition-all",
                                selectedImage === index
                                    ? "ring-2 ring-primary ring-offset-2"
                                    : "opacity-70 hover:opacity-100"
                            )}
                        >
                            {isThumbnailVideo && thumbnailVideoId ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={`https://img.youtube.com/vi/${thumbnailVideoId}/mqdefault.jpg`}
                                        alt={`${title} video thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover object-center"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <Play className="h-6 w-6 text-white fill-white" />
                                    </div>
                                </div>
                            ) : (
                                <Image
                                    src={media}
                                    alt={`${title} thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover object-center"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
