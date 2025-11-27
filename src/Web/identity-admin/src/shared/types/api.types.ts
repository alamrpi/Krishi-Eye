export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    emailConfirmed: boolean;
    twoFactorEnabled: boolean;
    role?: string;
    createdAt: string;
    lastLoginAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: string;
}

export interface RegisterResponse {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    message: string;
}

export interface ApiError {
    error: string;
    errors?: string[];
}
