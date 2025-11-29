import { useState } from 'react'
import { useNearbyRequests, useSubmitBid, useDrivers, useVehicles } from '../hooks/useTransportApi'
import { MapPinIcon, TruckIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function NewRequests() {
    // TODO: Get user's current location - for now using Dhaka coordinates
    const userLat = 23.8103
    const userLng = 90.4125

    const { data: requests, isLoading, error } = useNearbyRequests(userLat, userLng, 50)
    const { data: drivers } = useDrivers()
    const { data: vehicles } = useVehicles()
    const submitBidMutation = useSubmitBid()

    const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
    const [showBidModal, setShowBidModal] = useState(false)
    const [bidData, setBidData] = useState({
        bidAmount: '',
        note: '',
        driverId: '',
        vehicleId: '',
    })

    const handleSubmitBid = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedRequest || !bidData.bidAmount || !bidData.driverId || !bidData.vehicleId) {
            toast.error('Please fill all required fields')
            return
        }

        try {
            await submitBidMutation.mutateAsync({
                requestId: selectedRequest.id,
                bidAmount: parseFloat(bidData.bidAmount),
                note: bidData.note || undefined,
                driverId: bidData.driverId,
                vehicleId: bidData.vehicleId,
            })

            setShowBidModal(false)
            setBidData({ bidAmount: '', note: '', driverId: '', vehicleId: '' })
            setSelectedRequest(null)
        } catch (error) {
            // Error handled by mutation
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading requests...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card">
                <div className="text-center text-red-600">
                    <p>Failed to load requests. Please try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Requests</h1>
                    <p className="mt-1 text-sm text-gray-500">Browse and bid on available transport requests</p>
                </div>
            </div>

            {/* Request Cards */}
            <div className="grid gap-6">
                {requests?.value?.length === 0 ? (
                    <div className="card text-center py-12">
                        <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No requests available in your area</p>
                    </div>
                ) : (
                    requests?.value?.map((request: any) => (
                        <div key={request.id} className="card-hover">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-x-2 mb-4">
                                        <TruckIcon className="h-5 w-5 text-primary-500" />
                                        <h3 className="text-lg font-semibold text-gray-900">{request.goodsType}</h3>
                                        <span className="badge-info">Weight: {request.weight} kg</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-x-2">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Pickup</p>
                                                <p className="text-sm text-gray-600">
                                                    {request.pickupLocation.village}, {request.pickupLocation.thana}, {request.pickupLocation.district}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-x-2">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Delivery</p>
                                                <p className="text-sm text-gray-600">
                                                    {request.deliveryLocation.village}, {request.deliveryLocation.thana}, {request.deliveryLocation.district}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-x-4 pt-2">
                                            <div className="flex items-center gap-x-1 text-sm text-gray-600">
                                                <CalendarIcon className="h-4 w-4" />
                                                <span>{new Date(request.scheduledPickupTime).toLocaleDateString('en-GB')}</span>
                                            </div>
                                            <div className="flex items-center gap-x-1 text-sm">
                                                <CurrencyDollarIcon className="h-4 w-4" />
                                                <span>{request.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-x-2 ml-4">
                                    <button className="btn-outline">View Details</button>
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(request)
                                            setShowBidModal(true)
                                        }}
                                        className="btn-primary"
                                    >
                                        Submit Bid →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bid Submission Modal */}
            {showBidModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Bid</h2>

                        <form onSubmit={handleSubmitBid} className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Request: {selectedRequest.pickupLocation.district} → {selectedRequest.deliveryLocation.district}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Bid Amount (৳) *
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="Enter amount"
                                    value={bidData.bidAmount}
                                    onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note (Optional)
                                </label>
                                <textarea
                                    className="input-field"
                                    rows={3}
                                    placeholder="Any special notes..."
                                    value={bidData.note}
                                    onChange={(e) => setBidData({ ...bidData, note: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Driver *
                                </label>
                                <select
                                    className="input-field"
                                    value={bidData.driverId}
                                    onChange={(e) => setBidData({ ...bidData, driverId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a driver</option>
                                    {drivers?.value?.map((driver: any) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name} - {driver.licenseNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Vehicle *
                                </label>
                                <select
                                    className="input-field"
                                    value={bidData.vehicleId}
                                    onChange={(e) => setBidData({ ...bidData, vehicleId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a vehicle</option>
                                    {vehicles?.value?.map((vehicle: any) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.registrationNumber} ({vehicle.capacity} Ton)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBidModal(false)
                                        setBidData({ bidAmount: '', note: '', driverId: '', vehicleId: '' })
                                    }}
                                    className="btn-outline flex-1"
                                    disabled={submitBidMutation.isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                    disabled={submitBidMutation.isPending}
                                >
                                    {submitBidMutation.isPending ? 'Submitting...' : 'Submit Bid →'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
