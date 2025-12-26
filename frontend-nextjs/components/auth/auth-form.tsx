'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';

export function AuthForm() {
    const { login, register, resendVerification } = useAuth();
    const { t } = useI18n();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleResendVerification = async () => {
        const formData = new FormData(document.querySelector('form') as HTMLFormElement);
        const email = formData.get('email') as string;

        if (!email) {
            setError("Please enter your email address to resend verification.");
            return;
        }

        setResendLoading(true);
        try {
            const res = await resendVerification(email);
            if (res.success) {
                setSuccess(res.message || "Verification email resent!");
                setError(null);
            } else {
                setError(res.message || "Failed to resend.");
            }
        } catch (err) {
            setError("Failed to resend verification email.");
        } finally {
            setResendLoading(false);
        }
    };

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

    const isVerificationError = error?.toLowerCase().includes('verify');

    return (
        <div id="login-view" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>

            <div className="glass-card w-full max-w-md bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-border relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 mb-4 shadow-lg shadow-indigo-500/20 animate-float">
                        <span className="material-icons-round text-3xl text-white">lock</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                        {isRegisterMode ? t('login.register.title') || 'Create Account' : t('login.title') || 'Welcome Back'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isRegisterMode ? t('login.register.subtitle') || 'Join to GeminiDeMark' : t('login.subtitle') || 'Sign in to GeminiDeMark'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegisterMode && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                                {t('login.username.label') || 'Username'}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter username"
                                required={isRegisterMode}
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                            {t('login.email.label') || 'Email'}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                            {t('login.password.label') || 'Password'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder={t('login.password.placeholder') || 'Enter password'}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded border border-destructive/20">
                            {error}
                            {isVerificationError && !isRegisterMode && (
                                <div className="mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="w-full"
                                    >
                                        {resendLoading ? "Sending..." : "Resend Verification Email"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {success && (
                        <div className="text-emerald-500 text-sm text-center bg-emerald-500/10 p-2 rounded border border-emerald-500/20">{success}</div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="default"
                        className="w-full py-3 h-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <span className="material-icons-round mr-2">{isRegisterMode ? 'person_add' : 'login'}</span>
                        {isRegisterMode ? t('login.register.btn') || 'Sign Up' : t('login.btn') || 'Sign In'}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => {
                            setIsRegisterMode(!isRegisterMode);
                            setError(null);
                            setSuccess(null);
                        }}
                    >
                        {isRegisterMode ? (
                            <>
                                {t('login.signin.toggle') || 'Already have an account?'} <span className="text-primary font-bold">{t('login.btn') || 'Sign In'}</span>
                            </>
                        ) : (
                            <>
                                {t('login.register.toggle') || 'Need an account?'} <span className="text-primary font-bold">{t('login.register.btn') || 'Register'}</span>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
