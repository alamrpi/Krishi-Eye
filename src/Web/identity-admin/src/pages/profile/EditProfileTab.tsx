import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../shared/utils/api';
import { API_ENDPOINTS } from '../../shared/constants';
import type { User } from '../../shared/types/api.types';

const editProfileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileTabProps {
    user: User;
    setUser: (user: User) => void;
}

export const EditProfileTab = ({ user, setUser }: EditProfileTabProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
        },
    });

    const onSubmit = async (data: EditProfileFormData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.put(API_ENDPOINTS.PROFILE, data);
            setUser(response.data);
            setSuccessMessage('Profile updated successfully!');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Changing your email will require re-verification
                    </p>
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

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
