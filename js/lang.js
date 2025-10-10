// Language handler for simple data-lang attributes and a language select (#lang-select)
(function () {
    const LANG_JSON = './json/lang.json';
    let translations = {};
    let currentLang = localStorage.getItem('language') || 'en';

    // Load JSON translations
    function loadTranslations() {
        return fetch(LANG_JSON).then(res => {
            if (!res.ok) throw new Error('Failed to load lang.json');
            return res.json();
        }).then(data => {
            translations = data;
        }).catch(err => {
            console.error('Error loading translations:', err);
            translations = {};
        });
    }

    // Apply translations to DOM
    function applyTranslations() {
        // text content
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            const txt = (translations[currentLang] && translations[currentLang][key]) || null;
            if (txt !== null && txt !== undefined) {
                el.textContent = txt;
            }
        });

        // placeholders
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.getAttribute('data-lang-placeholder');
            const txt = (translations[currentLang] && translations[currentLang][key]) || null;
            if (txt !== null && txt !== undefined) {
                el.setAttribute('placeholder', txt);
            }
        });

        // title attributes
        document.querySelectorAll('[data-lang-title]').forEach(el => {
            const key = el.getAttribute('data-lang-title');
            const txt = (translations[currentLang] && translations[currentLang][key]) || null;
            if (txt !== null && txt !== undefined) {
                el.setAttribute('title', txt);
            }
        });

        // value (buttons/inputs)
        document.querySelectorAll('[data-lang-value]').forEach(el => {
            const key = el.getAttribute('data-lang-value');
            const txt = (translations[currentLang] && translations[currentLang][key]) || null;
            if (txt !== null && txt !== undefined) {
                if ('value' in el) el.value = txt;
                else el.textContent = txt;
            }
        });
    }

    // Set language
    function setLanguage(lang, persist = true) {
        if (!lang) return;
        currentLang = lang;
        if (persist) localStorage.setItem('language', lang);
        applyTranslations();
        // trigger event for Angular or other parts of the app
        window.dispatchEvent(new Event('languageChanged'));
    }

    // Init
    function init() {
        loadTranslations().then(() => {
            // set select value if present
            const select = document.getElementById('lang-select');
            if (select) {
                select.value = currentLang;
                select.addEventListener('change', function () {
                    setLanguage(this.value);
                });
            }
            // initial apply
            applyTranslations();
        });

        // expose helpers
        window.__setLanguage = setLanguage;
        window.__currentLanguage = () => currentLang;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
