/**
 * AntIdle - 科學研究系統
 * 管理研究點數、技術樹和解鎖功能
 */

const Research = {
    // 研究點數
    researchPoints: 0,

    // 總共獲得的研究點數
    totalResearchPoints: 0,

    // 已解鎖的研究
    unlockedResearch: {},

    // 當前研究中的項目
    currentResearch: null,

    // 研究進度（0-100）
    researchProgress: 0,

    // 研究開始時間
    researchStartTime: 0,

    // 研究加成效果
    researchBonuses: {
        allProductionBonus: 0,      // 所有生產加成
        foodBonus: 0,                // 食物加成
        leafBonus: 0,                // 葉子加成
        waterBonus: 0,               // 水滴加成
        larvaeBonus: 0,              // 幼蟲加成
        workerEfficiency: 0,         // 工蟻效率
        soldierPower: 0,             // 兵蟻力量
        nurseEfficiency: 0,          // 護理蟻效率
        queenEggRate: 0,             // 蟻后產卵率
        roomEfficiency: 0,           // 房間效率
        invasionDefense: 0,          // 入侵防禦
        weatherResistance: 0,        // 天氣抗性
        autoCollectEnabled: false,   // 自動收集
        autoFeedEnabled: false,      // 自動餵食蟻后
        criticalHitChance: 0,        // 暴擊機率
        storageEfficiency: 0,        // 儲存效率
    },

    /**
     * 初始化研究系統
     */
    init() {
        this.loadResearchData();
        this.calculateResearchBonuses();
        Utils.log('科學研究系統已啟動');
    },

    /**
     * 載入研究數據
     */
    loadResearchData() {
        const saved = localStorage.getItem('antidle_research');
        if (saved) {
            const data = JSON.parse(saved);
            this.researchPoints = data.researchPoints || 0;
            this.totalResearchPoints = data.totalResearchPoints || 0;
            this.unlockedResearch = data.unlockedResearch || {};
        }
    },

    /**
     * 保存研究數據
     */
    saveResearchData() {
        const data = {
            researchPoints: this.researchPoints,
            totalResearchPoints: this.totalResearchPoints,
            unlockedResearch: this.unlockedResearch,
        };
        localStorage.setItem('antidle_research', JSON.stringify(data));
    },

    /**
     * 獲得研究點數
     * @param {number} amount - 數量
     */
    earnResearchPoints(amount) {
        this.researchPoints += amount;
        this.totalResearchPoints += amount;
        this.saveResearchData();
        Utils.notify(`🔬 獲得 ${amount} 研究點數！`, 'success');
    },

    /**
     * 計算研究加成效果
     */
    calculateResearchBonuses() {
        // 重置為基礎值
        this.researchBonuses = {
            allProductionBonus: 0,
            foodBonus: 0,
            leafBonus: 0,
            waterBonus: 0,
            larvaeBonus: 0,
            workerEfficiency: 0,
            soldierPower: 0,
            nurseEfficiency: 0,
            queenEggRate: 0,
            roomEfficiency: 0,
            invasionDefense: 0,
            weatherResistance: 0,
            autoCollectEnabled: false,
            autoFeedEnabled: false,
            criticalHitChance: 0,
            storageEfficiency: 0,
        };

        // 遍歷所有已解鎖的研究
        for (const [researchId, unlocked] of Object.entries(this.unlockedResearch)) {
            if (!unlocked) continue;

            const research = GameConfig.researchTree[researchId];
            if (!research) continue;

            // 應用效果
            for (const [bonusType, bonusValue] of Object.entries(research.bonuses)) {
                if (bonusType in this.researchBonuses) {
                    if (typeof bonusValue === 'boolean') {
                        this.researchBonuses[bonusType] = bonusValue;
                    } else {
                        this.researchBonuses[bonusType] += bonusValue;
                    }
                }
            }
        }
    },

    /**
     * 檢查是否可以研究
     * @param {string} researchId - 研究 ID
     * @returns {boolean} 是否可以研究
     */
    canResearch(researchId) {
        const research = GameConfig.researchTree[researchId];
        if (!research) return false;

        // 檢查是否已解鎖
        if (this.unlockedResearch[researchId]) return false;

        // 檢查點數是否足夠
        if (this.researchPoints < research.cost) return false;

        // 檢查前置需求
        if (research.requires) {
            for (const [reqId, reqLevel] of Object.entries(research.requires)) {
                if (!this.unlockedResearch[reqId]) return false;
            }
        }

        return true;
    },

    /**
     * 開始研究
     * @param {string} researchId - 研究 ID
     * @returns {boolean} 是否開始成功
     */
    startResearch(researchId) {
        if (!this.canResearch(researchId)) {
            Utils.notify('無法開始研究！', 'error');
            return false;
        }

        const research = GameConfig.researchTree[researchId];

        // 檢查是否已有研究進行中
        if (this.currentResearch) {
            Utils.notify('已有研究進行中！', 'error');
            return false;
        }

        // 扣除研究點數
        this.researchPoints -= research.cost;

        // 開始研究
        this.currentResearch = researchId;
        this.researchProgress = 0;
        this.researchStartTime = Date.now();

        Utils.notify(`🔬 開始研究：${research.name}`, 'info');
        Utils.log(`開始研究：${research.name}，需要 ${research.time} 秒`);

        return true;
    },

    /**
     * 更新研究進度
     * @param {number} delta - 時間差（秒）
     */
    updateResearchProgress(delta) {
        if (!this.currentResearch) return;

        const research = GameConfig.researchTree[this.currentResearch];
        if (!research) {
            this.currentResearch = null;
            return;
        }

        // 增加進度
        const progressPerSecond = 100 / research.time;
        this.researchProgress += progressPerSecond * delta;

        // 檢查是否完成
        if (this.researchProgress >= 100) {
            this.completeResearch();
        }
    },

    /**
     * 完成研究
     */
    completeResearch() {
        if (!this.currentResearch) return;

        const research = GameConfig.researchTree[this.currentResearch];
        
        // 解鎖研究
        this.unlockedResearch[this.currentResearch] = true;

        // 重新計算加成
        this.calculateResearchBonuses();

        // 保存
        this.saveResearchData();

        // 通知
        Utils.notify(`🎉 研究完成：${research.name}！`, 'success');
        Utils.log(`研究完成：${research.name}`);
        
        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.RESEARCH, `研究完成：${research.icon} ${research.name}`, {
                id: this.currentResearch,
                name: research.name,
            });
        }

        // 播放音效
        if (typeof Audio !== 'undefined') {
            Audio.playAchievement();
        }

        // 重置
        this.currentResearch = null;
        this.researchProgress = 0;
    },

    /**
     * 取消研究
     */
    cancelResearch() {
        if (!this.currentResearch) return;

        const research = GameConfig.researchTree[this.currentResearch];
        
        // 返還部分點數（50%）
        const refund = Math.floor(research.cost * 0.5);
        this.researchPoints += refund;

        // 重置
        this.currentResearch = null;
        this.researchProgress = 0;

        // 保存
        this.saveResearchData();

        Utils.notify(`❌ 研究已取消，返還 ${refund} 點數`, 'warning');
        Utils.log(`研究已取消：${research.name}`);
    },

    /**
     * 獲取研究進度百分比
     * @returns {number} 進度（0-100）
     */
    getResearchProgressPercent() {
        if (!this.currentResearch) return 0;
        return Math.min(100, this.researchProgress);
    },

    /**
     * 獲取剩餘研究時間
     * @returns {number} 秒數
     */
    getRemainingTime() {
        if (!this.currentResearch) return 0;

        const research = GameConfig.researchTree[this.currentResearch];
        const progressPercent = this.researchProgress / 100;
        const remainingPercent = 1 - progressPercent;
        const remainingTime = research.time * remainingPercent;

        return Math.ceil(remainingTime);
    },

    /**
     * 獲取研究資訊
     * @param {string} researchId - 研究 ID
     * @returns {Object} 研究資訊
     */
    getResearchInfo(researchId) {
        const research = GameConfig.researchTree[researchId];
        if (!research) return null;

        return {
            ...research,
            unlocked: this.unlockedResearch[researchId] || false,
            canResearch: this.canResearch(researchId),
            isResearching: this.currentResearch === researchId,
        };
    },

    /**
     * 應用研究加成到遊戲
     * @param {Object} game - 遊戲實例
     */
    applyResearchBonuses(game) {
        // 這個方法會在 game.js 的 gameTick 中調用
        // 根據不同的加成類型應用效果
    },

    /**
     * 獲取研究樹狀結構（按類別分組）
     * @returns {Object} 分組後的研究樹
     */
    getResearchTreeByCategory() {
        const categories = {};

        for (const [id, research] of Object.entries(GameConfig.researchTree)) {
            const category = research.category;
            if (!categories[category]) {
                categories[category] = {
                    name: this.getCategoryName(category),
                    icon: this.getCategoryIcon(category),
                    researches: [],
                };
            }

            categories[category].researches.push({
                id,
                ...research,
                unlocked: this.unlockedResearch[id] || false,
                canResearch: this.canResearch(id),
                isResearching: this.currentResearch === id,
            });
        }

        return categories;
    },

    /**
     * 獲取類別名稱
     * @param {string} category - 類別 ID
     * @returns {string} 類別名稱
     */
    getCategoryName(category) {
        const names = {
            production: '生產技術',
            ants: '螞蟻進化',
            rooms: '建築工程',
            defense: '防禦系統',
            automation: '自動化',
            special: '特殊能力',
        };
        return names[category] || category;
    },

    /**
     * 獲取類別圖示
     * @param {string} category - 類別 ID
     * @returns {string} 圖示
     */
    getCategoryIcon(category) {
        const icons = {
            production: '⚡',
            ants: '🐜',
            rooms: '🏠',
            defense: '🛡️',
            automation: '🤖',
            special: '✨',
        };
        return icons[category] || '📦';
    },

    /**
     * 統計已解鎖的研究數量
     * @returns {Object} 統計數據
     */
    getStatistics() {
        const total = Object.keys(GameConfig.researchTree).length;
        const unlocked = Object.values(this.unlockedResearch).filter(v => v).length;

        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100),
        };
    },
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    Research.init();
});
