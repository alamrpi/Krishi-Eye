import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { ROUTES } from '../shared/constants';
import api from '../shared/utils/api';
import type { User } from '../shared/types/api.types';
import { EditProfileTab } from './profile/EditProfileTab';
import { ChangePasswordTab } from './profile/ChangePasswordTab';
import { TwoFactorTab } from './profile/TwoFactorTab';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'password' | '2fa'>('view');
    const [user, setUser] = useState<User | null>(authUser);


    // Fetch fresh user data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(ROUTES.DASHBOARD)}
                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Dashboard
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('view')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'view'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    👤 View Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'edit'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    ✏️ Edit Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'password'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    🔒 Change Password
                                </button>
                                <button
                                    onClick={() => setActiveTab('2fa')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === '2fa'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    🔐 2FA Settings
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'view' && <ViewProfileTab user={user} />}
                        {activeTab === 'edit' && <EditProfileTab user={user} setUser={setUser} />}
                        {activeTab === 'password' && <ChangePasswordTab />}
                        {activeTab === '2fa' && <TwoFactorTab user={user} setUser={setUser} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

// View Profile Tab Component
const ViewProfileTab = ({ user }: { user: User }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

            <div className="space-y-6">
                {/* Profile Picture Placeholder */}
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-600">
                            {user.firstName[0]}{user.lastName[0]}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                        <p className="text-gray-900 font-medium">{user.firstName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                        <p className="text-gray-900 font-medium">{user.lastName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <p className="text-gray-900 font-medium">{user.phoneNumber || 'Not provided'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {user.role}
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Verified</label>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${user.emailConfirmed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {user.emailConfirmed ? '✓ Verified' : '⚠ Not Verified'}
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Two-Factor Auth</label>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${user.twoFactorEnabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.twoFactorEnabled ? '🔐 Enabled' : '🔓 Disabled'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
