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
    let activePlayer = player1;
    let currentOpponent = 'human';

    function placeMark() {
        if (this.textContent === '') {
            this.textContent = activePlayer.getMarker();
            const chosenSquare = parseInt(this.id, 10);

            gameBoard.updateBoard((chosenSquare - 1), activePlayer.getMarker());
            console.log(gameBoard.emptySquares());

            activePlayer.addToMarkedSquares(chosenSquare);
            activePlayer.matchedSquares();

            activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
            console.log(currentOpponent);
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
            });
        } else {
            squares.forEach((square) => {
                square.style.pointerEvents = 'none';
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

//  computerRandom
