import { useState } from 'react'
import { useDrivers, useAddDriver, useUpdateDriver, useDeleteDriver } from '../hooks/useTransportApi'
import { PlusIcon, UserIcon, IdentificationIcon, PhoneIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import FileUpload from '../components/common/FileUpload'

export default function Drivers() {
    const { data: driversData, isLoading, error } = useDrivers()
    const addDriver = useAddDriver()
    const updateDriver = useUpdateDriver()
    const deleteDriver = useDeleteDriver()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        nidNumber: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        licenseImageUrl: '',
    })

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            nidNumber: '',
            licenseNumber: '',
            licenseExpiryDate: '',
            licenseImageUrl: '',
        })
        setSelectedDriverId(null)
    }

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addDriver.mutateAsync(formData)
            setIsAddModalOpen(false)
            resetForm()
        } catch (error) {
            // Error handled by mutation
        }
    }

    const handleEditClick = (driver: any) => {
        setSelectedDriverId(driver.id)
        setFormData({
            fullName: driver.fullName,
            phone: driver.phone,
            nidNumber: driver.nidNumber,
            licenseNumber: driver.licenseNumber,
            licenseExpiryDate: driver.licenseExpiryDate.split('T')[0],
            licenseImageUrl: driver.licenseImageUrl,
        })
        setIsEditModalOpen(true)
    }

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDriverId) return

        try {
            await updateDriver.mutateAsync({ id: selectedDriverId, ...formData })
            setIsEditModalOpen(false)
            resetForm()
        } catch (error) {
            // Error handled by mutation
        }
    }

    const handleDeleteClick = (id: string) => {
        setSelectedDriverId(id)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedDriverId) return

        try {
            await deleteDriver.mutateAsync(selectedDriverId)
            setIsDeleteModalOpen(false)
            setSelectedDriverId(null)
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

    const [searchQuery, setSearchQuery] = useState('')

    const drivers = driversData?.value || []

    const filteredDrivers = drivers.filter((driver: any) =>
        driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.includes(searchQuery)
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your driver fleet</p>
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search drivers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10 w-full sm:w-64"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            resetForm()
                            setIsAddModalOpen(true)
                        }}
                        className="btn-primary flex items-center gap-x-2 whitespace-nowrap"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Driver
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="stat-card border-blue-500">
                    <p className="text-sm font-medium text-gray-500">Total Drivers</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{filteredDrivers.length}</p>
                </div>
                <div className="stat-card border-green-500">
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {filteredDrivers.filter((d: any) => d.isActive).length}
                    </p>
                </div>
                <div className="stat-card border-gray-500">
                    <p className="text-sm font-medium text-gray-500">Inactive</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {filteredDrivers.filter((d: any) => !d.isActive).length}
                    </p>
                </div>
            </div>

            {/* Drivers Table */}
            <div className="card">
                {filteredDrivers.length === 0 ? (
                    <div className="text-center py-12">
                        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No drivers added yet</p>
                        <button
                            onClick={() => {
                                resetForm()
                                setIsAddModalOpen(true)
                            }}
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
                                {filteredDrivers.map((driver: any) => (
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(driver)}
                                                    className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(driver.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Driver Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {isEditModalOpen ? 'Edit Driver' : 'Add New Driver'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false)
                                    setIsEditModalOpen(false)
                                    resetForm()
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleUpdateSubmit : handleAddSubmit} className="space-y-4">
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

                                <div className="col-span-1 md:col-span-2">
                                    <FileUpload
                                        label="License Image"
                                        onUploadComplete={(url) => setFormData({ ...formData, licenseImageUrl: url })}
                                        currentFileUrl={formData.licenseImageUrl}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false)
                                        setIsEditModalOpen(false)
                                        resetForm()
                                    }}
                                    className="flex-1 btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addDriver.isPending || updateDriver.isPending}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    {isEditModalOpen
                                        ? (updateDriver.isPending ? 'Updating...' : 'Update Driver')
                                        : (addDriver.isPending ? 'Adding...' : 'Add Driver')
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <TrashIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">Delete Driver</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to delete this driver? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteModalOpen(false)
                                    setSelectedDriverId(null)
                                }}
                                className="flex-1 btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleteDriver.isPending}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteDriver.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
