export const Auth = {
    // Key for local storage
    STORAGE_KEY: 'gemini_demark_auth',

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return localStorage.getItem(this.STORAGE_KEY) === 'true';
    },

    /**
     * Log in the user
     * Accepts any username/password as per requirements
     * @param {string} username 
     * @param {string} password 
     */
    login(username, password) {
        // For now, allow any non-empty input, or even empty, as requested "process with any"
        localStorage.setItem(this.STORAGE_KEY, 'true');
        // Dispatch event for other components to listen to
        window.dispatchEvent(new CustomEvent('auth:login'));
        return true;
    },

    /**
     * Log out the user
     */
    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
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
