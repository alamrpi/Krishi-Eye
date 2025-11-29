import { useState } from 'react'
import { useVehicles, useAddVehicle } from '../hooks/useTransportApi'
import { PlusIcon, TruckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const VEHICLE_TYPES = [
    { value: 1, label: 'Pickup (1 Ton)', capacity: 1 },
    { value: 2, label: 'Truck (3 Ton)', capacity: 3 },
    { value: 3, label: 'Truck (5 Ton)', capacity: 5 },
    { value: 4, label: 'Covered Van', capacity: 2 },
    { value: 5, label: 'Trailer', capacity: 10 },
]

export default function Vehicles() {
    const { data: vehiclesData, isLoading, error } = useVehicles()
    const addVehicle = useAddVehicle()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        type: 1,
        registrationNumber: '',
        capacityTon: 1,
        model: '',
        manufactureYear: new Date().getFullYear(),
        fitnessExpiryDate: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addVehicle.mutateAsync({
                type: formData.type,
                registrationNumber: formData.registrationNumber,
                capacityTon: formData.capacityTon,
                model: formData.model || undefined,
                manufactureYear: formData.manufactureYear || undefined,
                fitnessExpiryDate: formData.fitnessExpiryDate,
            })
            setIsAddModalOpen(false)
            setFormData({
                type: 1,
                registrationNumber: '',
                capacityTon: 1,
                model: '',
                manufactureYear: new Date().getFullYear(),
                fitnessExpiryDate: '',
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
                    <p>Failed to load vehicles. Please try again.</p>
                </div>
            </div>
        )
    }

    const vehicles = vehiclesData?.value || []

    const getVehicleTypeLabel = (type: number) => {
        return VEHICLE_TYPES.find(t => t.value === type)?.label || 'Unknown'
    }

    const getVehicleTypeColor = (type: number) => {
        const colors: any = {
            1: 'bg-green-100 text-green-800',
            2: 'bg-blue-100 text-blue-800',
            3: 'bg-purple-100 text-purple-800',
            4: 'bg-yellow-100 text-yellow-800',
            5: 'bg-red-100 text-red-800',
        }
        return colors[type] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vehicles Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your vehicle fleet</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary flex items-center gap-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Vehicle
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="stat-card border-blue-500">
                    <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{vehicles.length}</p>
                </div>
                <div className="stat-card border-green-500">
                    <p className="text-sm font-medium text-gray-500">Available</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {vehicles.filter((v: any) => v.isAvailable).length}
                    </p>
                </div>
                <div className="stat-card border-yellow-500">
                    <p className="text-sm font-medium text-gray-500">In Use</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {vehicles.filter((v: any) => !v.isAvailable).length}
                    </p>
                </div>
                <div className="stat-card border-purple-500">
                    <p className="text-sm font-medium text-gray-500">Total Capacity</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {vehicles.reduce((sum: number, v: any) => sum + (v.capacityTon || 0), 0)} ton
                    </p>
                </div>
            </div>

            {/* Vehicles Grid */}
            <div className="card">
                {vehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No vehicles added yet</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-primary mt-4"
                        >
                            Add Your First Vehicle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle: any) => (
                            <div
                                key={vehicle.id}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                {/* Vehicle Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-x-3">
                                        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <TruckIcon className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{vehicle.regNumber}</h3>
                                            <p className="text-sm text-gray-500">{vehicle.model || 'No model'}</p>
                                        </div>
                                    </div>
                                    {vehicle.isAvailable ? (
                                        <span className="badge-success">Available</span>
                                    ) : (
                                        <span className="badge-warning">In Use</span>
                                    )}
                                </div>

                                {/* Vehicle Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-600">Type</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVehicleTypeColor(vehicle.type)}`}>
                                            {getVehicleTypeLabel(vehicle.type)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-600">Capacity</span>
                                        <span className="text-sm font-medium text-gray-900">{vehicle.capacityTon} ton</span>
                                    </div>
                                    {vehicle.manufactureYear && (
                                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                            <span className="text-sm text-gray-600">Year</span>
                                            <span className="text-sm font-medium text-gray-900">{vehicle.manufactureYear}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-600">Fitness Expiry</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(vehicle.fitnessExpiryDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button className="w-full btn-outline text-sm py-2 text-red-600 hover:bg-red-50 border-red-200">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Vehicle Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Vehicle</h3>
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
                                        Vehicle Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => {
                                            const type = parseInt(e.target.value)
                                            const selectedType = VEHICLE_TYPES.find(t => t.value === type)
                                            setFormData({
                                                ...formData,
                                                type,
                                                capacityTon: selectedType?.capacity || 1
                                            })
                                        }}
                                        className="input"
                                    >
                                        {VEHICLE_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Registration Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.registrationNumber}
                                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                                        className="input"
                                        placeholder="DHAKA-METRO-GA-11-2222"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Capacity (Ton) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0.1"
                                        step="0.1"
                                        value={formData.capacityTon}
                                        onChange={(e) => setFormData({ ...formData, capacityTon: parseFloat(e.target.value) })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Model (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="input"
                                        placeholder="e.g., TATA 407"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Manufacture Year (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        value={formData.manufactureYear}
                                        onChange={(e) => setFormData({ ...formData, manufactureYear: parseInt(e.target.value) })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fitness Expiry Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.fitnessExpiryDate}
                                        onChange={(e) => setFormData({ ...formData, fitnessExpiryDate: e.target.value })}
                                        className="input"
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
                                    disabled={addVehicle.isPending}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    {addVehicle.isPending ? 'Adding...' : 'Add Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
