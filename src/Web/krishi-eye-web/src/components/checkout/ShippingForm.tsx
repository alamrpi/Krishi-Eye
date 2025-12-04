"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export interface ShippingFormData {
    fullName: string;
    phone: string;
    email: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    saveAddress: boolean;
}

interface ShippingFormProps {
    formData: ShippingFormData;
    onFormChange: (data: Partial<ShippingFormData>) => void;
    errors: Record<string, string>;
}

export function ShippingForm({ formData, onFormChange, errors }: ShippingFormProps) {
    const divisions = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

    return (
        <Card className="p-6 border-0 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Shipping Information</h2>

            <div className="space-y-4">
                {/* Full Name */}
                <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => onFormChange({ fullName: e.target.value })}
                        className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={formData.phone}
                            onChange={(e) => onFormChange({ phone: e.target.value })}
                            className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => onFormChange({ email: e.target.value })}
                        />
                    </div>
                </div>

                {/* Division, District, Upazila */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="division">Division *</Label>
                        <select
                            id="division"
                            value={formData.division}
                            onChange={(e) => onFormChange({ division: e.target.value })}
                            className={`w-full h-10 px-3 rounded-md border ${errors.division ? "border-red-500" : "border-gray-200"} bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                        >
                            <option value="">Select</option>
                            {divisions.map((div) => (
                                <option key={div} value={div}>{div}</option>
                            ))}
                        </select>
                        {errors.division && <p className="text-xs text-red-500 mt-1">{errors.division}</p>}
                    </div>

                    <div>
                        <Label htmlFor="district">District *</Label>
                        <Input
                            id="district"
                            type="text"
                            placeholder="Enter district"
                            value={formData.district}
                            onChange={(e) => onFormChange({ district: e.target.value })}
                            className={errors.district ? "border-red-500" : ""}
                        />
                        {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                    </div>

                    <div>
                        <Label htmlFor="upazila">Upazila *</Label>
                        <Input
                            id="upazila"
                            type="text"
                            placeholder="Enter upazila"
                            value={formData.upazila}
                            onChange={(e) => onFormChange({ upazila: e.target.value })}
                            className={errors.upazila ? "border-red-500" : ""}
                        />
                        {errors.upazila && <p className="text-xs text-red-500 mt-1">{errors.upazila}</p>}
                    </div>
                </div>

                {/* Full Address */}
                <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <textarea
                        id="address"
                        rows={3}
                        placeholder="House/Flat no., Road, Area, Landmark"
                        value={formData.address}
                        onChange={(e) => onFormChange({ address: e.target.value })}
                        className={`w-full px-3 py-2 rounded-md border ${errors.address ? "border-red-500" : "border-gray-200"} bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                {/* Save Address */}
                <div className="pt-2">
                    <Checkbox
                        id="saveAddress"
                        checked={formData.saveAddress}
                        onChange={(e) => onFormChange({ saveAddress: (e.target as HTMLInputElement).checked })}
                        label="Save this address for future orders"
                    />
                </div>
            </div>
        </Card>
    );
}
