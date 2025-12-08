/**
 * @module Kiosk/languages
 */
export const languages = [
    { name: 'English', code: 'en', emoji: '🇬🇧' },
    { name: 'Español', code: 'es', emoji: '🇪🇸' },
    { name: 'Français', code: 'fr', emoji: '🇫🇷' },
    { name: 'Deutsch', code: 'de', emoji: '🇩🇪' },
    { name: 'Italiano', code: 'it', emoji: '🇮🇹' },
    { name: 'Português', code: 'pt', emoji: '🇵🇹' },
    { name: 'Русский', code: 'ru', emoji: '🇷🇺' },
    { name: '中文 (简体)', code: 'zh-CN', emoji: '🇨🇳' },
    { name: '中文 (繁體)', code: 'zh-TW', emoji: '🇭🇰' },
    { name: '日本語', code: 'ja', emoji: '🇯🇵' },
    { name: '한국어', code: 'ko', emoji: '🇰🇷' },
    { name: 'العربية', code: 'ar', emoji: '🇸🇦' },
    { name: 'हिन्दी', code: 'hi', emoji: '🇮🇳' },
    { name: 'বাংলা', code: 'bn', emoji: '🇧🇩' },
    { name: 'فارسی', code: 'fa', emoji: '🇮🇷' },
    { name: 'اردو', code: 'ur', emoji: '🇵🇰' },
    { name: 'ਪੰਜਾਬੀ', code: 'pa', emoji: '🇮🇳' },
    { name: 'ગુજરાતી', code: 'gu', emoji: '🇮🇳' },
    { name: 'मराठी', code: 'mr', emoji: '🇮🇳' },
    { name: 'தமிழ்', code: 'ta', emoji: '🇮🇳' },
    { name: 'తెలుగు', code: 'te', emoji: '🇮🇳' },
    { name: 'Bahasa Indonesia', code: 'id', emoji: '🇮🇩' },
    { name: 'Bahasa Melayu', code: 'ms', emoji: '🇲🇾' },
    { name: 'Tiếng Việt', code: 'vi', emoji: '🇻🇳' },
    { name: 'ภาษาไทย', code: 'th', emoji: '🇹🇭' },
    { name: 'Türkçe', code: 'tr', emoji: '🇹🇷' },
    { name: 'Swahili', code: 'sw', emoji: '🇰🇪' },
    { name: 'Tagalog', code: 'tl', emoji: '🇵🇭' },
    { name: 'Hausa', code: 'ha', emoji: '🇳🇬' },
    { name: 'Basa Jawa', code: 'jw', emoji: '🇮🇩' },
];

/**
 * Injects the Google Translate widget script and initializes the element once loaded.
 * @param {string} elementId DOM element id where Google Translate should render.
 * @returns {void}
 */
export function initGoogleTranslate(elementId) {
    const script = document.createElement('script');
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);
    window.googleTranslateElementInit = () =>{
        const languageCodes = languages.map(lang => lang.code).join(',');
        
        // ↓↓↓ this comment will disable a warning for the global `google` object
        // eslint-disable-next-line no-undef
        window.googleTranslateElement = new google.translate.TranslateElement({pageLanguage: 'en',
            includedLanguages: languageCodes,
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL
        }, elementId);
    };
}

/**
 * Reads the current Google Translate language from its cookie.
 * @returns {string} ISO language code currently applied.
 */
export function getCurrentLanguage() {
    const cookieMatch = document.cookie.match(/googtrans=([^;]+)/);
    if (!cookieMatch || cookieMatch[1] === 'null') return 'en';
    return cookieMatch[1].split('/')[2];
}

/**
 * Resolves when the Google Translate widget is ready or rejects on timeout.
 * @param {number} [timeout=2000] Maximum wait time in milliseconds.
 * @returns {Promise<Element>} Promise resolving with the widget container element.
 */
async function awaitGoogleTranslate(timeout = 2000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (window.googleTranslateElement?.Z) {
                clearInterval(interval);
                resolve(window.googleTranslateElement.Z);
                return;
            }
            if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject(new Error("Google Translate failed to initialize."));
            }
        }, 100);
    });
}

/**
 * Attempts to switch Google Translate to the desired language with retries.
 * @param {string} langCode Target language code to apply.
 * @returns {Promise<void>} Resolves once Google Translate reflects the requested language.
 */
export async function changeLanguage(langCode) {
    // Set the language, with retries.
    const changePromise = new Promise(async (resolve, reject) => {
        const start = Date.now();
        const timeout = 5000; // 5 seconds timeout for the whole operation

        while (Date.now() - start < timeout) {
            if (getCurrentLanguage() === langCode) {
                return resolve();
            }

            try {
                const googleTranslateContainer = await awaitGoogleTranslate();
                const select = googleTranslateContainer.querySelector('.goog-te-combo');
                if (select) {
                    select.value = langCode;
                    select.dispatchEvent(new Event('change'));
                }
            } catch (e) {
                // Ignore initialization errors and retry
            }

            await new Promise(r => setTimeout(r, 250)); // wait before retrying
        }
        reject(new Error("Failed to change language within the time limit."));
    });
    return changePromise;
}
