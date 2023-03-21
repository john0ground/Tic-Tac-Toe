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
            console.log(`${name} wins!`);
        }
        if (state === 'draw') {
            console.log('It\'s a draw!');
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
        const xo = chooseIcons('x', 'o');
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
        getMarker, matchedSquares, addToMarkedSquares, marker, updateMarker, reset,
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

        gameBoard.updateBoard((chosenSquare - 1), activePlayer.getMarker());

        activePlayer.addToMarkedSquares(chosenSquare);
        activePlayer.matchedSquares();

        activePlayer = player1;
    }

    function placeMark() {
        if (this.textContent === '') {
            this.classList.add('marked');
            this.textContent = activePlayer.getMarker();
            const chosenSquare = parseInt(this.id, 10);

            gameBoard.updateBoard((chosenSquare - 1), activePlayer.getMarker());

            activePlayer.addToMarkedSquares(chosenSquare);
            activePlayer.matchedSquares();

            activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;

            if (activePlayer === player2 && currentOpponent === 'computer' && currentState === 'active') {
                computerPlaceMark();
            }
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
        });
    });

    const resetGameBoard = () => {
        squares.forEach((square) => {
            square.textContent = '';
            square.classList.remove('marked');

            gameBoard.resetBoard();
            gameActive('active');

            player1.reset();
            player2.reset();
        });
    };

    const changeOpponent = (e) => {
        if (e.target.id === 'computer') {
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

    const opponentBtn = document.querySelectorAll('.change-op');
    opponentBtn.forEach((btn) => {
        btn.addEventListener('click', changeOpponent);
    });

    return { resetGameBoard, gameActive };
})();

const button2 = document.querySelector('.btn2');
