import { useMyBids } from '../hooks/useTransportApi'
import { MapPinIcon, TruckIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function ActiveJobs() {
    const { data: bidsData, isLoading } = useMyBids()

    // Filter only accepted bids that are in progress
    const activeJobs = bidsData?.value?.filter((bid: any) =>
        bid.status === 'Accepted' && bid.jobStatus !== 'Completed'
    ) || []

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Active Jobs</h1>
                <p className="mt-1 text-sm text-gray-500">Track your ongoing deliveries</p>
            </div>

            {/* Active Jobs Cards */}
            {activeJobs.length === 0 ? (
                <div className="card text-center py-12">
                    <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active jobs at the moment</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {activeJobs.map((job: any) => (
                        <div key={job.id} className="card">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Job #{job.id.substring(0, 8)}
                                    </h3>
                                    <span className="badge-info flex items-center gap-x-1 inline-flex">
                                        <TruckIcon className="h-4 w-4" />
                                        In Transit
                                    </span>
                                </div>
                                <button className="btn-primary">
                                    <PhoneIcon className="h-5 w-5 inline mr-2" />
                                    Contact Support
                                </button>
                            </div>

                            {/* Map Placeholder */}
                            <div className="h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">Live tracking map will be integrated here</p>
                                    <p className="text-sm text-gray-400 mt-1">Using Leaflet + OpenStreetMap</p>
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">Request ID</p>
                                    <p className="font-medium text-gray-900">{job.requestId.substring(0, 8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Bid Amount</p>
                                    <p className="font-medium text-gray-900">৳{job.bidAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className="font-medium text-gray-900">In Transit</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Started At</p>
                                    <p className="font-medium text-gray-900">
                                        {job.acceptedAt ? new Date(job.acceptedAt).toLocaleString('en-GB') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
