import { useMyBids } from '../hooks/useTransportApi'
import { CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

export default function CompletedJobs() {
    const { data: bidsData, isLoading } = useMyBids()

    // Filter completed jobs
    const completedJobs = bidsData?.value?.filter((bid: any) =>
        bid.status === 'Accepted' && bid.jobStatus === 'Completed'
    ) || []

    const totalEarned = completedJobs.reduce((sum: number, job: any) => sum + job.bidAmount, 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Completed Jobs</h1>
                <p className="mt-1 text-sm text-gray-500">View your job history and earnings</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="stat-card border-green-500">
                    <p className="text-sm font-medium text-gray-500">Total Completed</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{completedJobs.length}</p>
                </div>
                <div className="stat-card border-blue-500">
                    <p className="text-sm font-medium text-gray-500">Total Earned</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">৳{totalEarned.toLocaleString()}</p>
                </div>
                <div className="stat-card border-yellow-500">
                    <p className="text-sm font-medium text-gray-500">Average Per Job</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ৳{completedJobs.length > 0 ? Math.round(totalEarned / completedJobs.length).toLocaleString() : 0}
                    </p>
                </div>
            </div>

            {/* Jobs List */}
            <div className="card">
                {completedJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No completed jobs yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completed Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {completedJobs.map((job: any) => (
                                    <tr key={job.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                                <span className="font-medium text-gray-900">#{job.id.substring(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {job.completedAt ? new Date(job.completedAt).toLocaleDateString('en-GB') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-900 font-medium">
                                                <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                                                ৳{job.bidAmount.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="badge-success">Completed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
