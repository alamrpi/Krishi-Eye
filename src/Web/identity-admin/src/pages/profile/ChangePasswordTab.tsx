import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../shared/utils/api';
import { API_ENDPOINTS } from '../../shared/constants';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePasswordTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            setSuccessMessage('Password changed successfully!');
            reset();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to change password. Please check your current password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                {/* Current Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                    </label>
                    <input
                        {...register('currentPassword')}
                        type="password"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="••••••••"
                    />
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                    </label>
                    <input
                        {...register('newPassword')}
                        type="password"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="••••••••"
                    />
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Must be 8+ characters with uppercase, lowercase, number & special character
                    </p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                    </label>
                    <input
                        {...register('confirmPassword')}
                        type="password"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
                <p className="text-sm text-blue-900">
                    <strong>Security Tip:</strong> Use a strong, unique password that you don't use for other accounts. Consider using a password manager.
                </p>
            </div>
        </div>
    );
};
