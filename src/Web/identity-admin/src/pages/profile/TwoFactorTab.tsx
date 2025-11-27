import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../shared/utils/api';
import { API_ENDPOINTS } from '../../shared/constants';
import type { User } from '../../shared/types/api.types';

interface TwoFactorTabProps {
    user: User;
    setUser: (user: User) => void;
}

export const TwoFactorTab = ({ user, setUser }: TwoFactorTabProps) => {
    const [qrCodeUri, setQrCodeUri] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showSetup, setShowSetup] = useState(false);

    const handleEnable2FA = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.post(API_ENDPOINTS.ENABLE_2FA);
            setQrCodeUri(response.data.qrCodeUri);
            setManualCode(response.data.manualEntryKey);
            setShowSetup(true);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to enable 2FA. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!verificationCode || verificationCode.length !== 6) {
            setErrorMessage('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.VERIFY_2FA, {
                code: verificationCode,
            });

            setSuccessMessage('2FA enabled successfully!');
            setUser({ ...user, twoFactorEnabled: true });
            setShowSetup(false);
            setQrCodeUri('');
            setVerificationCode('');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await api.post(API_ENDPOINTS.DISABLE_2FA);
            setSuccessMessage('2FA disabled successfully.');
            setUser({ ...user, twoFactorEnabled: false });
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to disable 2FA. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Two-Factor Authentication</h2>

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

            {/* Current Status */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">2FA Status</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {user.twoFactorEnabled
                                ? 'Two-Factor Authentication is currently enabled for your account'
                                : 'Two-Factor Authentication is currently disabled'}
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${user.twoFactorEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                        }`}>
                        {user.twoFactorEnabled ? '🔐 Enabled' : '🔓 Disabled'}
                    </span>
                </div>
            </div>

            {!user.twoFactorEnabled && !showSetup && (
                <div>
                    {/* 2FA Benefits */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Why enable 2FA?</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>Adds an extra layer of security to your account</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>Protects against unauthorized access even if your password is compromised</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                <span>Works with authenticator apps like Google Authenticator or Authy</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleEnable2FA}
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Setting up...' : 'Enable 2FA'}
                    </button>
                </div>
            )}

            {showSetup && qrCodeUri && (
                <div className="max-w-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Set up 2FA</h3>

                    {/* Step 1: Scan QR Code */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            Step 1: Scan this QR code with your authenticator app
                        </p>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block">
                            <QRCodeSVG value={qrCodeUri} size={200} />
                        </div>
                    </div>

                    {/* Manual Entry Code */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Or enter this code manually:
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                            <code className="text-sm font-mono break-all">{manualCode}</code>
                        </div>
                    </div>

                    {/* Step 2: Verify */}
                    <form onSubmit={handleVerify2FA}>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Step 2: Enter the 6-digit code from your app
                        </p>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-center text-2xl tracking-widest mb-4"
                            placeholder="000000"
                            required
                        />

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify and Enable'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSetup(false);
                                    setQrCodeUri('');
                                    setVerificationCode('');
                                }}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {user.twoFactorEnabled && (
                <div>
                    {/* Disable 2FA */}
                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-900">
                            <strong>Warning:</strong> Disabling 2FA will make your account less secure. Only disable if you no longer have access to your authenticator app.
                        </p>
                    </div>

                    <button
                        onClick={handleDisable2FA}
                        disabled={isLoading}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                </div>
            )}
        </div>
    );
};
