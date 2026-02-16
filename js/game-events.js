/**
 * AntIdle - 事件處理系統
 * 處理天氣和入侵事件
 */

const GameEvents = {
    /**
     * 更新天氣
     * @param {number} delta - 時間差（秒）
     */
    updateWeather(delta) {
        // 檢查是否該觸發天氣
        if (Game.state.gameTime >= Game.state.nextWeatherTime) {
            // 隨機選擇天氣
            const weatherTypes = Object.keys(GameConfig.weather.types);
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const weatherInfo = GameConfig.weather.types[randomWeather];

            // 設置當前天氣
            Game.state.weather = randomWeather;

            // 設置持續時間
            const duration = GameConfig.weather.minDuration +
                Math.random() * (GameConfig.weather.maxDuration - GameConfig.weather.minDuration);
            Game.state.weatherEndTime = Game.state.gameTime + duration;

            // 設置下次天氣觸發時間
            const interval = GameConfig.weather.minInterval +
                Math.random() * (GameConfig.weather.maxInterval - GameConfig.weather.minInterval);
            Game.state.nextWeatherTime = Game.state.gameTime + duration + interval;

            // 創建天氣視覺效果
            if (typeof Effects !== 'undefined') {
                Effects.createWeatherEffect(randomWeather);
            }

            // 播放天氣音效
            if (typeof Audio !== 'undefined') {
                Audio.playWeather(randomWeather);
            }

            // 通知玩家
            Utils.notify(`${weatherInfo.icon} ${weatherInfo.name}來臨！持續 ${Math.round(duration)} 秒`, 'info');

            // 記錄日誌
            if (typeof Journal !== 'undefined') {
                Journal.log(Journal.types.WEATHER, 
                    `${weatherInfo.icon} ${weatherInfo.name}來臨，持續 ${Math.round(duration)} 秒`, {
                    weather: randomWeather,
                    duration: duration,
                });
            }

            Utils.log(`天氣變化: ${weatherInfo.name}, 持續 ${duration} 秒`);
        }

        // 檢查天氣是否結束
        if (Game.state.gameTime >= Game.state.weatherEndTime && Game.state.weather !== 'clear') {
            Game.state.weather = 'clear';
        }

        // 應用天氣效果（在 gameTick 中處理）
    },

    /**
     * 獲取天氣效果
     * @returns {Object} 天氣效果
     */
    getWeatherEffects() {
        const effects = {
            foodMultiplier: 1,
            leafMultiplier: 1,
            waterMultiplier: 1,
            consumptionMultiplier: 1,
        };

        switch (Game.state.weather) {
            case 'rain':
                effects.waterMultiplier = GameConfig.weather.types.rain.effects.waterMultiplier;
                effects.leafMultiplier = GameConfig.weather.types.rain.effects.leafMultiplier;
                break;
            case 'sunny':
                effects.leafMultiplier = GameConfig.weather.types.sunny.effects.leafMultiplier;
                effects.consumptionMultiplier = GameConfig.weather.types.sunny.effects.consumptionMultiplier;
                break;
            case 'storm':
                // 暴風的效果在 gameTick 中處理
                break;
        }

        return effects;
    },

    /**
     * 處理暴風效果
     * @param {number} delta - 時間差（秒）
     */
    handleStorm(delta) {
        if (Game.state.weather !== 'storm') return;

        // 隨機損失資源
        if (Math.random() < 0.1 * delta) { // 10% 每秒機率
            const lostFood = Math.floor(Game.state.food * 0.01);
            const lostLeaf = Math.floor(Game.state.leaf * 0.01);
            const lostWater = Math.floor(Game.state.water * 0.01);

            Game.state.food = Math.max(0, Game.state.food - lostFood);
            Game.state.leaf = Math.max(0, Game.state.leaf - lostLeaf);
            Game.state.water = Math.max(0, Game.state.water - lostWater);

            Utils.notify(`🌪️ 暴風來襲！損失 ${lostFood} 食物、${lostLeaf} 葉子、${lostWater} 水滴`, 'warning');
        }
    },

    /**
     * 檢查並處理入侵事件
     * @param {number} delta - 時間差（秒）
     */
    checkInvasion(delta) {
        // 檢查是否該觸發入侵
        if (Game.state.gameTime >= Game.state.lastInvasion + GameConfig.invasion.cooldown) {
            if (Math.random() < GameConfig.invasion.chance * delta) {
                this.handleInvasion();
            }
        }
    },

    /**
     * 處理入侵事件
     */
    handleInvasion() {
        // 計算防禦力
        const defensePower = Game.state.soldiers * GameConfig.soldiers.defensePower;

        // 計算入侵強度
        const invasionPower = Math.random() * 50 + 10;

        // 更新最後入侵時間
        Game.state.lastInvasion = Game.state.gameTime;

        if (defensePower >= invasionPower) {
            // 防禦成功
            Game.state.defenseWins++;

            // 獎勵昆蟲
            const reward = Math.floor(Math.random() * 3) + 1;
            Game.state.insect += reward;

            Utils.notify(`⚔️ 成功防禦！獲得 ${reward} 昆蟲`, 'success');

            // 記錄日誌
            if (typeof Journal !== 'undefined') {
                Journal.log(Journal.types.INVASION, 
                    `成功防禦入侵！獲得 ${reward} 昆蟲`, {
                    success: true,
                    reward: reward,
                    defensePower: defensePower,
                    invasionPower: invasionPower,
                });
            }

            // 播放音效
            if (typeof Audio !== 'undefined') {
                Audio.playInvasion(true);
            }
        } else {
            // 防禦失敗
            const lostFood = Math.floor(Game.state.food * 0.1);
            Game.state.food -= lostFood;

            Utils.notify(`⚔️ 防禦失敗！損失 ${Utils.formatNumber(lostFood)} 食物`, 'error');

            // 記錄日誌
            if (typeof Journal !== 'undefined') {
                Journal.log(Journal.types.INVASION, 
                    `防禦失敗！損失 ${Utils.formatNumber(lostFood)} 食物`, {
                    success: false,
                    lostFood: lostFood,
                    defensePower: defensePower,
                    invasionPower: invasionPower,
                });
            }

            // 播放音效
            if (typeof Audio !== 'undefined') {
                Audio.playInvasion(false);
            }
        }

        // 檢查成就
        if (typeof GameAchievements !== 'undefined') {
            GameAchievements.checkInvasionAchievements();
        }
    },
};
