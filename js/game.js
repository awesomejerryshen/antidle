/**
 * AntIdle - 遊戲核心邏輯
 * 管理遊戲狀態、儲存、更新循環等
 */

const Game = {
    // 遊戲狀態
    state: {
        food: GameConfig.resources.food.initial,
        workers: GameConfig.resources.workers.initial,
        leaf: GameConfig.resources.leaf.initial,
        water: GameConfig.resources.water.initial,
        larvae: GameConfig.resources.larvae.initial,
        insect: GameConfig.resources.insect.initial,
        totalFood: GameConfig.resources.food.initial,
        gameTime: 0, // 遊戲時間（秒）
        lastTick: Date.now(),
    },

    // 計時器引用
    timers: {
        gameLoop: null,
        autoSave: null,
    },

    /**
     * 初始化遊戲
     */
    init() {
        Utils.log('初始化遊戲...');

        // 載入存檔
        this.loadGame();

        // 綁定 UI 事件
        this.bindEvents();

        // 初始化 UI
        this.updateUI();

        // 啟動遊戲循環
        this.startGameLoop();

        // 啟動自動儲存
        this.startAutoSave();

        Utils.notify('歡迎來到 AntIdle！', 'success');
        Utils.log('遊戲初始化完成');
    },

    /**
     * 綁定事件監聽器
     */
    bindEvents() {
        // 收集按鈕
        document.getElementById('collect-btn').addEventListener('click', () => {
            this.collectLeaf();
            this.animateButton('collect-btn');
        });

        // 購買工蟻按鈕
        document.getElementById('buy-worker-btn').addEventListener('click', () => {
            this.buyWorker();
            this.animateButton('buy-worker-btn');
        });

        // 導航分頁切換
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // 儲存按鈕
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
            Utils.notify('遊戲已儲存！', 'success');
        });

        // 重置按鈕
        document.getElementById('reset-btn').addEventListener('click', () => {
            if (confirm('確定要重置遊戲嗎？所有進度將會遺失！')) {
                this.resetGame();
            }
        });

        // 自動儲存設定
        document.getElementById('setting-autosave').addEventListener('change', (e) => {
            GameConfig.game.autoSave = e.target.checked;
            if (e.target.checked) {
                this.startAutoSave();
            } else {
                this.stopAutoSave();
            }
        });

        // 儲存間隔設定
        document.getElementById('setting-save-interval').addEventListener('change', (e) => {
            const interval = parseInt(e.target.value) * 1000;
            GameConfig.game.saveInterval = interval;
            this.stopAutoSave();
            this.startAutoSave();
        });

        // 頁面關閉前儲存
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    },

    /**
     * 切換分頁
     * @param {string} tab - 分頁名稱
     */
    switchTab(tab) {
        // 更新導航按鈕狀態
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // 更新內容顯示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tab}`);
        });
    },

    /**
     * 收集葉子
     */
    collectLeaf() {
        const amount = GameConfig.actions.collect.baseAmount;
        this.state.leaf += amount;
        this.updateUI();
        Utils.log(`收集了 ${amount} 葉子`);
    },

    /**
     * 計算購買工蟻的價格
     * @returns {number} 工蟻價格
     */
    getWorkerPrice() {
        return Math.floor(
            GameConfig.workers.basePrice * Math.pow(GameConfig.workers.priceMultiplier, this.state.workers)
        );
    },

    /**
     * 購買工蟻
     */
    buyWorker() {
        const price = this.getWorkerPrice();

        if (this.state.food >= price) {
            this.state.food -= price;
            this.state.workers += 1;
            this.updateUI();
            Utils.notify(`購買了 1 隻工蟻！`, 'success');
            Utils.log(`購買了 1 隻工蟻，價格: ${price} 食物`);
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
        }
    },

    /**
     * 計算食物產生率
     * @returns {number} 每秒產生的食物
     */
    getFoodRate() {
        // 每個工蟻每秒產生 1 食物
        return this.state.workers;
    },

    /**
     * 遊戲更新循環
     */
    gameTick() {
        const now = Date.now();
        const delta = (now - this.state.lastTick) / 1000; // 轉換為秒

        // 更新遊戲時間
        this.state.gameTime += delta;

        // 工蟻自動將葉子轉換為食物
        if (this.state.workers > 0 && this.state.leaf > 0) {
            const conversionRate = GameConfig.workers.efficiency * this.state.workers;
            const amount = Math.min(this.state.leaf, conversionRate * delta);
            this.state.leaf -= amount;
            this.state.food += amount;
            this.state.totalFood += amount;
        }

        this.state.lastTick = now;
        this.updateUI();
    },

    /**
     * 啟動遊戲循環
     */
    startGameLoop() {
        if (this.timers.gameLoop) return;

        this.timers.gameLoop = setInterval(() => {
            this.gameTick();
        }, GameConfig.game.tickRate);

        Utils.log('遊戲循環已啟動');
    },

    /**
     * 啟動自動儲存
     */
    startAutoSave() {
        if (!GameConfig.game.autoSave) return;

        this.stopAutoSave();

        this.timers.autoSave = setInterval(() => {
            this.saveGame();
            Utils.log('自動儲存完成');
        }, GameConfig.game.saveInterval);

        Utils.log('自動儲存已啟動');
    },

    /**
     * 停止自動儲存
     */
    stopAutoSave() {
        if (this.timers.autoSave) {
            clearInterval(this.timers.autoSave);
            this.timers.autoSave = null;
            Utils.log('自動儲存已停止');
        }
    },

    /**
     * 更新 UI 顯示
     */
    updateUI() {
        // 更新資源
        document.getElementById('food').textContent = Utils.formatNumber(
            this.state.food,
            GameConfig.resources.food.precision
        );
        document.getElementById('workers').textContent = Utils.formatNumber(
            this.state.workers,
            GameConfig.resources.workers.precision
        );
        document.getElementById('leaf').textContent = Utils.formatNumber(
            this.state.leaf,
            GameConfig.resources.leaf.precision
        );
        document.getElementById('water').textContent = Utils.formatNumber(
            this.state.water,
            GameConfig.resources.water.precision
        );
        document.getElementById('larvae').textContent = Utils.formatNumber(
            this.state.larvae,
            GameConfig.resources.larvae.precision
        );
        document.getElementById('insect').textContent = Utils.formatNumber(
            this.state.insect,
            GameConfig.resources.insect.precision
        );

        // 更新工蟻價格
        document.getElementById('worker-price').textContent = this.getWorkerPrice();

        // 更新統計
        document.getElementById('game-time').textContent = Utils.formatTime(
            Math.floor(this.state.gameTime)
        );
        document.getElementById('total-food').textContent = Utils.formatNumber(
            this.state.totalFood
        );

        // 更新設定
        document.getElementById('setting-autosave').checked = GameConfig.game.autoSave;
        document.getElementById('setting-save-interval').value =
            GameConfig.game.saveInterval / 1000;
    },

    /**
     * 按鈕動畫效果
     * @param {string} buttonId - 按鈕 ID
     */
    animateButton(buttonId) {
        const btn = document.getElementById(buttonId);
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 500);
    },

    /**
     * 儲存遊戲
     */
    saveGame() {
        const saveData = {
            version: GameConfig.game.version,
            state: this.state,
            config: {
                autoSave: GameConfig.game.autoSave,
                saveInterval: GameConfig.game.saveInterval,
            },
            timestamp: Date.now(),
        };

        try {
            localStorage.setItem(GameConfig.saveKey, JSON.stringify(saveData));
            Utils.log('遊戲已儲存');
        } catch (error) {
            console.error('儲存失敗:', error);
            Utils.notify('儲存失敗！', 'error');
        }
    },

    /**
     * 載入遊戲
     */
    loadGame() {
        try {
            const saveData = localStorage.getItem(GameConfig.saveKey);
            if (saveData) {
                const parsed = JSON.parse(saveData);

                // 驗證版本
                if (parsed.version !== GameConfig.game.version) {
                    Utils.notify('檢測到舊版存檔，已升級', 'warning');
                }

                // 載入狀態
                this.state = { ...this.state, ...parsed.state };

                // 載入配置
                if (parsed.config) {
                    GameConfig.game.autoSave = parsed.config.autoSave;
                    GameConfig.game.saveInterval = parsed.config.saveInterval;
                }

                this.state.lastTick = Date.now();
                Utils.log('遊戲已載入');
                Utils.notify('歡迎回來！', 'success');
            }
        } catch (error) {
            console.error('載入失敗:', error);
            Utils.notify('載存檔失敗，已重置遊戲', 'warning');
        }
    },

    /**
     * 重置遊戲
     */
    resetGame() {
        // 重置狀態
        this.state = {
            food: GameConfig.resources.food.initial,
            workers: GameConfig.resources.workers.initial,
            leaf: GameConfig.resources.leaf.initial,
            water: GameConfig.resources.water.initial,
            larvae: GameConfig.resources.larvae.initial,
            insect: GameConfig.resources.insect.initial,
            totalFood: GameConfig.resources.food.initial,
            gameTime: 0,
            lastTick: Date.now(),
        };

        // 清除存檔
        localStorage.removeItem(GameConfig.saveKey);

        // 更新 UI
        this.updateUI();

        Utils.notify('遊戲已重置！', 'success');
        Utils.log('遊戲已重置');
    },
};

// 頁面載入後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
