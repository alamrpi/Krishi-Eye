import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: Toast['type'], message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: Toast['type'], message: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, type, message }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
    toasts,
    removeToast,
}) => {
    const getToastStyles = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-500 text-green-900';
            case 'error':
                return 'bg-red-50 border-red-500 text-red-900';
            case 'warning':
                return 'bg-yellow-50 border-yellow-500 text-yellow-900';
            case 'info':
                return 'bg-blue-50 border-blue-500 text-blue-900';
            default:
                return 'bg-gray-50 border-gray-500 text-gray-900';
        }
    };

    const getIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '•';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg min-w-[300px] max-w-md animate-slide-in ${getToastStyles(
                        toast.type
                    )}`}
                >
                    <span className="text-xl font-bold">{getIcon(toast.type)}</span>
                    <p className="flex-1 text-sm font-medium">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-lg font-bold hover:opacity-70 transition"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};
