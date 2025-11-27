export const TableSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <th key={i} className="px-6 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((row) => (
                            <tr key={row}>
                                {[1, 2, 3, 4, 5].map((col) => (
                                    <td key={col} className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export const ProfileSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
