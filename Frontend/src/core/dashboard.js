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

            const historyResponse = await fetch(`${Auth.API_URL.replace('/auth', '/dashboard')}/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch dashboard data');

            const data = await response.json();
            const history = historyResponse.ok ? await historyResponse.json() : [];
            this.history = history;

            console.log("Dashboard Data Received:", data, history);
            this.render(data, history);
        } catch (error) {
            console.error(error);
            const container = document.getElementById('dashboard-view');
            if (container) container.innerHTML = `<div class="text-red-400 text-center p-8">Failed to load dashboard data. <br> ${error.message}</div>`;
        }
    },

    render(user, history = []) {
        const container = document.getElementById('dashboard-view');
        if (!container) return;

        const percentage = Math.min(100, Math.round((user.monthlyUsage / user.monthlyLimit) * 100));
        let color = 'emerald';
        if (percentage > 75) color = 'yellow';
        if (percentage >= 100) color = 'red';

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <span class="material-icons-round text-indigo-500 text-4xl">dashboard</span>
                            ${i18n.t('dashboard.title')}
                        </h2>
                        <p class="text-slate-400 mt-2 font-medium">Manage your subscription and view your activity</p>
                    </div>
                    <button onclick="window.location.reload()" class="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-slate-300 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/10">
                        <span class="material-icons-round text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        ${i18n.t('dashboard.back')}
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Left Column: Profile & Usage (4 cols) -->
                    <div class="lg:col-span-4 space-y-8">
                        <!-- Profile Card -->
                        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                             <div class="absolute top-0 right-0 p-24 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
                            
                            <div class="relative z-10 flex flex-col items-center text-center">
                                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
                                    <div class="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                                        <span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">
                                            ${user.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-1">${user.username}</h3>
                                <div class="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                    <span class="material-icons-round text-base text-slate-500">email</span>
                                    ${user.email}
                                </div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                                    <span class="material-icons-round text-xs">verified</span>
                                    ${user.role.toUpperCase()} ${i18n.t('dashboard.plan')}
                                </div>
                            </div>
                        </div>

                        <!-- Usage Card -->
                        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                             <div class="flex items-center justify-between mb-6">
                                <h4 class="text-slate-300 font-semibold flex items-center gap-2">
                                    <span class="material-icons-round text-indigo-400">pie_chart</span>
                                    ${i18n.t('dashboard.usage.title')}
                                </h4>
                                <span class="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">Resets ${new Date(user.createdAt).getDate()}th</span>
                             </div>
                             
                             <div class="mb-3 flex items-end justify-between">
                                 <span class="text-4xl font-bold text-white tracking-tight">${user.monthlyUsage}</span>
                                 <span class="text-sm text-slate-400 mb-1.5 font-medium">/ ${user.monthlyLimit} credits</span>
                             </div>
                             
                            <!-- Progress Bar -->
                            <div class="w-full h-4 bg-black/40 rounded-full overflow-hidden mb-3 border border-white/5">
                                <div class="h-full bg-gradient-to-r from-indigo-500 to-${color}-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)] relative" style="width: ${percentage}%">
                                    <div class="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            <p class="text-xs text-slate-500 text-right font-medium">${percentage}% Used</p>
                        </div>
                        
                        <!-- Upgrade Call -->
                        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 text-center relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer border border-white/10">
                             <div class="absolute top-0 right-0 p-24 bg-white/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                             
                             <span class="material-icons-round text-4xl text-white/90 mb-4 drop-shadow-md">diamond</span>
                             <h4 class="text-white font-bold text-xl mb-2">${i18n.t('dashboard.upgrade.title')}</h4>
                             <p class="text-indigo-100 text-sm mb-6 leading-relaxed opacity-90">${i18n.t('dashboard.upgrade.desc')}</p>
                             <button class="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow-lg">
                                ${i18n.t('dashboard.upgrade.btn')}
                             </button>
                        </div>
                    </div>

                    <!-- Right Column: Recent Conversions (8 cols) -->
                    <div class="lg:col-span-8">
                        <div class="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl h-full flex flex-col">
                            <div class="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <h3 class="text-lg font-bold text-white flex items-center gap-3">
                                    <span class="material-icons-round text-emerald-400">history</span>
                                    Recent Conversions
                                </h3>
                                 <span class="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">${history.length} records</span>
                            </div>
                            
                            <div class="flex-1 overflow-x-auto">
                                <table class="w-full text-left text-sm text-slate-400">
                                     <thead class="bg-black/20 text-slate-300 uppercase font-semibold text-xs tracking-wider">
                                        <tr>
                                            <th class="px-6 py-4">
                                                <div class="flex items-center gap-2"><span class="material-icons-round text-sm text-slate-500">calendar_today</span> Date</div>
                                            </th>
                                            <th class="px-6 py-4">
                                                <div class="flex items-center gap-2"><span class="material-icons-round text-sm text-slate-500">sd_storage</span> Size</div>
                                            </th>
                                            <th class="px-6 py-4">
                                                 <div class="flex items-center gap-2"><span class="material-icons-round text-sm text-slate-500">info</span> Status</div>
                                            </th>
                                            <th class="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-white/5">
                                        ${history.length > 0 ? history.map(item => `
                                            <tr class="hover:bg-white/5 transition-colors group">
                                                <td class="px-6 py-4 text-slate-300 font-medium whitespace-nowrap">
                                                    ${new Date(item.timestamp).toLocaleDateString()}
                                                    <span class="text-xs text-slate-500 block mt-0.5">${new Date(item.timestamp).toLocaleTimeString()}</span>
                                                </td>
                                                <td class="px-6 py-4 font-mono text-xs">${this.formatBytes(item.fileSize)}</td>
                                                <td class="px-6 py-4">
                                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                                        Completed
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 text-right">
                                                    <button onclick="window.Dashboard.viewImage(${item.id})" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 transition-all text-xs font-bold group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-105 active:scale-95">
                                                        <span class="material-icons-round text-sm">visibility</span> View
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('') : `
                                            <tr>
                                                <td colspan="4" class="px-6 py-20 text-center text-slate-500">
                                                    <div class="flex flex-col items-center gap-4">
                                                        <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                            <span class="material-icons-round text-3xl text-slate-600">history_toggle_off</span>
                                                        </div>
                                                        <div>
                                                            <p class="text-base font-medium text-slate-400 mb-1">No conversion history found</p>
                                                            <p class="text-xs text-slate-600">Your recent activities will appear here</p>
                                                        </div>
                                                        <button onclick="window.location.reload()" class="text-indigo-400 hover:text-indigo-300 text-sm font-bold hover:underline">Start your first conversion</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Image Viewer Modal -->
            <div id="image-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 p-4 md:p-8">
                <!-- Close Button -->
                <button onclick="document.getElementById('image-modal').classList.add('hidden')" class="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 group">
                    <span class="material-icons-round text-2xl group-hover:rotate-90 transition-transform">close</span>
                </button>

                <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 h-[85vh]">
                    <!-- Original Card -->
                    <div class="flex flex-col bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                        <div class="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                            <h3 class="text-lg font-bold text-slate-200 flex items-center gap-3">
                                <span class="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
                                Original Image
                            </h3>
                        </div>
                        <div class="flex-1 relative p-6 flex items-center justify-center overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmRmZCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]">
                            <img id="modal-img-original" class="max-w-full max-h-full object-contain rounded-xl shadow-lg" src="" alt="Original">
                        </div>
                    </div>

                    <!-- Processed Card -->
                    <div class="flex flex-col bg-[#0f172a] rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 overflow-hidden relative group">
                        <!-- Glow effect -->
                        <div class="absolute inset-0 bg-emerald-500/5 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
                        
                        <div class="relative z-10 p-6 bg-emerald-500/10 border-b border-emerald-500/20 flex justify-between items-center backdrop-blur-sm">
                            <h3 class="text-lg font-bold text-emerald-400 flex items-center gap-3">
                                <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                                Processed Result
                            </h3>
                            <a id="modal-dl-processed" href="#" download class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm">
                                <span class="material-icons-round text-lg">download</span> Download
                            </a>
                        </div>
                        <div class="flex-1 relative z-10 p-6 flex items-center justify-center overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmRmZCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]">
                            <img id="modal-img-processed" class="max-w-full max-h-full object-contain rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300" src="" alt="Processed">
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    viewImage(id) {
        const item = this.history.find(h => h.id === id);
        if (!item) return;

        const modal = document.getElementById('image-modal');
        const imgOriginal = document.getElementById('modal-img-original');
        const imgProcessed = document.getElementById('modal-img-processed');
        const dlProcessed = document.getElementById('modal-dl-processed');
        const token = localStorage.getItem(Auth.TOKEN_KEY);

        // Security note: We use a signed URL or just auth headers? 
        // <img> tags initiate GET requests. We cannot easily add headers to standard <img> tags.
        // We either need a "token query param" or "fetch blob and set objectURL".
        // Let's use fetch blob for better security integration with existing 'Authorization' header.

        const loadImage = async (type, imgElement) => {
            imgElement.src = ''; // Clear previous
            imgElement.parentElement.classList.add('animate-pulse'); // Loading state

            try {
                const response = await fetch(`${Auth.API_URL.replace('/auth', '/dashboard')}/image/${id}/${type}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    imgElement.src = url;

                    // Cleanup URL when image loads (optional, but good for memory)
                    imgElement.onload = () => {
                        imgElement.parentElement.classList.remove('animate-pulse');
                    };

                    return url;
                } else {
                    console.error("Failed to load image");
                    imgElement.parentElement.classList.remove('animate-pulse');
                }
            } catch (e) {
                console.error(e);
                imgElement.parentElement.classList.remove('animate-pulse');
            }
        };

        // Load images
        Promise.all([
            loadImage('original', imgOriginal),
            loadImage('processed', imgProcessed).then(url => {
                if (url) {
                    dlProcessed.href = url;
                    dlProcessed.download = `gemini_${item.id}_clean.png`;
                }
            })
        ]);

        modal.classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('image-modal').classList.add('hidden');
    },

    formatBytes(bytes, decimals = 2) {
        if (!bytes) return '-';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
                alert(i18n.t('dashboard.limit.reached', { limit: data.monthlyLimit }));
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
    // Increment after success
    async trackSuccess(originalBlob = null, processedBlob = null) {
        if (!Auth.isLoggedIn()) return;
        try {
            let imageData = null;
            let originalImage = null;

            // Convert Processed Image
            if (processedBlob) {
                imageData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(processedBlob);
                });
            }

            // Convert Original Image
            if (originalBlob) {
                originalImage = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(originalBlob);
                });
            }

            const token = localStorage.getItem(Auth.TOKEN_KEY);
            const response = await fetch(`${Auth.API_URL.replace('/auth', '/user')}/track`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageData, originalImage })
            });

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
