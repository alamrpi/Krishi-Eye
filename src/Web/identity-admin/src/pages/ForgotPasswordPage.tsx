import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../shared/utils/api';
import { ROUTES, API_ENDPOINTS } from '../shared/constants';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.REQUEST_PASSWORD_RESET, { email });
            setSuccessMessage('Password reset link has been sent to your email. Please check your inbox.');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to send reset link. Please try again.');
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
                        <span className="text-3xl">🔑</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="mt-2 text-gray-600">
                        No worries! Enter your email and we'll send you a reset link
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to={ROUTES.LOGIN} className="text-green-600 hover:text-green-700 font-medium">
                            Back to Login
                        </Link>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                        <strong>Note:</strong> The reset link will be valid for 1 hour. If you don't receive an email, please check your spam folder.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
