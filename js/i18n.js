/**
 * AntIdle - 國際化系統（i18n）
 * 管理多語言支援和文字翻譯
 */

const I18n = {
    // 當前語言
    currentLang: 'zh-TW',

    // 支援的語言
    supportedLangs: {
        'zh-TW': '繁體中文',
        'en': 'English',
    },

    // 語言包（從外部載入）
    translations: {},

    /**
     * 初始化 i18n 系統
     */
    init() {
        // 載入保存的語言設定
        const savedLang = localStorage.getItem('antidle-lang');
        if (savedLang && this.supportedLangs[savedLang]) {
            this.currentLang = savedLang;
        }

        // 載入語言包
        this.loadLanguage(this.currentLang);
        
        Utils.log(`i18n 系統已啟動，當前語言：${this.currentLang}`);
    },

    /**
     * 載入語言包
     * @param {string} lang - 語言代碼
     */
    loadLanguage(lang) {
        // 檢查語言是否支援
        if (!this.supportedLangs[lang]) {
            console.error(`不支援的語言：${lang}`);
            return false;
        }

        // 獲取語言包（從全域變數）
        if (typeof window.translations !== 'undefined' && window.translations[lang]) {
            this.translations = window.translations[lang];
            this.currentLang = lang;
            
            // 保存設定
            localStorage.setItem('antidle-lang', lang);
            
            // 更新 UI
            this.updateAllText();
            
            Utils.log(`已載入語言包：${lang}`);
            return true;
        } else {
            console.error(`找不到語言包：${lang}`);
            return false;
        }
    },

    /**
     * 切換語言
     * @param {string} lang - 語言代碼
     */
    changeLanguage(lang) {
        if (this.loadLanguage(lang)) {
            Utils.notify(this.t('languageChanged'), 'success');
            
            // 觸發語言變更事件
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        }
    },

    /**
     * 翻譯文字
     * @param {string} key - 文字鍵值
     * @param {Object} params - 替換參數
     * @returns {string} 翻譯後的文字
     */
    t(key, params = {}) {
        // 獲取翻譯
        let text = this.getNestedValue(this.translations, key);
        
        // 如果找不到翻譯，返回鍵值
        if (text === undefined) {
            console.warn(`找不到翻譯：${key}`);
            return key;
        }

        // 替換參數
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(new RegExp(`{${param}}`, 'g'), value);
        }

        return text;
    },

    /**
     * 獲取嵌套值
     * @param {Object} obj - 物件
     * @param {string} path - 路徑（用 . 分隔）
     * @returns {*} 值
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    },

    /**
     * 更新所有文字
     */
    updateAllText() {
        // 更新所有帶有 data-i18n 屬性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // 更新所有帶有 data-i18n-placeholder 屬性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // 更新所有帶有 data-i18n-title 屬性的元素
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // 更新頁面標題
        document.title = this.t('game.title') + ' - ' + this.t('game.subtitle');
    },

    /**
     * 獲取當前語言
     * @returns {string} 語言代碼
     */
    getCurrentLang() {
        return this.currentLang;
    },

    /**
     * 獲取支援的語言列表
     * @returns {Object} 語言列表
     */
    getSupportedLangs() {
        return this.supportedLangs;
    },
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
