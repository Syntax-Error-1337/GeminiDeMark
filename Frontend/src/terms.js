import { Layout } from './core/layout.js';
import i18n from './i18n.js';

// Initialize the terms page
async function init() {
    // Initialize i18n (load translations)
    await i18n.init();

    // Serialize layout injection
    Layout.init();
}

init();
