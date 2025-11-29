import { BellIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Search Bar - Modern & Compact */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="relative flex items-center max-w-md">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="block w-full rounded-full border-0 py-2 pl-10 pr-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:leading-6 bg-gray-50 hover:bg-white transition-colors"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Notifications */}
                <button
                    type="button"
                    className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition-colors"
                >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="flex items-center gap-x-3">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">Transporter</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
