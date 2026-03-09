/**
 * AntIdle - Colony View Module
 * Renders a tunnel-style colony cross section with room state, upgrade bursts,
 * and decorative ants moving between rooms.
 */

const ColonyView = {
    roomIds: ['storage', 'nursery', 'fungus'],
    antCount: 5,
    previousLevels: {},
    initialized: false,

    update() {
        if (typeof Game === 'undefined' || typeof GameConfig === 'undefined') return;

        if (!this.initialized) {
            this.initialize();
        }

        this.updateRoom('storage', {
            level: Game.state.rooms.storage.level,
            stat: Utils.formatNumber(
                GameConfig.resources.food.baseCapacity +
                (Game.state.rooms.storage.level * GameConfig.rooms.storage.capacityBonus)
            ),
        });

        this.updateRoom('nursery', {
            level: Game.state.rooms.nursery.level,
            stat: (Game.state.rooms.nursery.level * GameConfig.rooms.nursery.hatchSpeedBonus).toFixed(1),
        });

        this.updateRoom('fungus', {
            level: Game.state.rooms.fungus.level,
            stat: (Game.state.rooms.fungus.level * GameConfig.rooms.fungus.productionRate).toFixed(1),
        });
    },

    initialize() {
        this.spawnAnts();
        this.roomIds.forEach((roomId) => {
            this.previousLevels[roomId] = Game.state.rooms[roomId].level;
        });
        this.initialized = true;
    },

    spawnAnts() {
        const container = document.getElementById('colony-ants');
        if (!container || container.children.length > 0) return;

        const lanes = ['storage', 'nursery', 'fungus'];
        for (let i = 0; i < this.antCount; i += 1) {
            const ant = document.createElement('span');
            ant.className = 'colony-ant';
            ant.textContent = '🐜';
            ant.style.setProperty('--ant-duration', `${8 + i * 1.2}s`);
            ant.style.setProperty('--ant-delay', `${i * -1.6}s`);
            ant.style.setProperty('--ant-size', `${0.8 + (i % 3) * 0.08}rem`);
            ant.dataset.lane = lanes[i % lanes.length];
            container.appendChild(ant);
        }
    },

    updateRoom(roomId, data) {
        const card = document.querySelector(`.colony-room-node[data-room="${roomId}"]`);
        const levelEl = document.getElementById(`cv-${roomId}-level`);
        const statEl = document.getElementById(`cv-${roomId}-stat`);

        if (!card || !levelEl || !statEl) return;

        levelEl.textContent = data.level;
        statEl.textContent = data.stat;
        card.style.setProperty('--room-level', data.level);

        if (typeof this.previousLevels[roomId] === 'number' && data.level > this.previousLevels[roomId]) {
            this.triggerUpgradeAnimation(roomId, data.level - this.previousLevels[roomId]);
        }

        this.previousLevels[roomId] = data.level;
    },

    triggerUpgradeAnimation(roomId, delta = 1) {
        const card = document.querySelector(`.colony-room-node[data-room="${roomId}"]`);
        const burst = document.getElementById(`cv-${roomId}-burst`);
        if (!card || !burst) return;

        card.classList.remove('level-up');
        burst.classList.remove('show');
        void card.offsetWidth;
        burst.textContent = `+${delta} Lv`;
        card.classList.add('level-up');
        burst.classList.add('show');

        window.setTimeout(() => {
            card.classList.remove('level-up');
            burst.classList.remove('show');
        }, 1400);
    },
};
