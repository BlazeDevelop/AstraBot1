const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: '2048',
    description: 'Play the 2048 game!'
  },
  async execute(interaction) {
    // Function to generate a new game board
    const generateBoard = () => {
      const board = [];
      for (let i = 0; i < 4; i++) {
        board.push([0, 0, 0, 0]);
      }
      return board;
    };

    // Function to display the game board
    const displayBoard = (board) => {
      const embed = new MessageEmbed()
        .setTitle('2048 Game')
        .setDescription('Use the reactions to play the game!')
        .setColor('#00ff00');

      for (let row of board) {
        embed.addField('\u200b', row.join(' | '));
      }

      return embed;
    };

    // Function to check if the game is over
    const isGameOver = (board) => {
      // Check if there are any empty tiles
      for (let row of board) {
        if (row.includes(0)) {
          return false;
        }
      }

      // Check if there are any adjacent tiles with the same value
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === board[i][j + 1] || board[i][j] === board[i + 1]?.[j]) {
            return false;
          }
        }
      }

      return true;
    };

    // Function to add a new tile to the board
    const addNewTile = (board) => {
      const emptyTiles = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board[i][j] === 0) {
            emptyTiles.push({ row: i, col: j });
          }
        }
      }

      if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
      }
    };

    // Create a new game board
    const board = generateBoard();

    // Add initial tiles
    addNewTile(board);
    addNewTile(board);

    // Display the initial game board
    const boardMessage = await interaction.reply({ embeds: [displayBoard(board)] });

    // Add reactions for player interaction
    await boardMessage.react('⬆️');
    await boardMessage.react('⬇️');
    await boardMessage.react('⬅️');
    await boardMessage.react('➡️');

    // Set up reaction collector
    const filter = (reaction, user) => user.id === interaction.user.id && !user.bot;
    const collector = boardMessage.createReactionCollector({ filter, time: 60000 });

    collector.on('collect', (reaction) => {
      const userMove = reaction.emoji.name;

      // Process user move and update the game board
      let moved = false;

      if (userMove === '⬆️') {
        moved = moveTilesUp(board);
      } else if (userMove === '⬇️') {
        moved = moveTilesDown(board);
      } else if (userMove === '⬅️') {
        moved = moveTilesLeft(board);
      } else if (userMove === '➡️') {
        moved = moveTilesRight(board);
      }

      // Check if the game is over
      if (isGameOver(board)) {
        collector.stop('game_over');
      }

      // Update the game board and display it
      boardMessage.edit({ embeds: [displayBoard(board)] });

      // If a move was made, add a new tile to the board
      if (moved) {
        addNewTile(board);
        boardMessage.edit({ embeds: [displayBoard(board)] });

        // Check if the game is over after adding a new tile
        if (isGameOver(board)) {
          collector.stop('game_over');
        }
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'game_over') {
        interaction.followUp('Game over! Thanks for playing!');
      } else {
        interaction.followUp('Game session expired. Use the command again to start a new game.');
      }
    });

    // Function to move tiles up
    function moveTilesUp(board) {
      let moved = false;
      for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
          if (board[i][j] !== 0) {
            let k = i - 1;
            while (k >= 0 && board[k][j] === 0) {
              board[k][j] = board[k + 1][j];
              board[k + 1][j] = 0;
              k--;
              moved = true;
            }
            if (k >= 0 && board[k][j] === board[k + 1][j]) {
              board[k][j] *= 2;
              board[k + 1][j] = 0;
              moved = true;
            }
          }
        }
      }
      return moved;
    }

    // Function to move tiles down
    function moveTilesDown(board) {
      let moved = false;
      for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
          if (board[i][j] !== 0) {
            let k = i + 1;
            while (k < 4 && board[k][j] === 0) {
              board[k][j] = board[k - 1][j];
              board[k - 1][j] = 0;
              k++;
              moved = true;
            }
            if (k < 4 && board[k][j] === board[k - 1][j]) {
              board[k][j] *= 2;
              board[k - 1][j] = 0;
              moved = true;
            }
          }
        }
      }
      return moved;
    }

    // Function to move tiles left
    function moveTilesLeft(board) {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
          if (board[i][j] !== 0) {
            let k = j - 1;
            while (k >= 0 && board[i][k] === 0) {
              board[i][k] = board[i][k + 1];
              board[i][k + 1] = 0;
              k--;
              moved = true;
            }
            if (k >= 0 && board[i][k] === board[i][k + 1]) {
              board[i][k] *= 2;
              board[i][k + 1] = 0;
              moved = true;
            }
          }
        }
      }
      return moved;
    }

    // Function to move tiles right
    function moveTilesRight(board) {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
          if (board[i][j] !== 0) {
            let k = j + 1;
            while (k < 4 && board[i][k] === 0) {
              board[i][k] = board[i][k - 1];
              board[i][k - 1] = 0;
              k++;
              moved = true;
            }
            if (k < 4 && board[i][k] === board[i][k - 1]) {
              board[i][k] *= 2;
              board[i][k - 1] = 0;
              moved = true;
            }
          }
        }
      }
      return moved;
    }
  },
};