import { useQueryClient } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useMyBids, useNearbyRequests, queryKeys } from '../hooks/useTransportApi'
import { useSignalR, useNewRequestNotifications, useBidStatusNotifications } from '../hooks/useSignalR'
import {
    DocumentTextIcon,
    CurrencyDollarIcon,
    TruckIcon,
    CheckCircleIcon,
    UserGroupIcon,
    ChartBarIcon,
    WifiIcon,
} from '@heroicons/react/24/outline'
import TransportMap from '../components/map/Map'

export default function Dashboard() {
    const queryClient = useQueryClient()

    // TODO: Get user location - for now using Dhaka
    const userLat = 23.8103
    const userLng = 90.4125

    const { data: requestsData } = useNearbyRequests(userLat, userLng, 50)
    const { data: bidsData } = useMyBids()

    // SignalR connection
    const { connection, isConnected } = useSignalR(userLat, userLng, 50)

    // Listen for new requests
    useNewRequestNotifications(connection, () => {
        // Invalidate requests query to refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.nearbyRequests(userLat, userLng, 50) })
    })

    // Listen for bid status updates
    useBidStatusNotifications(connection, () => {
        // Invalidate bids query to refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.myBids })
    })

    const requests = requestsData?.value || []
    const bids = bidsData?.value || []

    const pendingBids = bids.filter((b: any) => b.status === 'Pending')
    const activeJobs = bids.filter((b: any) => b.status === 'Accepted' && b.jobStatus !== 'Completed')
    const completedJobs = bids.filter((b: any) => b.status === 'Accepted' && b.jobStatus === 'Completed')

    const stats = [
        { name: 'New Requests', value: requests.length, change: `${requests.length} nearby`, icon: DocumentTextIcon, color: 'border-blue-500' },
        { name: 'Pending Bids', value: pendingBids.length, change: `${pendingBids.length} awaiting`, icon: CurrencyDollarIcon, color: 'border-yellow-500' },
        { name: 'Active Jobs', value: activeJobs.length, change: `${activeJobs.length} in progress`, icon: TruckIcon, color: 'border-green-500' },
        { name: 'Completed Jobs', value: completedJobs.length, change: `${completedJobs.length} done`, icon: CheckCircleIcon, color: 'border-gray-500' },
    ]

    const quickActions = [
        { name: 'Add Driver', icon: UserGroupIcon, href: '/drivers', color: 'bg-blue-500' },
        { name: 'Add Vehicle', icon: TruckIcon, href: '/vehicles', color: 'bg-green-500' },
        { name: 'Submit Bid', icon: CurrencyDollarIcon, href: '/requests', color: 'bg-yellow-500' },
        { name: 'View Report', icon: ChartBarIcon, href: '/earnings', color: 'bg-purple-500' },
    ]

    return (
        <div className="space-y-6">
            {/* Page Header with Real-time Status */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-x-2">
                    <WifiIcon className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                        {isConnected ? 'Real-time ON' : 'Connecting...'}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className={`stat-card ${stat.color}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                                <p className="mt-1 text-sm text-gray-600">{stat.change}</p>
                            </div>
                            <stat.icon className="h-12 w-12 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Map View - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <div className="card h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Nearby Requests</h2>
                            <span className="text-sm text-gray-500">
                                {requests.length} requests within 50km
                            </span>
                        </div>
                        <div className="flex-1 min-h-[400px] relative z-0">
                            <TransportMap
                                center={[userLat, userLng]}
                                zoom={12}
                                markers={requests.map((req: any) => ({
                                    id: req.id,
                                    position: [req.pickupLocation.latitude, req.pickupLocation.longitude],
                                    title: `${req.goodsType} (${req.weight}kg)`,
                                    description: `From: ${req.pickupLocation.thana}, ${req.pickupLocation.district}`
                                }))}
                                className="h-full w-full rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Charts Grid - 2 columns */}
                <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bid Statistics Chart */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bid Statistics</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Pending', value: pendingBids.length, fill: '#EAB308' },
                                        { name: 'Accepted', value: activeJobs.length + completedJobs.length, fill: '#10B981' },
                                        { name: 'Rejected', value: bids.length - pendingBids.length - activeJobs.length - completedJobs.length, fill: '#EF4444' },
                                    ]}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Job Completion Pie Chart */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Status</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Active', value: activeJobs.length, fill: '#3B82F6' },
                                            { name: 'Completed', value: completedJobs.length, fill: '#10B981' },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {[
                                            { name: 'Active', value: activeJobs.length, fill: '#3B82F6' },
                                            { name: 'Completed', value: completedJobs.length, fill: '#10B981' },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - 1 column */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action) => (
                            <a
                                key={action.name}
                                href={action.href}
                                className="w-full flex items-center gap-x-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className={`${action.color} p-2 rounded-lg`}>
                                    <action.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{action.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    {bids.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No recent activity</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bids.slice(0, 5).map((bid: any, index: number) => (
                                <div key={index} className="flex items-start gap-x-3 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-primary-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {bid.status === 'Accepted' ? 'Bid Accepted' : bid.status === 'Pending' ? 'Bid Submitted' : 'Bid Rejected'}:
                                            ৳{bid.bidAmount.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(bid.submittedAt).toLocaleString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
