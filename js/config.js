/**
 * AntIdle - 遊戲配置檔
 * 集中管理所有可調整的遊戲參數
 */

const GameConfig = {
    // 遊戲基本設定
    game: {
        name: 'AntIdle',
        version: '0.8.0',
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
        collectRate: 0.5, // 每隻工蟻每秒收集葉子數量
        conversionRate: 0.5, // 每隻工蟻每秒轉換葉子為食物數量
        waterProduction: 0.02, // 每隻工蟻每秒產生水滴數量（平衡優化）
        bulkBuyAmount: 10, // 批量購買數量
    },

    // 兵蟻購買設定
    soldiers: {
        basePrice: 10, // 基礎價格（幼蟲）
        priceMultiplier: 1.25, // 每次購買價格增長倍數（平衡優化：1.3 → 1.25）
        defensePower: 1, // 每隻兵蟻的防禦力
    },

    // 護理蟻購買設定
    nurses: {
        basePrice: 15, // 基礎價格（食物）
        priceMultiplier: 1.35, // 每次購買價格增長倍數（平衡優化：1.4 → 1.35）
        careEfficiency: 0.08, // 每隻護理蟻提高幼蟲產生速度（平衡優化：0.1 → 0.08）
    },

    // 蟻后設定
    queen: {
        eggProductionRate: 0.08, // 每秒產生幼蟲數量（平衡優化：0.1 → 0.08）
        productionMultiplier: 0.05, // 每隻蟻后提高所有生產效率（百分比）
        maxHealth: 100, // 最大健康值
        healthDecay: 0.05, // 每秒健康值下降
        nurseHealRate: 0.2, // 每隻護理蟻每秒恢復的健康值
        larvaeFeedAmount: 5, // 餵食幼蟲數量
        larvaeFeedHeal: 10, // 餵食恢復的健康值
    },

    // 入侵事件設定
    invasion: {
        baseChance: 0.03, // 基礎入侵機率（每秒）
        baseDamage: 5, // 入侵成功造成的基礎傷害（食物）
        baseReward: {food: 15, leaf: 5}, // 防禦成功獲得的基礎獎勵（食物、葉子）
        cooldown: 300, // 入侵冷卻時間（秒）
    },

    // 天氣系統設定
    weather: {
        minInterval: 60, // 最小觸發間隔（秒）
        maxInterval: 120, // 最大觸發間隔（秒）
        minDuration: 30, // 最小持續時間（秒）
        maxDuration: 60, // 最大持續時間（秒）
        types: {
            clear: {
                name: '晴朗',
                icon: '🌤️',
                effects: {
                    leafMultiplier: 1.0,
                    waterMultiplier: 1.0,
                    foodMultiplier: 1.0,
                    consumptionMultiplier: 1.0,
                },
            },
            rain: {
                name: '雨',
                icon: '🌧️',
                effects: {
                    leafMultiplier: 0.7, // 葉子 -30%
                    waterMultiplier: 1.5, // 水滴 +50%
                    foodMultiplier: 1.0,
                    consumptionMultiplier: 1.0,
                },
            },
            sunny: {
                name: '陽光',
                icon: '☀️',
                effects: {
                    leafMultiplier: 1.5, // 葉子 +50%
                    waterMultiplier: 0.8, // 水滴 -20%
                    foodMultiplier: 1.0,
                    consumptionMultiplier: 1.2, // 食物消耗 +20%
                },
            },
            storm: {
                name: '暴風',
                icon: '🌪️',
                effects: {
                    leafMultiplier: 0.5, // 葉子 -50%
                    waterMultiplier: 0.8, // 水滴 -20%
                    foodMultiplier: 1.0,
                    consumptionMultiplier: 1.0,
                    lossChance: 0.05, // 5% 機率損失資源
                    lossPercent: 0.1, // 損失 10% 資源
                },
            },
        },
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
            productionRate: 0.6, // 每級產出高級食物（平衡優化：0.5 → 0.6）
            waterConsumption: 0.08, // 每級消耗水滴（平衡優化：0.1 → 0.08）
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

    // 科學研究系統
    researchTree: {
        // === 生產技術類 ===
        advancedFarming: {
            name: '高級農業',
            description: '所有食物生產 +20%',
            category: 'production',
            cost: 50,
            time: 60, // 研究時間（秒）
            icon: '🌾',
            bonuses: { allProductionBonus: 20 },
            requires: null,
        },
        leafProcessing: {
            name: '葉子處理技術',
            description: '葉子收集效率 +30%',
            category: 'production',
            cost: 80,
            time: 90,
            icon: '🍃',
            bonuses: { leafBonus: 30 },
            requires: { advancedFarming: true },
        },
        waterConservation: {
            name: '水源保護',
            description: '水滴產生 +25%',
            category: 'production',
            cost: 100,
            time: 120,
            icon: '💧',
            bonuses: { waterBonus: 25 },
            requires: { advancedFarming: true },
        },
        breedingTech: {
            name: '育種技術',
            description: '幼蟲生長 +35%',
            category: 'production',
            cost: 150,
            time: 150,
            icon: '🐛',
            bonuses: { larvaeBonus: 35 },
            requires: { leafProcessing: true, waterConservation: true },
        },

        // === 螞蟻進化類 ===
        workerEfficiency: {
            name: '工蟻效率訓練',
            description: '工蟻工作效率 +40%',
            category: 'ants',
            cost: 100,
            time: 100,
            icon: '👷',
            bonuses: { workerEfficiency: 40 },
            requires: null,
        },
        soldierStrength: {
            name: '兵蟻力量強化',
            description: '兵蟻戰鬥力 +50%',
            category: 'ants',
            cost: 120,
            time: 120,
            icon: '⚔️',
            bonuses: { soldierPower: 50 },
            requires: { workerEfficiency: true },
        },
        nurseCare: {
            name: '護理蟻專業訓練',
            description: '護理蟻效率 +45%',
            category: 'ants',
            cost: 130,
            time: 130,
            icon: '👩‍⚕️',
            bonuses: { nurseEfficiency: 45 },
            requires: { workerEfficiency: true },
        },
        queenEnhancement: {
            name: '蟻后基因強化',
            description: '蟻后產卵率 +60%',
            category: 'ants',
            cost: 200,
            time: 180,
            icon: '👑',
            bonuses: { queenEggRate: 60 },
            requires: { soldierStrength: true, nurseCare: true },
        },

        // === 建築工程類 ===
        roomOptimization: {
            name: '房間優化設計',
            description: '所有房間效率 +30%',
            category: 'rooms',
            cost: 90,
            time: 90,
            icon: '🏠',
            bonuses: { roomEfficiency: 30 },
            requires: null,
        },
        storageUpgrade: {
            name: '儲存空間升級',
            description: '食物儲存效率 +40%',
            category: 'rooms',
            cost: 110,
            time: 110,
            icon: '📦',
            bonuses: { storageEfficiency: 40 },
            requires: { roomOptimization: true },
        },
        nurseryExpansion: {
            name: '育兒室擴建',
            description: '幼蟲孵化速度 +50%',
            category: 'rooms',
            cost: 140,
            time: 140,
            icon: '🐣',
            bonuses: { larvaeBonus: 50 },
            requires: { roomOptimization: true },
        },
        advancedRooms: {
            name: '高級房間技術',
            description: '所有房間效果 +70%',
            category: 'rooms',
            cost: 220,
            time: 200,
            icon: '🏛️',
            bonuses: { roomEfficiency: 70 },
            requires: { storageUpgrade: true, nurseryExpansion: true },
        },

        // === 防禦系統類 ===
        defenseTraining: {
            name: '防禦訓練',
            description: '入侵防禦能力 +30%',
            category: 'defense',
            cost: 80,
            time: 80,
            icon: '🛡️',
            bonuses: { invasionDefense: 30 },
            requires: null,
        },
        weatherShielding: {
            name: '天氣防護',
            description: '減少天氣負面影響 40%',
            category: 'defense',
            cost: 120,
            time: 120,
            icon: '🌤️',
            bonuses: { weatherResistance: 40 },
            requires: { defenseTraining: true },
        },
        alertSystem: {
            name: '警報系統',
            description: '入侵防禦 +60%，天氣抗性 +50%',
            category: 'defense',
            cost: 180,
            time: 160,
            icon: '🚨',
            bonuses: { invasionDefense: 60, weatherResistance: 50 },
            requires: { defenseTraining: true },
        },
        fortress: {
            name: '堡壘建設',
            description: '防禦能力 +100%',
            category: 'defense',
            cost: 250,
            time: 220,
            icon: '🏰',
            bonuses: { invasionDefense: 100, weatherResistance: 80 },
            requires: { alertSystem: true },
        },

        // === 自動化類 ===
        autoCollect: {
            name: '自動收集系統',
            description: '自動收集資源（無需點擊）',
            category: 'automation',
            cost: 200,
            time: 180,
            icon: '🤖',
            bonuses: { autoCollectEnabled: true },
            requires: { workerEfficiency: true, roomOptimization: true },
        },
        autoFeeding: {
            name: '自動餵食系統',
            description: '自動餵食蟻后',
            category: 'automation',
            cost: 180,
            time: 160,
            icon: '🍽️',
            bonuses: { autoFeedEnabled: true },
            requires: { nurseCare: true, roomOptimization: true },
        },
        efficiencyBoost: {
            name: '效率全面提升',
            description: '所有生產 +50%',
            category: 'automation',
            cost: 280,
            time: 240,
            icon: '⚡',
            bonuses: { allProductionBonus: 50 },
            requires: { autoCollect: true, autoFeeding: true },
        },

        // === 特殊能力類 ===
        criticalHits: {
            name: '暴擊能力',
            description: '10% 機率獲得雙倍資源',
            category: 'special',
            cost: 150,
            time: 140,
            icon: '💥',
            bonuses: { criticalHitChance: 10 },
            requires: { soldierStrength: true },
        },
        megaCrit: {
            name: '超級暴擊',
            description: '暴擊機率提升至 25%',
            category: 'special',
            cost: 250,
            time: 200,
            icon: '🔥',
            bonuses: { criticalHitChance: 15 }, // 額外 +15%
            requires: { criticalHits: true },
        },
        ultimateSynergy: {
            name: '終極協同效應',
            description: '所有加成再提升 +100%',
            category: 'special',
            cost: 500,
            time: 300,
            icon: '🌟',
            bonuses: { allProductionBonus: 100 },
            requires: { 
                queenEnhancement: true, 
                advancedRooms: true, 
                fortress: true,
                efficiencyBoost: true 
            },
        },
    },

    // 重生系統升級
    rebirthUpgrades: {
        // 生產效率類
        productionBoost1: {
            name: '生產加速 I',
            description: '所有生產效率 +10%',
            type: 'productionMultiplier',
            effect: 0.1, // 10%
            baseCost: 10,
            costMultiplier: 1.5,
            maxLevel: 10,
            icon: '⚡',
        },
        productionBoost2: {
            name: '生產加速 II',
            description: '所有生產效率 +25%（需要生產加速 I 等級 5）',
            type: 'productionMultiplier',
            effect: 0.25, // 25%
            baseCost: 50,
            costMultiplier: 2.0,
            maxLevel: 5,
            icon: '⚡',
            requires: { productionBoost1: 5 },
        },

        // 價格折扣類
        priceDiscount1: {
            name: '交易優惠 I',
            description: '所有購買價格 -5%',
            type: 'priceDiscount',
            effect: 5, // 5%
            baseCost: 15,
            costMultiplier: 1.6,
            maxLevel: 10,
            icon: '💰',
        },
        priceDiscount2: {
            name: '交易優惠 II',
            description: '所有購買價格 -10%（需要交易優惠 I 等級 5）',
            type: 'priceDiscount',
            effect: 10, // 10%
            baseCost: 75,
            costMultiplier: 2.0,
            maxLevel: 5,
            icon: '💰',
            requires: { priceDiscount1: 5 },
        },

        // 容量加成類
        capacityBoost: {
            name: '擴充倉庫',
            description: '食物儲存上限 +50',
            type: 'capacityBonus',
            effect: 50,
            baseCost: 20,
            costMultiplier: 1.4,
            maxLevel: 20,
            icon: '📦',
        },

        // 蟻后健康類
        queenHealth: {
            name: '蟻后強化',
            description: '蟻后最大健康值 +20',
            type: 'queenHealthBonus',
            effect: 20,
            baseCost: 30,
            costMultiplier: 1.5,
            maxLevel: 10,
            icon: '👑',
        },

        // 初始資源類
        startingBonus: {
            name: '起始資源',
            description: '重生後獲得額外初始資源',
            type: 'startingResources',
            effect: 1, // 等級 1 = +10 食物、+5 葉子、+2 幼蟲
            baseCost: 25,
            costMultiplier: 1.8,
            maxLevel: 10,
            icon: '🎁',
        },
    },

    // 通知設定
    notifications: {
        enabled: true,
        duration: 3000, // 通知顯示時間（毫秒）
        maxCount: 5, // 最多顯示幾個通知
    },

    // 調試模式
    debug: false,
};
