const mongoose = require('mongoose');

const vipSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    isVip: {
        type: Boolean,
        default: false,
    },
    lastReward: {
        type: Date,
        default: null
    },
    vipExpiration: {
        type: Date,
        default: null,
    },
});

const Vip = mongoose.model('Vip', vipSchema);

module.exports = { Vip };