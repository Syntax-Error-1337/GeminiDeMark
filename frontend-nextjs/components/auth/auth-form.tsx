'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';

export function AuthForm() {
    const { login, register } = useAuth();
    const { t } = useI18n();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;

        try {
            if (isRegisterMode) {
                const res = await register(username, email, password);
                if (res.success) {
                    setSuccess(res.message || 'Registration successful');
                    setTimeout(() => setIsRegisterMode(false), 2000);
                } else {
                    setError(res.message || 'Registration failed');
                }
            } else {
                const res = await login(email, password);
                if (!res.success) {
                    setError(res.message || 'Login failed');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-view" className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <canvas id="bg-canvas" className="absolute inset-0 w-full h-full -z-20"></canvas>

            <div className="glass-card w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 mb-4 shadow-lg shadow-indigo-500/20 animate-float">
                        <span className="material-icons-round text-3xl text-white">lock</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isRegisterMode ? t('login.register.title') || 'Create Account' : t('login.title') || 'Welcome Back'}
                    </h2>
                    <p className="text-slate-400 mt-2">
                        {isRegisterMode ? t('login.register.subtitle') || 'Join to GeminiDeMark' : t('login.subtitle') || 'Sign in to GeminiDeMark'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegisterMode && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                                {t('login.username.label') || 'Username'}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                placeholder="Enter username"
                                required={isRegisterMode}
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                            {t('login.email.label') || 'Email'}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                            {t('login.password.label') || 'Password'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder={t('login.password.placeholder') || 'Enter password'}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>
                    )}
                    {success && (
                        <div className="text-emerald-400 text-sm text-center bg-emerald-500/10 p-2 rounded">{success}</div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="gradient"
                        className="w-full py-3 h-auto"
                    >
                        <span className="material-icons-round mr-2">{isRegisterMode ? 'person_add' : 'login'}</span>
                        {isRegisterMode ? t('login.register.btn') || 'Sign Up' : t('login.btn') || 'Sign In'}
                    </Button>

                    <div className="text-center text-xs text-slate-500 cursor-pointer hover:text-white transition-colors"
                        onClick={() => {
                            setIsRegisterMode(!isRegisterMode);
                            setError(null);
                            setSuccess(null);
                        }}
                    >
                        {isRegisterMode ? (
                            <>
                                {t('login.signin.toggle') || 'Already have an account?'} <span className="text-indigo-400 font-bold">{t('login.btn') || 'Sign In'}</span>
                            </>
                        ) : (
                            <>
                                {t('login.register.toggle') || 'Need an account?'} <span className="text-indigo-400 font-bold">{t('login.register.btn') || 'Register'}</span>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
