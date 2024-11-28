// Player Object
const PLAYER = (function () {
    // List of players
    const players = []

    // Player constructor
    function Player(name, symbol) {
        this.name = name;
        this.symbol = symbol;
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


    const formSubmitButton = document.querySelector(".submit");
    formSubmitButton.addEventListener("click", function (event) {
        event.preventDefault();
        addPlayer();
    });

    function addPlayer() {
        // Check if the players are not greater than two
        if (players.length >= 2) {
            return alert("Impossible to add more than two players!");
        }

        // Get the name and symbol of the player
        const validSymbols = ["X", "O"];

        const playerName = document.getElementById("name").value;
        const playerSymbol = document.getElementById("symbol").value;

        // validate the name and symbol
        // Check if the symbol if not already choosen
        if (players.every(player => player.symbol !== playerSymbol)) {

            if (playerName !== "" && validSymbols.includes(playerSymbol)) {
                const selectedSymbol = document.querySelector(`.player-${playerSymbol.toLowerCase()}`);

                // Disable the selected option
                if (selectedSymbol) {
                    selectedSymbol.disabled = true;
                }

                // Add the player to the list of players
                players.push(new Player(playerName, playerSymbol.toUpperCase()));

                // Reset the form
                document.getElementById("name").value = "";
                document.getElementById("symbol").value = "";

                // Update the players display
                playerOneElement.textContent = displayPlayer("X");
                playerTwoElement.textContent = displayPlayer("O");
            }

        } else {
            alert("Sorry. Symbol is already choosen");
        }
    }

    const moustapha = new Player("moustapha", "X");
    const doudou = new Player("Pape", "O");

    players.push(moustapha);
    // players.push(doudou);

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
        // Capture the div containing the cells from the DOM
        const cellsContainer = document.querySelector(".cells");
        cellsContainer.innerHTML = divAccumulator.join("");

        return divAccumulator;
    }

    return { gameboard, displayGameboard, reset };
})();


const Game = (function Game() {
    Gameboard.displayGameboard(Gameboard.gameboard);

    const currentPlayerElement = document.querySelector(".current-player");
    // Capture the result section from the DOM
    const resultElement = document.querySelector(".result");

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

        if (PLAYER.players.length < 2) {
            return alert("Not enough players. Please click on the 'Add Player' button to add a player.");
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
            const submitMoveButton = document.querySelector(".submit-move");
            submitMoveButton.addEventListener("click", function handleMove() {
                const playerMoveInput = document.querySelector(".player-move");
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


    // Attach event listener to start and reset button
    // Capture the start button
    (function () {
        const startButton = document.querySelector(".start");
        startButton.addEventListener("click", function startGame() {
            playMatch();
            startButton.removeEventListener("click", startGame)
        });
    })();

    // Capture the reset button
    (function () {
        const resetButton = document.querySelector(".reset");
        resetButton.addEventListener("click", function () {
            window.location.reload()
            Gameboard.reset();
            resultElement.textContent = ""; // Clear result display
            currentPlayerElement.textContent = ""; // Clear current player display
        });
    })();

    function isWinner(array) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6], // Diagonals
        ]

        function isMatch(array, index1, index2, index3) {
            return (array[index1] !== null && array[index1] === array[index2] && array[index1] === array[index3]);
        }

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
