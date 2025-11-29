"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
    trigger: string;
    children: React.ReactNode;
    className?: string;
}

export function MegaMenu({ trigger, children, className }: MegaMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
            >
                {trigger}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-border rounded-xl shadow-xl z-50 p-6",
                        className
                    )}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {children}
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
            <h3 className="font-semibold text-sm text-foreground mb-3">{title}</h3>
            <div className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                    >
                        <div className="font-medium text-sm group-hover:text-primary transition-colors">
                            {item.label}
                        </div>
                        {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
