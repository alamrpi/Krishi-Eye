import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { ROUTES } from '../shared/constants';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">K</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Krishi Eye Admin</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                {user?.role || 'User'}
                            </span>
                            <button
                                onClick={() => navigate(ROUTES.PROFILE)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Profile
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
                {/* Welcome Card */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.firstName}! 👋
                    </h2>
                    <p className="text-gray-600">Here's what's happening with your account today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email Status</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {user?.emailConfirmed ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user?.emailConfirmed ? 'bg-green-100' : 'bg-yellow-100'
                                }`}>
                                <span className="text-2xl">
                                    {user?.emailConfirmed ? '✓' : '!'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">2FA Status</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user?.twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                <span className="text-2xl">🔐</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Account Role</p>
                                <p className="text-2xl font-bold text-gray-900">{user?.role || 'User'}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">👤</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate(ROUTES.PROFILE)}
                            className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center"
                        >
                            <div className="text-3xl mb-2">👤</div>
                            <div className="font-semibold text-gray-900">View Profile</div>
                        </button>

                        {user?.role === 'Admin' && (
                            <>
                                <button
                                    onClick={() => navigate(ROUTES.USERS)}
                                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center cursor-pointer"
                                >
                                    <div className="text-3xl mb-2">👥</div>
                                    <div className="font-semibold text-gray-900">Manage Users</div>
                                </button>

                                <button
                                    onClick={() => navigate(ROUTES.AUDIT_LOGS)}
                                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center cursor-pointer"
                                >
                                    <div className="text-3xl mb-2">📊</div>
                                    <div className="font-semibold text-gray-900">Audit Logs</div>
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => navigate(ROUTES.PROFILE)}
                            className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center cursor-pointer"
                        >
                            <div className="text-3xl mb-2">🔒</div>
                            <div className="font-semibold text-gray-900">Security Settings</div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
