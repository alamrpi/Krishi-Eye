import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { ROUTES } from '../shared/constants';
import api from '../shared/utils/api';
import { UserDetailModal } from './admin/UserDetailModal';
import { CreateUserModal } from './admin/CreateUserModal';

interface UserListItem {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    emailConfirmed: boolean;
    twoFactorEnabled: boolean;
    isBlocked: boolean;
    createdAt: string;
}

const UsersPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Role filter
        if (roleFilter !== 'All') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleBlockUser = async (userId: string) => {
        try {
            await api.post(`/admin/users/${userId}/block`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await api.post(`/admin/users/${userId}/unblock`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to unblock user:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(ROUTES.DASHBOARD)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate(ROUTES.AUDIT_LOGS)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Audit Logs
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Users</h2>
                        <p className="text-gray-600 mt-1">Manage all users in the system</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                    >
                        + Create User
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Users
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Search by name or email..."
                            />
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Role
                            </label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option>All</option>
                                <option>Admin</option>
                                <option>Trader</option>
                                <option>Seller</option>
                                <option>Buyer</option>
                                <option>Transporter</option>
                                <option>ServiceProvider</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p className="mt-4 text-gray-600">Loading users...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2FA</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-sm font-semibold text-green-600">
                                                                {user.firstName[0]}{user.lastName[0]}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-block w-fit ${user.emailConfirmed
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {user.emailConfirmed ? '✓ Verified' : '⚠ Unverified'}
                                                        </span>
                                                        {user.isBlocked && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full inline-block w-fit">
                                                                🚫 Blocked
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm ${user.twoFactorEnabled ? 'text-green-600' : 'text-gray-400'
                                                        }`}>
                                                        {user.twoFactorEnabled ? '🔐 On' : '🔓 Off'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowDetailModal(true);
                                                            }}
                                                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                                                        >
                                                            View
                                                        </button>
                                                        {user.isBlocked ? (
                                                            <button
                                                                onClick={() => handleUnblockUser(user.id)}
                                                                className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition"
                                                            >
                                                                Unblock
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleBlockUser(user.id)}
                                                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                                                            >
                                                                Block
                                                            </button>
                                                        )}
                                                    </div>
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
                                        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

            {/* Modals will be added here */}
            {showDetailModal && selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedUser(null);
                    }}
                    onRefresh={fetchUsers}
                />
            )}

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchUsers}
                />
            )}
        </div>
    );
};

export default UsersPage;
