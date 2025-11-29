import { useEarningsReport } from '../hooks/useTransportApi'
import { ChartBarIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

export default function EarningsReport() {
    const { data: earningsData, isLoading, error } = useEarningsReport()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card">
                <div className="text-center text-red-600">
                    <p>Failed to load earnings report. Please try again.</p>
                </div>
            </div>
        )
    }

    const earnings = earningsData?.value || {}
    const transactions = earnings.recentTransactions || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Earnings Report</h1>
                <p className="mt-1 text-sm text-gray-500">Track your income and financial summary</p>
            </div>

            {/* Month Selector */}
            <div className="card">
                <div className="flex items-center gap-x-4">
                    <CalendarIcon className="h-6 w-6 text-gray-400" />
                    <select className="input-field max-w-xs">
                        <option>November 2025</option>
                        <option>October 2025</option>
                        <option>September 2025</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="stat-card border-green-500">
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ৳{earnings.totalEarnings?.toLocaleString() || 0}
                    </p>
                    {earnings.percentageChange && (
                        <p className="mt-1 text-sm text-green-600">+{earnings.percentageChange}% from last month</p>
                    )}
                </div>
                <div className="stat-card border-blue-500">
                    <p className="text-sm font-medium text-gray-500">Cash Received</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ৳{earnings.cashReceived?.toLocaleString() || 0}
                    </p>
                </div>
                <div className="stat-card border-yellow-500">
                    <p className="text-sm font-medium text-gray-500">Cash Pending</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ৳{earnings.cashPending?.toLocaleString() || 0}
                    </p>
                </div>
                <div className="stat-card border-purple-500">
                    <p className="text-sm font-medium text-gray-500">Jobs Completed</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {earnings.completedJobs || 0}
                    </p>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings Trend</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Chart will be integrated here</p>
                        <p className="text-sm text-gray-400 mt-1">Using Chart.js or Recharts</p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                {transactions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((txn: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-x-4">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{txn.description || 'Job Payment'}</p>
                                        <p className="text-sm text-gray-600">
                                            {txn.date ? new Date(txn.date).toLocaleDateString('en-GB') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">৳{txn.amount?.toLocaleString() || 0}</p>
                                    <span className={`text-sm ${txn.status === 'Received' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {txn.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="btn-outline w-full mt-4">Download Full Report</button>
            </div>
        </div>
    )
}
