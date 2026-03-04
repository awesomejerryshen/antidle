/**
 * AntIdle - 繁體中文語言包
 */

window.translations = window.translations || {};
window.translations['zh-TW'] = {
    // 遊戲標題
    game: {
        title: 'AntIdle',
        subtitle: '螞蟻放置遊戲',
    },

    // 導航
    nav: {
        overview: '總覽',
        colony: '蟻群',
        upgrades: '升級',
        research: '研究',
        rebirth: '重生',
        achievements: '成就',
        settings: '設定',
    },

    // 資源
    resources: {
        food: '食物',
        leaf: '葉子',
        water: '水滴',
        larvae: '幼蟲',
        insect: '昆蟲',
        queen: '蟻后',
        workers: '工蟻',
        soldiers: '兵蟻',
        nurses: '護理蟻',
    },

    // 總覽頁面
    overview: {
        title: '蟻巢總覽',
        collectFood: '收集食物',
        autoProduction: '自動生產',
        perSecond: '/秒',
    },

    // 蟻群頁面
    colony: {
        title: '蟻群管理',
        buyWorker: '購買工蟻',
        buySoldier: '購買兵蟻',
        buyNurse: '購買護理蟻',
        feedQueen: '餵食蟻后',
        totalAnts: '總螞蟻數',
        totalDefense: '總防禦力',
        productionEfficiency: '生產效率',
        antDetails: {
            worker: {
                name: '工蟻',
                description: '自動收集葉子和水滴',
            },
            soldier: {
                name: '兵蟻',
                description: '防禦外來入侵',
            },
            nurse: {
                name: '護理蟻',
                description: '照顧幼蟲和維護蟻后健康',
            },
            queen: {
                name: '蟻后',
                description: '產卵並提供生產加成',
            },
        },
    },

    colonyView: {
        title: '蟻巢可視化',
        capacity: '容量',
        hatchRate: '孵化',
        production: '產出',
        rooms: {
            storage: {
                name: '儲藏室',
            },
            nursery: {
                name: '育兒室',
            },
            fungus: {
                name: '真菌農場',
            },
        },
    },

    // 升級頁面
    upgrades: {
        title: '房間升級',
        rooms: {
            storage: {
                name: '儲藏室',
                description: '增加食物儲存上限',
                upgrade: '升級儲藏室',
            },
            nursery: {
                name: '育兒室',
                description: '加速幼蟲孵化',
                upgrade: '升級育兒室',
            },
            fungus: {
                name: '真菌農場',
                description: '用水滴產出食物',
                upgrade: '升級真菌農場',
            },
        },
        maxLevel: '已滿級',
    },

    // 研究頁面
    research: {
        title: '科學研究系統',
        points: '研究點數',
        totalPoints: '總獲得點數',
        unlocked: '已解鎖研究',
        currentResearch: '當前研究',
        progress: '進度',
        remainingTime: '剩餘時間',
        startResearch: '開始研究',
        cancelResearch: '取消研究',
        researching: '研究中',
        completed: '已完成',
        cannotResearch: '無法研究',
        needPoints: '需要 {points} 點（點數不足）',
        needPrerequisites: '需要前置研究',
        researchTime: '研究時間',
        currentBonuses: '當前研究加成',
        noBonuses: '尚未解鎖任何研究加成',
        categories: {
            production: '生產技術',
            ants: '螞蟻進化',
            rooms: '建築工程',
            defense: '防禦系統',
            automation: '自動化',
            special: '特殊能力',
        },
    },

    // 重生頁面
    rebirth: {
        title: '重生系統',
        points: '重生點數',
        totalPoints: '總獲得點數',
        count: '重生次數',
        preview: '重生預覽',
        canEarn: '本次可獲得',
        willReset: '重生後將重置',
        willKeep: '重生後將保留',
        performRebirth: '執行重生',
        needTime: '需要遊戲時間 {time}',
        permanentUpgrades: '永久升級商店',
        currentBonuses: '當前永久加成',
        tips: '重生提示',
        tip1: '重生會重置遊戲進度，但獲得重生點數',
        tip2: '重生點數用於購買永久升級',
        tip3: '永久升級在所有遊戲中都有效',
        tip4: '建議在遊戲進度停滯時重生',
        tip5: '重生後會獲得初始資源加成（如有購買）',
        upgrade: {
            maxLevel: '已滿級',
            buy: '購買',
            insufficientPoints: '點數不足',
        },
    },

    // 成就頁面
    achievements: {
        title: '成就系統',
        unlocked: '已解鎖',
        completion: '完成度',
        locked: '尚未解鎖',
        progress: '進度',
        noAchievements: '尚未解鎖任何成就，繼續努力！',
    },

    // 設定頁面
    settings: {
        title: '遊戲設定',
        audio: {
            title: '音效設定',
            enabled: '啟用音效',
            masterVolume: '主音量',
            sfxVolume: '音效音量',
            bgmEnabled: '背景音樂',
            bgmVolume: '音樂音量',
        },
        theme: {
            title: '主題設定',
            darkMode: '切換深色模式',
        },
        language: {
            title: '語言設定',
            select: '選擇語言',
        },
        data: {
            title: '數據管理',
            save: '手動儲存',
            reset: '重置遊戲',
            confirmReset: '確定要重置遊戲嗎？所有進度將會丟失！',
        },
        about: {
            title: '關於',
            version: '版本',
            author: '作者',
            github: 'GitHub',
        },
    },

    // 天氣
    weather: {
        clear: '晴朗',
        rain: '雨天',
        sunny: '陽光',
        storm: '暴風',
        incoming: '來臨！持續 {duration} 秒',
    },

    // 事件
    events: {
        invasion: {
            title: '入侵警報',
            description: '外來昆蟲入侵！',
            success: '成功防禦！獲得 {insects} 昆蟲',
            failed: '防禦失敗！損失 {food} 食物',
        },
    },

    // 通知
    notifications: {
        welcome: '歡迎來到 AntIdle！',
        saved: '遊戲已儲存',
        rebirthSuccess: '重生成功！獲得 {points} 重生點數！',
        researchComplete: '研究完成：{name}！',
        researchCanceled: '研究已取消，返還 {points} 點數',
        achievementUnlocked: '🏆 成就解鎖：{name}',
        buySuccess: '購買成功',
        upgradeSuccess: '升級成功',
        notEnoughResources: '資源不足！',
        languageChanged: '語言已切換',
    },

    // 按鈕
    buttons: {
        collect: '收集',
        buy: '購買',
        upgrade: '升級',
        start: '開始',
        cancel: '取消',
        confirm: '確認',
        close: '關閉',
    },

    // 單位
    units: {
        second: '秒',
        minute: '分鐘',
        hour: '小時',
        day: '天',
    },

    // 通用
    common: {
        loading: '載入中...',
        enabled: '已啟用',
        disabled: '已停用',
        on: '開',
        off: '關',
        yes: '是',
        no: '否',
    },
};
