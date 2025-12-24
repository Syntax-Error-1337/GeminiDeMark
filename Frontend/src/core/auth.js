export const Auth = {
    // Key for local storage
    STORAGE_KEY: 'gemini_demark_auth',
    TOKEN_KEY: 'gemini_demark_token',
    USER_KEY: 'gemini_demark_user',
    API_URL: 'http://localhost:5001/api/auth',

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    },

    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Log in the user
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

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
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, message: error.message };
        }
    },

    /**
     * Register a new user
     * @param {string} username
     * @param {string} email 
     * @param {string} password 
     */
    async register(username, email, password) {
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
        } catch (error) {
            console.error('Register Error:', error);
            return { success: false, message: error.message };
        }
    },

    /**
     * Log out the user
     */
    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        // Reload to ensure clean state
        window.location.reload();
    },

    /**
     * Require auth: Redirect or show login if not authenticated
     * @param {Function} onUnauthenticated Callback if not logged in
     */
    requireAuth(onUnauthenticated) {
        if (!this.isLoggedIn()) {
            if (onUnauthenticated) onUnauthenticated();
            return false;
        }
        return true;
    }
};
