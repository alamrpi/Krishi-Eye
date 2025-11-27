import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { ROUTES } from '../shared/constants';

// Pages (will be created)
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import UsersPage from '../pages/UsersPage';
import AuditLogsPage from '../pages/AuditLogsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
};

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.VERIFY_EMAIL} element={<EmailVerificationPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

                {/* Protected routes */}
                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROFILE}
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.USERS}
                    element={
                        <ProtectedRoute>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.AUDIT_LOGS}
                    element={
                        <ProtectedRoute>
                            <AuditLogsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
