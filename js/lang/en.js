/**
 * AntIdle - English Language Pack
 */

window.translations = window.translations || {};
window.translations['en'] = {
    // Game Title
    game: {
        title: 'AntIdle',
        subtitle: 'Ant Idle Game',
    },

    // Navigation
    nav: {
        overview: 'Overview',
        colony: 'Colony',
        upgrades: 'Upgrades',
        research: 'Research',
        rebirth: 'Rebirth',
        achievements: 'Achievements',
        settings: 'Settings',
    },

    // Resources
    resources: {
        food: 'Food',
        leaf: 'Leaves',
        water: 'Water',
        larvae: 'Larvae',
        insect: 'Insects',
        queen: 'Queen',
        workers: 'Workers',
        soldiers: 'Soldiers',
        nurses: 'Nurses',
    },

    // Overview Page
    overview: {
        title: 'Colony Overview',
        collectFood: 'Collect Food',
        autoProduction: 'Auto Production',
        perSecond: '/sec',
    },

    // Colony Page
    colony: {
        title: 'Colony Management',
        buyWorker: 'Buy Worker',
        buySoldier: 'Buy Soldier',
        buyNurse: 'Buy Nurse',
        feedQueen: 'Feed Queen',
        totalAnts: 'Total Ants',
        totalDefense: 'Total Defense',
        productionEfficiency: 'Production Efficiency',
        antDetails: {
            worker: {
                name: 'Worker',
                description: 'Automatically collects leaves and water',
            },
            soldier: {
                name: 'Soldier',
                description: 'Defends against invasions',
            },
            nurse: {
                name: 'Nurse',
                description: 'Cares for larvae and maintains queen health',
            },
            queen: {
                name: 'Queen',
                description: 'Lays eggs and provides production bonus',
            },
        },
    },

    // Upgrades Page
    upgrades: {
        title: 'Room Upgrades',
        rooms: {
            storage: {
                name: 'Storage Room',
                description: 'Increases food storage capacity',
                upgrade: 'Upgrade Storage',
            },
            nursery: {
                name: 'Nursery',
                description: 'Accelerates larva hatching',
                upgrade: 'Upgrade Nursery',
            },
            fungus: {
                name: 'Fungus Farm',
                description: 'Produces food using water',
                upgrade: 'Upgrade Fungus Farm',
            },
        },
        maxLevel: 'Max Level',
    },

    // Research Page
    research: {
        title: 'Scientific Research System',
        points: 'Research Points',
        totalPoints: 'Total Points Earned',
        unlocked: 'Research Unlocked',
        currentResearch: 'Current Research',
        progress: 'Progress',
        remainingTime: 'Time Remaining',
        startResearch: 'Start Research',
        cancelResearch: 'Cancel Research',
        researching: 'Researching',
        completed: 'Completed',
        cannotResearch: 'Cannot Research',
        needPoints: 'Need {points} points (insufficient)',
        needPrerequisites: 'Requires prerequisites',
        researchTime: 'Research Time',
        currentBonuses: 'Current Research Bonuses',
        noBonuses: 'No research bonuses unlocked yet',
        categories: {
            production: 'Production Technology',
            ants: 'Ant Evolution',
            rooms: 'Construction',
            defense: 'Defense Systems',
            automation: 'Automation',
            special: 'Special Abilities',
        },
    },

    // Rebirth Page
    rebirth: {
        title: 'Rebirth System',
        points: 'Rebirth Points',
        totalPoints: 'Total Points Earned',
        count: 'Rebirth Count',
        preview: 'Rebirth Preview',
        canEarn: 'You will earn',
        willReset: 'Will reset upon rebirth',
        willKeep: 'Will keep upon rebirth',
        performRebirth: 'Perform Rebirth',
        needTime: 'Requires {time} game time',
        permanentUpgrades: 'Permanent Upgrades Shop',
        currentBonuses: 'Current Permanent Bonuses',
        tips: 'Rebirth Tips',
        tip1: 'Rebirth resets game progress but earns rebirth points',
        tip2: 'Use rebirth points to buy permanent upgrades',
        tip3: 'Permanent upgrades are effective in all games',
        tip4: 'Rebirth recommended when progress stalls',
        tip5: 'Starting resource bonus applied after rebirth (if purchased)',
        upgrade: {
            maxLevel: 'Max Level',
            buy: 'Buy',
            insufficientPoints: 'Insufficient Points',
        },
    },

    // Achievements Page
    achievements: {
        title: 'Achievement System',
        unlocked: 'Unlocked',
        completion: 'Completion',
        locked: 'Locked',
        progress: 'Progress',
        noAchievements: 'No achievements unlocked yet. Keep playing!',
    },

    // Settings Page
    settings: {
        title: 'Game Settings',
        audio: {
            title: 'Audio Settings',
            enabled: 'Enable Audio',
            masterVolume: 'Master Volume',
            sfxVolume: 'SFX Volume',
        },
        theme: {
            title: 'Theme Settings',
            darkMode: 'Toggle Dark Mode',
        },
        language: {
            title: 'Language Settings',
            select: 'Select Language',
        },
        data: {
            title: 'Data Management',
            save: 'Manual Save',
            reset: 'Reset Game',
            confirmReset: 'Are you sure you want to reset? All progress will be lost!',
        },
        about: {
            title: 'About',
            version: 'Version',
            author: 'Author',
            github: 'GitHub',
        },
    },

    // Weather
    weather: {
        clear: 'Clear',
        rain: 'Rain',
        sunny: 'Sunny',
        storm: 'Storm',
        incoming: 'incoming! Duration: {duration} seconds',
    },

    // Events
    events: {
        invasion: {
            title: 'Invasion Alert',
            description: 'Foreign insects invading!',
            success: 'Defense successful! Gained {insects} insects',
            failed: 'Defense failed! Lost {food} food',
        },
    },

    // Notifications
    notifications: {
        welcome: 'Welcome to AntIdle!',
        saved: 'Game saved',
        rebirthSuccess: 'Rebirth successful! Earned {points} rebirth points!',
        researchComplete: 'Research complete: {name}!',
        researchCanceled: 'Research canceled, refunded {points} points',
        achievementUnlocked: '🏆 Achievement unlocked: {name}',
        buySuccess: 'Purchase successful',
        upgradeSuccess: 'Upgrade successful',
        notEnoughResources: 'Not enough resources!',
        languageChanged: 'Language changed',
    },

    // Buttons
    buttons: {
        collect: 'Collect',
        buy: 'Buy',
        upgrade: 'Upgrade',
        start: 'Start',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
    },

    // Units
    units: {
        second: 'second',
        minute: 'minute',
        hour: 'hour',
        day: 'day',
    },

    // Common
    common: {
        loading: 'Loading...',
        enabled: 'Enabled',
        disabled: 'Disabled',
        on: 'On',
        off: 'Off',
        yes: 'Yes',
        no: 'No',
    },
};
