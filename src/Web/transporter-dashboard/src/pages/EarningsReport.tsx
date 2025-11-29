import { useEarningsReport } from '../hooks/useTransportApi'
import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

            {/* Chart Section */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings Trend</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={[
                                { name: 'Jan', amount: 4000 },
                                { name: 'Feb', amount: 3000 },
                                { name: 'Mar', amount: 2000 },
                                { name: 'Apr', amount: 2780 },
                                { name: 'May', amount: 1890 },
                                { name: 'Jun', amount: 2390 },
                                { name: 'Jul', amount: 3490 },
                                { name: 'Aug', amount: 4200 },
                                { name: 'Sep', amount: 5100 },
                                { name: 'Oct', amount: 4800 },
                                { name: 'Nov', amount: earnings.totalEarnings || 6000 },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip
                                formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Earnings']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#10B981"
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
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
