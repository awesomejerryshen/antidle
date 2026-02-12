# AntIdle - 螞蟻放置遊戲

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/yourusername/antidle)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

一個基於瀏覽器的螞蟻放置遊戲，採用純 HTML/CSS/JavaScript 開發，無需後端伺服器。

## 🎮 遊戲特色

- **放置式玩法**：即使離線也能持續獲得資源
- **資源管理**：管理食物、工蟻等資源
- **升級系統**：解鎖並升級各種功能（開發中）
- **成就系統**：挑戰並解鎖成就（開發中）
- **自動存檔**：定期自動儲存遊戲進度
- **響應式設計**：支援桌面和行動裝置

## 🚀 快速開始

### 前置需求

- 現代網頁瀏覽器（Chrome、Firefox、Safari、Edge）

### 安裝

1. 下載或複製專案到本地
```bash
git clone https://github.com/yourusername/antidle.git
cd antidle
```

2. 使用任何網頁伺服器開啟（或直接用瀏覽器開啟 `index.html`）

### 使用 Python 啟動本地伺服器
```bash
# Python 3
python -m http.server 8000

# 然後在瀏覽器開啟: http://localhost:8000
```

### 使用 VS Code Live Server
1. 安裝 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.liveserver) 擴充套件
2. 在 `index.html` 上點擊右鍵 → "Open with Live Server"

## 📁 專案結構

```
antidle/
├── index.html          # 主 HTML 檔案
├── README.md           # 專案說明文件
├── css/                # 樣式檔案
│   ├── variables.css   # CSS 變數定義
│   └── style.css       # 主要樣式表
├── js/                 # JavaScript 檔案
│   ├── config.js       # 遊戲配置
│   ├── utils.js        # 工具函數庫
│   └── game.js         # 遊戲核心邏輯
└── assets/             # 資源檔案
    ├── images/         # 圖片資源
    └── sounds/         # 音效資源
```

## 🎯 遊戲玩法

1. **收集食物**：點擊「收集食物」按鈕獲得食物
2. **招募工蟻**：使用食物招募工蟻（開發中）
3. **升級設施**：使用食物升級各種設施（開發中）
4. **解鎖成就**：達成特定條件解鎖成就（開發中）

## 🛠️ 開發指南

### 核心架構

遊戲採用模組化設計，分為三個主要部分：

#### 1. 配置層 (`config.js`)
- 定義所有遊戲參數
- 方便調整平衡性
- 包含資源、動作、升級等設定

#### 2. 工具層 (`utils.js`)
- 提供通用工具函數
- 格式化、通知、防抖等功能
- 可在遊戲各處重複使用

#### 3. 邏輯層 (`game.js`)
- 管理遊戲狀態
- 處理遊戲循環
- 控制更新和儲存

### 新增功能

#### 新增資源

在 `config.js` 中新增資源定義：

```javascript
resources: {
    newResource: {
        name: '新資源',
        icon: '🌟',
        initial: 0,
        precision: 2,
    },
},
```

#### 新增升級

在 `config.js` 的 `upgrades` 中定義升級：

```javascript
upgrades: {
    upgradeId: {
        name: '升級名稱',
        description: '升級描述',
        cost: 100,
        effect: () => { /* 升級效果 */ },
    },
},
```

#### 新增成就

在 `config.js` 的 `achievements` 中定義成就：

```javascript
achievements: {
    achievementId: {
        name: '成就名稱',
        description: '成就描述',
        condition: () => { /* 解鎖條件 */ },
    },
},
```

### 儲存系統

遊戲使用 `localStorage` 儲存進度，包含：
- 遊戲狀態（資源、升級等）
- 遊戲配置（自動儲存設定等）
- 版本資訊

存檔位置：`localStorage.getItem('antidle_save')`

### 調試模式

啟用調試模式以查看詳細日誌：

```javascript
// 在 config.js 中設定
debug: true,
```

## 🎨 自訂樣式

所有顏色、間距、字型等都在 `css/variables.css` 中定義，可以輕鬆自訂：

```css
:root {
    --color-primary: #8B4513;  /* 主色調 */
    --color-bg: #F5F5DC;       /* 背景色 */
    /* 更多變數... */
}
```

## 📝 待辦清單

- [ ] 工蟻招募系統
- [ ] 升級商店
- [ ] 成就系統
- [ ] 裝飾系統
- [ ] 特殊事件
- [ ] 音效
- [ ] 多語言支援

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 📮 聯絡方式

- 作者：Your Name
- Email：your.email@example.com
- GitHub：https://github.com/yourusername/antidle

## 🙏 致謝

感謝所有貢獻者和玩家的支持！

---

**享受遊戲！🐜**

