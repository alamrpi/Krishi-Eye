import { useState } from 'react'
import { useDrivers, useAddDriver } from '../hooks/useTransportApi'
import { PlusIcon, UserIcon, PhoneIcon, IdentificationIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Drivers() {
    const { data: driversData, isLoading, error } = useDrivers()
    const addDriver = useAddDriver()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        nidNumber: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        licenseImageUrl: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addDriver.mutateAsync(formData)
            setIsAddModalOpen(false)
            setFormData({
                fullName: '',
                phone: '',
                nidNumber: '',
                licenseNumber: '',
                licenseExpiryDate: '',
                licenseImageUrl: '',
            })
        } catch (error) {
            // Error handled by mutation
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card">
                <div className="text-center text-red-600">
                    <p>Failed to load drivers. Please try again.</p>
                </div>
            </div>
        )
    }

    const drivers = driversData?.value || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your driver fleet</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary flex items-center gap-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Driver
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="stat-card border-blue-500">
                    <p className="text-sm font-medium text-gray-500">Total Drivers</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{drivers.length}</p>
                </div>
                <div className="stat-card border-green-500">
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {drivers.filter((d: any) => d.isActive).length}
                    </p>
                </div>
                <div className="stat-card border-gray-500">
                    <p className="text-sm font-medium text-gray-500">Inactive</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {drivers.filter((d: any) => !d.isActive).length}
                    </p>
                </div>
            </div>

            {/* Drivers Table */}
            <div className="card">
                {drivers.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No drivers added yet</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-primary mt-4"
                        >
                            Add Your First Driver
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Driver
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        License
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        NID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {drivers.map((driver: any) => (
                                    <tr key={driver.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-primary-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{driver.fullName}</div>
                                                    <div className="text-sm text-gray-500">
                                                        Exp: {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <IdentificationIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                {driver.licenseNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                {driver.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {driver.nidNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Driver Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Driver</h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="input"
                                        placeholder="Enter driver's full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input"
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        NID Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nidNumber}
                                        onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                                        className="input"
                                        placeholder="National ID number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        License Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        className="input"
                                        placeholder="Driving license number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        License Expiry Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.licenseExpiryDate}
                                        onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        License Image URL *
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.licenseImageUrl}
                                        onChange={(e) => setFormData({ ...formData, licenseImageUrl: e.target.value })}
                                        className="input"
                                        placeholder="https://example.com/license.jpg"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addDriver.isPending}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    {addDriver.isPending ? 'Adding...' : 'Add Driver'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
