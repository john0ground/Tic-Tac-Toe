const gameBoard = (() => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

    const endGame = () => {
        console.log(`${name} wins!`);
        gameController.gameActive('inactive');
        reset();
    };

    const matchedSquares = () => {
        const isInMarkedSquares = (currentNum) => markedSquares.includes(currentNum);

        let i = 0;
        while (i < winningRows.length) {
            if (winningRows[i].every(isInMarkedSquares)) {
                return endGame();
            }
            i++;
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

    function placeMark() {
        if (this.textContent === '') {
            this.textContent = activePlayer.getMarker();

            activePlayer.addToMarkedSquares(parseInt(this.id, 10));
            activePlayer.matchedSquares();

            activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
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

    const computerOpponent = document.querySelector('.computer');
    computerOpponent.addEventListener('click', () => {
        player2 = player('Computer');
        activePlayer = player1;

        resetGameBoard();
        gameActive('active');

        player1.updateMarker('xo');
        player2.updateMarker('xo');
    });

    return { resetGameBoard, gameActive };
})();

const button2 = document.querySelector('.btn2');
//  rewrite computerOpponent
