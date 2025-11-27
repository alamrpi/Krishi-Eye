export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    USERS: '/users',
    AUDIT_LOGS: '/audit-logs',
} as const;

export const ROLES = {
    ADMIN: 'Admin',
    TRADER: 'Trader',
    SELLER: 'Seller',
    BUYER: 'Buyer',
    TRANSPORTER: 'Transporter',
    SERVICE_PROVIDER: 'ServiceProvider',
} as const;

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/identity/auth/login',
    REGISTER: '/identity/auth/register',
    REFRESH: '/identity/auth/refresh',
    VERIFY_EMAIL_SEND: '/identity/auth/send-verification-email',
    VERIFY_EMAIL: '/identity/auth/verify-email',
    REQUEST_PASSWORD_RESET: '/identity/auth/request-password-reset',
    RESET_PASSWORD: '/identity/auth/reset-password',

    // Profile
    PROFILE: '/identity/user/profile',
    CHANGE_PASSWORD: '/identity/user/profile/change-password',
    ENABLE_2FA: '/identity/user/profile/enable-2fa',
    VERIFY_2FA: '/identity/user/profile/verify-2fa',
    DISABLE_2FA: '/identity/user/profile/disable-2fa',

    // Admin
    USERS: '/identity/admin/users',
    USER_DETAIL: (id: string) => `/identity/admin/users/${id}`,
    BLOCK_USER: (id: string) => `/identity/admin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `/identity/admin/users/${id}/unblock`,
    RESET_USER_PASSWORD: (id: string) => `/identity/admin/users/${id}/reset-password`,
    CREATE_USER: '/identity/admin/users/create',
    AUDIT_LOGS: '/identity/admin/audit-logs',
} as const;
