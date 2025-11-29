import { NavLink } from 'react-router-dom'
import {
    HomeIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    TruckIcon,
    CheckCircleIcon,
    UsersIcon,
    ChartBarIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'NewRequests', href: '/requests', icon: DocumentTextIcon },
    { name: 'My Bids', href: '/bids', icon: CurrencyDollarIcon },
    { name: 'Active Jobs', href: '/active-jobs', icon: TruckIcon },
    { name: 'Completed Jobs', href: '/completed-jobs', icon: CheckCircleIcon },
    { name: 'Drivers', href: '/drivers', icon: UsersIcon },
    { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
    { name: 'Earnings Report', href: '/earnings', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
                {/* Logo */}
                <div className="flex h-16 shrink-0 items-center">
                    <TruckIcon className="h-8 w-8 text-primary-500" />
                    <span className="ml-2 text-xl font-bold text-gray-900">KrishiEye Transport</span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <NavLink
                                            to={item.href}
                                            className={({ isActive }) =>
                                                `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isActive
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                                                }`
                                            }
                                        >
                                            <item.icon
                                                className="h-6 w-6 shrink-0"
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}
