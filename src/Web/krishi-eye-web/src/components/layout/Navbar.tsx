"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu, MegaMenuSection } from "./MegaMenu";
import { useState } from "react";

export function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const router = useRouter();

    return (
        <>
            {/* Top Bar - Contact Info */}
            <div className="bg-primary text-primary-foreground py-1 text-xs font-medium">
                <div className="container max-w-screen-2xl flex justify-between items-center px-4 md:px-8">
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
            <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
                <div className="container max-w-screen-2xl flex h-20 items-center justify-between px-4 md:px-8 gap-4">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                            <span className="text-primary-foreground font-bold text-2xl">K</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-2xl tracking-tight text-foreground">
                            Krishi<span className="text-primary">Eye</span>
                        </span>
                    </Link>

                    {/* Search Bar - Centered & Prominent */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const query = formData.get('q') as string;
                            if (query.trim()) {
                                router.push(`/search?q=${encodeURIComponent(query)}&type=products`);
                            }
                        }}
                        className="hidden md:flex flex-1 max-w-xl mx-auto relative"
                    >
                        <input
                            type="text"
                            name="q"
                            placeholder="Search for seeds, fertilizers, or services..."
                            className="w-full h-11 pl-4 pr-12 rounded-full border border-input bg-muted/30 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <Button type="submit" size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    {/* Actions Area */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Desktop Navigation with Mega Menus */}
                        <div className="hidden md:flex items-center gap-6 mr-4">
                            {/* Products Dropdown (renamed from Items) */}
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

                            {/* Transporters Dropdown */}
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

                            {/* Consultants Dropdown (renamed from Services) */}
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

                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative group">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white group-hover:scale-110 transition-transform"></span>
                        </Button>

                        <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary font-semibold">
                            <User className="h-4 w-4" /> Sign In
                        </Button>

                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </header>
        </>
    );
}
