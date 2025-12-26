
export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    accessToken?: string;
    id?: string;
    username?: string;
    email?: string;
    role?: string;
}

export const Auth = {
    STORAGE_KEY: 'gemini_demark_auth',
    TOKEN_KEY: 'gemini_demark_token',
    USER_KEY: 'gemini_demark_user',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/auth',

    isLoggedIn(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(this.TOKEN_KEY);
    },

    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                const text = await response.text();
                console.error("Non-JSON response:", text);
                throw new Error("Server returned non-JSON response. Check console for details.");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem(this.TOKEN_KEY, data.accessToken);
            localStorage.setItem(this.USER_KEY, JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role
            }));

            // Dispatch event for other components to listen to
            window.dispatchEvent(new CustomEvent('auth:login'));
            return { success: true };
        } catch (error: any) {
            console.error('Login Error:', error);
            return { success: false, message: error.message };
        }
    },

    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            return { success: true, message: data.message };
        } catch (error: any) {
            console.error('Register Error:', error);
            return { success: false, message: error.message };
        }
    },

    async verifyEmail(token: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_URL}/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            return { success: true, message: data.message };
        } catch (error: any) {
            console.error('Verification Error:', error);
            return { success: false, message: error.message };
        }
    },

    async resendVerification(email: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_URL}/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                // This usually happens if the route doesn't exist (404 HTML) or server crashed
                const text = await response.text();
                console.error("Resend Verification Non-JSON response:", text);
                return { success: false, message: "Backend route not found. Please RESTART the backend server." };
            }

            const data = await response.json();

            if (!response.ok) {
                // Return success false but with the message from backend
                return { success: false, message: data.message || 'Resend failed' };
            }

            return { success: true, message: data.message };
        } catch (error: any) {
            console.error('Resend Verification Error:', error);
            return { success: false, message: error.message };
        }
    },

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        // In Next.js we might use router.push instead of reload, but reload is safe
        window.location.reload();
    }
};
