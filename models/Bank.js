const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = { Bank };