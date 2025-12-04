"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";

interface ProductTabsProps {
    product: any;
}

export function ProductTabs({ product }: ProductTabsProps) {
    return (
        <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-100 rounded-none h-auto p-0 bg-transparent gap-8 overflow-x-auto scrollbar-hide">
                <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium text-gray-500 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                >
                    Description
                </TabsTrigger>
                <TabsTrigger
                    value="specifications"
                    className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium text-gray-500 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                >
                    Specifications
                </TabsTrigger>
                <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium text-gray-500 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                >
                    Reviews ({product.reviews.length})
                </TabsTrigger>
            </TabsList>

            <div className="mt-8">
                <TabsContent value="description" className="text-gray-600 leading-relaxed animate-in fade-in-50 duration-300">
                    <p>{product.description}</p>
                    <p className="mt-4">
                        Our premium Miniket rice is processed using state-of-the-art technology to ensure that every grain retains its natural aroma and nutritional value. It is free from stones, dust, and other impurities.
                    </p>
                </TabsContent>

                <TabsContent value="specifications" className="animate-in fade-in-50 duration-300">
                    <div className="rounded-xl overflow-hidden border border-gray-100">
                        <table className="w-full text-sm text-left">
                            <tbody className="divide-y divide-gray-100">
                                {product.specifications.map((spec: any, index: number) => (
                                    <tr key={index} className="bg-white">
                                        <td className="px-6 py-4 font-medium text-gray-500 w-1/3 bg-gray-50/50">
                                            {spec.label}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {spec.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="animate-in fade-in-50 duration-300">
                    <div className="flex flex-col gap-6">
                        {product.reviews.map((review: any) => (
                            <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.user}</h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-gray-100 text-gray-100"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    );
}
