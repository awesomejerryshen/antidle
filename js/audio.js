/**
 * AntIdle - 音效系統
 * 使用 Web Audio API 生成音效
 */

const Audio = {
    // Audio Context
    context: null,

    // 音量設定 (0-1)
    masterVolume: 0.3,
    sfxVolume: 0.5,
    musicVolume: 0.2,

    // 是否啟用音效
    enabled: true,

    // 背景音樂播放器
    musicPlayer: null,
    musicPlaying: false,

    /**
     * 初始化音效系統
     */
    init() {
        // 創建 Audio Context
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            Utils.log('音效系統已啟動');
        } catch (e) {
            console.warn('Web Audio API 不支援', e);
            this.enabled = false;
        }

        // 載入設定
        this.loadSettings();
    },

    /**
     * 載入音效設定
     */
    loadSettings() {
        const saved = localStorage.getItem('antidle-audio');
        if (saved) {
            const settings = JSON.parse(saved);
            this.enabled = settings.enabled !== false;
            this.masterVolume = settings.masterVolume || 0.3;
            this.sfxVolume = settings.sfxVolume || 0.5;
            this.musicVolume = settings.musicVolume || 0.2;
        }
    },

    /**
     * 保存音效設定
     */
    saveSettings() {
        localStorage.setItem('antidle-audio', JSON.stringify({
            enabled: this.enabled,
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume
        }));
    },

    /**
     * 確保 Audio Context 已啟動（需要用戶交互）
     */
    ensureContext() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    /**
     * 播放點擊音效
     */
    playClick() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        const volume = this.masterVolume * this.sfxVolume;
        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    },

    /**
     * 播放收集音效
     */
    playCollect() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';

        const volume = this.masterVolume * this.sfxVolume;
        gainNode.gain.setValueAtTime(volume * 0.8, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.2);

        // 第二個音
        setTimeout(() => {
            const osc2 = this.context.createOscillator();
            const gain2 = this.context.createGain();

            osc2.connect(gain2);
            gain2.connect(this.context.destination);

            osc2.frequency.value = 659.25; // E5
            osc2.type = 'sine';

            gain2.gain.setValueAtTime(volume * 0.6, this.context.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

            osc2.start(this.context.currentTime);
            osc2.stop(this.context.currentTime + 0.15);
        }, 80);
    },

    /**
     * 播放購買音效
     */
    playBuy() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        const notes = [659.25, 783.99, 987.77]; // E5, G5, B5

        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'triangle';

                const volume = this.masterVolume * this.sfxVolume;
                gainNode.gain.setValueAtTime(volume * 0.5, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.15);
            }, index * 60);
        });
    },

    /**
     * 播放升級音效
     */
    playUpgrade() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const volume = this.masterVolume * this.sfxVolume;
                gainNode.gain.setValueAtTime(volume * 0.6, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.3);
            }, index * 100);
        });
    },

    /**
     * 播放成就解鎖音效
     */
    playAchievement() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        // 簡單的勝利音效
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const volume = this.masterVolume * this.sfxVolume;
                gainNode.gain.setValueAtTime(volume * 0.7, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.4);

                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.4);
            }, index * 120);
        });
    },

    /**
     * 播放錯誤音效
     */
    playError() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';

        const volume = this.masterVolume * this.sfxVolume;
        gainNode.gain.setValueAtTime(volume * 0.4, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.2);
    },

    /**
     * 播放天氣音效
     */
    playWeather(weather) {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        switch (weather) {
            case 'rain':
                // 雨聲（低沉的滴答聲）
                this.playRainSound();
                break;
            case 'sunny':
                // 陽光（明亮的上升音）
                this.playSunnySound();
                break;
            case 'storm':
                // 暴風（低沉的警告音）
                this.playStormSound();
                break;
        }
    },

    playRainSound() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);

                oscillator.frequency.value = 400 + Math.random() * 200;
                oscillator.type = 'sine';

                const volume = this.masterVolume * this.sfxVolume;
                gainNode.gain.setValueAtTime(volume * 0.3, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.1);
            }, i * 100);
        }
    },

    playSunnySound() {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.setValueAtTime(400, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.3);
        oscillator.type = 'sine';

        const volume = this.masterVolume * this.sfxVolume;
        gainNode.gain.setValueAtTime(volume * 0.5, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
    },

    playStormSound() {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = 150;
        oscillator.type = 'sawtooth';

        const volume = this.masterVolume * this.sfxVolume;
        gainNode.gain.setValueAtTime(volume * 0.6, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.5);
    },

    /**
     * 播放入侵警報音效
     */
    playInvasionAlert() {
        if (!this.enabled || !this.context) return;
        this.ensureContext();

        // 警報聲
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);

                oscillator.frequency.value = 600;
                oscillator.type = 'square';

                const volume = this.masterVolume * this.sfxVolume;
                gainNode.gain.setValueAtTime(volume * 0.4, this.context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);

                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + 0.15);
            }, i * 200);
        }
    },

    /**
     * 切換音效開關
     */
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
        return this.enabled;
    },

    /**
     * 設置主音量
     */
    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        this.saveSettings();
    },

    /**
     * 設置音效音量
     */
    setSfxVolume(value) {
        this.sfxVolume = Math.max(0, Math.min(1, value));
        this.saveSettings();
    },

    /**
     * 設置音樂音量
     */
    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
        this.saveSettings();
    }
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    Audio.init();
});

// 第一次用戶交互時啟動 Audio Context
document.addEventListener('click', () => {
    if (Audio.context && Audio.context.state === 'suspended') {
        Audio.context.resume();
    }
}, { once: true });
