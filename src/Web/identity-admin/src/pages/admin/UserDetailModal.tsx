import { useState } from 'react';
import api from '../../shared/utils/api';

interface UserDetailModalProps {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        emailConfirmed: boolean;
        twoFactorEnabled: boolean;
        isBlocked: boolean;
        phoneNumber?: string;
        createdAt: string;
    };
    onClose: () => void;
    onRefresh: () => void;
}

export const UserDetailModal = ({ user, onClose, onRefresh }: UserDetailModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleResetPassword = async () => {
        if (!confirm(`Are you sure you want to reset password for ${user.email}?`)) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(`/admin/users/${user.id}/reset-password`);
            setSuccessMessage('Password reset email sent successfully!');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlockUser = async () => {
        if (!confirm(`Are you sure you want to block ${user.email}?`)) {
            return;
        }

        setIsLoading(true);
        try {
            await api.post(`/admin/users/${user.id}/block`);
            onRefresh();
            onClose();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to block user.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnblockUser = async () => {
        setIsLoading(true);
        try {
            await api.post(`/admin/users/${user.id}/unblock`);
            onRefresh();
            onClose();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to unblock user.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>

                    {/* Messages */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {errorMessage}
                        </div>
                    )}

                    {/* User Info */}
                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-4 pb-6 border-b">
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
                                <div className="flex gap-2 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        {user.role}
                                    </span>
                                    {user.isBlocked && (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                            🚫 Blocked
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                <p className="text-gray-900">{user.phoneNumber || 'Not provided'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Verification</label>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                                <p className="text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                                <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                                >
                                    Reset Password
                                </button>

                                {user.isBlocked ? (
                                    <button
                                        onClick={handleUnblockUser}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                                    >
                                        Unblock User
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleBlockUser}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                                    >
                                        Block User
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
