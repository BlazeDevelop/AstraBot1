const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        description: { type: String, default: '' },
    }, ],
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = { Inventory }