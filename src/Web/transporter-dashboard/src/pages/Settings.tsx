import { useState } from 'react'
import { UserCircleIcon, KeyIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile')

    // Mock user data - in real app would come from auth context/API
    const [profile, setProfile] = useState({
        name: 'Rahim Transport',
        email: 'rahim@transport.com',
        phone: '+880 1712 345678',
        address: '123 Transport Lane, Dhaka',
        licenseNumber: 'TR-2025-8899'
    })

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    })

    const [notifications, setNotifications] = useState({
        email: true,
        sms: true,
        push: false,
        marketing: false
    })

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success('Profile updated successfully')
    }

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match')
            return
        }
        toast.success('Password updated successfully')
        setPasswords({ current: '', new: '', confirm: '' })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your account preferences and security</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile'
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <UserCircleIcon className="h-5 w-5" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security'
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <KeyIcon className="h-5 w-5" />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications'
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <BellIcon className="h-5 w-5" />
                            Notifications
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-500">Update your account's profile information and email address.</p>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="input-field bg-gray-50"
                                        value={profile.email}
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Contact support to change email.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        className="input-field"
                                        rows={3}
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                                <p className="text-sm text-gray-500">Ensure your account is secure by using a strong password.</p>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                                <p className="text-sm text-gray-500">Choose how you want to be notified about important updates.</p>
                            </div>

                            <div className="space-y-4 max-w-lg">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-x-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <BellIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Push Notifications</p>
                                            <p className="text-sm text-gray-500">Receive notifications on your device</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications.push}
                                            onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Email Notifications</p>
                                            <p className="text-sm text-gray-500">Receive daily summaries and alerts</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications.email}
                                            onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-x-3">
                                        <div className="bg-yellow-100 p-2 rounded-lg">
                                            <BellIcon className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">SMS Notifications</p>
                                            <p className="text-sm text-gray-500">Receive urgent alerts via SMS</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications.sms}
                                            onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
