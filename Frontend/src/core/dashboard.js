import { Auth } from './auth.js';
import i18n from '../i18n.js';

export const Dashboard = {
    init() {
        this.renderPlaceholder();
    },

    renderPlaceholder() {
        const statsContainer = document.getElementById('dashboard-view');
        if (!statsContainer) return;

        // Initial skeleton or hidden state
        statsContainer.classList.add('hidden');
    },

    async show() {
        if (!Auth.isLoggedIn()) return;

        const container = document.getElementById('dashboard-view');
        const appContent = document.getElementById('app-content');
        const loginView = document.getElementById('login-view');

        // Hide others
        if (appContent) appContent.classList.add('hidden');
        if (loginView) loginView.classList.add('hidden');

        // Show dashboard
        if (container) container.classList.remove('hidden');

        await this.fetchAndRender();
    },

    async fetchAndRender() {
        try {
            const token = localStorage.getItem(Auth.TOKEN_KEY);
            const response = await fetch(`${Auth.API_URL.replace('/auth', '/user')}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch dashboard data');

            const data = await response.json();
            console.log("Dashboard Data Received:", data);
            this.render(data);
        } catch (error) {
            console.error(error);
            const container = document.getElementById('dashboard-view');
            if (container) container.innerHTML = `<div class="text-red-400 text-center p-8">Failed to load dashboard data. <br> ${error.message}</div>`;
        }
    },

    render(user) {
        const container = document.getElementById('dashboard-view');
        if (!container) return;

        const percentage = Math.min(100, Math.round((user.monthlyUsage / user.monthlyLimit) * 100));
        let color = 'emerald';
        if (percentage > 75) color = 'yellow';
        if (percentage >= 100) color = 'red';

        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 py-12">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-bold text-white">Dashboard</h2>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 text-sm transition-colors">
                        Back to Editor
                    </button>
                </div>

                <!-- Profile Card -->
                <div class="glass-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
                    <div class="flex items-center gap-6">
                        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            ${user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-white mb-1">${user.username}</h3>
                            <p class="text-slate-400 text-sm">${user.email}</p>
                            <div class="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                ${user.role.toUpperCase()} PLAN
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Usage Stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Monthly Usage -->
                    <div class="glass-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div class="absolute top-0 right-0 p-32 bg-${color}-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-${color}-500/20 transition-all"></div>
                        
                        <div class="relative z-10">
                            <h4 class="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Monthly Usage</h4>
                            <div class="flex items-end gap-2 mb-4">
                                <span class="text-4xl font-bold text-white">${user.monthlyUsage}</span>
                                <span class="text-xl text-slate-500 mb-1">/ ${user.monthlyLimit} images</span>
                            </div>

                            <!-- Progress Bar -->
                            <div class="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div class="h-full bg-${color}-500 transition-all duration-1000" style="width: ${percentage}%"></div>
                            </div>
                            <p class="text-xs text-slate-500 mt-3">Resets on ${new Date(user.createdAt).getDate()}th of every month</p>
                        </div>
                    </div>

                    <!-- Upgrade Call -->
                    <div class="glass-card bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                        <span class="material-icons-round text-4xl text-indigo-400 mb-3">diamond</span>
                        <h4 class="text-white font-bold text-lg mb-2">Upgrade to Pro</h4>
                        <p class="text-slate-400 text-sm mb-6">Get unlimited processing and priority support.</p>
                        <button class="px-6 py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                            View Plans
                        </button>
                        <button onclick="window.Dashboard.trackSuccess()" class="mt-4 text-xs text-indigo-300 underline">
                            Test Tracking (Debug)
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Check usage before processing
    async verifyLimit() {
        if (!Auth.isLoggedIn()) return true; // Or false if you enforce login

        try {
            const token = localStorage.getItem(Auth.TOKEN_KEY);
            const response = await fetch(`${Auth.API_URL.replace('/auth', '/user')}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.monthlyUsage >= data.monthlyLimit) {
                alert("You have reached your monthly limit of " + data.monthlyLimit + " images.");
                return false;
            }
            return true;
        } catch (e) {
            console.error("Limit check failed", e);
            return true; // Use simple fail-open or fail-closed policy
        }
    },

    // Increment after success
    // Increment after success
    async trackSuccess() {
        if (!Auth.isLoggedIn()) return;
        try {
            const token = localStorage.getItem(Auth.TOKEN_KEY);
            const response = await fetch(`${Auth.API_URL.replace('/auth', '/user')}/track`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("[Dashboard] Track usage response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                this.syncHeaderStats(data.usage, data.limit);
            }
        } catch (e) { console.error(e); }
    },

    async fetchStatsSilent() {
        if (!Auth.isLoggedIn()) return;
        try {
            const token = localStorage.getItem(Auth.TOKEN_KEY);
            const response = await fetch(`${Auth.API_URL.replace('/auth', '/user')}/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                this.syncHeaderStats(data.monthlyUsage, data.monthlyLimit);
            }
        } catch (e) { console.error(e); }
    },

    syncHeaderStats(usage, limit) {
        const badge = document.getElementById('header-usage-badge');
        if (badge) {
            badge.textContent = `${usage} / ${limit}`;
            badge.classList.remove('hidden');

            // Visual feedback
            badge.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.2)' },
                { transform: 'scale(1)' }
            ], { duration: 300 });
        }
    }
};
