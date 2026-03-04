/**
 * AntIdle - 遊戲核心邏輯
 * 管理遊戲狀態、儲存、更新循環等
 */

const Game = {
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
        gameTime: 0,
        lastTick: Date.now(),
        lastInvasion: -GameConfig.invasion.cooldown,
        rooms: {
            storage: { level: 0, maxLevel: GameConfig.rooms.storage.maxLevel },
            nursery: { level: 0, maxLevel: GameConfig.rooms.nursery.maxLevel },
            fungus: { level: 0, maxLevel: GameConfig.rooms.fungus.maxLevel },
        },
        achievements: [],
        defenseWins: 0,
        queenHealth: 100,
        weather: 'clear',
        weatherEndTime: 0,
        nextWeatherTime: 0,
    },

    timers: {
        gameLoop: null,
        autoSave: null,
    },

    performance: {
        lastResourceUpdate: 0,
        lastButtonUpdate: 0,
        resourceUpdateInterval: 100,
        buttonUpdateInterval: 500,
    },

    init() {
        Utils.log('初始化遊戲...');

        if (typeof Rebirth !== 'undefined') {
            Rebirth.applyPermanentBonuses(this);
        }

        this.loadGame();
        this.bindEvents();

        if (typeof GameUI !== 'undefined') {
            GameUI.updateUI();
        } else {
            this.updateUI();
        }
        
        if (typeof GameUI !== 'undefined') {
            GameUI.updateAchievementsUI();
        } else {
            this.updateAchievementsUI();
        }
        
        if (typeof Research !== 'undefined') {
            this.updateResearchUI();
        }
        
        if (typeof Rebirth !== 'undefined') {
            this.updateRebirthUI();
        }
        
        if (typeof I18n !== 'undefined') {
            document.getElementById('language-select').value = I18n.getCurrentLang();
        }
        
        if (typeof Audio !== 'undefined') {
            document.getElementById('setting-bgm-enabled').checked = Audio.bgmEnabled;
            document.getElementById('setting-bgm-volume').value = Audio.bgmVolume * 100;
            document.getElementById('bgm-volume-display').textContent = `${Math.round(Audio.bgmVolume * 100)}%`;
        }
        
        if (typeof Journal !== 'undefined') {
            Journal.updateJournalUI();
        }

        this.startGameLoop();
        this.startAutoSave();

        Utils.notify('歡迎來到 AntIdle！', 'success');
        Utils.log('遊戲初始化完成');
    },

    bindEvents() {
        document.getElementById('collect-btn').addEventListener('click', (e) => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            
            if (e.shiftKey) {
                GameResources.bulkBuyWorkers(this);
            } else {
                GameResources.collectLeaf(this);
            }
            this.animateButton('collect-btn');
        });

        document.getElementById('buy-worker-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameResources.buyWorker(this);
            this.animateButton('buy-worker-btn');
        });

        document.getElementById('buy-soldier-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameResources.buySoldier(this);
            this.animateButton('buy-soldier-btn');
        });

        document.getElementById('buy-nurse-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameResources.buyNurse(this);
            this.animateButton('buy-nurse-btn');
        });

        document.getElementById('storage-upgrade-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameRooms.upgradeStorage(this);
            this.animateButton('storage-upgrade-btn');
        });

        document.getElementById('nursery-upgrade-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameRooms.upgradeNursery(this);
            this.animateButton('nursery-upgrade-btn');
        });

        document.getElementById('fungus-upgrade-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameRooms.upgradeFungus(this);
            this.animateButton('fungus-upgrade-btn');
        });

        document.getElementById('feed-queen-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            GameRooms.feedQueen(this);
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
            Utils.notify('遊戲已儲存！', 'success');
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            if (confirm('確定要重置遊戲嗎？所有進度將會遺失！')) {
                this.resetGame();
            }
        });

        document.getElementById('export-save-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            this.exportSave();
        });

        document.getElementById('import-save-btn').addEventListener('click', () => {
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
            document.getElementById('import-file-input').click();
        });

        document.getElementById('import-file-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importSave(file);
                e.target.value = '';
            }
        });

        document.getElementById('setting-autosave').addEventListener('change', (e) => {
            GameConfig.game.autoSave = e.target.checked;
            if (e.target.checked) {
                this.startAutoSave();
            } else {
                this.stopAutoSave();
            }
        });

        document.getElementById('setting-save-interval').addEventListener('change', (e) => {
            const interval = parseInt(e.target.value) * 1000;
            GameConfig.game.saveInterval = interval;
            this.stopAutoSave();
            this.startAutoSave();
        });

        document.getElementById('dark-mode-btn').addEventListener('click', () => {
            if (typeof Effects !== 'undefined') {
                Effects.toggleDarkMode();
            }
            if (typeof Audio !== 'undefined') {
                Audio.playClick();
            }
        });

        document.getElementById('setting-audio-enabled').addEventListener('change', (e) => {
            if (typeof Audio !== 'undefined') {
                Audio.toggle();
            }
        });

        document.getElementById('setting-master-volume').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            if (typeof Audio !== 'undefined') {
                Audio.setMasterVolume(value);
            }
            document.getElementById('master-volume-display').textContent = `${e.target.value}%`;
        });

        document.getElementById('setting-sfx-volume').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            if (typeof Audio !== 'undefined') {
                Audio.setSfxVolume(value);
            }
            document.getElementById('sfx-volume-display').textContent = `${e.target.value}%`;
        });

        document.getElementById('setting-bgm-enabled').addEventListener('change', (e) => {
            if (typeof Audio !== 'undefined') {
                if (e.target.checked) {
                    Audio.startBgm();
                } else {
                    Audio.stopBgm();
                }
            }
        });

        document.getElementById('setting-bgm-volume').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            if (typeof Audio !== 'undefined') {
                Audio.setBgmVolume(value);
            }
            document.getElementById('bgm-volume-display').textContent = `${e.target.value}%`;
        });

        document.getElementById('language-select').addEventListener('change', (e) => {
            const lang = e.target.value;
            if (typeof I18n !== 'undefined') {
                I18n.changeLanguage(lang);
            }
        });

        document.getElementById('clear-journal-btn').addEventListener('click', () => {
            if (confirm('確定要清空所有日誌記錄嗎？')) {
                if (typeof Journal !== 'undefined') {
                    Journal.clear();
                }
            }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const filter = e.target.getAttribute('data-filter');
                this.filterJournal(filter);
            });
        });

        document.getElementById('rebirth-btn').addEventListener('click', () => {
            this.performRebirth();
        });

        document.getElementById('cancel-research-btn').addEventListener('click', () => {
            if (typeof Research !== 'undefined') {
                Research.cancelResearch();
                this.updateResearchUI();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    },

    switchTab(tab) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tab}`);
        });
    },

    gameTick(timestamp) {
        const now = Date.now();
        const delta = (now - this.state.lastTick) / 1000;

        this.state.gameTime += delta;

        if (typeof GameEvents !== 'undefined') {
            GameEvents.updateWeather(delta);
        } else {
            GameWeather.updateWeather(this, delta);
        }

        GameResources.updateResources(this, delta);

        GameInvasion.checkInvasion(this, delta);

        this.state.lastTick = now;
        
        this.throttledUpdateUI(now);
        
        if (typeof Rebirth !== 'undefined') {
            this.updateRebirthUI();
        }
        
        if (typeof Research !== 'undefined') {
            Research.updateResearchProgress(delta);
            this.updateResearchUI();
            
            if (Math.floor(this.state.gameTime) % 30 === 0 && this.state.gameTime > 0) {
                Research.earnResearchPoints(1);
            }
        }
        
        if (Math.floor(this.state.gameTime) % 5 === 0) {
            if (typeof GameAchievements !== 'undefined') {
                GameAchievements.checkAchievements();
            } else {
                this.checkAchievements();
            }
        }

        this.timers.gameLoop = requestAnimationFrame((ts) => this.gameTick(ts));
    },

    throttledUpdateUI(now) {
        if (now - this.performance.lastResourceUpdate >= this.performance.resourceUpdateInterval) {
            this.updateResourceDisplay();
            this.performance.lastResourceUpdate = now;
        }

        if (now - this.performance.lastButtonUpdate >= this.performance.buttonUpdateInterval) {
            this.updateButtonStates();
            this.performance.lastButtonUpdate = now;
        }

        this.updateWeatherDisplay();
        this.updateWorkersVisual();
        this.updateColonyInfo();
        this.updateStatsDisplay();
    },

    updateResourceDisplay() {
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
    },

    updateWeatherDisplay() {
        const weatherInfo = GameConfig.weather.types[this.state.weather];
        document.getElementById('weather-icon').textContent = weatherInfo.icon;
        document.getElementById('weather-name').textContent = weatherInfo.name;
    },

    updateStatsDisplay() {
        document.getElementById('game-time').textContent = Utils.formatTime(
            Math.floor(this.state.gameTime)
        );
        document.getElementById('total-food').textContent = Utils.formatNumber(
            this.state.totalFood
        );

        document.getElementById('setting-autosave').checked = GameConfig.game.autoSave;
        document.getElementById('setting-save-interval').value =
            GameConfig.game.saveInterval / 1000;
    },

    updateUI() {
        this.updateWeatherDisplay();
        this.updateResourceDisplay();
        this.updateWorkersVisual();
        this.updateButtonStates();
        this.updateColonyInfo();
        this.updateStatsDisplay();
    },

    updateButtonStates() {
        const buyWorkerBtn = document.getElementById('buy-worker-btn');
        const workerPrice = GameResources.getWorkerPrice(this);

        if (this.state.food < workerPrice) {
            buyWorkerBtn.disabled = true;
            buyWorkerBtn.textContent = `🐜 購買工蟻 (${workerPrice} 🍯) - 食物不足`;
        } else {
            buyWorkerBtn.disabled = false;
            buyWorkerBtn.textContent = `🐜 購買工蟻 (${workerPrice} 🍯)`;
        }

        const buySoldierBtn = document.getElementById('buy-soldier-btn');
        const soldierPrice = GameResources.getSoldierPrice(this);

        if (this.state.larvae < soldierPrice) {
            buySoldierBtn.disabled = true;
            buySoldierBtn.textContent = `⚔️ 孵化兵蟻 (${soldierPrice} 🥚) - 幼蟲不足`;
        } else {
            buySoldierBtn.disabled = false;
            buySoldierBtn.textContent = `⚔️ 孵化兵蟻 (${soldierPrice} 🥚)`;
        }

        const buyNurseBtn = document.getElementById('buy-nurse-btn');
        const nursePrice = GameResources.getNursePrice(this);

        if (this.state.food < nursePrice) {
            buyNurseBtn.disabled = true;
            buyNurseBtn.textContent = `👶 購買護理蟻 (${nursePrice} 🍯) - 食物不足`;
        } else {
            buyNurseBtn.disabled = false;
            buyNurseBtn.textContent = `👶 購買護理蟻 (${nursePrice} 🍯)`;
        }

        const storageUpgradeBtn = document.getElementById('storage-upgrade-btn');
        const storagePrice = GameRooms.getStorageUpgradePrice(this);
        const storageMaxLevel = GameConfig.rooms.storage.maxLevel;

        if (this.state.food < storagePrice || this.state.rooms.storage.level >= storageMaxLevel) {
            storageUpgradeBtn.disabled = true;
            const levelText = this.state.rooms.storage.level >= storageMaxLevel ? '已滿級' : `${storagePrice} 🍯`;
            storageUpgradeBtn.textContent = `🏠 升級儲藏室 (${levelText})`;
        } else {
            storageUpgradeBtn.disabled = false;
            storageUpgradeBtn.textContent = `🏠 升級儲藏室 (${storagePrice} 🍯)`;
        }

        const nurseryUpgradeBtn = document.getElementById('nursery-upgrade-btn');
        const nurseryPrice = GameRooms.getNurseryUpgradePrice(this);
        const nurseryMaxLevel = GameConfig.rooms.nursery.maxLevel;

        if (this.state.food < nurseryPrice || this.state.rooms.nursery.level >= nurseryMaxLevel) {
            nurseryUpgradeBtn.disabled = true;
            const levelText = this.state.rooms.nursery.level >= nurseryMaxLevel ? '已滿級' : `${nurseryPrice} 🍯`;
            nurseryUpgradeBtn.textContent = `🥚 升級育兒室 (${levelText})`;
        } else {
            nurseryUpgradeBtn.disabled = false;
            nurseryUpgradeBtn.textContent = `🥚 升級育兒室 (${nurseryPrice} 🍯)`;
        }

        const fungusUpgradeBtn = document.getElementById('fungus-upgrade-btn');
        const fungusPrice = GameRooms.getFungusUpgradePrice(this);
        const fungusMaxLevel = GameConfig.rooms.fungus.maxLevel;

        if (this.state.food < fungusPrice || this.state.rooms.fungus.level >= fungusMaxLevel) {
            fungusUpgradeBtn.disabled = true;
            const levelText = this.state.rooms.fungus.level >= fungusMaxLevel ? '已滿級' : `${fungusPrice} 🍯`;
            fungusUpgradeBtn.textContent = `🍄 升級真菌農場 (${levelText})`;
        } else {
            fungusUpgradeBtn.disabled = false;
            fungusUpgradeBtn.textContent = `🍄 升級真菌農場 (${fungusPrice} 🍯)`;
        }
    },

    updateColonyInfo() {
        const totalAnts = this.state.workers + this.state.soldiers + this.state.nurses + this.state.queen;
        document.getElementById('total-ants').textContent = Utils.formatNumber(totalAnts);

        const totalDefense = this.state.soldiers * GameConfig.soldiers.defensePower;
        document.getElementById('total-defense').textContent = Utils.formatNumber(totalDefense);

        const productionMultiplier = 1 + (this.state.queen * GameConfig.queen.productionMultiplier);
        const productionEfficiency = Math.round(productionMultiplier * 100);
        document.getElementById('production-efficiency').textContent = `${productionEfficiency}%`;

        document.getElementById('queen-count').textContent = this.state.queen;
        document.getElementById('queen-health').textContent = Math.round(this.state.queenHealth);

        const healthMultiplier = this.state.queenHealth / GameConfig.queen.maxHealth;
        const eggRate = GameConfig.queen.eggProductionRate * this.state.queen * healthMultiplier;
        document.getElementById('queen-egg-rate').textContent = eggRate.toFixed(1);

        const queenBonus = this.state.queen * GameConfig.queen.productionMultiplier * 100;
        document.getElementById('queen-bonus').textContent = queenBonus.toFixed(1);

        document.getElementById('workers-count').textContent = this.state.workers;
        const queenMultiplier = 1 + (this.state.queen * GameConfig.queen.productionMultiplier);
        const collectRate = GameConfig.workers.collectRate * this.state.workers * queenMultiplier;
        const conversionRate = GameConfig.workers.conversionRate * this.state.workers * queenMultiplier;
        document.getElementById('workers-collect-rate').textContent = collectRate.toFixed(1);
        document.getElementById('workers-conversion-rate').textContent = conversionRate.toFixed(1);

        document.getElementById('soldiers-count').textContent = this.state.soldiers;
        document.getElementById('soldiers-defense').textContent = totalDefense;
        const avgInvasionPower = 4.5;
        const successRate = Math.min(100, Math.round((totalDefense / avgInvasionPower) * 100));
        document.getElementById('soldiers-success-rate').textContent = successRate;

        document.getElementById('nurses-count').textContent = this.state.nurses;
        const nurseEfficiency = GameConfig.nurses.careEfficiency * this.state.nurses;
        document.getElementById('nurses-efficiency').textContent = nurseEfficiency.toFixed(1);
        const totalLarvaeRate = eggRate + nurseEfficiency;
        document.getElementById('total-larvae-rate').textContent = totalLarvaeRate.toFixed(1);

        const storageCapacity = GameConfig.resources.food.baseCapacity + (this.state.rooms.storage.level * GameConfig.rooms.storage.capacityBonus);
        document.getElementById('storage-level').textContent = this.state.rooms.storage.level;
        document.getElementById('storage-capacity').textContent = Utils.formatNumber(storageCapacity);
        const storagePercent = Math.min(100, Math.round((this.state.food / storageCapacity) * 100));
        document.getElementById('storage-usage').textContent = `${storagePercent}%`;

        const nurseryBonus = this.state.rooms.nursery.level * GameConfig.rooms.nursery.hatchSpeedBonus;
        const totalEggRate = eggRate + nurseryBonus;
        document.getElementById('nursery-level').textContent = this.state.rooms.nursery.level;
        document.getElementById('nursery-bonus').textContent = `+${nurseryBonus.toFixed(1)}`;
        document.getElementById('nursery-total-rate').textContent = totalEggRate.toFixed(1);

        const fungusProduction = this.state.rooms.fungus.level * GameConfig.rooms.fungus.productionRate;
        const fungusConsumption = this.state.rooms.fungus.level * GameConfig.rooms.fungus.waterConsumption;
        document.getElementById('fungus-level').textContent = this.state.rooms.fungus.level;
        document.getElementById('fungus-production').textContent = fungusProduction.toFixed(1);
        document.getElementById('fungus-consumption').textContent = fungusConsumption.toFixed(1);

        const timeSinceLastInvasion = this.state.gameTime - this.state.lastInvasion;
        const isInvaded = timeSinceLastInvasion < 10;

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

    unlockAchievement(achievementId) {
        if (this.state.achievements.includes(achievementId)) return;
        
        const achievement = GameConfig.achievements[achievementId];
        if (!achievement) return;
        
        this.state.achievements.push(achievementId);
        
        Utils.notify(`🏆 成就解鎖：${achievement.icon} ${achievement.name}`, 'success');
        Utils.log(`成就解鎖: ${achievement.name}`);
        
        if (typeof Audio !== 'undefined') {
            Audio.playAchievement();
        }
        
        this.updateAchievementsUI();
    },

    checkAchievements() {
        for (const [id, achievement] of Object.entries(GameConfig.achievements)) {
            if (this.state.achievements.includes(id)) continue;
            
            if (!achievement.condition) continue;
            
            if (achievement.condition(this.state)) {
                this.unlockAchievement(id);
            }
        }
    },

    updateAchievementsUI() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        const allAchievements = Object.entries(GameConfig.achievements);
        const unlockedIds = this.state.achievements;
        const totalAchievements = allAchievements.length;
        const unlockedCount = unlockedIds.length;

        const statsEl = document.getElementById('achievements-stats');
        if (statsEl) {
            const percentage = Math.round((unlockedCount / totalAchievements) * 100);
            statsEl.innerHTML = `
                <div class="achievements-stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">已解鎖</span>
                        <span class="stat-value">${unlockedCount}/${totalAchievements}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">完成度</span>
                        <span class="stat-value">${percentage}%</span>
                    </div>
                </div>
            `;
        }

        container.innerHTML = '';

        const fragment = document.createDocumentFragment();
        
        allAchievements.forEach(([id, achievement]) => {
            const isUnlocked = unlockedIds.includes(id);
            const card = document.createElement('div');
            card.className = 'achievement-card';
            if (isUnlocked) {
                card.classList.add('unlocked');
            } else {
                card.classList.add('locked');
            }

            let progressText = '';
            if (!isUnlocked) {
                const progress = this.getAchievementProgress(id, achievement);
                if (progress) {
                    progressText = `<p class="achievement-progress">${progress}</p>`;
                }
            }

            card.innerHTML = `
                <span class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</span>
                <div class="achievement-info">
                    <h4>${isUnlocked ? achievement.name : '???'}</h4>
                    <p>${isUnlocked ? achievement.description : '尚未解鎖'}</p>
                    ${progressText}
                </div>
                <span class="achievement-status">${isUnlocked ? '✅' : '🔒'}</span>
            `;

            fragment.appendChild(card);
        });

        container.appendChild(fragment);
    },

    getAchievementProgress(achievementId, achievement) {
        const state = this.state;

        switch (achievementId) {
            case 'food100':
                return `進度：${Utils.formatNumber(state.totalFood)}/100 食物`;
            case 'food1000':
                return `進度：${Utils.formatNumber(state.totalFood)}/1,000 食物`;
            case 'food10000':
                return `進度：${Utils.formatNumber(state.totalFood)}/10,000 食物`;
            case 'food100000':
                return `進度：${Utils.formatNumber(state.totalFood)}/100,000 食物`;

            case 'worker10':
                return `進度：${state.workers}/10 工蟻`;
            case 'worker50':
                return `進度：${state.workers}/50 工蟻`;
            case 'worker100':
                return `進度：${state.workers}/100 工蟻`;
            case 'soldier10':
                return `進度：${state.soldiers}/10 兵蟻`;
            case 'soldier50':
                return `進度：${state.soldiers}/50 兵蟻`;
            case 'nurse10':
                return `進度：${state.nurses}/10 護理蟻`;
            case 'nurse50':
                return `進度：${state.nurses}/50 護理蟻`;
            case 'ants100':
                const totalAnts = state.workers + state.soldiers + state.nurses;
                return `進度：${totalAnts}/100 螞蟻`;
            case 'ants500':
                const totalAnts2 = state.workers + state.soldiers + state.nurses;
                return `進度：${totalAnts2}/500 螞蟻`;

            case 'firstRoom':
                const hasRoom = state.rooms.storage.level > 0 || state.rooms.nursery.level > 0 || state.rooms.fungus.level > 0;
                return hasRoom ? '✓ 已建造房間' : '建造你的第一個房間';
            case 'allRooms':
                const roomsCount = (state.rooms.storage.level > 0 ? 1 : 0) + (state.rooms.nursery.level > 0 ? 1 : 0) + (state.rooms.fungus.level > 0 ? 1 : 0);
                return `進度：${roomsCount}/3 種房間`;
            case 'allRoomsLevel5':
                const maxLevelRooms = (state.rooms.storage.level >= 5 ? 1 : 0) + (state.rooms.nursery.level >= 5 ? 1 : 0) + (state.rooms.fungus.level >= 5 ? 1 : 0);
                return `進度：${maxLevelRooms}/3 房間達到 5 級`;

            case 'playTime10min':
                const time10 = Math.floor(state.gameTime / 60);
                return `進度：${time10}/10 分鐘`;
            case 'playTime1hour':
                const time60 = Math.floor(state.gameTime / 60);
                return `進度：${time60}/60 分鐘`;
            case 'playTime1day':
                const time1440 = Math.floor(state.gameTime / 60);
                return `進度：${time1440}/1,440 分鐘`;

            case 'defense1':
                return `進度：${state.defenseWins}/1 次成功防禦`;
            case 'defense10':
                return `進度：${state.defenseWins}/10 次成功防禦`;
            case 'click100':
                return '點擊收集 100 次';
            case 'click1000':
                return '點擊收集 1,000 次';

            default:
                return '';
        }
    },

    startGameLoop() {
        if (this.timers.gameLoop) return;

        this.timers.gameLoop = requestAnimationFrame((timestamp) => this.gameTick(timestamp));

        Utils.log('遊戲循環已啟動（requestAnimationFrame）');
    },

    stopGameLoop() {
        if (this.timers.gameLoop) {
            cancelAnimationFrame(this.timers.gameLoop);
            this.timers.gameLoop = null;
            Utils.log('遊戲循環已停止');
        }
    },

    startAutoSave() {
        if (!GameConfig.game.autoSave) return;

        this.stopAutoSave();

        this.timers.autoSave = setInterval(() => {
            this.saveGame();
            Utils.log('自動儲存完成');
        }, GameConfig.game.saveInterval);

        Utils.log('自動儲存已啟動');
    },

    stopAutoSave() {
        if (this.timers.autoSave) {
            clearInterval(this.timers.autoSave);
            this.timers.autoSave = null;
            Utils.log('自動儲存已停止');
        }
    },

    animateButton(buttonId) {
        const btn = document.getElementById(buttonId);
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 500);
    },

    performRebirth() {
        if (typeof Rebirth === 'undefined') return;

        const preview = Rebirth.getRebirthPreview(this.state);
        
        if (!preview.canRebirth) {
            Utils.notify('無法重生！需要遊戲時間至少 5 分鐘', 'error');
            return;
        }

        if (confirm(`確定要重生嗎？\n\n將獲得 ${preview.points} 重生點數\n所有資源和螞蟻將被重置`)) {
            Rebirth.performRebirth(this);
            this.updateUI();
            this.updateRebirthUI();
        }
    },

    updateRebirthUI() {
        if (typeof Rebirth === 'undefined') return;

        const preview = Rebirth.getRebirthPreview(this.state);

        document.getElementById('rebirth-points').textContent = Utils.formatNumber(Rebirth.rebirthPoints);
        document.getElementById('total-rebirth-points').textContent = Utils.formatNumber(Rebirth.totalRebirthPoints);
        document.getElementById('rebirth-count').textContent = Rebirth.rebirthCount;

        document.getElementById('preview-points').textContent = `${preview.points} 點`;

        const rebirthBtn = document.getElementById('rebirth-btn');
        rebirthBtn.disabled = !preview.canRebirth;

        if (preview.canRebirth) {
            rebirthBtn.textContent = `♻️ 執行重生（獲得 ${preview.points} 點）`;
        } else {
            const remainingTime = 300 - this.state.gameTime;
            rebirthBtn.textContent = `♻️ 執行重生（需要 ${Math.ceil(remainingTime)} 秒）`;
        }

        this.updateRebirthUpgradesList();
        this.updateRebirthBonusesList();
    },

    updateRebirthUpgradesList() {
        const container = document.getElementById('rebirth-upgrades-list');
        if (!container) return;

        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        for (const [id, upgrade] of Object.entries(GameConfig.rebirthUpgrades)) {
            const currentLevel = Rebirth.getUpgradeLevel(id);
            const price = Rebirth.getUpgradePrice(id);
            const canAfford = Rebirth.rebirthPoints >= price;

            const card = document.createElement('div');
            card.className = 'upgrade-card';

            let statusText = '';
            let buttonDisabled = false;

            if (currentLevel >= upgrade.maxLevel) {
                statusText = '已滿級';
                buttonDisabled = true;
            } else if (!canAfford) {
                statusText = `${price} 點（點數不足）`;
                buttonDisabled = true;
            } else {
                statusText = `${price} 點`;
            }

            card.innerHTML = `
                <div class="upgrade-header">
                    <span class="upgrade-icon">${upgrade.icon}</span>
                    <h4>${upgrade.name}</h4>
                    <span class="upgrade-level">${currentLevel}/${upgrade.maxLevel}</span>
                </div>
                <div class="upgrade-info">
                    <p>${upgrade.description}</p>
                </div>
                <div class="upgrade-action">
                    <button class="action-btn" data-upgrade="${id}" ${buttonDisabled ? 'disabled' : ''}>
                        購買 (${statusText})
                    </button>
                </div>
            `;

            const btn = card.querySelector('button');
            if (!buttonDisabled) {
                btn.addEventListener('click', () => {
                    if (Rebirth.purchasePermanentUpgrade(id)) {
                        this.updateRebirthUI();
                    }
                });
            }

            fragment.appendChild(card);
        }

        container.appendChild(fragment);
    },

    updateRebirthBonusesList() {
        const container = document.getElementById('rebirth-bonuses-list');
        if (!container) return;

        const bonuses = Rebirth.permanentBonuses;

        container.innerHTML = `
            <div class="bonus-item">
                <span>⚡ 生產效率：</span>
                <span>${((bonuses.productionMultiplier - 1) * 100).toFixed(0)}%</span>
            </div>
            <div class="bonus-item">
                <span>💰 價格折扣：</span>
                <span>${bonuses.priceDiscount.toFixed(0)}%</span>
            </div>
            <div class="bonus-item">
                <span>📦 容量加成：</span>
                <span>+${bonuses.capacityBonus}</span>
            </div>
            <div class="bonus-item">
                <span>👑 蟻后健康：</span>
                <span>+${bonuses.queenHealthBonus}</span>
            </div>
            <div class="bonus-item">
                <span>🎁 初始資源：</span>
                <span>等級 ${bonuses.startingResources}</span>
            </div>
        `;
    },

    filterJournal(filter) {
        if (typeof Journal === 'undefined') return;

        const container = document.getElementById('journal-list');
        if (!container) return;

        if (filter === 'all') {
            Journal.updateJournalUI();
            return;
        }

        const entries = Journal.getEntries({ type: filter, limit: 50 });

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-entries">尚無此類型的日誌記錄</p>';
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="journal-entry" data-type="${entry.type}">
                <div class="entry-icon" style="color: ${Journal.getTypeColor(entry.type)}">
                    ${Journal.getTypeIcon(entry.type)}
                </div>
                <div class="entry-content">
                    <div class="entry-message">${entry.message}</div>
                    <div class="entry-meta">
                        <span class="entry-time">${Journal.formatTimestamp(entry.timestamp)}</span>
                        <span class="entry-game-time">遊戲時間: ${Journal.formatGameTime(entry.gameTime)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    updateResearchUI() {
        if (typeof Research === 'undefined') return;

        document.getElementById('research-points').textContent = Utils.formatNumber(Research.researchPoints);
        document.getElementById('total-research-points').textContent = Utils.formatNumber(Research.totalResearchPoints);

        const stats = Research.getStatistics();
        document.getElementById('research-progress').textContent = `${stats.unlocked}/${stats.total}`;

        const currentBox = document.getElementById('current-research-box');
        if (Research.currentResearch) {
            currentBox.style.display = 'block';
            const research = GameConfig.researchTree[Research.currentResearch];
            document.getElementById('current-research-name').textContent = `${research.icon} ${research.name}`;
            
            const progressPercent = Research.getResearchProgressPercent();
            document.getElementById('research-progress-bar').style.width = `${progressPercent}%`;
            
            const remainingTime = Research.getRemainingTime();
            document.getElementById('research-time-remaining').textContent = `剩餘 ${remainingTime} 秒`;
        } else {
            currentBox.style.display = 'none';
        }

        this.updateResearchTree();
        this.updateResearchBonuses();
    },

    updateResearchTree() {
        const container = document.getElementById('research-tree');
        if (!container) return;

        const categories = Research.getResearchTreeByCategory();
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        for (const [categoryId, category] of Object.entries(categories)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'research-category';
            categoryDiv.innerHTML = `
                <div class="category-header">
                    <span class="category-icon">${category.icon}</span>
                    <h3>${category.name}</h3>
                </div>
                <div class="category-researches" id="category-${categoryId}">
                </div>
            `;

            const researchesContainer = categoryDiv.querySelector(`#category-${categoryId}`);

            for (const research of category.researches) {
                const card = document.createElement('div');
                card.className = 'research-card';
                if (research.unlocked) card.classList.add('unlocked');
                if (research.isResearching) card.classList.add('researching');

                let statusText = '';
                let buttonDisabled = false;
                let buttonText = '';

                if (research.unlocked) {
                    statusText = '✅ 已解鎖';
                    buttonDisabled = true;
                    buttonText = '已完成';
                } else if (research.isResearching) {
                    statusText = '⏳ 研究中...';
                    buttonDisabled = true;
                    buttonText = '研究中';
                } else if (!research.canResearch) {
                    if (Research.researchPoints < research.cost) {
                        statusText = `需要 ${research.cost} 點（點數不足）`;
                    } else {
                        statusText = '需要前置研究';
                    }
                    buttonDisabled = true;
                    buttonText = '無法研究';
                } else {
                    statusText = `需要 ${research.cost} 點`;
                    buttonText = '開始研究';
                }

                card.innerHTML = `
                    <div class="research-header">
                        <span class="research-icon">${research.icon}</span>
                        <h4>${research.name}</h4>
                    </div>
                    <div class="research-info">
                        <p>${research.description}</p>
                        <p class="research-time">⏱️ 研究時間：${research.time} 秒</p>
                    </div>
                    <div class="research-status">
                        <span class="status-text">${statusText}</span>
                    </div>
                    <div class="research-action">
                        <button class="action-btn" data-research="${research.id}" ${buttonDisabled ? 'disabled' : ''}>
                            ${buttonText}
                        </button>
                    </div>
                `;

                const btn = card.querySelector('button');
                if (!buttonDisabled && !research.unlocked && !research.isResearching) {
                    btn.addEventListener('click', () => {
                        if (Research.startResearch(research.id)) {
                            this.updateResearchUI();
                        }
                    });
                }

                researchesContainer.appendChild(card);
            }

            fragment.appendChild(categoryDiv);
        }

        container.appendChild(fragment);
    },

    updateResearchBonuses() {
        const container = document.getElementById('research-bonuses-list');
        if (!container) return;

        const bonuses = Research.researchBonuses;
        const bonusItems = [];

        if (bonuses.allProductionBonus > 0) {
            bonusItems.push(`<span>⚡ 所有生產：</span><span>+${bonuses.allProductionBonus}%</span>`);
        }
        if (bonuses.foodBonus > 0) {
            bonusItems.push(`<span>🌾 食物加成：</span><span>+${bonuses.foodBonus}%</span>`);
        }
        if (bonuses.leafBonus > 0) {
            bonusItems.push(`<span>🍃 葉子加成：</span><span>+${bonuses.leafBonus}%</span>`);
        }
        if (bonuses.waterBonus > 0) {
            bonusItems.push(`<span>💧 水滴加成：</span><span>+${bonuses.waterBonus}%</span>`);
        }
        if (bonuses.larvaeBonus > 0) {
            bonusItems.push(`<span>🐛 幼蟲加成：</span><span>+${bonuses.larvaeBonus}%</span>`);
        }
        if (bonuses.workerEfficiency > 0) {
            bonusItems.push(`<span>👷 工蟻效率：</span><span>+${bonuses.workerEfficiency}%</span>`);
        }
        if (bonuses.soldierPower > 0) {
            bonusItems.push(`<span>⚔️ 兵蟻力量：</span><span>+${bonuses.soldierPower}%</span>`);
        }
        if (bonuses.nurseEfficiency > 0) {
            bonusItems.push(`<span>👩‍⚕️ 護理蟻效率：</span><span>+${bonuses.nurseEfficiency}%</span>`);
        }
        if (bonuses.queenEggRate > 0) {
            bonusItems.push(`<span>👑 蟻后產卵：</span><span>+${bonuses.queenEggRate}%</span>`);
        }
        if (bonuses.roomEfficiency > 0) {
            bonusItems.push(`<span>🏠 房間效率：</span><span>+${bonuses.roomEfficiency}%</span>`);
        }
        if (bonuses.invasionDefense > 0) {
            bonusItems.push(`<span>🛡️ 入侵防禦：</span><span>+${bonuses.invasionDefense}%</span>`);
        }
        if (bonuses.weatherResistance > 0) {
            bonusItems.push(`<span>🌤️ 天氣抗性：</span><span>+${bonuses.weatherResistance}%</span>`);
        }
        if (bonuses.autoCollectEnabled) {
            bonusItems.push(`<span>🤖 自動收集：</span><span>已啟用</span>`);
        }
        if (bonuses.autoFeedEnabled) {
            bonusItems.push(`<span>🍽️ 自動餵食：</span><span>已啟用</span>`);
        }
        if (bonuses.criticalHitChance > 0) {
            bonusItems.push(`<span>💥 暴擊機率：</span><span>${bonuses.criticalHitChance}%</span>`);
        }
        if (bonuses.storageEfficiency > 0) {
            bonusItems.push(`<span>📦 儲存效率：</span><span>+${bonuses.storageEfficiency}%</span>`);
        }

        if (bonusItems.length === 0) {
            container.innerHTML = '<p class="no-bonuses">尚未解鎖任何研究加成</p>';
        } else {
            container.innerHTML = bonusItems.map(item => `
                <div class="bonus-item">${item}</div>
            `).join('');
        }
    },

    showFloatingNumber(amount, icon, targetElement) {
        const floatingNumber = document.createElement('div');
        floatingNumber.className = 'floating-number';
        floatingNumber.textContent = `+${amount} ${icon}`;

        const rect = targetElement.getBoundingClientRect();
        floatingNumber.style.left = `${rect.left + rect.width / 2}px`;
        floatingNumber.style.top = `${rect.top}px`;

        document.body.appendChild(floatingNumber);

        setTimeout(() => {
            floatingNumber.remove();
        }, 1000);
    },

    createParticles(type, targetElement) {
        const particleCount = 8;
        const rect = targetElement.getBoundingClientRect();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    },

    updateWorkersVisual() {
        const container = document.getElementById('workers-visual');
        const workerCount = this.state.workers;

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

        if (workerCount > maxVisible) {
            const moreIndicator = document.createElement('span');
            moreIndicator.className = 'mini-ant';
            moreIndicator.textContent = `+${workerCount - maxVisible}`;
            container.appendChild(moreIndicator);
        }
    },

    animateResourceValue(resourceId) {
        const element = document.getElementById(resourceId);
        if (!element) return;

        element.classList.add('updated');
        setTimeout(() => {
            element.classList.remove('updated');
        }, 300);
    },

    shakeButton(buttonId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        btn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            btn.style.animation = '';
        }, 500);
    },

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

    loadGame() {
        try {
            const saveData = localStorage.getItem(GameConfig.saveKey);
            if (saveData) {
                const parsed = JSON.parse(saveData);

                if (parsed.version !== GameConfig.game.version) {
                    Utils.notify('檢測到舊版存檔，已重置為初始狀態', 'warning');
                    return;
                }

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
                    rooms: parsed.state.rooms ?? {
                        storage: { level: 0, maxLevel: GameConfig.rooms.storage.maxLevel },
                        nursery: { level: 0, maxLevel: GameConfig.rooms.nursery.maxLevel },
                        fungus: { level: 0, maxLevel: GameConfig.rooms.fungus.maxLevel },
                    },
                    lastInvasion: parsed.state.lastInvasion ?? -GameConfig.invasion.cooldown,
                    totalFood: parsed.state.totalFood ?? GameConfig.resources.food.initial,
                    gameTime: parsed.state.gameTime ?? 0,
                    lastTick: Date.now(),
                    achievements: parsed.state.achievements ?? [],
                    defenseWins: parsed.state.defenseWins ?? 0,
                    queenHealth: parsed.state.queenHealth ?? GameConfig.queen.maxHealth,
                    weather: parsed.state.weather ?? 'clear',
                    weatherEndTime: parsed.state.weatherEndTime ?? 0,
                    nextWeatherTime: parsed.state.nextWeatherTime ?? GameConfig.weather.minInterval,
                };

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

    exportSave() {
        const now = new Date();
        const timestamp = now.toISOString();
        const filename = `antidle-save-${now.toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
        
        const exportData = {
            version: GameConfig.game.version,
            exportTime: timestamp,
            gameState: this.state,
        };

        if (typeof Rebirth !== 'undefined') {
            exportData.rebirthData = {
                rebirthPoints: Rebirth.rebirthPoints,
                totalRebirthPoints: Rebirth.totalRebirthPoints,
                rebirthCount: Rebirth.rebirthCount,
                purchasedUpgrades: Rebirth.purchasedUpgrades,
            };
        }

        if (typeof Research !== 'undefined') {
            exportData.researchData = {
                researchPoints: Research.researchPoints,
                totalResearchPoints: Research.totalResearchPoints,
                unlockedResearch: Research.unlockedResearch,
            };
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.updateLastBackupTime(timestamp);
        Utils.notify('存檔已匯出！', 'success');
        Utils.log(`存檔已匯出: ${filename}`);
    },

    importSave(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!this.validateImportData(importData)) {
                    Utils.notify('無效的存檔格式！', 'error');
                    return;
                }

                const importVersion = importData.version;
                const currentVersion = GameConfig.game.version;
                
                if (importVersion !== currentVersion) {
                    if (!confirm(`存檔版本 (${importVersion}) 與當前版本 (${currentVersion}) 不同，可能導致相容性問題。\n\n確定要繼續匯入嗎？`)) {
                        return;
                    }
                }

                if (!confirm('匯入存檔將覆蓋當前遊戲進度！\n\n確定要繼續嗎？')) {
                    return;
                }

                this.state = { ...this.state, ...importData.gameState };
                this.state.lastTick = Date.now();

                if (importData.rebirthData && typeof Rebirth !== 'undefined') {
                    Rebirth.rebirthPoints = importData.rebirthData.rebirthPoints || 0;
                    Rebirth.totalRebirthPoints = importData.rebirthData.totalRebirthPoints || 0;
                    Rebirth.rebirthCount = importData.rebirthData.rebirthCount || 0;
                    Rebirth.purchasedUpgrades = importData.rebirthData.purchasedUpgrades || {};
                }

                if (importData.researchData && typeof Research !== 'undefined') {
                    Research.researchPoints = importData.researchData.researchPoints || 0;
                    Research.totalResearchPoints = importData.researchData.totalResearchPoints || 0;
                    Research.unlockedResearch = importData.researchData.unlockedResearch || [];
                }

                this.saveGame();
                this.updateUI();
                
                if (typeof GameUI !== 'undefined') {
                    GameUI.updateUI();
                }
                
                if (typeof Rebirth !== 'undefined') {
                    this.updateRebirthUI();
                }
                
                if (typeof Research !== 'undefined') {
                    this.updateResearchUI();
                }
                
                if (typeof GameAchievements !== 'undefined') {
                    GameAchievements.updateAchievementsUI();
                } else {
                    this.updateAchievementsUI();
                }

                this.updateLastBackupTime(importData.exportTime);
                Utils.notify('存檔已匯入！', 'success');
                Utils.log('存檔已成功匯入');
                
            } catch (error) {
                console.error('匯入失敗:', error);
                Utils.notify('匯入失敗！請確認檔案格式正確', 'error');
            }
        };

        reader.onerror = () => {
            Utils.notify('讀取檔案失敗！', 'error');
        };

        reader.readAsText(file);
    },

    validateImportData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.version || typeof data.version !== 'string') return false;
        if (!data.gameState || typeof data.gameState !== 'object') return false;
        
        const requiredFields = ['food', 'workers', 'queen', 'gameTime'];
        for (const field of requiredFields) {
            if (!(field in data.gameState)) return false;
        }
        
        return true;
    },

    updateLastBackupTime(timestamp) {
        const el = document.getElementById('last-backup-time');
        if (el) {
            const date = new Date(timestamp);
            el.textContent = date.toLocaleString('zh-TW');
        }
    },

    resetGame() {
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
            achievements: [],
            defenseWins: 0,
            queenHealth: GameConfig.queen.maxHealth,
            weather: 'clear',
            weatherEndTime: 0,
            nextWeatherTime: GameConfig.weather.minInterval,
        };

        localStorage.removeItem(GameConfig.saveKey);

        this.updateUI();

        Utils.notify('遊戲已重置！', 'success');
        Utils.log('遊戲已重置');
    },
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
