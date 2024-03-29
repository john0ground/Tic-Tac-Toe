const gameBoard = (() => {
    let board = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const emptySquares = () => board.filter((index) => typeof index === 'number');

    const updateBoard = (square, marker) => {
        board[square] = marker;
    };

    const resetBoard = () => {
        board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    };

    return { updateBoard, emptySquares, resetBoard };
}
)();

const player = (name) => {
    const getName = () => name;

    let marker = '';
    const getMarker = () => marker;

    let markedSquares = [];
    const addToMarkedSquares = (squareNum) => markedSquares.push(squareNum);

    const winningRows = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
    ];

    const reset = () => {
        markedSquares = [];
    };

    const endGame = (state) => {
        if (state === 'win') {
            userInputAndDisplay.displayWinner(name);
        }
        if (state === 'draw') {
            userInputAndDisplay.displayDraw();
        }

        gameController.gameActive('inactive');
        reset();
    };

    const matchedSquares = () => {
        const isInMarkedSquares = (currentNum) => markedSquares.includes(currentNum);

        let gameWon = false;
        let i = 0;
        while (i < winningRows.length) {
            if (winningRows[i].every(isInMarkedSquares)) {
                endGame('win');
                gameWon = true;

                // squares won animation
                const squaresWon = winningRows[i];
                gameController.squaresWonAnimation(squaresWon);
            }
            i++;
        }

        if (!gameWon && gameBoard.emptySquares().length === 0) {
            return endGame('draw');
        }
    };

    const chooseIcons = (x, o) => {
        const firstPlayerIcon = () => x;
        const secondPlayerIcon = () => o;

        return { firstPlayerIcon, secondPlayerIcon };
    };

    const updateMarker = (icon) => {
        const xo = chooseIcons('X', 'O');
        const catDog = chooseIcons('🐶', '🐱');
        const iceFire = chooseIcons('🧊', '🔥');

        const selected = () => {
            if (icon === 'xo') return xo;
            if (icon === 'catDog') return catDog;
            if (icon === 'iceFire') return iceFire;
        };

        if (name === 'Player1') {
            marker = selected().firstPlayerIcon();
        } else marker = selected().secondPlayerIcon();
    };

    return {
        getMarker, matchedSquares, addToMarkedSquares, marker, updateMarker, reset, getName,
    };
};

const player1 = player('Player1');
let player2 = player('Player2');

const gameController = (() => {
    let currentState = 'active';
    let activePlayer = player1;
    let currentOpponent = 'human';

    function computerPlaceMark() {
        // choose index based on emptySquares array length, 5 will be 0 - 4 and so on.
        const chooseIndex = Math.floor(Math.random() * gameBoard.emptySquares().length);
        const chosenSquare = gameBoard.emptySquares()[chooseIndex];
        document.getElementById(`${chosenSquare}`).textContent = activePlayer.getMarker();
        document.getElementById(`${chosenSquare}`).style.color = 'rgb(157, 221, 157)';

        gameBoard.updateBoard((chosenSquare - 1), activePlayer.getMarker());

        activePlayer.addToMarkedSquares(chosenSquare);
        activePlayer.matchedSquares();

        activePlayer = player1;
    }

    function placeMark() {
        if (this.textContent === '') {
            this.classList.add('marked');
            this.textContent = activePlayer.getMarker();

            if (activePlayer === player1) {
                this.style.color = 'rgb(142, 194, 214)';
            } else {
                this.style.color = 'rgb(157, 221, 157)';
            }

            const chosenSquare = parseInt(this.id, 10);
            gameBoard.updateBoard((chosenSquare - 1), activePlayer.getMarker());

            const playerTurn = document.querySelector('.turn');
            playerTurn.style.display = 'block';

            activePlayer.addToMarkedSquares(chosenSquare);
            activePlayer.matchedSquares();

            activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;

            if (activePlayer === player2 && currentOpponent === 'computer' && currentState === 'active') {
                computerPlaceMark();
            }

            const turnName = document.querySelector('.turn-name');
            turnName.textContent = `${activePlayer.getName()} - ${activePlayer.getMarker()}`;
        }
    }

    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
        square.addEventListener('click', placeMark);
    });

    const gameActive = (state) => {
        if (state === 'active') {
            squares.forEach((square) => {
                square.style.pointerEvents = 'auto';
                currentState = 'active';
            });
        } else {
            squares.forEach((square) => {
                square.style.pointerEvents = 'none';
                currentState = 'inactive';
            });
        }
    };

    const iconsBtn = document.querySelectorAll('.icon');
    iconsBtn.forEach((icon) => {
        icon.addEventListener('click', (e) => {
            player1.updateMarker(e.target.dataset.marker);
            player2.updateMarker(e.target.dataset.marker);

            gameController.resetGameBoard();

            userInputAndDisplay.closeAvailableIcons(e);
        });
    });

    const resetGameBoard = () => {
        squares.forEach((square) => {
            square.textContent = '';
            square.classList.remove('marked');
        });

        gameBoard.resetBoard();
        gameActive('active');

        player1.reset();
        player2.reset();

        activePlayer = player1;

        document.querySelector('.current-marker').textContent = 'X O';
        document.querySelector('.turn-name').textContent = `${player1.getName()} ${player1.getMarker()}`;
        document.querySelector('.output-main').textContent = 'Tic Tac Toe';
    };

    const squaresWonAnimation = (squares) => {
        let setDelay = 0;
        let i = 0;

        while (i < squares.length) {
            const squareElement = document.getElementById(`${squares[i]}`);

            setTimeout(() => {
                squareElement.classList.add('growSquare');
            }, setDelay);

            setDelay += 200;
            i++;
        }

        setDelay = 0;
        squares.forEach((square) => {
            document.getElementById(`${square}`).classList.remove('growSquare');
        });
    };

    const changeOpponent = (e) => {
        if (e.target.dataset.opponent === 'computer') {
            player2 = player('Computer');
            currentOpponent = 'computer';
        } else {
            player2 = player('Player2');
            currentOpponent = 'human';
        }

        resetGameBoard();
        gameActive('active');

        activePlayer = player1;
        player1.updateMarker('xo');
        player2.updateMarker('xo');
    };

    const chooseOpponentsBtn = document.querySelectorAll('.choose-opponents-btn');
    chooseOpponentsBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const chooseOpponentsPage = document.querySelector('.choose-opponent-page');
            // chooseOpponentsPage.style.left = '-110%';
            chooseOpponentsPage.style.animation = 'close-shrink 0.5s linear forwards';
            changeOpponent(e);
        });
    });

    return { resetGameBoard, gameActive, squaresWonAnimation };
})();

const userInputAndDisplay = (() => {
    const resetBtn = document.querySelector('.reset');
    resetBtn.addEventListener('click', () => {
        gameController.resetGameBoard();
    });

    const changeMarkerBtn = document.querySelector('.current-marker');
    const availableIcons = document.querySelector('.available-icons');

    changeMarkerBtn.addEventListener('click', () => {
        availableIcons.classList.toggle('reveal-available-icons');
    });

    const closeAvailableIcons = (e) => {
        availableIcons.classList.remove('reveal-available-icons');
        changeMarkerBtn.textContent = e.target.textContent;
    };

    const chooseOpponentBtn = document.querySelector('.change-opponent');
    chooseOpponentBtn.addEventListener('click', () => {
        const chooseOpponentsPage = document.querySelector('.choose-opponent-page');
        chooseOpponentsPage.style.animation = 'open-grow 0.5s forwards';
    });

    const outputMain = document.querySelector('.output-main');
    const displayWinner = (name) => {
        outputMain.textContent = `${name} wins!`;
        outputMain.classList.add('display-winner');
        removeWinnerAnimation();
    };
    const displayDraw = () => {
        outputMain.textContent = 'It\'s a draw!';
        outputMain.classList.add('display-winner');
        removeWinnerAnimation();
    };

    const removeWinnerAnimation = () => {
        setTimeout(() => {
            outputMain.classList.remove('display-winner');
        }, 600);
    };

    return { closeAvailableIcons, displayWinner, displayDraw };
})();
