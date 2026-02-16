/**
 * AntIdle - 成就系統
 * 處理成就解鎖和檢查
 */

const GameAchievements = {
    /**
     * 解鎖成就
     * @param {string} achievementId - 成就 ID
     */
    unlockAchievement(achievementId) {
        // 檢查是否已解鎖
        if (Game.state.achievements.includes(achievementId)) return;

        // 檢查成就是否存在
        const achievement = GameConfig.achievements[achievementId];
        if (!achievement) return;

        // 解鎖成就
        Game.state.achievements.push(achievementId);

        // 記錄日誌
        if (typeof Journal !== 'undefined') {
            Journal.log(Journal.types.ACHIEVEMENT, 
                `解鎖成就：${achievement.icon} ${achievement.name}`, {
                id: achievementId,
                name: achievement.name,
            });
        }

        // 通知
        Utils.notify(`🏆 成就解鎖：${achievement.name}`, 'success');

        // 播放音效
        if (typeof Audio !== 'undefined') {
            Audio.playAchievement();
        }

        // 創建特效
        if (typeof Effects !== 'undefined') {
            Effects.createAchievementEffect();
        }

        Utils.log(`成就解鎖: ${achievement.name}`);
    },

    /**
     * 檢查所有成就條件
     */
    checkAchievements() {
        for (const [id, achievement] of Object.entries(GameConfig.achievements)) {
            // 跳過已解鎖的成就
            if (Game.state.achievements.includes(id)) continue;

            // 跳過特殊條件成就（condition 為 null）
            if (!achievement.condition) continue;

            // 檢查條件
            if (achievement.condition(Game.state)) {
                this.unlockAchievement(id);
            }
        }
    },

    /**
     * 檢查入侵相關成就
     */
    checkInvasionAchievements() {
        if (Game.state.defenseWins >= 1) {
            this.unlockAchievement('defense1');
        }
        if (Game.state.defenseWins >= 10) {
            this.unlockAchievement('defense10');
        }
    },

    /**
     * 獲取成就進度提示
     * @param {string} achievementId - 成就 ID
     * @param {Object} achievement - 成就對象
     * @returns {string} 進度提示文字
     */
    getAchievementProgress(achievementId, achievement) {
        const state = Game.state;

        // 根據成就類型返回進度提示
        switch (achievementId) {
            // 食物相關
            case 'food100':
                return `進度：${Utils.formatNumber(state.totalFood)}/100 食物`;
            case 'food1000':
                return `進度：${Utils.formatNumber(state.totalFood)}/1,000 食物`;
            case 'food10000':
                return `進度：${Utils.formatNumber(state.totalFood)}/10,000 食物`;
            case 'food100000':
                return `進度：${Utils.formatNumber(state.totalFood)}/100,000 食物`;

            // 螞蟻相關
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

            // 房間相關
            case 'firstRoom':
                const hasRoom = state.rooms.storage.level > 0 || 
                               state.rooms.nursery.level > 0 || 
                               state.rooms.fungus.level > 0;
                return hasRoom ? '✓ 已建造房間' : '建造你的第一個房間';
            case 'allRooms':
                const roomsCount = (state.rooms.storage.level > 0 ? 1 : 0) + 
                                  (state.rooms.nursery.level > 0 ? 1 : 0) + 
                                  (state.rooms.fungus.level > 0 ? 1 : 0);
                return `進度：${roomsCount}/3 種房間`;
            case 'allRoomsLevel5':
                const maxLevelRooms = (state.rooms.storage.level >= 5 ? 1 : 0) + 
                                     (state.rooms.nursery.level >= 5 ? 1 : 0) + 
                                     (state.rooms.fungus.level >= 5 ? 1 : 0);
                return `進度：${maxLevelRooms}/3 房間達到 5 級`;

            // 時間相關
            case 'playTime10min':
                const time10 = Math.floor(state.gameTime / 60);
                return `進度：${time10}/10 分鐘`;
            case 'playTime1hour':
                const time60 = Math.floor(state.gameTime / 60);
                return `進度：${time60}/60 分鐘`;
            case 'playTime1day':
                const time1440 = Math.floor(state.gameTime / 60);
                return `進度：${time1440}/1,440 分鐘`;

            // 其他
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
};
