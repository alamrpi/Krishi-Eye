"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
    trigger: string;
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MegaMenu({ trigger, children, className, isOpen, onOpenChange }: MegaMenuProps) {
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onOpenChange(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onOpenChange]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-md transition-all duration-200",
                    isOpen
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-muted/50"
                )}
                onClick={() => onOpenChange(!isOpen)}
                onMouseEnter={() => onOpenChange(true)}
            >
                {trigger}
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-2",
                        "bg-white border border-border/50 rounded-2xl shadow-2xl z-50",
                        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
                        className
                    )}
                    onMouseLeave={() => onOpenChange(false)}
                >
                    {/* Dropdown Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <div className="w-4 h-4 bg-white border-l border-t border-border/50 rotate-45"></div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

interface MegaMenuSectionProps {
    title: string;
    items: { label: string; href: string; description?: string }[];
}

export function MegaMenuSection({ title, items }: MegaMenuSectionProps) {
    return (
        <div>
            <h3 className="font-bold text-sm text-foreground mb-4 pb-2 border-b border-border/40">
                {title}
            </h3>
            <div className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-primary/5 transition-all duration-200 group"
                    >
                        <div className="flex-1">
                            <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                {item.label}
                            </div>
                            {item.description && (
                                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                    {item.description}
                                </div>
                            )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
