import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../shared/utils/api';
import { ROUTES, API_ENDPOINTS } from '../shared/constants';

const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromQuery = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailFromQuery);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendCode = async () => {
        if (!email) {
            setErrorMessage('Please enter your email address');
            return;
        }

        setIsSending(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.VERIFY_EMAIL_SEND, { email });
            setSuccessMessage('Verification code sent! Please check your email.');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to send verification code.');
        } finally {
            setIsSending(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !code) {
            setErrorMessage('Please enter both email and verification code');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.VERIFY_EMAIL, {
                email,
                code,
            });

            setSuccessMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Verification failed. Please try again.');
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
                        <span className="text-3xl">📧</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">Verify Email</h2>
                    <p className="mt-2 text-gray-600">Enter the verification code sent to your email</p>
                </div>

                {/* Form */}
                <form onSubmit={handleVerify} className="mt-8 space-y-6">
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
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        {/* Verification Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the 6-digit code from your email
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={isSending}
                            className="text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                        >
                            {isSending ? 'Sending...' : 'Resend Verification Code'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
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

export default EmailVerificationPage;
