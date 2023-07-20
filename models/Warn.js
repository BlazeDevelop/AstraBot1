const mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
    userID: String,
    warns: [{
        reason: String,
        date: Date,
        warner: String
    }]
});
const Warn = mongoose.model('Warn', warnSchema);
module.exports = { Warn }