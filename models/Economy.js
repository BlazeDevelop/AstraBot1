const mongoose = require('mongoose');

const economySchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 100
    },
    lastRobbery: {
        type: Date,
        default: null
    },
    lastWork: {
        type: Date,
        default: null
    },
    lastDaily: {
        type: Date,
        default: null
    },
    lastWeekly: {
        type: Date,
        default: null
    },
    lastMining: {
        type: Date,
        default: null
    },
    lastChopping: {
        type: Date,
        default: null
    },
    lastDig: {
        type: Date,
        default: null
    },
    lastChest: {
        type: Date,
        default: null
    },
    lastBeg: {
        type: Date,
        default: null
    }
});

const roleShopSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true
    },
    rarity: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    purchaseCount: {
        type: Number,
        default: 0
    }
});

const Economy = mongoose.model('Economy', economySchema);
const RoleShop = mongoose.model('RoleShop', roleShopSchema);

module.exports = { Economy, RoleShop };