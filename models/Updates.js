const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    additions: { type: String },
    removed: { type: String },
});

module.exports = mongoose.model('Update', updateSchema);