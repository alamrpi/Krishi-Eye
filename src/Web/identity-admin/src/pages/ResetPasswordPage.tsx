import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../shared/utils/api';
import { ROUTES, API_ENDPOINTS } from '../shared/constants';

const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
    token: z.string().min(1, 'Reset token is required'),
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromQuery = searchParams.get('email') || '';
    const tokenFromQuery = searchParams.get('token') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromQuery,
            token: tokenFromQuery,
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.RESET_PASSWORD, {
                email: data.email,
                token: data.token,
                newPassword: data.newPassword,
            });

            setSuccessMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Password reset failed. The link may be expired or invalid.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-gray-600">Create a new password for your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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

                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Reset Token */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reset Token
                            </label>
                            <input
                                {...register('token')}
                                type="text"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.token ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Token from email"
                            />
                            {errors.token && (
                                <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
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
                                Confirm New Password
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
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
