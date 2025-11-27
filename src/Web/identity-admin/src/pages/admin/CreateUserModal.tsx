import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../shared/utils/api';

const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phoneNumber: z.string().optional(),
    role: z.string().min(1, 'Role is required'),
    sendWelcomeEmail: z.boolean().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateUserModal = ({ onClose, onSuccess }: CreateUserModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [temporaryPassword, setTemporaryPassword] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            sendWelcomeEmail: true,
        },
    });

    const onSubmit = async (data: CreateUserFormData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        setTemporaryPassword('');

        try {
            const response = await api.post('/admin/users/create', data);
            setTemporaryPassword(response.data.temporaryPassword);
            setSuccessMessage(`User created successfully! ${data.sendWelcomeEmail ? 'Welcome email sent.' : ''}`);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 3000);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to create user. Please try again.');
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
                        <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                {successMessage}
                                {temporaryPassword && (
                                    <div className="mt-3 pt-3 border-t border-green-300">
                                        <p className="font-semibold mb-2">Temporary Password:</p>
                                        <code className="block bg-green-100 p-2 rounded font-mono text-sm">
                                            {temporaryPassword}
                                        </code>
                                        <p className="text-xs mt-2">
                                            {!errors.email && 'This password has been sent to the user\'s email. '}
                                            The user will be required to change it on first login.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {errorMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    {...register('firstName')}
                                    type="text"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="John"
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    {...register('lastName')}
                                    type="text"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.lastName ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="user@example.com"
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

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role *
                            </label>
                            <select
                                {...register('role')}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.role ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a role...</option>
                                <option value="Admin">Admin</option>
                                <option value="Trader">Trader</option>
                                <option value="Seller">Seller</option>
                                <option value="Buyer">Buyer</option>
                                <option value="Transporter">Transporter</option>
                                <option value="ServiceProvider">Service Provider</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Send Welcome Email */}
                        <div className="flex items-center">
                            <input
                                {...register('sendWelcomeEmail')}
                                type="checkbox"
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                Send welcome email with temporary password
                            </label>
                        </div>

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> A secure temporary password will be automatically generated.
                                The user will be required to change it on first login.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating User...' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
