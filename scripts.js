// Player Object
function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol.toUpperCase();
    this.moves = 0;
}

Player.prototype.makeMove = function (index) {
    if (Gameboard.gameboard[index] === null) {
        Gameboard.gameboard[index] = this.symbol;
        this.moves++;
        Gameboard.displayGameboard();
        return true;
    } else {
        return false;
    }
}

const players = []
const moustapha = new Player("moustapha", "X");
const doudou = new Player("doudou", "O");
const foo = new Player("doudou", "Z");

players.push(moustapha);
players.push(doudou);


// The Gameboard
const Gameboard = (function Gameboard() {
    const gameboard = Array(9).fill(null);

    function displayGameboard(board = gameboard) {
        for (let i = 0; i < board.length; i += 3) {
            console.log(
                board.slice(i, i + 3).map(cell => cell === null ? " " : cell).join(" | ")
            )
            if (i < 6) {
                console.log("--+---+--");
            }
        }
    }

    return { gameboard, displayGameboard };
})();

const Game = (function Game() {
    Gameboard.displayGameboard();

    function createPlayer() {
        const name = prompt(`Player number ${players.length + 1}, what is your name`);
        const symbol = prompt(`Player number ${players.length + 1}, what is your symbol`).toUpperCase();

        if (name !== "" && symbol !== "") {
            for (let i = 0; i < players.length; i++) {
                const element = players[i];
                if (element.symbol === symbol) {
                    return alert("Choosen symbol already exists, please choose something different");
                }
            }
        }

        return players.push(new Player(name.toLowerCase(), symbol))
    }

    function alternate(playersArrary, currentIndex) {
        if (playersArrary.length === 2) {
            return (currentIndex + 1) % 2;
        } else {
            return alert("Sorry, there are too many players");
        }
    }

    function playMatch() {
        if (players.length > 2) {
            return alert("Sorry, there are too many players")
        }

        while (players.length !== 2) {
            createPlayer();
        }

        if (players.length === 2) {
            let randomIndex = Math.floor(Math.random() * players.length);

            while (!isWinner(Gameboard.gameboard)) {
                const currentPlayer = players[randomIndex];
                let playerMove;
                do {
                    playerMove = parseInt(prompt(`${currentPlayer.name}, pick a move`))
                } while (isNaN(playerMove) || playerMove < 0 || playerMove > 8 || Gameboard.gameboard[playerMove] !== null);
                currentPlayer.makeMove(playerMove);
                randomIndex = alternate(players, randomIndex);
            }

            console.log(isWinner(Gameboard.gameboard));
        }
    }

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6], // Diagonals
    ]

    function isWinner(array) {
        for (let i = 0; i < winningCombinations.length; i++) {
            const element = winningCombinations[i];

            if (isMatch(array, element[0], element[1], element[2])) {
                // Return the winning symbol;

                return getWinner(array[element[0]]);

            }

        }

        // Check if it's a tie
        // If no winner and board is full, it's a tie
        if (array.every(cell => cell !== null)) {
            return "It's a tie";
        }

        return false;
    }

    function getWinner(winningSymbol) {
        // Announce the winner
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.symbol === winningSymbol) {
                return `${player.name.toUpperCase()} WON!`;
            }
        }
    }

    return { isWinner, playMatch, alternate }

})();

function isMatch(array, index1, index2, index3) {
    return (array[index1] !== null && array[index1] === array[index2] && array[index1] === array[index3]);
}