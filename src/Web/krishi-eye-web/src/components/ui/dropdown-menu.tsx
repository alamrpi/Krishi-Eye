"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function DropdownMenu({ trigger, children, className }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
            >
                {trigger}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute top-full left-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 min-w-[200px]",
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

interface DropdownItemProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
}

export function DropdownItem({ children, href, onClick, className }: DropdownItemProps) {
    const Component = href ? "a" : "button";

    return (
        <Component
            href={href}
            onClick={onClick}
            className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                className
            )}
        >
            {children}
        </Component>
    );
}

interface DropdownSectionProps {
    title: string;
    children: React.ReactNode;
}

export function DropdownSection({ title, children }: DropdownSectionProps) {
    return (
        <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {title}
            </div>
            {children}
        </div>
    );
}
