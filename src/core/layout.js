import i18n from '../i18n.js';
import { Auth } from './auth.js';

export const Layout = {
  init() {
    this.injectStyles();
    this.renderHeader();
    this.renderFooter();
    this.highlightActiveLink();
    this.setupMobileMenu();
    this.setupAuthListeners();
    // Apply translations to the newly injected elements
    i18n.applyTranslations();
  },

  injectStyles() {
    // Inject any critical CSS for the layout that can't be handled by Tailwind alone
    // (mostly for the mobile menu transition)
    const style = document.createElement('style');
    style.textContent = `
      .mobile-menu {
        transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
      }
      .mobile-menu.open {
        max-height: 400px;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  },

  setupAuthListeners() {
    window.addEventListener('auth:login', () => {
      this.renderHeader(); // Re-render to show Sign Out
      i18n.applyTranslations();
      this.highlightActiveLink();
    });
    window.addEventListener('auth:logout', () => {
      this.renderHeader(); // Re-render to show Sign In
      i18n.applyTranslations();
      this.highlightActiveLink();
    });
  },

  renderHeader() {
    const headerContainer = document.getElementById('app-header');
    if (!headerContainer) return;

    const isLoggedIn = Auth.isLoggedIn();

    headerContainer.innerHTML = `
      <header class="fixed top-0 inset-x-0 z-50 bg-[#050914]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center gap-2">
              <a href="/" class="group flex items-center gap-3" title="GeminiDeMark">
                 <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                 </div>
                 <div class="flex flex-col">
                    <span class="text-lg font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">GeminiDeMark</span>
                 </div>
              </a>
            </div>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-6">
              ${isLoggedIn ? `
                <button onclick="window.Auth.logout()" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                  <span class="material-icons-round text-lg">logout</span>
                  Sign Out
                </button>
              ` : `
                <button onclick="document.getElementById('login-modal')?.classList.remove('hidden')" class="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 rounded-full transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                  <span class="material-icons-round text-lg">login</span>
                  Sign In
                </button>
              `}

              <div class="h-6 w-px bg-white/10 mx-1"></div>

              <div class="relative">
                <button id="langDropdownBtn" class="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 rounded-full transition-all">
                  <span class="material-icons-round text-sm opacity-70">translate</span>
                  <span id="currentLangLabel">${{ 'en-US': 'EN', 'zh-CN': '中文', 'ru-RU': 'RU', 'ar-SA': 'AR', 'hi-IN': 'HI' }[i18n.locale] || 'EN'}</span>
                  <span class="material-icons-round text-sm opacity-50 ml-0.5">expand_more</span>
                </button>
                <!-- Dropdown -->
                <div id="langDropdownMenu" class="absolute top-full right-0 mt-2 w-32 bg-[#0b1120] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden transition-all origin-top-right z-50">
                    <button data-lang="en-US" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">English</button>
                    <button data-lang="zh-CN" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">中文</button>
                    <button data-lang="ru-RU" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">Русский</button>
                    <button data-lang="ar-SA" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">العربية</button>
                    <button data-lang="hi-IN" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">हिन्दी</button>
                </div>
              </div>
            </nav>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center">
              <button id="mobile-menu-btn" class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors">
                <span class="material-icons-round text-2xl">menu</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="mobile-menu md:hidden bg-[#050914]/95 backdrop-blur-xl border-t border-white/5">
           <div class="px-4 pt-2 pb-6 space-y-1 shadow-lg">
              ${isLoggedIn ? `
                <a href="/" class="flex items-center px-3 py-3 rounded-lg text-base font-medium text-white bg-white/5">
                   <span class="material-icons-round mr-3">home</span>
                   Home
                </a>
                <button onclick="window.Auth.logout()" class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-white/5 hover:text-red-300">
                   <span class="material-icons-round mr-3">logout</span>
                   Sign Out
                </button>
              ` : `
                 <button onclick="document.getElementById('login-modal')?.classList.remove('hidden')" class="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-white hover:bg-white/5">
                   <span class="material-icons-round mr-3">login</span>
                   Sign In
                 </button>
              `}
           </div>
        </div>
      </header>
    `;

    // Make Auth available globally for inline onclick handlers
    if (!window.Auth) window.Auth = Auth;
  },

  renderFooter() {
    const footerContainer = document.getElementById('app-footer');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
      <footer class="bg-[#050914] border-t border-white/5 pt-16 pb-8 text-slate-400 font-light relative overflow-hidden">
        <!-- Glow Effect -->
        <div class="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <!-- Brand Column -->
            <div class="col-span-1 md:col-span-2 space-y-6">
              <a href="/" class="flex items-center gap-3 group w-fit">
                <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </div>
                <span class="text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">GeminiDeMark</span>
              </a>
              <p class="text-sm leading-relaxed max-w-sm text-slate-500" data-i18n="footer.desc">
                GeminiDeMark. Engineered for precision and privacy.
              </p>
            </div>

            <!-- Social Links Column -->
            <div class="col-span-1 md:col-span-2 flex flex-col md:items-end">
              <div>
                <h6 class="font-bold mb-6 text-white text-xs tracking-[0.2em] uppercase opacity-80" data-i18n="footer.social">SOCIAL LINKS</h6>
                <ul class="space-y-4 text-sm">
                  <li><a href="#" class="hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>Twitter / X</a></li>
                  <li><a href="#" class="hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>LinkedIn</a></li>
                  <li><a href="#" class="hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>GitHub</a></li>
                </ul>
              </div>
            </div>

          </div>
          
          <!-- Bottom Bar -->
          <div class="border-t border-white/5 pt-8 text-xs font-medium tracking-wide text-slate-500">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
                <div class="flex items-center gap-1.5">
                    <span data-i18n="footer.madeby">Made with love by</span>
                    <span class="text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">Himanshu Tiwari</span>
                </div>
                
                <div class="flex items-center gap-8">
                   <a href="/privacy.html" class="hover:text-white transition-colors" data-i18n="footer.privacy">Privacy</a>
                   <a href="/terms.html" class="hover:text-white transition-colors" data-i18n="footer.terms">Terms</a>
                </div>
            </div>
            
            <p class="w-full opacity-60 leading-relaxed text-[10px] uppercase tracking-wider text-center md:text-left align-center" data-i18n="footer.disclaimer">
                Disclaimer: This tool is for educational purposes only. The author is not responsible for any illegal use or misuse of this software. Users are solely responsible for their actions.
            </p>
          </div>
        </div>
      </footer>
    `;
  },

  highlightActiveLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('nav a, .mobile-menu a');

    links.forEach(link => {
      const href = link.getAttribute('href');
      // Reset
      link.classList.remove('text-indigo-600', 'bg-indigo-50/50');
      link.classList.add('text-slate-600');

      if (href === path || (path === '/' && href === '/index.html') || (path.endsWith('/') && href === './')) {
        link.classList.add('text-indigo-600', 'bg-indigo-50/50');
        link.classList.remove('text-slate-600');
      }
    });
  },

  setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', () => {
        menu.classList.toggle('open');
      });
    }
  }
};
