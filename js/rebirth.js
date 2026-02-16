/**
 * AntIdle - 重生系統
 * 管理重生點數、永久加成和重生功能
 */

const Rebirth = {
    // 重生點數
    rebirthPoints: 0,

    // 總共獲得的重生點數
    totalRebirthPoints: 0,

    // 重生次數
    rebirthCount: 0,

    // 已購買的永久升級
    permanentUpgrades: {},

    // 永久加成效果（計算後的值）
    permanentBonuses: {
        productionMultiplier: 1,    // 生產效率倍數
        priceDiscount: 0,           // 價格折扣（百分比）
        capacityBonus: 0,           // 容量加成
        queenHealthBonus: 0,        // 蟻后健康加成
        startingResources: 0,       // 初始資源加成
    },

    /**
     * 初始化重生系統
     */
    init() {
        this.loadRebirthData();
        this.calculatePermanentBonuses();
        Utils.log('重生系統已啟動');
    },

    /**
     * 載入重生數據
     */
    loadRebirthData() {
        const saved = localStorage.getItem('antidle_rebirth');
        if (saved) {
            const data = JSON.parse(saved);
            this.rebirthPoints = data.rebirthPoints || 0;
            this.totalRebirthPoints = data.totalRebirthPoints || 0;
            this.rebirthCount = data.rebirthCount || 0;
            this.permanentUpgrades = data.permanentUpgrades || {};
        }
    },

    /**
     * 保存重生數據
     */
    saveRebirthData() {
        const data = {
            rebirthPoints: this.rebirthPoints,
            totalRebirthPoints: this.totalRebirthPoints,
            rebirthCount: this.rebirthCount,
            permanentUpgrades: this.permanentUpgrades,
        };
        localStorage.setItem('antidle_rebirth', JSON.stringify(data));
    },

    /**
     * 計算當前可獲得的重生點數
     * @param {Object} gameState - 當前遊戲狀態
     * @returns {number} 重生點數
     */
    calculateRebirthPoints(gameState) {
        let points = 0;

        // 基於總食物（每 1000 食物 = 1 點）
        points += Math.floor(gameState.totalFood / 1000);

        // 基於遊戲時間（每 10 分鐘 = 1 點）
        points += Math.floor(gameState.gameTime / 600);

        // 基於成就數量（每個成就 = 5 點）
        points += gameState.achievements.length * 5;

        // 基於螞蟻總數（每 10 隻 = 1 點）
        const totalAnts = gameState.workers + gameState.soldiers + gameState.nurses;
        points += Math.floor(totalAnts / 10);

        // 基於房間等級（每級 = 2 點）
        const totalRoomLevels = gameState.rooms.storage.level +
                                gameState.rooms.nursery.level +
                                gameState.rooms.fungus.level;
        points += totalRoomLevels * 2;

        // 最少 1 點
        return Math.max(1, points);
    },

    /**
     * 執行重生
     * @param {Object} game - 遊戲實例
     */
    performRebirth(game) {
        // 計算獲得的重生點數
        const earnedPoints = this.calculateRebirthPoints(game.state);

        // 增加重生點數
        this.rebirthPoints += earnedPoints;
        this.totalRebirthPoints += earnedPoints;
        this.rebirthCount++;

        // 保存重生數據（重生後保留）
        this.saveRebirthData();

        // 重置遊戲狀態（保留部分數據）
        this.resetGameState(game);

        // 應用初始資源加成
        this.applyStartingBonus(game);

        // 通知玩家
        Utils.notify(`🌟 重生成功！獲得 ${earnedPoints} 重生點數！`, 'success');
        Utils.log(`重生完成，獲得 ${earnedPoints} 點，總計 ${this.rebirthPoints} 點`);

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.REBIRTH, `重生成功！獲得 ${earnedPoints} 點，總計 ${Rebirth.rebirthPoints} 點`, {
                points: earnedPoints,
                totalPoints: Rebirth.rebirthPoints,
                count: Rebirth.rebirthCount,
            });
        }

        // 播放音效
        if (typeof Audio !== 'undefined') {
            Audio.playAchievement();
        }

        return earnedPoints;
    },

    /**
     * 重置遊戲狀態
     * @param {Object} game - 遊戲實例
     */
    resetGameState(game) {
        // 保存需要保留的數據
        const achievements = [...game.state.achievements];
        const defenseWins = game.state.defenseWins;

        // 重置資源
        game.state.food = GameConfig.resources.food.initial;
        game.state.workers = GameConfig.resources.workers.initial;
        game.state.queen = GameConfig.resources.queen.initial;
        game.state.soldiers = GameConfig.resources.soldiers.initial;
        game.state.nurses = GameConfig.resources.nurses.initial;
        game.state.leaf = GameConfig.resources.leaf.initial;
        game.state.water = GameConfig.resources.water.initial;
        game.state.larvae = GameConfig.resources.larvae.initial;
        game.state.insect = GameConfig.resources.insect.initial;
        game.state.totalFood = GameConfig.resources.food.initial;

        // 重置遊戲時間和計時器
        game.state.gameTime = 0;
        game.state.lastTick = Date.now();
        game.state.lastInvasion = -GameConfig.invasion.cooldown;

        // 重置房間
        game.state.rooms.storage.level = 0;
        game.state.rooms.nursery.level = 0;
        game.state.rooms.fungus.level = 0;

        // 重置蟻后健康
        game.state.queenHealth = GameConfig.queen.maxHealth;

        // 重置天氣
        game.state.weather = 'clear';
        game.state.weatherEndTime = 0;
        game.state.nextWeatherTime = 0;

        // 恢復保留的數據
        game.state.achievements = achievements;
        game.state.defenseWins = defenseWins;

        // 保存遊戲
        game.saveGame();
    },

    /**
     * 應用初始資源加成
     * @param {Object} game - 遊戲實例
     */
    applyStartingBonus(game) {
        const bonus = this.permanentBonuses.startingResources;
        if (bonus > 0) {
            game.state.food += bonus * 10;
            game.state.leaf += bonus * 5;
            game.state.larvae += bonus * 2;
            Utils.notify(`🎁 初始資源加成：+${bonus * 10} 食物、+${bonus * 5} 葉子、+${bonus * 2} 幼蟲`, 'info');
        }
    },

    /**
     * 購買永久升級
     * @param {string} upgradeId - 升級 ID
     * @returns {boolean} 是否購買成功
     */
    purchasePermanentUpgrade(upgradeId) {
        const upgrade = GameConfig.rebirthUpgrades[upgradeId];
        if (!upgrade) return false;

        // 檢查是否已購買
        const currentLevel = this.permanentUpgrades[upgradeId] || 0;
        if (currentLevel >= upgrade.maxLevel) {
            Utils.notify('已達最高等級！', 'error');
            return false;
        }

        // 計算價格
        const price = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

        // 檢查點數是否足夠
        if (this.rebirthPoints < price) {
            Utils.notify(`重生點數不足！需要 ${price} 點`, 'error');
            return false;
        }

        // 扣除點數
        this.rebirthPoints -= price;

        // 增加等級
        this.permanentUpgrades[upgradeId] = currentLevel + 1;

        // 重新計算永久加成
        this.calculatePermanentBonuses();

        // 保存
        this.saveRebirthData();

        // 通知
        Utils.notify(`✨ 購買成功！${upgrade.name} 等級 ${currentLevel + 1}`, 'success');
        Utils.log(`購買永久升級：${upgrade.name}，等級 ${currentLevel + 1}，花費 ${price} 點`);

        // 播放音效
        if (typeof Audio !== 'undefined') {
            Audio.playUpgrade();
        }

        return true;
    },

    /**
     * 計算永久加成效果
     */
    calculatePermanentBonuses() {
        // 重置為基礎值
        this.permanentBonuses = {
            productionMultiplier: 1,
            priceDiscount: 0,
            capacityBonus: 0,
            queenHealthBonus: 0,
            startingResources: 0,
        };

        // 遍歷所有已購買的升級
        for (const [upgradeId, level] of Object.entries(this.permanentUpgrades)) {
            const upgrade = GameConfig.rebirthUpgrades[upgradeId];
            if (!upgrade) continue;

            // 應用效果
            switch (upgrade.type) {
                case 'productionMultiplier':
                    this.permanentBonuses.productionMultiplier += upgrade.effect * level;
                    break;
                case 'priceDiscount':
                    this.permanentBonuses.priceDiscount += upgrade.effect * level;
                    break;
                case 'capacityBonus':
                    this.permanentBonuses.capacityBonus += upgrade.effect * level;
                    break;
                case 'queenHealthBonus':
                    this.permanentBonuses.queenHealthBonus += upgrade.effect * level;
                    break;
                case 'startingResources':
                    this.permanentBonuses.startingResources += upgrade.effect * level;
                    break;
            }
        }
    },

    /**
     * 應用永久加成到遊戲
     * @param {Object} game - 遊戲實例
     */
    applyPermanentBonuses(game) {
        // 應用容量加成
        // 注意：這個會在 game.js 的 gameTick 中自動計算

        // 應用蟻后健康加成
        if (this.permanentBonuses.queenHealthBonus > 0) {
            GameConfig.queen.maxHealth = 100 + this.permanentBonuses.queenHealthBonus;
        }
    },

    /**
     * 獲取升級價格
     * @param {string} upgradeId - 升級 ID
     * @returns {number} 價格
     */
    getUpgradePrice(upgradeId) {
        const upgrade = GameConfig.rebirthUpgrades[upgradeId];
        if (!upgrade) return 0;

        const currentLevel = this.permanentUpgrades[upgradeId] || 0;
        if (currentLevel >= upgrade.maxLevel) return 0;

        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    },

    /**
     * 獲取升級當前等級
     * @param {string} upgradeId - 升級 ID
     * @returns {number} 等級
     */
    getUpgradeLevel(upgradeId) {
        return this.permanentUpgrades[upgradeId] || 0;
    },

    /**
     * 檢查是否可以重生
     * @param {Object} gameState - 遊戲狀態
     * @returns {boolean} 是否可以重生
     */
    canRebirth(gameState) {
        // 至少需要遊戲時間 5 分鐘
        if (gameState.gameTime < 300) return false;

        // 至少需要一些進度
        if (gameState.totalFood < 100) return false;

        return true;
    },

    /**
     * 獲取重生預覽信息
     * @param {Object} gameState - 遊戲狀態
     * @returns {Object} 預覽信息
     */
    getRebirthPreview(gameState) {
        const points = this.calculateRebirthPoints(gameState);
        const canRebirth = this.canRebirth(gameState);

        return {
            points: points,
            canRebirth: canRebirth,
            currentPoints: this.rebirthPoints,
            rebirthCount: this.rebirthCount,
        };
    },
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    Rebirth.init();
});
