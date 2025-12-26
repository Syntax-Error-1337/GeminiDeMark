'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token found.');
            return;
        }

        const verify = async () => {
            try {
                const response = await Auth.verifyEmail(token);
                if (response.success) {
                    setStatus('success');
                    setMessage(response.message || 'Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Verification failed. Invalid or expired token.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during verification.');
            }
        };

        verify();
    }, [token]);

    return (
        <Card className="w-full max-w-md mx-auto mt-20">
            <CardHeader className="text-center">
                <CardTitle>Email Verification</CardTitle>
                <CardDescription>
                    {status === 'verifying' && 'Please wait while we verify your email address.'}
                    {status === 'success' && 'Your email has been successfully verified.'}
                    {status === 'error' && 'We could not verify your email address.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                {status === 'verifying' && (
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <p className="text-center text-sm text-gray-500">{message}</p>
                        <Button onClick={() => router.push('/?login=true')} className="w-full">
                            Go to Login
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="h-12 w-12 text-red-500" />
                        <p className="text-center text-sm text-gray-500">{message}</p>
                        <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                            Return Home
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
