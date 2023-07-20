const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
});

const Level = mongoose.model('Level', levelSchema);
module.exports = { Level }