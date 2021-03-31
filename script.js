import Game from "./engine/game.js";



const loadGameIntoContainer = function(game) {
    var board = game.board;

    return `
    <div class="row">${board[0]} ${board[1]} ${board[2]} ${board[3]}</div><br>
    <div class="row">${board[4]} ${board[5]} ${board[6]} ${board[7]}</div><br>
    <div class="row">${board[8]} ${board[9]} ${board[10]} ${board[11]}</div><br>
    <div class="row">${board[12]} ${board[13]} ${board[14]} ${board[15]}</div>
    `;
}

const loadStatsIntoDom = function(game) {
    const stats = game.getGameState();

    return `<div class="stats">
    <p><strong>Score: ${stats.score}</strong></p>
    </div>`
}

const loadWinIntoDom = function(gameState) {
    return `<div class="stats">
    <h1>A WINNER IS YOU!</h1>
    <p><strong>Score: ${gameState.score}</strong></p>
    </div>`
}
const loadLossIntoDom = function(gameState) {
    return `<div class="stats">
    <h1>A LOSER IS YOU!</h1>
    <p><strong>Score: ${gameState.score}</strong></p>
    </div>`
}

const loadIntoDom = function(game) {
    const $root = $('.root');
    const $container = $('.container');
    var board = loadGameIntoContainer(game);
    $container.append(board);
    var stats = loadStatsIntoDom(game);
    $root.append(stats);
    $('.restart').on("click", function() {
        game.setupNewGame();
        board = loadGameIntoContainer(game);
        $container.empty();
        $container.append(board);
        $('.stats').remove();
        stats = loadStatsIntoDom(game);
        $root.append(stats);
    });

    game.onWin(gameState => {
        board = loadWinIntoDom(gameState);
        $container.empty();
        $container.append(board);
    });

    game.onLose(gameState => {
        board = loadLossIntoDom(gameState);
        $container.empty();
        $container.append(board);
    });

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        switch(key) {
            case "ArrowLeft": 
                game.move('left');
                $container.empty();
                board = loadGameIntoContainer(game);
                $container.append(board);
                $('.stats').remove();
                stats = loadStatsIntoDom(game);
                $root.append(stats);
            break;

            case "ArrowRight":
                game.move('right');
                $container.empty();
                board = loadGameIntoContainer(game);
                $container.append(board);
                $('.stats').remove();
                stats = loadStatsIntoDom(game);
                $root.append(stats);
            break;

            case "ArrowUp":
                game.move('up');
                $container.empty();
                board = loadGameIntoContainer(game);
                $container.append(board);
                $('.stats').remove();
                stats = loadStatsIntoDom(game);
                $root.append(stats);
            break;

            case "ArrowDown":
                game.move('down');
                $container.empty();
                board = loadGameIntoContainer(game);
                $container.append(board);
                $('.stats').remove();
                stats = loadStatsIntoDom(game);
                $root.append(stats);
            break;
        }

    });

}

$(function() {
    var game = new Game(4);
    loadIntoDom(game);
});