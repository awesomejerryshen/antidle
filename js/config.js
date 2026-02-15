/**
 * AntIdle - 遊戲配置檔
 * 集中管理所有可調整的遊戲參數
 */

const GameConfig = {
    // 遊戲基本設定
    game: {
        name: 'AntIdle',
        version: '0.3.0',
        tickRate: 1000, // 遊戲更新頻率（毫秒）
        autoSave: true,
        saveInterval: 30000, // 自動儲存間隔（毫秒）
    },

    // 資源設定
    resources: {
        food: {
            name: '食物',
            icon: '🍯',
            initial: 10,
            baseCapacity: 100, // 基礎儲存容量
            precision: 0, // 小數點位數
        },
        workers: {
            name: '工蟻',
            icon: '🐜',
            initial: 5,
            precision: 0,
        },
        queen: {
            name: '蟻后',
            icon: '👑',
            initial: 1,
            precision: 0,
        },
        soldiers: {
            name: '兵蟻',
            icon: '⚔️',
            initial: 0,
            precision: 0,
        },
        nurses: {
            name: '護理蟻',
            icon: '👶',
            initial: 0,
            precision: 0,
        },
        leaf: {
            name: '葉子',
            icon: '🍃',
            initial: 10,
            precision: 0,
        },
        water: {
            name: '水滴',
            icon: '💧',
            initial: 0,
            precision: 0,
        },
        larvae: {
            name: '幼蟲',
            icon: '🥚',
            initial: 0,
            precision: 0,
        },
        insect: {
            name: '昆蟲',
            icon: '🍪',
            initial: 0,
            precision: 0,
        },
    },

    // 動作設定
    actions: {
        collect: {
            baseAmount: 5, // 每次點擊獲得的葉子（手動較快）
            baseCooldown: 0, // 冷卻時間（毫秒）
        },
    },

    // 工蟻購買設定
    workers: {
        basePrice: 10, // 基礎價格（食物）
        priceMultiplier: 1.2, // 每次購買價格增長倍數
        collectRate: 0.5, // 每隻工蟻每秒收集葉子數量（提高以平衡轉換率）
        conversionRate: 0.5, // 每隻工蟻每秒轉換葉子為食物數量
        bulkBuyAmount: 10, // 批量購買數量
    },

    // 兵蟻購買設定
    soldiers: {
        basePrice: 10, // 基礎價格（幼蟲）- 提高以避免初期購買太快
        priceMultiplier: 1.3, // 每次購買價格增長倍數
        defensePower: 1, // 每隻兵蟻的防禦力
    },

    // 護理蟻購買設定
    nurses: {
        basePrice: 15, // 基礎價格（食物）
        priceMultiplier: 1.4, // 每次購買價格增長倍數
        careEfficiency: 0.1, // 每隻護理蟻提高幼蟲產生速度（每秒）
    },

    // 蟻后設定
    queen: {
        eggProductionRate: 0.1, // 每秒產生幼蟲數量（降低以減少幼蟲過多）
        productionMultiplier: 0.05, // 每隻蟻后提高所有生產效率（百分比）
        maxHealth: 100, // 最大健康值
        healthDecay: 0.05, // 每秒健康值下降
        nurseHealRate: 0.2, // 每隻護理蟻每秒恢復的健康值
    },

    // 入侵事件設定
    invasion: {
        baseChance: 0.03, // 基礎入侵機率（每秒）
        baseDamage: 5, // 入侵成功造成的基礎傷害（食物）
        baseReward: {food: 15, leaf: 5}, // 防禦成功獲得的基礎獎勵（食物、葉子）
        cooldown: 300, // 入侵冷卻時間（秒）
    },

    // 房間系統設定
    rooms: {
        storage: {
            name: '儲藏室',
            icon: '🏠',
            basePrice: 50, // 基礎價格（食物）
            priceMultiplier: 1.3, // 每次升級價格增長倍數
            capacityBonus: 50, // 每級增加儲存上限（食物）
            maxLevel: 20, // 最高等級
        },
        nursery: {
            name: '育兒室',
            icon: '🥚',
            basePrice: 30, // 基礎價格（食物）
            priceMultiplier: 1.25, // 每次升級價格增長倍數
            hatchSpeedBonus: 0.2, // 每級增加孵化速度（幼蟲/秒）
            maxLevel: 20, // 最高等級
        },
        fungus: {
            name: '真菌農場',
            icon: '🍄',
            basePrice: 80, // 基礎價格（食物）
            priceMultiplier: 1.4, // 每次升級價格增長倍數
            productionRate: 0.5, // 每級產出高級食物（食物/秒）
            waterConsumption: 0.1, // 每級消耗水滴（水滴/秒）
            maxLevel: 20, // 最高等級
        },
    },

    // 升級系統（預留）
    upgrades: {
        // 升級將在此定義
    },

    // 成就系統
    achievements: {
        // 幼蟲相關
        firstLarvae: {
            name: '新生命',
            description: '獲得第一隻幼蟲',
            icon: '🥚',
            condition: (state) => state.larvae >= 1,
        },
        larvae50: {
            name: '繁衍不息',
            description: '擁有 50 隻幼蟲',
            icon: '🥚',
            condition: (state) => state.larvae >= 50,
        },
        larvae200: {
            name: '蟲群初現',
            description: '擁有 200 隻幼蟲',
            icon: '🐛',
            condition: (state) => state.larvae >= 200,
        },
        
        // 工蟻相關
        workers10: {
            name: '小型蟻群',
            description: '擁有 10 隻工蟻',
            icon: '🐜',
            condition: (state) => state.workers >= 10,
        },
        workers50: {
            name: '勤勞軍團',
            description: '擁有 50 隻工蟻',
            icon: '🐜',
            condition: (state) => state.workers >= 50,
        },
        workers100: {
            name: '工蟻大軍',
            description: '擁有 100 隻工蟻',
            icon: '🐜',
            condition: (state) => state.workers >= 100,
        },
        
        // 兵蟻相關
        firstSoldier: {
            name: '首名衛士',
            description: '孵化第一隻兵蟻',
            icon: '⚔️',
            condition: (state) => state.soldiers >= 1,
        },
        soldiers10: {
            name: '防禦陣列',
            description: '擁有 10 隻兵蟻',
            icon: '🛡️',
            condition: (state) => state.soldiers >= 10,
        },
        
        // 護理蟻相關
        firstNurse: {
            name: '呵護之手',
            description: '招募第一隻護理蟻',
            icon: '👶',
            condition: (state) => state.nurses >= 1,
        },
        nurses10: {
            name: '育兒團隊',
            description: '擁有 10 隻護理蟻',
            icon: '👶',
            condition: (state) => state.nurses >= 10,
        },
        
        // 蟻后相關
        queenLevel2: {
            name: '皇家進階',
            description: '蟻后等級達到 2',
            icon: '👑',
            condition: (state) => state.queen >= 2,
        },
        
        // 食物相關
        food100: {
            name: '初嘗甜頭',
            description: '累計獲得 100 食物',
            icon: '🍯',
            condition: (state) => state.totalFood >= 100,
        },
        food1000: {
            name: '大豐收',
            description: '累計獲得 1000 食物',
            icon: '🍯',
            condition: (state) => state.totalFood >= 1000,
        },
        food10000: {
            name: '食物帝國',
            description: '累計獲得 10000 食物',
            icon: '🏆',
            condition: (state) => state.totalFood >= 10000,
        },
        
        // 房間相關
        firstUpgrade: {
            name: '建築師',
            description: '升級任意房間',
            icon: '🏠',
            condition: (state) => 
                state.rooms.storage.level >= 1 || 
                state.rooms.nursery.level >= 1 || 
                state.rooms.fungus.level >= 1,
        },
        allRoomsLevel5: {
            name: '全面升級',
            description: '所有房間達到 5 級',
            icon: '🏗️',
            condition: (state) => 
                state.rooms.storage.level >= 5 && 
                state.rooms.nursery.level >= 5 && 
                state.rooms.fungus.level >= 5,
        },
        
        // 時間相關
        playTime10min: {
            name: '初入蟻界',
            description: '遊戲時間達到 10 分鐘',
            icon: '⏰',
            condition: (state) => state.gameTime >= 600,
        },
        playTime1hour: {
            name: '蟻國新手',
            description: '遊戲時間達到 1 小時',
            icon: '⏰',
            condition: (state) => state.gameTime >= 3600,
        },
        
        // 入侵相關（特殊條件，在程式碼中手動觸發）
        firstDefense: {
            name: '首次防禦',
            description: '成功擊退一次入侵',
            icon: '🛡️',
            condition: null,
        },
        defenseMaster: {
            name: '防禦大師',
            description: '成功防禦 10 次入侵',
            icon: '🏅',
            condition: null,
        },
    },

    // 存檔鍵名
    saveKey: 'antidle_save',

    // 通知設定
    notifications: {
        enabled: true,
        duration: 3000, // 通知顯示時間（毫秒）
        maxCount: 5, // 最多顯示幾個通知
    },

    // 調試模式
    debug: false,
};
