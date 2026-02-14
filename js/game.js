/**
 * AntIdle - 遊戲核心邏輯
 * 管理遊戲狀態、儲存、更新循環等
 */

const Game = {
    // 遊戲狀態
    state: {
        food: GameConfig.resources.food.initial,
        workers: GameConfig.resources.workers.initial,
        queen: GameConfig.resources.queen.initial,
        soldiers: GameConfig.resources.soldiers.initial,
        nurses: GameConfig.resources.nurses.initial,
        leaf: GameConfig.resources.leaf.initial,
        water: GameConfig.resources.water.initial,
        larvae: GameConfig.resources.larvae.initial,
        insect: GameConfig.resources.insect.initial,
        totalFood: GameConfig.resources.food.initial,
        gameTime: 0, // 遊戲時間（秒）
        lastTick: Date.now(),
        lastInvasion: -GameConfig.invasion.cooldown, // 上次入侵時間
        rooms: {
            storage: { level: 0, maxLevel: GameConfig.rooms.storage.maxLevel },
            nursery: { level: 0, maxLevel: GameConfig.rooms.nursery.maxLevel },
            fungus: { level: 0, maxLevel: GameConfig.rooms.fungus.maxLevel },
        },
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
        document.getElementById('collect-btn').addEventListener('click', (e) => {
            // 檢測 Shift 鍵觸發批量購買
            if (e.shiftKey) {
                this.bulkBuyWorkers();
            } else {
                this.collectLeaf();
            }
            this.animateButton('collect-btn');
        });

        // 購買工蟻按鈕
        document.getElementById('buy-worker-btn').addEventListener('click', () => {
            this.buyWorker();
            this.animateButton('buy-worker-btn');
        });

        // 購買兵蟻按鈕
        document.getElementById('buy-soldier-btn').addEventListener('click', () => {
            this.buySoldier();
            this.animateButton('buy-soldier-btn');
        });

        // 購買護理蟻按鈕
        document.getElementById('buy-nurse-btn').addEventListener('click', () => {
            this.buyNurse();
            this.animateButton('buy-nurse-btn');
        });

        // 房間升級按鈕
        document.getElementById('storage-upgrade-btn').addEventListener('click', () => {
            this.upgradeStorage();
            this.animateButton('storage-upgrade-btn');
        });

        document.getElementById('nursery-upgrade-btn').addEventListener('click', () => {
            this.upgradeNursery();
            this.animateButton('nursery-upgrade-btn');
        });

        document.getElementById('fungus-upgrade-btn').addEventListener('click', () => {
            this.upgradeFungus();
            this.animateButton('fungus-upgrade-btn');
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

        // 視覺效果：浮動數字和粒子
        this.showFloatingNumber(amount, '🍃', document.getElementById('collect-btn'));
        this.createParticles('leaf', document.getElementById('collect-btn'));

        // 資源值動畫
        this.animateResourceValue('leaf');

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

            // 視覺效果
            this.showFloatingNumber(1, '🐜', document.getElementById('buy-worker-btn'));
            this.createParticles('food', document.getElementById('buy-worker-btn'));

            // 資源值動畫
            this.animateResourceValue('workers');
            this.animateResourceValue('food');

            Utils.notify(`購買了 1 隻工蟻！`, 'success');
            Utils.log(`購買了 1 隻工蟻，價格: ${price} 食物`);
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            this.shakeButton('buy-worker-btn');
        }
    },

    /**
     * 批量購買工蟻
     */
    bulkBuyWorkers() {
        const bulkAmount = GameConfig.workers.bulkBuyAmount;
        let totalCost = 0;
        const currentWorkers = this.state.workers;

        // 計算批量購買的總價格
        for (let i = 0; i < bulkAmount; i++) {
            const price = Math.floor(
                GameConfig.workers.basePrice * Math.pow(GameConfig.workers.priceMultiplier, currentWorkers + i)
            );
            if (this.state.food < totalCost + price) {
                break;
            }
            totalCost += price;
        }

        const actualAmount = totalCost / this.getWorkerPrice() / Math.pow(GameConfig.workers.priceMultiplier, this.state.workers);
        const affordableAmount = Math.floor(actualAmount);

        if (affordableAmount > 0 && this.state.food >= totalCost) {
            this.state.food -= totalCost;
            this.state.workers += affordableAmount;
            this.updateUI();

            // 視覺效果
            this.showFloatingNumber(affordableAmount, '🐜', document.getElementById('collect-btn'));
            this.createParticles('food', document.getElementById('collect-btn'));

            // 資源值動畫
            this.animateResourceValue('workers');
            this.animateResourceValue('food');

            Utils.notify(`批量購買了 ${affordableAmount} 隻工蟻！`, 'success');
            Utils.log(`批量購買了 ${affordableAmount} 隻工蟻，總價格: ${totalCost} 食物`);
        } else {
            const price = this.getWorkerPrice();
            Utils.notify(`食物不足！需要 ${price} 食物才能購買 1 隻工蟻`, 'error');
            this.shakeButton('collect-btn');
        }
    },

    /**
     * 計算購買兵蟻的價格
     * @returns {number} 兵蟻價格
     */
    getSoldierPrice() {
        return Math.floor(
            GameConfig.soldiers.basePrice * Math.pow(GameConfig.soldiers.priceMultiplier, this.state.soldiers)
        );
    },

    /**
     * 購買兵蟻
     */
    buySoldier() {
        const price = this.getSoldierPrice();

        if (this.state.larvae >= price) {
            this.state.larvae -= price;
            this.state.soldiers += 1;
            this.updateUI();

            // 視覺效果
            this.showFloatingNumber(1, '⚔️', document.getElementById('buy-soldier-btn'));
            this.createParticles('food', document.getElementById('buy-soldier-btn'));

            // 資源值動畫
            this.animateResourceValue('soldiers');
            this.animateResourceValue('larvae');

            Utils.notify(`孵化了 1 隻兵蟻！`, 'success');
            Utils.log(`孵化了 1 隻兵蟻，價格: ${price} 幼蟲`);
        } else {
            Utils.notify(`幼蟲不足！需要 ${price} 幼蟲`, 'error');
            this.shakeButton('buy-soldier-btn');
        }
    },

    /**
     * 計算購買護理蟻的價格
     * @returns {number} 護理蟻價格
     */
    getNursePrice() {
        return Math.floor(
            GameConfig.nurses.basePrice * Math.pow(GameConfig.nurses.priceMultiplier, this.state.nurses)
        );
    },

    /**
     * 購買護理蟻
     */
    buyNurse() {
        const price = this.getNursePrice();

        if (this.state.food >= price) {
            this.state.food -= price;
            this.state.nurses += 1;
            this.updateUI();

            // 視覺效果
            this.showFloatingNumber(1, '👶', document.getElementById('buy-nurse-btn'));
            this.createParticles('food', document.getElementById('buy-nurse-btn'));

            // 資源值動畫
            this.animateResourceValue('nurses');
            this.animateResourceValue('food');

            Utils.notify(`購買了 1 隻護理蟻！`, 'success');
            Utils.log(`購買了 1 隻護理蟻，價格: ${price} 食物`);
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            this.shakeButton('buy-nurse-btn');
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

        // 蟻后加成（影響收集和轉換）
        const queenMultiplier = 1 + (this.state.queen * GameConfig.queen.productionMultiplier);

        // 工蟻自動收集葉子
        if (this.state.workers > 0) {
            const collectRate = GameConfig.workers.collectRate * this.state.workers * queenMultiplier;
            this.state.leaf += collectRate * delta;
        }

        // 工蟻自動將葉子轉換為食物
        if (this.state.workers > 0 && this.state.leaf > 0) {
            const conversionRate = GameConfig.workers.conversionRate * this.state.workers * queenMultiplier;
            const amount = Math.min(this.state.leaf, conversionRate * delta);
            this.state.leaf -= amount;
            this.state.food += amount;
            this.state.totalFood += amount;
        }

        // 蟻后產卵
        if (this.state.queen > 0) {
            const eggProduction = GameConfig.queen.eggProductionRate * this.state.queen * delta;
            this.state.larvae += eggProduction;
        }

        // 護理蟻照顧幼蟲（提高產生速率）
        if (this.state.nurses > 0) {
            const careBonus = GameConfig.nurses.careEfficiency * this.state.nurses * delta;
            this.state.larvae += careBonus;
        }

        // 入侵事件檢查
        this.checkInvasion(delta);

        this.state.lastTick = now;
        this.updateUI();
    },

    /**
     * 檢查並處理入侵事件
     * @param {number} delta - 經過的時間（秒）
     */
    checkInvasion(delta) {
        // 檢查是否在冷卻中
        const timeSinceLastInvasion = this.state.gameTime - this.state.lastInvasion;
        if (timeSinceLastInvasion < GameConfig.invasion.cooldown) {
            return;
        }

        // 計算入侵機率
        const invasionChance = GameConfig.invasion.baseChance * delta;

        if (Math.random() < invasionChance) {
            this.handleInvasion();
        }
    },

    /**
     * 處理入侵事件
     */
    handleInvasion() {
        // 更新上次入侵時間
        this.state.lastInvasion = this.state.gameTime;

        // 計算防禦力和入侵強度
        const defensePower = this.state.soldiers * GameConfig.soldiers.defensePower;
        const invasionPower = Math.random() * 5 + 2; // 隨機 2-7 的入侵強度

        if (defensePower >= invasionPower) {
            // 防禦成功
            const baseReward = GameConfig.invasion.baseReward.food + Math.floor(Math.random() * 10);
            const leafReward = GameConfig.invasion.baseReward.leaf + Math.floor(Math.random() * 5);
            this.state.food += baseReward;
            this.state.leaf += leafReward;
            Utils.notify(`⚔️ 入侵已被擊退！獲得 ${baseReward} 食物 + ${leafReward} 葉子`, 'success');
            Utils.log(`防禦成功，獎勵: ${baseReward} 食物 + ${leafReward} 葉子`);
        } else {
            // 防禦失敗
            const damage = GameConfig.invasion.baseDamage + Math.floor(Math.random() * 5);
            const lostFood = Math.min(this.state.food, damage);
            const lostLeaf = Math.min(this.state.leaf, Math.floor(damage / 2));
            this.state.food -= lostFood;
            this.state.leaf -= lostLeaf;
            Utils.notify(`⚠️ 入侵成功！損失 ${lostFood} 食物 + ${lostLeaf} 葉子`, 'error');
            Utils.log(`防禦失敗，損失: ${lostFood} 食物 + ${lostLeaf} 葉子`);
        }
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
        document.getElementById('queen').textContent = Utils.formatNumber(
            this.state.queen,
            GameConfig.resources.queen.precision
        );
        document.getElementById('food').textContent = Utils.formatNumber(
            this.state.food,
            GameConfig.resources.food.precision
        );
        document.getElementById('workers').textContent = Utils.formatNumber(
            this.state.workers,
            GameConfig.resources.workers.precision
        );
        document.getElementById('soldiers').textContent = Utils.formatNumber(
            this.state.soldiers,
            GameConfig.resources.soldiers.precision
        );
        document.getElementById('nurses').textContent = Utils.formatNumber(
            this.state.nurses,
            GameConfig.resources.nurses.precision
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

        // 更新工蟻視覺化
        this.updateWorkersVisual();

        // 更新按鈕狀態（會更新工蟻價格）
        this.updateButtonStates();

        // 更新蟻群管理資訊
        this.updateColonyInfo();

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
     * 更新按鈕狀態（啟用/禁用）
     */
    updateButtonStates() {
        // 工蟻按鈕
        const buyWorkerBtn = document.getElementById('buy-worker-btn');
        const workerPrice = this.getWorkerPrice();

        if (this.state.food < workerPrice) {
            buyWorkerBtn.disabled = true;
            buyWorkerBtn.textContent = `🐜 購買工蟻 (${workerPrice} 🍯) - 食物不足`;
        } else {
            buyWorkerBtn.disabled = false;
            buyWorkerBtn.textContent = `🐜 購買工蟻 (${workerPrice} 🍯)`;
        }

        // 兵蟻按鈕
        const buySoldierBtn = document.getElementById('buy-soldier-btn');
        const soldierPrice = this.getSoldierPrice();

        if (this.state.larvae < soldierPrice) {
            buySoldierBtn.disabled = true;
            buySoldierBtn.textContent = `⚔️ 孵化兵蟻 (${soldierPrice} 🥚) - 幼蟲不足`;
        } else {
            buySoldierBtn.disabled = false;
            buySoldierBtn.textContent = `⚔️ 孵化兵蟻 (${soldierPrice} 🥚)`;
        }

        // 護理蟻按鈕
        const buyNurseBtn = document.getElementById('buy-nurse-btn');
        const nursePrice = this.getNursePrice();

        if (this.state.food < nursePrice) {
            buyNurseBtn.disabled = true;
            buyNurseBtn.textContent = `👶 購買護理蟻 (${nursePrice} 🍯) - 食物不足`;
        } else {
            buyNurseBtn.disabled = false;
            buyNurseBtn.textContent = `👶 購買護理蟻 (${nursePrice} 🍯)`;
        }
    },

    /**
     * 更新蟻群管理資訊
     */
    updateColonyInfo() {
        // 總螞蟻數量
        const totalAnts = this.state.workers + this.state.soldiers + this.state.nurses + this.state.queen;
        document.getElementById('total-ants').textContent = Utils.formatNumber(totalAnts);

        // 總防禦力
        const totalDefense = this.state.soldiers * GameConfig.soldiers.defensePower;
        document.getElementById('total-defense').textContent = Utils.formatNumber(totalDefense);

        // 生產效率
        const productionMultiplier = 1 + (this.state.queen * GameConfig.queen.productionMultiplier);
        const productionEfficiency = Math.round(productionMultiplier * 100);
        document.getElementById('production-efficiency').textContent = `${productionEfficiency}%`;

        // 蟻后資訊
        document.getElementById('queen-count').textContent = this.state.queen;
        const eggRate = GameConfig.queen.eggProductionRate * this.state.queen;
        document.getElementById('queen-egg-rate').textContent = eggRate.toFixed(1);
        const queenBonus = this.state.queen * GameConfig.queen.productionMultiplier * 100;
        document.getElementById('queen-bonus').textContent = queenBonus.toFixed(1);

        // 工蟻資訊
        document.getElementById('workers-count').textContent = this.state.workers;
        const queenMultiplier = 1 + (this.state.queen * GameConfig.queen.productionMultiplier);
        const collectRate = GameConfig.workers.collectRate * this.state.workers * queenMultiplier;
        const conversionRate = GameConfig.workers.conversionRate * this.state.workers * queenMultiplier;
        document.getElementById('workers-collect-rate').textContent = collectRate.toFixed(1);
        document.getElementById('workers-conversion-rate').textContent = conversionRate.toFixed(1);

        // 兵蟻資訊
        document.getElementById('soldiers-count').textContent = this.state.soldiers;
        document.getElementById('soldiers-defense').textContent = totalDefense;
        // 基礎入侵強度是 2-7，計算成功率
        const avgInvasionPower = 4.5;
        const successRate = Math.min(100, Math.round((totalDefense / avgInvasionPower) * 100));
        document.getElementById('soldiers-success-rate').textContent = successRate;

        // 護理蟻資訊
        document.getElementById('nurses-count').textContent = this.state.nurses;
        const nurseEfficiency = GameConfig.nurses.careEfficiency * this.state.nurses;
        document.getElementById('nurses-efficiency').textContent = nurseEfficiency.toFixed(1);
        const totalLarvaeRate = eggRate + nurseEfficiency;
        document.getElementById('total-larvae-rate').textContent = totalLarvaeRate.toFixed(1);

        // 房間資訊
        // 儲藏室：食物儲存上限
        const storageCapacity = GameConfig.resources.food.initial + (this.state.rooms.storage.level * GameConfig.rooms.storage.capacityBonus);
        document.getElementById('storage-level').textContent = this.state.rooms.storage.level;
        document.getElementById('storage-capacity').textContent = Utils.formatNumber(storageCapacity);
        const storagePercent = Math.min(100, Math.round((this.state.food / storageCapacity) * 100));
        document.getElementById('storage-usage').textContent = `${storagePercent}%`;

        // 育兒室：孵化速度加成
        const nurseryBonus = this.state.rooms.nursery.level * GameConfig.rooms.nursery.hatchSpeedBonus;
        const totalEggRate = eggRate + nurseryBonus;
        document.getElementById('nursery-level').textContent = this.state.rooms.nursery.level;
        document.getElementById('nursery-bonus').textContent = `+${nurseryBonus.toFixed(1)}`;
        document.getElementById('nursery-total-rate').textContent = totalEggRate.toFixed(1);

        // 真菌農場：生產率和水滴消耗
        const fungusProduction = this.state.rooms.fungus.level * GameConfig.rooms.fungus.productionRate;
        const fungusConsumption = this.state.rooms.fungus.level * GameConfig.rooms.fungus.waterConsumption;
        document.getElementById('fungus-level').textContent = this.state.rooms.fungus.level;
        document.getElementById('fungus-production').textContent = fungusProduction.toFixed(1);
        document.getElementById('fungus-consumption').textContent = fungusConsumption.toFixed(1);
        const totalFoodFromFungus = fungusProduction;
        document.getElementById('fungus-total-food').textContent = totalFoodFromFungus.toFixed(1);

        // 入侵狀態
        const timeSinceLastInvasion = this.state.gameTime - this.state.lastInvasion;
        const isInvaded = timeSinceLastInvasion < 10; // 10秒內視為入侵中

        if (isInvaded) {
            document.getElementById('invasion-status-icon').textContent = '⚠️';
            document.getElementById('invasion-status-text').textContent = '入侵警告！';
            document.getElementById('invasion-status-text').className = 'status-text danger';
        } else if (this.state.soldiers === 0) {
            document.getElementById('invasion-status-icon').textContent = '⚠️';
            document.getElementById('invasion-status-text').textContent = '無防禦兵力';
            document.getElementById('invasion-status-text').className = 'status-text danger';
        } else {
            document.getElementById('invasion-status-icon').textContent = '🛡️';
            document.getElementById('invasion-status-text').textContent = '蟻群安全';
            document.getElementById('invasion-status-text').className = 'status-text safe';
        }

        // 上一次入侵時間
        const lastInvasion = document.getElementById('last-invasion-time');
        if (this.state.lastInvasion < 0) {
            lastInvasion.textContent = '無';
        } else if (timeSinceLastInvasion < 60) {
            lastInvasion.textContent = `${Math.floor(timeSinceLastInvasion)} 秒前`;
        } else if (timeSinceLastInvasion < 3600) {
            lastInvasion.textContent = `${Math.floor(timeSinceLastInvasion / 60)} 分鐘前`;
        } else {
            lastInvasion.textContent = `${Math.floor(timeSinceLastInvasion / 3600)} 小時前`;
        }
    },

    /**
     * 獲取儲藏室升級價格
     * @returns {number} 升級價格
     */
    getStorageUpgradePrice() {
        const level = this.state.rooms.storage.level;
        return Math.floor(
            GameConfig.rooms.storage.basePrice * Math.pow(GameConfig.rooms.storage.priceMultiplier, level)
        );
    },

    /**
     * 升級儲藏室
     */
    upgradeStorage() {
        const price = this.getStorageUpgradePrice();
        const maxLevel = GameConfig.rooms.storage.maxLevel;

        if (this.state.food >= price && this.state.rooms.storage.level < maxLevel) {
            this.state.food -= price;
            this.state.rooms.storage.level += 1;
            this.updateUI();

            // 視覺效果
            this.showFloatingNumber(1, '🏠', document.getElementById('storage-upgrade-btn'));
            this.createParticles('food', document.getElementById('storage-upgrade-btn'));

            // 資源值動畫
            this.animateResourceValue('food');

            Utils.notify(`儲藏室升級到 ${this.state.rooms.storage.level} 級！`, 'success');
            Utils.log(`儲藏室升級，價格: ${price} 食物，新等級: ${this.state.rooms.storage.level}`);
        } else if (this.state.rooms.storage.level >= maxLevel) {
            Utils.notify('儲藏室已達最高等級！', 'error');
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            this.shakeButton('storage-upgrade-btn');
        }
    },

    /**
     * 獲取育兒室升級價格
     * @returns {number} 升級價格
     */
    getNurseryUpgradePrice() {
        const level = this.state.rooms.nursery.level;
        return Math.floor(
            GameConfig.rooms.nursery.basePrice * Math.pow(GameConfig.rooms.nursery.priceMultiplier, level)
        );
    },

    /**
     * 升級育兒室
     */
    upgradeNursery() {
        const price = this.getNurseryUpgradePrice();
        const maxLevel = GameConfig.rooms.nursery.maxLevel;

        if (this.state.food >= price && this.state.rooms.nursery.level < maxLevel) {
            this.state.food -= price;
            this.state.rooms.nursery.level += 1;
            this.updateUI();

            // 視覺效果
            this.showFloatingNumber(1, '🥚', document.getElementById('nursery-upgrade-btn'));
            this.createParticles('food', document.getElementById('nursery-upgrade-btn'));

            // 資源值動畫
            this.animateResourceValue('food');

            Utils.notify(`育兒室升級到 ${this.state.rooms.nursery.level} 級！`, 'success');
            Utils.log(`育兒室升級，價格: ${price} 食物，新等級: ${this.state.rooms.nursery.level}`);
        } else if (this.state.rooms.nursery.level >= maxLevel) {
            Utils.notify('育兒室已達最高等級！', 'error');
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            this.shakeButton('nursery-upgrade-btn');
        }
    },

    /**
     * 獲取真菌農場升級價格
     * @returns {number} 升級價格
     */
    getFungusUpgradePrice() {
        const level = this.state.rooms.fungus.level;
        return Math.floor(
            GameConfig.rooms.fungus.basePrice * Math.pow(GameConfig.rooms.fungus.priceMultiplier, level)
        );
    },

    /**
     * 升級真菌農場
     */
    upgradeFungus() {
        const price = this.getFungusUpgradePrice();
        const maxLevel = GameConfig.rooms.fungus.maxLevel;

        if (this.state.food >= price && this.state.rooms.fungus.level < maxLevel) {
            this.state.food -= price;
            this.state.rooms.fungus.level += 1;
            this.updateUI();

            // 視覺效果
            this.showFloatingNumber(1, '🍄', document.getElementById('fungus-upgrade-btn'));
            this.createParticles('food', document.getElementById('fungus-upgrade-btn'));

            // 資源值動畫
            this.animateResourceValue('food');

            Utils.notify(`真菌農場升級到 ${this.state.rooms.fungus.level} 級！`, 'success');
            Utils.log(`真菌農場升級，價格: ${price} 食物，新等級: ${this.state.rooms.fungus.level}`);
        } else if (this.state.rooms.fungus.level >= maxLevel) {
            Utils.notify('真菌農場已達最高等級！', 'error');
        } else {
            Utils.notify(`食物不足！需要 ${price} 食物`, 'error');
            this.shakeButton('fungus-upgrade-btn');
        }
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
     * 顯示浮動數字
     * @param {number} amount - 數量
     * @param {string} icon - 圖示
     * @param {HTMLElement} targetElement - 目標元素
     */
    showFloatingNumber(amount, icon, targetElement) {
        const floatingNumber = document.createElement('div');
        floatingNumber.className = 'floating-number';
        floatingNumber.textContent = `+${amount} ${icon}`;

        // 設定位置
        const rect = targetElement.getBoundingClientRect();
        floatingNumber.style.left = `${rect.left + rect.width / 2}px`;
        floatingNumber.style.top = `${rect.top}px`;

        document.body.appendChild(floatingNumber);

        // 動畫結束後移除
        setTimeout(() => {
            floatingNumber.remove();
        }, 1000);
    },

    /**
     * 創建粒子特效
     * @param {string} type - 粒子類型（'leaf' 或 'food'）
     * @param {HTMLElement} targetElement - 目標元素
     */
    createParticles(type, targetElement) {
        const particleCount = 8;
        const rect = targetElement.getBoundingClientRect();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;

            // 隨機位置和方向
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(particle);

            // 粒子結束後移除
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    },

    /**
     * 更新工蟻數量視覺化
     */
    updateWorkersVisual() {
        const container = document.getElementById('workers-visual');
        const workerCount = this.state.workers;

        // 最多顯示 10 隻小螞蟻
        const maxVisible = 10;
        const visibleCount = Math.min(workerCount, maxVisible);

        container.innerHTML = '';

        for (let i = 0; i < visibleCount; i++) {
            const miniAnt = document.createElement('span');
            miniAnt.className = 'mini-ant';
            miniAnt.textContent = '🐜';
            miniAnt.style.setProperty('--delay', `${Math.random() * 0.5}s`);
            container.appendChild(miniAnt);
        }

        // 如果工蟻超過 10 隻，顯示數字
        if (workerCount > maxVisible) {
            const moreIndicator = document.createElement('span');
            moreIndicator.className = 'mini-ant';
            moreIndicator.textContent = `+${workerCount - maxVisible}`;
            container.appendChild(moreIndicator);
        }
    },

    /**
     * 資源值動畫
     * @param {string} resourceId - 資源 ID
     */
    animateResourceValue(resourceId) {
        const element = document.getElementById(resourceId);
        if (!element) return;

        element.classList.add('updated');
        setTimeout(() => {
            element.classList.remove('updated');
        }, 300);
    },

    /**
     * 按鈕搖晃效果（錯誤提示）
     * @param {string} buttonId - 按鈕 ID
     */
    shakeButton(buttonId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        btn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            btn.style.animation = '';
        }, 500);
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

                // 驗證版本，如果是舊版本則重置為初始值
                if (parsed.version !== GameConfig.game.version) {
                    Utils.notify('檢測到舊版存檔，已重置為初始狀態', 'warning');
                    return; // 使用初始值，不載入舊存檔
                }

                // 載入狀態，確保包含所有必要的字段
                this.state = {
                    food: parsed.state.food ?? GameConfig.resources.food.initial,
                    workers: parsed.state.workers ?? GameConfig.resources.workers.initial,
                    queen: parsed.state.queen ?? GameConfig.resources.queen.initial,
                    leaf: parsed.state.leaf ?? GameConfig.resources.leaf.initial,
                    water: parsed.state.water ?? GameConfig.resources.water.initial,
                    larvae: parsed.state.larvae ?? GameConfig.resources.larvae.initial,
                    insect: parsed.state.insect ?? GameConfig.resources.insect.initial,
                    soldiers: parsed.state.soldiers ?? GameConfig.resources.soldiers.initial,
                    nurses: parsed.state.nurses ?? GameConfig.resources.nurses.initial,
                    lastInvasion: parsed.state.lastInvasion ?? -GameConfig.invasion.cooldown,
                    totalFood: parsed.state.totalFood ?? GameConfig.resources.food.initial,
                    gameTime: parsed.state.gameTime ?? 0,
                    lastTick: Date.now(),
                };

                // 載入配置
                if (parsed.config) {
                    GameConfig.game.autoSave = parsed.config.autoSave;
                    GameConfig.game.saveInterval = parsed.config.saveInterval;
                }

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
            queen: GameConfig.resources.queen.initial,
            soldiers: GameConfig.resources.soldiers.initial,
            nurses: GameConfig.resources.nurses.initial,
            leaf: GameConfig.resources.leaf.initial,
            water: GameConfig.resources.water.initial,
            larvae: GameConfig.resources.larvae.initial,
            insect: GameConfig.resources.insect.initial,
            totalFood: GameConfig.resources.food.initial,
            gameTime: 0,
            lastInvasion: -GameConfig.invasion.cooldown,
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
