'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth, type User } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, pass: string) => Promise<any>;
    register: (user: string, email: string, pass: string) => Promise<any>;
    logout: () => void;
    resendVerification: (email: string) => Promise<any>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const storedUser = Auth.getUser();
        if (storedUser) setUser(storedUser);
        setIsLoading(false);

        // Listen for global events
        const onLogin = () => setUser(Auth.getUser());
        const onLogout = () => setUser(null);

        window.addEventListener('auth:login', onLogin);
        window.addEventListener('auth:logout', onLogout);

        return () => {
            window.removeEventListener('auth:login', onLogin);
            window.removeEventListener('auth:logout', onLogout);
        };
    }, []);

    const login = async (email: string, pass: string) => {
        return Auth.login(email, pass);
    };

    const register = async (username: string, email: string, pass: string) => {
        return Auth.register(username, email, pass);
    };

    const logout = () => {
        Auth.logout();
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, resendVerification: (email) => Auth.resendVerification(email), isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
