// Capture the div containing the cells from the DOM
const cellsContainer = document.querySelector(".cells");

// Capture the playerDisplay, playMoveInput and submitMove from the DOM
const currentPlayerElement = document.querySelector(".current-player");
const playerMoveInput = document.querySelector(".player-move");
const submitMoveButton = document.querySelector(".submit-move");

// Capture the result section from the DOM
const resultElement = document.querySelector(".result");

// Capture the start button
const startButton = document.querySelector(".start");
const resetButton = document.querySelector(".reset");

// Player Object

const PLAYER = (function () {
    // List of players
    const players = []

    // Player constructor
    function Player(name, symbol) {
        this.name = name;
        this.symbol = symbol.toUpperCase();
        this.moves = 0;
    }

    // make move for a player
    Player.prototype.makeMove = function (index) {
        if (Gameboard.gameboard[index - 1] === null) {
            Gameboard.gameboard[index - 1] = this.symbol;
            this.moves++;
            Gameboard.displayGameboard(Gameboard.gameboard);
            return true;
        } else {
            return false;
        }
    }

    // Display player if matching symbol is found:
    function displayPlayer(playerSymbol) {
        let matchingPlayer;
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.symbol === playerSymbol) {
                matchingPlayer = player;
                return `${matchingPlayer.name}: ${matchingPlayer.symbol}`;
            };
        }

        if (!matchingPlayer) {
            return `Name: ${playerSymbol}`;
        }
    }

    const moustapha = new Player("moustapha", "X");
    const doudou = new Player("Pape", "O");

    players.push(moustapha);
    players.push(doudou);

    return { Player, displayPlayer, players }
})();


// The Gameboard
const Gameboard = (function Gameboard() {
    let gameboard = Array(9).fill(null);

    function reset() {
        for (let i = 0; i < gameboard.length; i++) {
            gameboard[i] = null;
        }

        displayGameboard(gameboard);

        return gameboard;

    }

    function displayGameboard(board = gameboard) {

        // Build the html of each cell
        let divAccumulator = [];
        for (let i = 0; i < board.length; i++) {
            const cellValue = board[i];
            const cellText = board[i] === null ? (i + 1) : board[i];

            if (board[i] !== null) {
                divAccumulator.push(`<div class="cell ${cellValue.toLowerCase()}">${cellText}</div>`)
            } else {
                divAccumulator.push(`<div class="cell">${cellText}</div>`);
            }

        }

        // Update the html of the cells' container
        cellsContainer.innerHTML = divAccumulator.join("");

        return divAccumulator;
    }

    return { gameboard, displayGameboard, reset };
})();


const Game = (function Game() {
    Gameboard.displayGameboard(Gameboard.gameboard);

    function createPlayer() {
        const name = prompt(`Player number ${PLAYER.players.length + 1}, what is your name`);
        const symbol = prompt(`Player number ${PLAYER.players.length + 1}, what is your symbol`);

        if (name !== "" && symbol !== "") {
            for (let i = 0; i < PLAYER.players.length; i++) {
                const element = PLAYER.players[i];
                if (element.symbol === symbol) {
                    return alert("Choosen symbol already exists, please choose something different");
                }
            }
        }

        return PLAYER.players.push(new PLAYER.Player(name.toLowerCase(), symbol.toUpperCase()));
    }

    function alternate(playersArrary, currentIndex) {
        if (playersArrary.length === 2) {
            return (currentIndex + 1) % 2;
        } else {
            return alert("Sorry, there are too many players");
        }
    }

    function playMatch() {
        // Ensure the gameboard is reset before starting
        Gameboard.displayGameboard(Gameboard.gameboard);

        if (PLAYER.players.length > 2) {
            return alert("Sorry, there are too many players");
        }

        while (PLAYER.players.length !== 2) {
            createPlayer();
        }

        if (PLAYER.players.length === 2) {
            // Randomly choose who starts
            let currentIndex = Math.floor(Math.random() * PLAYER.players.length);

            // Set the current player display
            function displayCurrentPlayer() {
                currentPlayerElement.textContent = `It's ${PLAYER.players[currentIndex].name}'s turn`;
            }
            displayCurrentPlayer();

            // Handle the move submission
            // Remove any existing event listeners before adding a new one
            submitMoveButton.addEventListener("click", function handleMove() {
                const playerMove = parseInt(playerMoveInput.value);

                // Validate PlayerMove
                if (
                    isNaN(playerMove) ||
                    playerMove < 1 ||
                    playerMove > 9 ||
                    Gameboard.gameboard[playerMove - 1] !== null
                ) {
                    alert("Invalid move. Please try again");
                    return;
                }

                // Make the move
                let currentPlayer = PLAYER.players[currentIndex];
                currentPlayer.makeMove(playerMove);

                // Check if there's a winner or a tie
                const result = isWinner(Gameboard.gameboard);
                if (result) {
                    document.querySelector(".move-input-container").textContent = "GAME OVER";
                    resultElement.textContent = result;
                    submitMoveButton.removeEventListener("click", handleMove);
                    return;
                }

                // Alternate to the next player and update the UI
                currentIndex = alternate(PLAYER.players, currentIndex);
                displayCurrentPlayer();

                // Clear the input field for the next move
                playerMoveInput.value = "";
            });
        }
    }


    // Attach event listener to start and reset buttons
    startButton.addEventListener("click", function () {
        playMatch()
    });

    resetButton.addEventListener("click", function () {
        window.location.reload()
        Gameboard.reset();
        resultElement.textContent = ""; // Clear result display
        currentPlayerElement.textContent = ""; // Clear current player display
    });


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
        for (let i = 0; i < PLAYER.players.length; i++) {
            const player = PLAYER.players[i];
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
