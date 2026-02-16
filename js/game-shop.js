/**
 * AntIdle - 商店和購買系統
 * 處理螞蟻購買和房間升級
 */

const GameShop = {
    /**
     * 獲取工蟻價格
     * @returns {number} 價格
     */
    getWorkerPrice() {
        return Math.floor(
            GameConfig.workers.basePrice * 
            Math.pow(GameConfig.workers.priceMultiplier, Game.state.workers)
        );
    },

    /**
     * 購買工蟻
     * @returns {boolean} 是否成功
     */
    buyWorker() {
        const price = this.getWorkerPrice();

        if (Game.state.food < price) {
            Utils.notify('食物不足！', 'error');
            return false;
        }

        Game.state.food -= price;
        Game.state.workers++;

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.PURCHASE, 
                `購買工蟻（價格：${Utils.formatNumber(price)} 食物），現有 ${Game.state.workers} 隻`);
        }

        Utils.notify(`購買成功！工蟻 +1`, 'success');
        Game.updateUI();

        // 播放音效
        if (typeof Audio !== 'undefined') {
            Audio.playPurchase();
        }

        // 創建粒子效果
        if (typeof Effects !== 'undefined') {
            Effects.createPurchaseEffect('buy-worker-btn');
        }

        return true;
    },

    /**
     * 批量購買工蟻
     * @returns {boolean} 是否成功
     */
    bulkBuyWorkers() {
        const bulkAmount = GameConfig.workers.bulkBuyAmount;
        let totalCost = 0;
        const currentWorkers = Game.state.workers;

        // 計算批量購買的總價格
        for (let i = 0; i < bulkAmount; i++) {
            const price = Math.floor(
                GameConfig.workers.basePrice * 
                Math.pow(GameConfig.workers.priceMultiplier, currentWorkers + i)
            );
            if (Game.state.food < totalCost + price) {
                break;
            }
            totalCost += price;
        }

        const affordableAmount = bulkAmount;
        
        if (affordableAmount > 0 && Game.state.food >= totalCost) {
            Game.state.food -= totalCost;
            Game.state.workers += affordableAmount;

            // 記錄日誌
            if (typeof Journal !== 'undefined') {
                Journal.log(Journal.types.PURCHASE, 
                    `批量購買 ${affordableAmount} 隻工蟻（價格：${Utils.formatNumber(totalCost)} 食物），現有 ${Game.state.workers} 隻`);
            }

            Utils.notify(`購買成功！工蟻 +${affordableAmount}`, 'success');
            Game.updateUI();

            if (typeof Audio !== 'undefined') {
                Audio.playPurchase();
            }

            return true;
        } else {
            Utils.notify('食物不足！', 'error');
            Game.shakeButton('buy-worker-btn');
            return false;
        }
    },

    /**
     * 獲取兵蟻價格（幼蟲）
     * @returns {number} 價格
     */
    getSoldierPrice() {
        return GameConfig.soldiers.larvaeCost;
    },

    /**
     * 購買兵蟻
     * @returns {boolean} 是否成功
     */
    buySoldier() {
        const cost = this.getSoldierPrice();

        if (Game.state.larvae < cost) {
            Utils.notify('幼蟲不足！', 'error');
            return false;
        }

        Game.state.larvae -= cost;
        Game.state.soldiers++;

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.PURCHASE, 
                `孵化兵蟻（消耗：${cost} 幼蟲），現有 ${Game.state.soldiers} 隻`);
        }

        Utils.notify(`孵化成功！兵蟻 +1`, 'success');
        Game.updateUI();

        if (typeof Audio !== 'undefined') {
            Audio.playPurchase();
        }

        if (typeof Effects !== 'undefined') {
            Effects.createPurchaseEffect('buy-soldier-btn');
        }

        return true;
    },

    /**
     * 獲取護理蟻價格
     * @returns {number} 價格
     */
    getNursePrice() {
        return Math.floor(
            GameConfig.nurses.basePrice * 
            Math.pow(GameConfig.nurses.priceMultiplier, Game.state.nurses)
        );
    },

    /**
     * 購買護理蟻
     * @returns {boolean} 是否成功
     */
    buyNurse() {
        const price = this.getNursePrice();

        if (Game.state.food < price) {
            Utils.notify('食物不足！', 'error');
            return false;
        }

        Game.state.food -= price;
        Game.state.nurses++;

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.PURCHASE, 
                `購買護理蟻（價格：${Utils.formatNumber(price)} 食物），現有 ${Game.state.nurses} 隻`);
        }

        Utils.notify(`購買成功！護理蟻 +1`, 'success');
        Game.updateUI();

        if (typeof Audio !== 'undefined') {
            Audio.playPurchase();
        }

        if (typeof Effects !== 'undefined') {
            Effects.createPurchaseEffect('buy-nurse-btn');
        }

        return true;
    },

    /**
     * 獲取儲藏室升級價格
     * @returns {number} 價格
     */
    getStorageUpgradePrice() {
        return Math.floor(
            GameConfig.rooms.storage.basePrice * 
            Math.pow(GameConfig.rooms.storage.priceMultiplier, Game.state.rooms.storage.level)
        );
    },

    /**
     * 升級儲藏室
     * @returns {boolean} 是否成功
     */
    upgradeStorage() {
        const price = this.getStorageUpgradePrice();
        const maxLevel = GameConfig.rooms.storage.maxLevel;

        if (Game.state.food < price) {
            Utils.notify('食物不足！', 'error');
            return false;
        }

        if (Game.state.rooms.storage.level >= maxLevel) {
            Utils.notify('已達最高等級！', 'error');
            return false;
        }

        Game.state.food -= price;
        Game.state.rooms.storage.level++;

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.UPGRADE, 
                `升級儲藏室至等級 ${Game.state.rooms.storage.level}（價格：${Utils.formatNumber(price)} 食物）`);
        }

        Utils.notify(`儲藏室升級成功！等級 ${Game.state.rooms.storage.level}`, 'success');
        Game.updateUI();

        if (typeof Audio !== 'undefined') {
            Audio.playUpgrade();
        }

        if (typeof Effects !== 'undefined') {
            Effects.createUpgradeEffect('storage-upgrade-btn');
        }

        return true;
    },

    /**
     * 獲取育兒室升級價格
     * @returns {number} 價格
     */
    getNurseryUpgradePrice() {
        return Math.floor(
            GameConfig.rooms.nursery.basePrice * 
            Math.pow(GameConfig.rooms.nursery.priceMultiplier, Game.state.rooms.nursery.level)
        );
    },

    /**
     * 升級育兒室
     * @returns {boolean} 是否成功
     */
    upgradeNursery() {
        const price = this.getNurseryUpgradePrice();
        const maxLevel = GameConfig.rooms.nursery.maxLevel;

        if (Game.state.food < price) {
            Utils.notify('食物不足！', 'error');
            return false;
        }

        if (Game.state.rooms.nursery.level >= maxLevel) {
            Utils.notify('已達最高等級！', 'error');
            return false;
        }

        Game.state.food -= price;
        Game.state.rooms.nursery.level++;

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.UPGRADE, 
                `升級育兒室至等級 ${Game.state.rooms.nursery.level}（價格：${Utils.formatNumber(price)} 食物）`);
        }

        Utils.notify(`育兒室升級成功！等級 ${Game.state.rooms.nursery.level}`, 'success');
        Game.updateUI();

        if (typeof Audio !== 'undefined') {
            Audio.playUpgrade();
        }

        if (typeof Effects !== 'undefined') {
            Effects.createUpgradeEffect('nursery-upgrade-btn');
        }

        return true;
    },

    /**
     * 獲取真菌農場升級價格
     * @returns {number} 價格
     */
    getFungusUpgradePrice() {
        return Math.floor(
            GameConfig.rooms.fungus.basePrice * 
            Math.pow(GameConfig.rooms.fungus.priceMultiplier, Game.state.rooms.fungus.level)
        );
    },

    /**
     * 升級真菌農場
     * @returns {boolean} 是否成功
     */
    upgradeFungus() {
        const price = this.getFungusUpgradePrice();
        const maxLevel = GameConfig.rooms.fungus.maxLevel;

        if (Game.state.food < price) {
            Utils.notify('食物不足！', 'error');
            return false;
        }

        if (Game.state.rooms.fungus.level >= maxLevel) {
            Utils.notify('已達最高等級！', 'error');
            return false;
        }

        Game.state.food -= price;
        Game.state.rooms.fungus.level++;

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.UPGRADE, 
                `升級真菌農場至等級 ${Game.state.rooms.fungus.level}（價格：${Utils.formatNumber(price)} 食物）`);
        }

        Utils.notify(`真菌農場升級成功！等級 ${Game.state.rooms.fungus.level}`, 'success');
        Game.updateUI();

        if (typeof Audio !== 'undefined') {
            Audio.playUpgrade();
        }

        if (typeof Effects !== 'undefined') {
            Effects.createUpgradeEffect('fungus-upgrade-btn');
        }

        return true;
    },

    /**
     * 餵食蟻后（用幼蟲恢復健康）
     * @returns {boolean} 是否成功
     */
    feedQueen() {
        const cost = GameConfig.queen.larvaeFeedAmount;
        const heal = GameConfig.queen.larvaeFeedHeal;

        // 檢查蟻后是否需要恢復
        if (Game.state.queenHealth >= GameConfig.queen.maxHealth) {
            Utils.notify('蟻后健康值已滿！', 'error');
            return false;
        }

        // 檢查幼蟲是否足夠
        if (Game.state.larvae < cost) {
            Utils.notify(`幼蟲不足！需要 ${cost} 隻幼蟲`, 'error');
            return false;
        }

        // 消耗幼蟲
        Game.state.larvae -= cost;

        // 恢復健康
        Game.state.queenHealth = Math.min(
            GameConfig.queen.maxHealth,
            Game.state.queenHealth + heal
        );

        Utils.notify(`餵食成功！蟻后健康值 +${heal}`, 'success');
        Game.updateUI();

        if (typeof Audio !== 'undefined') {
            Audio.playPurchase();
        }

        return true;
    },
};
