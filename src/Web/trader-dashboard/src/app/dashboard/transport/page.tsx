"use client"

import { Button } from "@/components/ui/button";
import { Truck, Calendar, MapPin, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { transportService } from "@/services/transportService";

export default function TransportPage() {
    const { data: requests, isLoading } = useQuery({
        queryKey: ['transport-requests'],
        queryFn: transportService.getTransportRequests
    });

    if (isLoading) {
        return <div>Loading requests...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport Requests</h1>
                    <p className="text-gray-500">Manage your transport requests for sales and purchases.</p>
                </div>
                <Button className="gap-2">
                    <Truck className="h-4 w-4" /> New Request
                </Button>
            </div>

            {requests && requests.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                        request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(request.scheduledTime).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-gray-500 text-xs">Pickup</p>
                                        <p className="font-medium">{request.pickupAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-gray-500 text-xs">Drop</p>
                                        <p className="font-medium">{request.dropAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Package className="h-4 w-4" />
                                    <span>{request.goodsType} ({request.weightKg} kg)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm p-12 text-center text-gray-500">
                    No active transport requests.
                </div>
            )}
        </div>
    );
}
