import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ListingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
                    <p className="text-gray-500">Manage your product catalog and inventory.</p>
                </div>
                <Link href="/dashboard/listings/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add New Product
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search listings..."
                        className="pl-9"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            {/* Listings Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-900">Product</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Stock</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {/* Placeholder Row */}
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100"></div>
                                    <div>
                                        <div className="font-medium text-gray-900">Fresh Mangoes</div>
                                        <div className="text-gray-500 text-xs">ID: #12345</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">Fruits</td>
                            <td className="px-6 py-4 font-medium">৳ 120.00</td>
                            <td className="px-6 py-4 text-gray-600">500 kg</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
