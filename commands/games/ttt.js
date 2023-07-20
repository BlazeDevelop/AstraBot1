const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en', commandOptionName: 'user' });

module.exports = {
    data: {
        name: "tictactoe",
        description: "Simple game ttt",
        options: [{
            name: 'user',
            description: 'The user to game',
            type: 'USER',
            required: true,
        }]
    },
    execute(interaction) {
        game.handleInteraction(interaction);
    }
}