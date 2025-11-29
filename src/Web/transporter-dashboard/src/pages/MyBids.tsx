import { useMyBids } from '../hooks/useTransportApi'
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function MyBids() {
    const { data: bidsData, isLoading, error } = useMyBids()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading bids...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card">
                <div className="text-center text-red-600">
                    <p>Failed to load bids. Please try again.</p>
                </div>
            </div>
        )
    }

    const bids = bidsData?.value || []
    const pendingBids = bids.filter((b: any) => b.status === 'Pending')
    const acceptedBids = bids.filter((b: any) => b.status === 'Accepted')
    const rejectedBids = bids.filter((b: any) => b.status === 'Rejected')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Bids</h1>
                <p className="mt-1 text-sm text-gray-500">Track all your submitted bids</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="stat-card border-yellow-500">
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{pendingBids.length}</p>
                </div>
                <div className="stat-card border-green-500">
                    <p className="text-sm font-medium text-gray-500">Accepted</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{acceptedBids.length}</p>
                </div>
                <div className="stat-card border-red-500">
                    <p className="text-sm font-medium text-gray-500">Rejected</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{rejectedBids.length}</p>
                </div>
            </div>

            {/* Bids List */}
            <div className="card">
                {bids.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No bids submitted yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bids.map((bid: any) => (
                            <div
                                key={bid.id}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Bid #{bid.id.substring(0, 8)}
                                            </h3>
                                            {bid.status === 'Pending' && (
                                                <span className="badge-warning flex items-center gap-x-1">
                                                    <ClockIcon className="h-4 w-4" />
                                                    Pending
                                                </span>
                                            )}
                                            {bid.status === 'Accepted' && (
                                                <span className="badge-success flex items-center gap-x-1">
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    Accepted
                                                </span>
                                            )}
                                            {bid.status === 'Rejected' && (
                                                <span className="badge-danger flex items-center gap-x-1">
                                                    <XCircleIcon className="h-4 w-4" />
                                                    Rejected
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-x-4 text-sm text-gray-600">
                                            <span>Request ID: {bid.requestId.substring(0, 8)}</span>
                                            <span>Bid Amount: ৳{bid.bidAmount.toLocaleString()}</span>
                                            <span>Submitted: {new Date(bid.submittedAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                        {bid.note && (
                                            <p className="mt-2 text-sm text-gray-600">Note: {bid.note}</p>
                                        )}
                                    </div>
                                    <button className="btn-outline">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
