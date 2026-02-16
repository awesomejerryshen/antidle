/**
 * AntIdle - 視覺效果模組
 * 處理動畫、粒子、天氣效果
 */

const Effects = {
    // 螞蟻動畫容器
    antContainer: null,

    // 活動的螞蟻列表
    activeAnts: [],

    // 最大同時存在的螞蟻數量
    maxAnts: 5,

    /**
     * 初始化效果系統
     */
    init() {
        this.createAntContainer();
        this.startAntAnimation();
        Utils.log('視覺效果系統已啟動');
    },

    /**
     * 創建螞蟻容器
     */
    createAntContainer() {
        this.antContainer = document.createElement('div');
        this.antContainer.id = 'ant-animation-container';
        this.antContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
            overflow: hidden;
        `;
        document.body.appendChild(this.antContainer);
    },

    /**
     * 啟動螞蟻動畫
     */
    startAntAnimation() {
        // 每 3-8 秒生成一隻新螞蟻
        setInterval(() => {
            if (this.activeAnts.length < this.maxAnts) {
                this.spawnAnt();
            }
        }, 3000 + Math.random() * 5000);
    },

    /**
     * 生成一隻螞蟻
     */
    spawnAnt() {
        const ant = document.createElement('div');
        const isReverse = Math.random() > 0.5;
        const antTypes = ['', 'ant-worker', 'ant-soldier'];
        const antType = antTypes[Math.floor(Math.random() * antTypes.length)];

        ant.className = `ant-animated ${isReverse ? 'reverse' : ''} ${antType}`;
        ant.textContent = '🐜';

        // 隨機垂直位置（避開頂部導航和底部）
        const topPercent = 15 + Math.random() * 70;
        ant.style.top = `${topPercent}%`;

        // 隨機動畫時長（5-12 秒）
        const duration = 5 + Math.random() * 7;
        ant.style.animationDuration = `${duration}s`;

        this.antContainer.appendChild(ant);
        this.activeAnts.push(ant);

        // 動畫結束後移除
        setTimeout(() => {
            if (ant.parentNode) {
                ant.parentNode.removeChild(ant);
            }
            const index = this.activeAnts.indexOf(ant);
            if (index > -1) {
                this.activeAnts.splice(index, 1);
            }
        }, duration * 1000);
    },

    /**
     * 創建資源粒子效果
     * @param {string} resource - 資源圖標（如 '🍯', '🍃'）
     * @param {number} count - 數量
     * @param {Element} sourceElement - 來源元素（可選）
     */
    createResourceParticles(resource, count, sourceElement = null) {
        const startX = sourceElement
            ? sourceElement.getBoundingClientRect().left + sourceElement.offsetWidth / 2
            : window.innerWidth / 2;
        const startY = sourceElement
            ? sourceElement.getBoundingClientRect().top
            : window.innerHeight / 2;

        for (let i = 0; i < Math.min(count, 10); i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle resource-particle';
                particle.textContent = resource;

                // 隨機偏移
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = -50 - Math.random() * 50;

                particle.style.left = `${startX + offsetX}px`;
                particle.style.top = `${startY}px`;
                particle.style.setProperty('--tx', `${offsetX}px`);
                particle.style.setProperty('--ty', `${offsetY}px`);

                document.body.appendChild(particle);

                // 動畫結束後移除
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 50);
        }
    },

    /**
     * 創建收集爆發效果
     * @param {Element} button - 觸發按鈕
     * @param {string} resource - 資源圖標
     */
    createCollectBurst(button, resource) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 創建 5-8 個粒子
        const particleCount = 5 + Math.floor(Math.random() * 4);

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle resource-particle collect-particle';
            particle.textContent = resource;

            // 圓形散開
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 30;

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    },

    /**
     * 創建按鈕波紋效果
     * @param {Element} button - 按鈕元素
     * @param {Event} event - 點擊事件
     */
    createRipple(button, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },

    /**
     * 資源卡片跳動效果
     * @param {string} resourceId - 資源元素 ID
     */
    bumpResource(resourceId) {
        const element = document.getElementById(resourceId);
        if (element) {
            const card = element.closest('.resource');
            if (card) {
                card.classList.remove('resource-bump');
                void card.offsetWidth; // 觸發重排
                card.classList.add('resource-bump');
            }
        }
    },

    /**
     * 創建天氣效果
     * @param {string} weather - 天氣類型 ('rain', 'sunny', 'storm')
     */
    createWeatherEffect(weather) {
        this.clearWeatherEffects();

        switch (weather) {
            case 'rain':
                this.createRainEffect();
                break;
            case 'sunny':
                this.createSunshineEffect();
                break;
            case 'storm':
                this.createStormEffect();
                break;
        }
    },

    /**
     * 創建下雨效果
     */
    createRainEffect() {
        const container = document.createElement('div');
        container.id = 'weather-effect-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
            overflow: hidden;
        `;

        // 創建 30-50 個雨滴
        const dropCount = 30 + Math.floor(Math.random() * 20);
        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'weather-particle rain-drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(drop);
        }

        document.body.appendChild(container);
    },

    /**
     * 創建陽光效果
     */
    createSunshineEffect() {
        const ray = document.createElement('div');
        ray.className = 'sunshine-ray';
        ray.id = 'weather-effect-container';
        document.body.appendChild(ray);
    },

    /**
     * 創建暴風效果
     */
    createStormEffect() {
        const container = document.createElement('div');
        container.id = 'weather-effect-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
            overflow: hidden;
        `;

        // 創建 5-10 個風粒子
        const particleCount = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'weather-particle wind-particle';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(particle);
        }

        document.body.appendChild(container);
    },

    /**
     * 清除天氣效果
     */
    clearWeatherEffects() {
        const container = document.getElementById('weather-effect-container');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    },

    /**
     * 創建成就解鎖動畫
     * @param {Element} achievementElement - 成就元素
     */
    achievementUnlock(achievementElement) {
        achievementElement.classList.add('achievement-unlock');
        setTimeout(() => {
            achievementElement.classList.remove('achievement-unlock');
        }, 500);
    },

    /**
     * 創建升級成功動畫
     * @param {Element} element - 升級的元素
     */
    upgradeSuccess(element) {
        element.classList.add('upgrade-success');
        setTimeout(() => {
            element.classList.remove('upgrade-success');
        }, 500);
    },

    /**
     * 創建入侵警報效果
     */
    invasionAlert() {
        document.body.classList.add('invasion-alert');
        setTimeout(() => {
            document.body.classList.remove('invasion-alert');
        }, 2000);
    },

    /**
     * 創建浮動提示
     * @param {string} message - 提示訊息
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     */
    showFloatingTip(message, x, y) {
        const tip = document.createElement('div');
        tip.className = 'floating-tip';
        tip.textContent = message;
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;

        document.body.appendChild(tip);

        setTimeout(() => {
            if (tip.parentNode) {
                tip.parentNode.removeChild(tip);
            }
        }, 3000);
    },

    /**
     * 切換深色模式
     */
    toggleDarkMode() {
        document.body.classList.add('theme-transition');

        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('antidle-theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('antidle-theme', 'dark');
        }

        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    },

    /**
     * 創建成就解鎖效果
     */
    createAchievementEffect() {
        // 創建金色閃光效果
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 15 + 5}px;
                    height: ${Math.random() * 15 + 5}px;
                    background: radial-gradient(circle, #FFD700, #FFA500);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: achievementParticle 1.5s ease-out forwards;
                `;
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1500);
            }, i * 50);
        }
        
        // 創建閃光文字
        const text = document.createElement('div');
        text.textContent = '🏆 成就解鎖！';
        text.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3em;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500;
            pointer-events: none;
            z-index: 9999;
            animation: achievementText 2s ease-out forwards;
        `;
        document.body.appendChild(text);
        
        setTimeout(() => text.remove(), 2000);
    },

    /**
     * 載入保存的主題
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('antidle-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    Effects.init();
    Effects.loadSavedTheme();
});
