/**
 * AntIdle - 遊戲配置檔
 * 集中管理所有可調整的遊戲參數
 */

const GameConfig = {
    // 遊戲基本設定
    game: {
        name: 'AntIdle',
        version: '0.1.0',
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
            precision: 0, // 小數點位數
        },
        workers: {
            name: '工蟻',
            icon: '🐜',
            initial: 5,
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
            baseAmount: 1, // 每次點擊獲得的葉子
            baseCooldown: 0, // 冷卻時間（毫秒）
        },
    },

    // 工蟻購買設定
    workers: {
        basePrice: 10, // 基礎價格（食物）
        priceMultiplier: 1.2, // 每次購買價格增長倍數
        efficiency: 1, // 每隻工蟻每秒轉換的葉子數量
    },

    // 升級系統（預留）
    upgrades: {
        // 升級將在此定義
    },

    // 成就系統（預留）
    achievements: {
        // 成就將在此定義
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
