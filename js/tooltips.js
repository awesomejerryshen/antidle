/**
 * AntIdle - 工具提示系統
 * 處理 hover 顯示詳細說明
 */

const Tooltips = {
    // 工具提示元素
    tooltipElement: null,

    // 當前顯示的目標
    currentTarget: null,

    // 工具提示數據
    tooltipData: {
        // 資源
        queen: {
            title: '👑 蟻后',
            description: '蟻群的核心，負責產卵並提高所有螞蟻的生產效率。',
            stats: ['持續產生幼蟲', '健康值影響產卵速度', '需要護理蟻維護健康']
        },
        food: {
            title: '🍯 食物',
            description: '螞蟻的主要資源，用於購買螞蟻和升級設施。',
            stats: ['由工蟻轉換葉子而來', '儲存上限受儲藏室等級影響', '真菌農場可產出高級食物']
        },
        leaf: {
            title: '🍃 葉子',
            description: '基礎資源，點擊收集後由工蟻轉換為食物。',
            stats: ['點擊「收集葉子」獲得', '工蟻自動轉換為食物', '受天氣影響產量']
        },
        workers: {
            title: '🐜 工蟻',
            description: '勤勞的工作者，自動收集葉子並轉換為食物。',
            stats: ['價格隨數量增加', '自動收集葉子', '自動轉換葉子為食物']
        },
        soldiers: {
            title: '⚔️ 兵蟻',
            description: '勇敢的戰士，保護蟻群免受外來昆蟻入侵。',
            stats: ['用幼蟲孵化', '提供防禦力', '防禦成功可獲得獎勵']
        },
        nurses: {
            title: '👶 護理蟻',
            description: '細心的照護者，照顧幼蟲並維護蟻后健康。',
            stats: ['提高幼蟲產生速率', '維護蟻后健康值', '增強整體生產效率']
        },
        larvae: {
            title: '🥚 幼蟲',
            description: '未來的螞蟻，可用於孵化兵蟻。',
            stats: ['由蟻后產生', '護理蟻加速產生', '用於孵化兵蟻']
        },
        water: {
            title: '💧 水滴',
            description: '生命之源，用於真菌農場種植。',
            stats: ['雨天獲得加成', '真菌農場消耗', '產出高級食物']
        },
        insect: {
            title: '🍪 昆蟲',
            description: '外來昆蟲，可能是入侵者或食物來源。',
            stats: ['入侵事件出現', '擊敗獲得獎勵', '需要兵蟻防禦']
        },

        // 房間
        storage: {
            title: '🏠 儲藏室',
            description: '擴大食物儲存空間，讓你能儲備更多資源。',
            stats: ['每級 +50 食物上限', '最高 10 級', '價格逐級增加']
        },
        nursery: {
            title: '🥚 育兒室',
            description: '改善幼蟲孵化環境，提高整體幼蟲產生速率。',
            stats: ['每級 +0.2 幼蟲/秒', '最高 10 級', '加速蟻群成長']
        },
        fungus: {
            title: '🍄 真菌農場',
            description: '用水滴種植真菌，產出高級食物。',
            stats: ['每級 +0.5 食物/秒', '消耗水滴', '穩定的食物來源']
        },

        // 天氣
        weather: {
            title: '🌤️ 天氣系統',
            description: '動態天氣會影響資源生產。',
            stats: ['🌧️ 雨：水滴↑ 葉子↓', '☀️ 陽光：葉子↑ 食物消耗↑', '🌪️ 暴風：資源損失風險']
        },

        // 成就
        achievements: {
            title: '🏆 成就系統',
            description: '完成各種挑戰獲得成就徽章。',
            stats: ['21 個成就待解鎖', '涵蓋所有遊戲內容', '追蹤你的進度']
        }
    },

    /**
     * 初始化工具提示系統
     */
    init() {
        this.createTooltipElement();
        this.bindEvents();
        Utils.log('工具提示系統已啟動');
    },

    /**
     * 創建工具提示 DOM 元素
     */
    createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tooltip';
        this.tooltipElement.style.display = 'none';
        document.body.appendChild(this.tooltipElement);
    },

    /**
     * 綁定事件
     */
    bindEvents() {
        // 為所有帶有 data-tooltip 的元素綁定事件
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.show(target);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hide();
            }
        });

        // 移動端支持 - 點擊顯示
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                if (this.currentTarget === target) {
                    this.hide();
                } else {
                    this.show(target);
                }
            } else if (this.tooltipElement.style.display !== 'none') {
                // 點擊其他地方隱藏
                this.hide();
            }
        });
    },

    /**
     * 顯示工具提示
     * @param {Element} target - 目標元素
     */
    show(target) {
        const key = target.dataset.tooltip;
        const data = this.tooltipData[key];

        if (!data) {
            console.warn(`未找到工具提示數據: ${key}`);
            return;
        }

        this.currentTarget = target;

        // 構建工具提示內容
        let html = `<div class="tooltip-title">${data.title}</div>`;
        html += `<div class="tooltip-description">${data.description}</div>`;

        if (data.stats && data.stats.length > 0) {
            html += '<div class="tooltip-stats">';
            data.stats.forEach(stat => {
                html += `<div>• ${stat}</div>`;
            });
            html += '</div>';
        }

        this.tooltipElement.innerHTML = html;
        this.tooltipElement.style.display = 'block';

        // 計算位置
        requestAnimationFrame(() => {
            this.position(target);
            this.tooltipElement.classList.add('visible');
        });
    },

    /**
     * 隱藏工具提示
     */
    hide() {
        this.tooltipElement.classList.remove('visible');
        setTimeout(() => {
            if (!this.tooltipElement.classList.contains('visible')) {
                this.tooltipElement.style.display = 'none';
            }
        }, 200);
        this.currentTarget = null;
    },

    /**
     * 計算並設置工具提示位置
     * @param {Element} target - 目標元素
     */
    position(target) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();

        let top = rect.top - tooltipRect.height - 10;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // 防止超出視窗
        if (top < 10) {
            top = rect.bottom + 10;
        }

        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
    },

    /**
     * 為元素添加工具提示
     * @param {string} selector - CSS 選擇器
     * @param {string} key - 工具提示 key
     */
    addToElements(selector, key) {
        document.querySelectorAll(selector).forEach(el => {
            el.dataset.tooltip = key;
        });
    }
};

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    Tooltips.init();

    // 自動為資源卡片添加工具提示
    Tooltips.addToElements('[id="queen"]', 'queen');
    Tooltips.addToElements('[id="food"]', 'food');
    Tooltips.addToElements('[id="leaf"]', 'leaf');
    Tooltips.addToElements('[id="workers"]', 'workers');
    Tooltips.addToElements('[id="soldiers"]', 'soldiers');
    Tooltips.addToElements('[id="nurses"]', 'nurses');
    Tooltips.addToElements('[id="larvae"]', 'larvae');
    Tooltips.addToElements('[id="water"]', 'water');
    Tooltips.addToElements('[id="insect"]', 'insect');

    // 為資源容器添加工具提示
    document.querySelectorAll('.resource').forEach(el => {
        const valueEl = el.querySelector('.resource-value');
        if (valueEl && valueEl.id) {
            el.dataset.tooltip = valueEl.id;
        }
    });
});
