"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

export function ProductForm() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        // Handle success/redirect
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/listings">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
                        <p className="text-gray-500">Fill in the details to list your product.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button">Discard</Button>
                    <Button type="submit" disabled={isLoading} className="gap-2">
                        <Save className="h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Product Title</Label>
                            <Input id="title" placeholder="e.g., Fresh Organic Mangoes" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe your product..." className="min-h-[120px]" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing and Inventory */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (৳)</Label>
                                <Input id="price" type="number" placeholder="0.00" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">Kg</SelectItem>
                                        <SelectItem value="ton">Ton</SelectItem>
                                        <SelectItem value="piece">Piece</SelectItem>
                                        <SelectItem value="liter">Liter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input id="stock" type="number" placeholder="0" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Category and Location */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category & Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fruits">Fruits</SelectItem>
                                    <SelectItem value="vegetables">Vegetables</SelectItem>
                                    <SelectItem value="seeds">Seeds</SelectItem>
                                    <SelectItem value="fertilizers">Fertilizers</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                                Can't find your category? <button type="button" className="text-primary hover:underline">Request new category</button>
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g., Rajshahi, Bangladesh" />
                        </div>
                    </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>SEO Settings (Search Engine Optimization)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input id="slug" placeholder="fresh-organic-mangoes" />
                            <p className="text-xs text-gray-500">The unique part of the product URL.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input id="metaTitle" placeholder="Page title for search engines" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea id="metaDescription" placeholder="Brief description for search results..." />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
