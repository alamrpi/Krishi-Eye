"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, Phone, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu, MegaMenuSection } from "./MegaMenu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

    const router = useRouter();

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('q') as string;
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}&type=products`);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <>
            {/* Top Bar - Contact Info */}
            <div className="bg-primary text-primary-foreground py-1.5 text-xs font-medium">
                <div className="w-full px-4 md:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +880 1234 567890</span>
                        <span className="hidden sm:inline">support@krishieye.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/track-order" className="hover:underline">Track Order</Link>
                        <Link href="/offers" className="hover:underline">Offers</Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 md:px-8 flex h-20 items-center justify-between gap-4">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                            <span className="text-primary-foreground font-bold text-2xl">K</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-2xl tracking-tight text-foreground">
                            Krishi<span className="text-primary">Eye</span>
                        </span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex flex-1 max-w-2xl mx-auto relative"
                    >
                        <input
                            type="text"
                            name="q"
                            placeholder="Search for seeds, fertilizers, or services..."
                            className="w-full h-11 pl-5 pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    {/* Actions Area */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-gray-600"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        >
                            {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                        </Button>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6 mr-4">
                            <MegaMenu
                                trigger="Products"
                                className="w-[600px]"
                                isOpen={openDropdown === "products"}
                                onOpenChange={(open) => setOpenDropdown(open ? "products" : null)}
                            >
                                <div className="grid grid-cols-3 gap-6">
                                    <MegaMenuSection
                                        title="Seeds"
                                        items={[
                                            { label: "Rice Seeds", href: "/products/seeds/rice" },
                                            { label: "Wheat Seeds", href: "/products/seeds/wheat" },
                                            { label: "Corn Seeds", href: "/products/seeds/corn" },
                                            { label: "Vegetable Seeds", href: "/products/seeds/vegetables" },
                                        ]}
                                    />
                                    <MegaMenuSection
                                        title="Fertilizers"
                                        items={[
                                            { label: "Organic", href: "/products/fertilizers/organic" },
                                            { label: "Chemical", href: "/products/fertilizers/chemical" },
                                            { label: "Compost", href: "/products/fertilizers/compost" },
                                        ]}
                                    />
                                    <MegaMenuSection
                                        title="Equipment"
                                        items={[
                                            { label: "Hand Tools", href: "/products/equipment/hand-tools" },
                                            { label: "Irrigation", href: "/products/equipment/irrigation" },
                                            { label: "Pesticides", href: "/products/equipment/pesticides" },
                                        ]}
                                    />
                                </div>
                            </MegaMenu>

                            <MegaMenu
                                trigger="Transporters"
                                className="w-[300px]"
                                isOpen={openDropdown === "transporters"}
                                onOpenChange={(open) => setOpenDropdown(open ? "transporters" : null)}
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    <MegaMenuSection
                                        title="Vehicle Type"
                                        items={[
                                            { label: "Trucks (5+ Ton)", href: "/transporters/trucks" },
                                            { label: "Pickup Vans", href: "/transporters/pickup-vans" },
                                            { label: "Covered Vans", href: "/transporters/covered-vans" },
                                            { label: "Refrigerated", href: "/transporters/refrigerated" },
                                            { label: "Open Trucks", href: "/transporters/open-trucks" },
                                        ]}
                                    />
                                </div>
                            </MegaMenu>

                            <MegaMenu
                                trigger="Consultants"
                                className="w-[500px]"
                                isOpen={openDropdown === "consultants"}
                                onOpenChange={(open) => setOpenDropdown(open ? "consultants" : null)}
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <MegaMenuSection
                                        title="Veterinary"
                                        items={[
                                            { label: "Cattle Specialists", href: "/consultants/veterinary/cattle" },
                                            { label: "Poultry Doctors", href: "/consultants/veterinary/poultry" },
                                            { label: "General Vets", href: "/consultants/veterinary/general" },
                                        ]}
                                    />
                                    <MegaMenuSection
                                        title="Crop Experts"
                                        items={[
                                            { label: "Soil Testing", href: "/consultants/crop/soil-testing" },
                                            { label: "Pest Control", href: "/consultants/crop/pest-control" },
                                            { label: "Crop Advisors", href: "/consultants/crop/advisors" },
                                        ]}
                                    />
                                </div>
                            </MegaMenu>
                        </div>

                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary relative group">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white group-hover:scale-110 transition-transform"></span>
                        </Button>

                        <Button variant="outline" className="hidden lg:flex gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary font-semibold">
                            <User className="h-4 w-4" /> Sign In
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-gray-600"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar (Expandable) */}
                {isMobileSearchOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white p-4 animate-in slide-in-from-top-2">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                name="q"
                                placeholder="Search..."
                                className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                autoFocus
                            />
                            <Button type="submit" size="icon" className="absolute right-0 top-0 h-10 w-10 text-gray-500 hover:text-primary">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Content */}
                    <div className="absolute top-0 right-0 bottom-0 w-[300px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-lg">Menu</span>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {/* Mobile Navigation Items */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => setMobileExpandedSection(mobileExpandedSection === 'products' ? null : 'products')}
                                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left font-medium"
                                >
                                    Products
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileExpandedSection === 'products' && "rotate-180")} />
                                </button>
                                {mobileExpandedSection === 'products' && (
                                    <div className="pl-4 space-y-1 pb-2">
                                        <Link href="/products/seeds" className="block p-2 text-sm text-gray-600 hover:text-primary">Seeds</Link>
                                        <Link href="/products/fertilizers" className="block p-2 text-sm text-gray-600 hover:text-primary">Fertilizers</Link>
                                        <Link href="/products/equipment" className="block p-2 text-sm text-gray-600 hover:text-primary">Equipment</Link>
                                    </div>
                                )}

                                <button
                                    onClick={() => setMobileExpandedSection(mobileExpandedSection === 'transporters' ? null : 'transporters')}
                                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left font-medium"
                                >
                                    Transporters
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileExpandedSection === 'transporters' && "rotate-180")} />
                                </button>
                                {mobileExpandedSection === 'transporters' && (
                                    <div className="pl-4 space-y-1 pb-2">
                                        <Link href="/transporters/trucks" className="block p-2 text-sm text-gray-600 hover:text-primary">Trucks</Link>
                                        <Link href="/transporters/pickup-vans" className="block p-2 text-sm text-gray-600 hover:text-primary">Pickup Vans</Link>
                                    </div>
                                )}

                                <button
                                    onClick={() => setMobileExpandedSection(mobileExpandedSection === 'consultants' ? null : 'consultants')}
                                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left font-medium"
                                >
                                    Consultants
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileExpandedSection === 'consultants' && "rotate-180")} />
                                </button>
                                {mobileExpandedSection === 'consultants' && (
                                    <div className="pl-4 space-y-1 pb-2">
                                        <Link href="/consultants/veterinary" className="block p-2 text-sm text-gray-600 hover:text-primary">Veterinary</Link>
                                        <Link href="/consultants/crop" className="block p-2 text-sm text-gray-600 hover:text-primary">Crop Experts</Link>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 my-4 pt-4">
                                <Link href="/track-order" className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left font-medium">
                                    Track Order
                                </Link>
                                <Link href="/offers" className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left font-medium">
                                    Offers
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <Button className="w-full gap-2 rounded-full font-semibold">
                                <User className="h-4 w-4" /> Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
