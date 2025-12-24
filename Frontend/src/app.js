import { WatermarkEngine } from './core/watermarkEngine.js';
import { Layout } from './core/layout.js';
import { Auth } from './core/auth.js';
import { Dashboard } from './core/dashboard.js';
import { AuroraBackground } from './core/bg-animation.js';
import i18n from './i18n.js';
import { loadImage, checkOriginal, getOriginalStatus, setStatusMessage, showLoading, hideLoading } from './utils.js';
import JSZip from 'jszip';
import mediumZoom from 'medium-zoom';

// global state
let engine = null;
let imageQueue = [];
let processedCount = 0;
let zoom = null;

// dom elements references
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const singlePreview = document.getElementById('singlePreview');
const multiPreview = document.getElementById('multiPreview');
const imageList = document.getElementById('imageList');
const progressText = document.getElementById('progressText');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const originalImage = document.getElementById('originalImage');
const processedSection = document.getElementById('processedSection');
const processedImage = document.getElementById('processedImage');
const originalInfo = document.getElementById('originalInfo');
const processedInfo = document.getElementById('processedInfo');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

/**
 * initialize the application
 */
// Initialize GSAP Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".glass-card", { duration: 1.2, y: 0, opacity: 1, ease: "power3.out", stagger: 0.2 });
    gsap.to(".hero-title", { duration: 1, y: 0, opacity: 1, ease: "back.out(1.7)", delay: 0.2 });
    gsap.to(".hero-subtitle", { duration: 1, y: 0, opacity: 1, ease: "power2.out", delay: 0.4 });

    // Checks if element exists to avoid warning
    if (document.querySelector(".float-element")) {
        gsap.to(".float-element", { y: -15, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    // Features Staggered Entry
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".feature-card",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        onComplete: () => {
            gsap.set(".feature-card", { clearProps: "transform" });
        }
    });
}

async function init() {
    try {
        await i18n.init();
        updateProgress(); // Restore counter after i18n overwrite
        Layout.init();

        // Initialize Background & Animations
        setTimeout(() => {
            new AuroraBackground('bg-canvas');
            new AuroraBackground('hero-canvas');
            initAnimations();
        }, 100);

        // Language Dropdown Toggle
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#langDropdownBtn');
            const menu = document.getElementById('langDropdownMenu');

            if (btn && menu) {
                e.stopPropagation();
                menu.classList.toggle('hidden');
                return;
            }

            // Language Selection
            const langItem = e.target.closest('[data-lang]');
            if (langItem && menu && !menu.contains(e.target.parentNode.closest('#langDropdownMenu') === null)) { // Simplify check: just check if inside menu
                // Actually relying on bubbling. 
            }
        });

        // Better delegated listener for Language Selection
        document.addEventListener('click', async (e) => {
            const langItem = e.target.closest('[data-lang]');
            if (langItem) {
                const newLocale = langItem.getAttribute('data-lang');
                await i18n.switchLocale(newLocale);

                // Update label
                const label = document.getElementById('currentLangLabel');
                const labels = { 'en-US': 'EN', 'zh-CN': '中文', 'ru-RU': 'RU', 'ar-SA': 'AR', 'hi-IN': 'HI' };
                if (label) label.textContent = labels[newLocale] || 'EN';

                updateDynamicTexts();
                document.getElementById('langDropdownMenu')?.classList.add('hidden');
            }

            // Close menu when clicking outside
            if (!e.target.closest('#langDropdownBtn') && !e.target.closest('#langDropdownMenu')) {
                document.getElementById('langDropdownMenu')?.classList.add('hidden');
            }
        });

        // Check Auth
        if (!Auth.isLoggedIn()) {
            showLogin();
        } else {
            showApp();
        }

        // Listen for events
        window.addEventListener('auth:login', () => showApp());
        window.addEventListener('auth:logout', () => showLogin());

        showLoading(i18n.t('status.loading'));

        engine = await WatermarkEngine.create();

        hideLoading();
        setupEventListeners();

        zoom = mediumZoom('[data-zoomable]', {
            margin: 24,
            scrollOffset: 0,
            background: 'rgba(15, 23, 42, 0.95)', // Dark Slate 900
        });


    } catch (error) {
        hideLoading();
        console.error('初始化错误：', error);
    }
}

function showLogin() {
    document.getElementById('login-view')?.classList.remove('hidden');
    document.getElementById('app-content')?.classList.add('hidden');
    document.getElementById('dashboard-view')?.classList.add('hidden');
}

function showApp() {
    document.getElementById('login-view')?.classList.add('hidden');
    document.getElementById('dashboard-view')?.classList.add('hidden');
    document.getElementById('app-content')?.classList.remove('hidden');
}

/**
 * setup language switch
 */
// setupLanguageSwitch removed in favor of delegated event listener in init()

/**
 * setup event listeners
 */
function setupEventListeners() {
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(Array.from(e.dataTransfer.files));
    });

    downloadAllBtn.addEventListener('click', downloadAll);
    resetBtn.addEventListener('click', reset);

    // Login Form Listener
    // Login/Register Logic
    const loginForm = document.getElementById('login-form');
    const toggleBtn = document.getElementById('toggle-auth-mode');
    const usernameField = document.getElementById('username-field');
    const authBtnText = document.getElementById('auth-btn-text');
    const authBtnIcon = document.getElementById('auth-btn-icon');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');
    let isRegisterMode = false;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isRegisterMode = !isRegisterMode;
            if (isRegisterMode) {
                usernameField.classList.remove('hidden');
                document.getElementById('username').required = true;
                authBtnText.textContent = 'Register';
                authBtnIcon.textContent = 'person_add';
                document.querySelector('[data-i18n="login.title"]').textContent = 'Create Account';
                document.querySelector('[data-i18n="login.subtitle"]').textContent = 'Join GeminiDeMark today';
                toggleBtn.innerHTML = `Already have an account? <span class="text-indigo-400 font-bold">Sign In</span>`;
            } else {
                usernameField.classList.add('hidden');
                document.getElementById('username').required = false;
                authBtnText.textContent = i18n.t('login.btn') || 'Sign In';
                authBtnIcon.textContent = 'login';
                document.querySelector('[data-i18n="login.title"]').textContent = i18n.t('login.title') || 'Welcome Back';
                document.querySelector('[data-i18n="login.subtitle"]').textContent = i18n.t('login.subtitle') || 'Sign in to GeminiDeMark';
                toggleBtn.innerHTML = `Need an account? <span class="text-indigo-400 font-bold">Register</span>`;
            }
            formError.classList.add('hidden');
            formSuccess.classList.add('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Form Submitted! Register Mode:", isRegisterMode);

            formError.classList.add('hidden');
            formSuccess.classList.add('hidden');

            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const username = loginForm.username.value;

            if (isRegisterMode) {
                const result = await Auth.register(username, email, password);
                if (result.success) {
                    formSuccess.textContent = result.message;
                    formSuccess.classList.remove('hidden');
                    // Switch to login
                    setTimeout(() => toggleBtn.click(), 2000);
                } else {
                    formError.textContent = result.message;
                    formError.classList.remove('hidden');
                }
            } else {
                const result = await Auth.login(email, password);
                if (!result.success) {
                    formError.textContent = result.message;
                    formError.classList.remove('hidden');
                }
                // If success, Auth.login triggers 'auth:login' event which updates UI globally
            }
        });
    }
}

function reset() {
    singlePreview.style.display = 'none';
    multiPreview.style.display = 'none';
    imageQueue = [];
    processedCount = 0;
    fileInput.value = '';
}

function handleFileSelect(e) {
    handleFiles(Array.from(e.target.files));
}

function handleFiles(files) {
    const validFiles = files.filter(file => {
        if (!file.type.match('image/(jpeg|png|webp)')) return false;
        if (file.size > 20 * 1024 * 1024) return false;
        return true;
    });

    if (validFiles.length === 0) return;

    imageQueue = validFiles.map((file, index) => ({
        id: Date.now() + index,
        file,
        name: file.name,
        status: 'pending',
        originalImg: null,
        processedBlob: null
    }));

    processedCount = 0;

    if (validFiles.length === 1) {
        singlePreview.style.display = 'block';
        multiPreview.style.display = 'none';
        processSingle(imageQueue[0]);
    } else {
        singlePreview.style.display = 'none';
        multiPreview.style.display = 'block';
        imageList.innerHTML = '';
        updateProgress();
        multiPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        imageQueue.forEach(item => createImageCard(item));
        processQueue();
    }
}

async function processSingle(item) {
    try {
        const img = await loadImage(item.file);
        item.originalImg = img;

        const { is_google, is_original } = await checkOriginal(item.file);
        const status = getOriginalStatus({ is_google, is_original });
        setStatusMessage(status, is_google && is_original ? 'success' : 'warn');

        originalImage.src = img.src;

        const watermarkInfo = engine.getWatermarkInfo(img.width, img.height);
        originalInfo.innerHTML = `
            <p>${i18n.t('info.size')}: ${img.width}×${img.height}</p>
            <p>${i18n.t('info.watermark')}: ${watermarkInfo.size}×${watermarkInfo.size}</p>
            <p>${i18n.t('info.position')}: (${watermarkInfo.position.x},${watermarkInfo.position.y})</p>
        `;

        const result = await engine.removeWatermarkFromImage(img);
        const blob = await new Promise(resolve => result.toBlob(resolve, 'image/png'));
        item.processedBlob = blob;

        processedImage.src = URL.createObjectURL(blob);
        processedSection.style.display = 'block';
        downloadBtn.style.display = 'flex';
        downloadBtn.onclick = () => downloadImage(item);

        processedInfo.innerHTML = `
            <p>${i18n.t('info.size')}: ${img.width}×${img.height}</p>
            <p>${i18n.t('info.status')}: ${i18n.t('info.removed')}</p>
        `;

        zoom.detach();
        zoom.attach('[data-zoomable]');

        processedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error(error);
    }
}

function createImageCard(item) {
    const card = document.createElement('div');
    card.id = `card-${item.id}`;
    card.className = 'bg-white md:h-[140px] rounded-xl shadow-card border border-gray-100 overflow-hidden';
    card.innerHTML = `
        <div class="flex flex-wrap h-full">
            <div class="w-full md:w-auto h-full flex border-b border-gray-100">
                <div class="w-24 md:w-48 flex-shrink-0 bg-gray-50 p-2 flex items-center justify-center">
                    <img id="result-${item.id}" class="max-w-full max-h-24 md:max-h-full rounded" data-zoomable />
                </div>
                <div class="flex-1 p-4 flex flex-col min-w-0">
                    <h4 class="font-semibold text-sm text-gray-900 mb-2 truncate">${item.name}</h4>
                    <div class="text-xs text-gray-500" id="status-${item.id}">${i18n.t('status.pending')}</div>
                </div>
            </div>
            <div class="w-full md:w-auto ml-auto flex-shrink-0 p-2 md:p-4 flex items-center justify-center">
                <button id="download-${item.id}" class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs md:text-sm hidden">${i18n.t('btn.download')}</button>
            </div>
        </div>
    `;
    imageList.appendChild(card);
}

async function processQueue() {
    for (const item of imageQueue) {
        const img = await loadImage(item.file);
        item.originalImg = img;
        document.getElementById(`result-${item.id}`).src = img.src;
        zoom.attach(`#result-${item.id}`);
    }

    for (const item of imageQueue) {
        if (item.status !== 'pending') continue;

        // Check Limit
        const allowed = await Dashboard.verifyLimit();
        if (!allowed) {
            item.status = 'error';
            updateStatus(item.id, "Monthly Limit Reached");
            continue;
        }

        item.status = 'processing';
        updateStatus(item.id, i18n.t('status.processing'));

        try {
            const result = await engine.removeWatermarkFromImage(item.originalImg);
            const blob = await new Promise(resolve => result.toBlob(resolve, 'image/png'));
            item.processedBlob = blob;

            document.getElementById(`result-${item.id}`).src = URL.createObjectURL(blob);

            item.status = 'completed';

            // Track Usage
            await Dashboard.trackSuccess();

            const watermarkInfo = engine.getWatermarkInfo(item.originalImg.width, item.originalImg.height);
            const { is_google, is_original } = await checkOriginal(item.originalImg);
            const originalStatus = getOriginalStatus({ is_google, is_original });

            updateStatus(item.id, `<p>${i18n.t('info.size')}: ${item.originalImg.width}×${item.originalImg.height}</p>
            <p>${i18n.t('info.watermark')}: ${watermarkInfo.size}×${watermarkInfo.size}</p>
            <p>${i18n.t('info.position')}: (${watermarkInfo.position.x},${watermarkInfo.position.y})</p>
            <p class="inline-block mt-1 text-xs md:text-sm ${is_google && is_original ? 'hidden' : 'text-warn'}">${originalStatus}</p>`, true);

            const downloadBtn = document.getElementById(`download-${item.id}`);
            downloadBtn.classList.remove('hidden');
            downloadBtn.onclick = () => downloadImage(item);

            processedCount++;
            updateProgress();
        } catch (error) {
            item.status = 'error';
            updateStatus(item.id, i18n.t('status.failed'));
            console.error(error);
        }
    }

    if (processedCount > 0) {
        downloadAllBtn.style.display = 'flex';
    }
}

function updateStatus(id, text, isHtml = false) {
    const el = document.getElementById(`status-${id}`);
    if (el) el.innerHTML = isHtml ? text : text.replace(/\n/g, '<br>');
}

function updateProgress() {
    progressText.textContent = `${i18n.t('progress.text')}: ${processedCount}/${imageQueue.length}`;
}

function updateDynamicTexts() {
    if (progressText.textContent) {
        updateProgress();
    }
}

function downloadImage(item) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(item.processedBlob);
    a.download = `unwatermarked_${item.name.replace(/\.[^.]+$/, '')}.png`;
    a.click();
}

async function downloadAll() {
    const completed = imageQueue.filter(item => item.status === 'completed');
    if (completed.length === 0) return;

    const zip = new JSZip();
    completed.forEach(item => {
        const filename = `unwatermarked_${item.name.replace(/\.[^.]+$/, '')}.png`;
        zip.file(filename, item.processedBlob);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `unwatermarked_${Date.now()}.zip`;
    a.click();
}

init();
