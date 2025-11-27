import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../shared/utils/api';
import { ROUTES, API_ENDPOINTS } from '../shared/constants';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phoneNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const { confirmPassword, ...registerData } = data;
            await api.post(API_ENDPOINTS.REGISTER, registerData);
            
            setSuccessMessage('Registration successful! Please check your email to verify your account.');
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 3000);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-gray-600">Join Krishi Eye Admin Platform</p>
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
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    {...register('firstName')}
                                    type="text"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="John"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    {...register('lastName')}
                                    type="text"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="john.doe@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                {...register('phoneNumber')}
                                type="tel"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="+880 1700000000 (Optional)"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Must be 8+ characters with uppercase, lowercase, number & special character
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
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
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="text-green-600 hover:text-green-700 font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
