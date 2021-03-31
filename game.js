export default class Game {
    
     constructor(dimensions) {
        this.board = [];
        this.score = 0;
        this.won = false;
        this.over = false;
        this.board = Array(dimensions*dimensions).fill(0);
        this.rows = Array(dimensions).fill(Array(dimensions).fill(0));
        this.added = false;
        this.onMoveArr = [];
        this.onLoseArr = [];
        this.onWinArr = [];
        this.addTile();
        while (!this.added) {
             this.added = this.addTile();
         }
         this.added = false;
     }

     setupNewGame() {
       this.score = 0;
        this.won = false;
        this.over = false;
        this.board.fill(0);
        this.addTile();
        this.added = false;
        while (!this.added) {
            this.added = this.addTile();
        }
        this.onMoveArr = [];
        this.onLoseArr = [];
        this.onWinArr = [];
     }

     loadGame(state) {
        this.board = state.board;
        this.score = state.score;
        this.won = state.won;
        this.over = state.over;
     }

     move(direction) {
        var dimension = Math.sqrt(this.board.length);
        var i = 0;
                for (var b = 0; b < dimension; b++) {
                    this.rows[b] = this.board.slice(i, i+dimension);
                    i+= dimension;
                }
            this.shift(direction);
            this.merge(direction);

            i = 0;
            for (var j = 0; j < dimension; j++) {
                for (var b = 0; b < dimension; b++) {
                    this.board[i] = this.rows[j][b];
                    i++;
                }
            }


        if (this.board.includes(0)) {
            this.added = false;
            while(!this.added) {
                this.added = this.addTile();
            }
        } 
        if (this.board.includes(2048)) {
            this.won = true;
            this.onWinArr.forEach(win => {
                win(this.getGameState());
            });
        }
        this.checkStatus();
       
        this.onMoveArr.forEach(callback => {
            callback(this.getGameState());
        });

     }
 

     toString() {
        var dimension = Math.sqrt(this.board.length);
        var string = "";
       for (var i = 0; i < this.board.length; i+= dimension) {
            for (var b = 0; b < dimension; b++) {
                string += this.board[b+i] + " ";
            }
            string += '\n';
        } 

        return string;
     }

     getGameState() {
        return { board: this.board,
                score: this.score,
                won: this.won,
                over: this.over};
     }
    
    onMove(callback) {
            this.onMoveArr.push(callback);
    }

    onWin(callback) {
            this.onWinArr.push(callback);
    }

    onLose(callback) {
            this.onLoseArr.push(callback);
    }
    
    randomHelper(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min) + min);
    }
    addTile() {
        var index = this.randomHelper(0, this.board.length) 
        var rand = Math.random();
        if (rand < 0.9) {
            if (this.board[index] == 0) {
                this.board[index] = 2;
                return true;
            }
        } else {
            if (this.board[index] == 0) {
                this.board[index] = 4;
                return true;
            }
        }
        return false;
    }
    shift(direction) {

        var i = 0;
        var dimension = Math.sqrt(this.board.length);
        if (direction == 'left' || direction == 'right') {

            while (i < dimension) {
                var elements = [];
                this.rows[i].forEach(el => {
                    if (el != 0) {
                        elements.push(el);
                    }
                });
                // Clears the array
                for (var c = 0; c < dimension; c++) {
                    this.rows[i][c] = 0;
                }

                if (direction == 'left') {
                    for (var b = 0; b < elements.length; b++) {
                        this.rows[i][b] = (elements[b]);
                    }
                    for (var b = elements.length; b < dimension-elements.length; b++) {
                        this.rows[i][b] = 0;
                    }
                } else if (direction == 'right') {
                    for (var b = 0; b < dimension-elements.length; b++) {
                        this.rows[i][b] = 0;
                    }
                    var a = 0;
                    for (var b = dimension-elements.length; b < dimension; b++) {
                        this.rows[i][b] = elements[a];
                        a++;
                    }
                }
                i++;
            }
         }  
         if (direction == 'up' || direction == 'down') { 
            while (i < dimension) {
                var elements = [];
                for (var b = 0; b < dimension; b++) {
                    if (this.rows[b][i] != 0) {
                        elements.push(this.rows[b][i]);
                    }
                }
                for (var b = 0; b < dimension; b++) {
                    this.rows[b][i] = 0;
                }
                if (direction == 'up') {
                    var a = 0;
                    for (var b = 0; b < elements.length; b++) {
                        this.rows[b][i] = elements[a];
                        a++;
                    }
                    for (a = elements.length; a < dimension; a++) {
                        this.rows[a][i] = 0;
                    }
                } else if (direction == 'down') {
                    var a = 0;
                    for (var b = 0; b < dimension-elements.length; b++) {
                        this.rows[b][i] = 0;
                    }
                    for (b = dimension-elements.length; b < dimension; b++) {
                        this.rows[b][i] = elements[a];
                        a++;
                    }
                }
                i++;
            }
        }
    } 
    merge(direction) {
        var dimension = Math.sqrt(this.board.length);
        if (direction == 'left') {
            for (var i = 0; i < dimension; i++) {
                for (var b = 0; b < dimension-1; b++) {
                        if (this.rows[i][b] == this.rows[i][b+1]) {
                            this.rows[i][b] *= 2;
                            this.score += this.rows[i][b];
                            this.rows[i][b+1] = 0;
                        }
                }
            }
        } else if (direction == 'right') {
            for (var i = 0; i < dimension; i++) {
                for (var b = dimension-1; b > 0; b--) {
                        if (this.rows[i][b] == this.rows[i][b-1]) {
                            this.rows[i][b] *= 2;
                            this.score += this.rows[i][b];
                            this.rows[i][b-1] = 0;
                        }
                }
            }
        } else if (direction == 'up') {
            var b = 0;
            while (b < dimension) {
                for (var i = 0; i < dimension-1; i++) {
                        if(this.rows[i][b] == this.rows[i+1][b]) {
                            this.rows[i][b] *= 2;
                            this.score += this.rows[i][b];
                            this.rows[i+1][b] = 0;
                        }
                }
                b++;
            }
        } else if (direction == 'down') {
            var b = 0;
            while (b < dimension) {
                for (var i = dimension-1; i > 0; i--) {
                        if (this.rows[i][b] == this.rows[i-1][b]) {
                            this.rows[i][b] *= 2;
                            this.score += this.rows[i][b];
                            this.rows[i-1][b] = 0;
                        }
                }
                b++;
            }
        }
        this.shift(direction);
    }

    checkStatus() {
        var dimension = Math.sqrt(this.board.length);
        var i = 0;
        for (var b = 0; b < dimension; b++) {
            this.rows[b] = this.board.slice(i, i+dimension);
            i+= dimension;
        }
            var dimension = Math.sqrt(this.board.length);
            var originalScore = this.score;

            this.merge('up');
            this.merge('down');
            this.merge('left');
            this.merge('right');
            var boardCopy = this.board.slice();
            i = 0;
            for (var j = 0; j < dimension; j++) {
                for (var b = 0; b < dimension; b++) {
                    boardCopy[i] = this.rows[j][b];
                    i++;
                }
            }
            if (!(boardCopy.includes(0))) {
                this.over = true;
                this.score = originalScore;
                this.onLoseArr.forEach(lose => {
                    lose(this.getGameState());
                });
            }        
            this.score = originalScore;
    }
}