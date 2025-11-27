import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { ROUTES } from '../shared/constants';
import api from '../shared/utils/api';

interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    timestamp: string;
    ipAddress: string;
    details?: string;
}

const AuditLogsPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('All');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage] = useState(20);

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        filterLogs();
    }, [logs, searchTerm, actionFilter]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/audit-logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterLogs = () => {
        let filtered = logs;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(log =>
                log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.ipAddress.includes(searchTerm)
            );
        }

        // Action filter
        if (actionFilter !== 'All') {
            filtered = filtered.filter(log => log.action.includes(actionFilter));
        }

        setFilteredLogs(filtered);
        setCurrentPage(1);
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    // Pagination
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const getActionBadgeColor = (action: string) => {
        if (action.includes('Login')) return 'bg-green-100 text-green-800';
        if (action.includes('Logout')) return 'bg-gray-100 text-gray-800';
        if (action.includes('Create')) return 'bg-blue-100 text-blue-800';
        if (action.includes('Update') || action.includes('Edit')) return 'bg-yellow-100 text-yellow-800';
        if (action.includes('Delete') || action.includes('Block')) return 'bg-red-100 text-red-800';
        if (action.includes('Password')) return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate(ROUTES.DASHBOARD)}
                                className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                            >
                                <span className="text-white font-bold text-xl">K</span>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(ROUTES.DASHBOARD)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate(ROUTES.USERS)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Users
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">System Activity Logs</h2>
                    <p className="text-gray-600 mt-1">Track all user actions and system events</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Logs
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Search by user, action, or IP address..."
                            />
                        </div>

                        {/* Action Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Action
                            </label>
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option>All</option>
                                <option>Login</option>
                                <option>Logout</option>
                                <option>Create</option>
                                <option>Update</option>
                                <option>Delete</option>
                                <option>Password</option>
                                <option>Block</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p className="mt-4 text-gray-600">Loading audit logs...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                                    {new Date(log.timestamp).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                    {log.userName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getActionBadgeColor(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                    {log.ipAddress}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {log.details || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AuditLogsPage;
