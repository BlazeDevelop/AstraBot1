const mongoose = require("mongoose");

const SuggestionsSchema = new mongoose.Schema({
    suggestionNum: {
        type: Number,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }
});

const Suggestions = mongoose.model('Suggestions', SuggestionsSchema);
module.exports = { Suggestions }