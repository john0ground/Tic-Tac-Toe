const gameBoard = (() => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
)();

const player = (name) => {
    const icon = '';

    const markedSquares = [];
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

    const endGame = () => {
        console.log(`${name} wins!`);
        gameController.gameActive('inactive');
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

    return {
        matchedSquares, addToMarkedSquares, icon, markedSquares,
    };
};

const chooseIcons = (x, o) => {
    const firstPlayerIcon = () => x;
    const secondPlayerIcon = () => o;

    return { firstPlayerIcon, secondPlayerIcon };
};

const player1 = player('Player1');
let player2 = player('Player2');

const gameController = (() => {
    let activePlayer = player1;

    function placeMark() {
        if (this.textContent === '') {
            this.textContent = activePlayer.icon;

            activePlayer.addToMarkedSquares(parseInt(this.id, 10));
            activePlayer.matchedSquares();

            activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;

            console.log(player1.icon);
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

    const resetGameBoard = () => {
        squares.forEach((square) => {
            square.textContent = '';

            player1.markedSquares = [];
            player2.markedSquares = [];
        });
    };

    const computerOpponent = document.querySelector('.computer');
    computerOpponent.addEventListener('click', () => {
        player2 = player('Computer');
        player1.icon = chooseIcons('x', 'o').firstPlayerIcon();
        player2.icon = chooseIcons('x', 'o').secondPlayerIcon();

        activePlayer = player1;

        resetGameBoard();
        gameActive('active');
    });

    return { resetGameBoard, gameActive };
})();

const selectedIcon = (() => {
    const xo = chooseIcons('x', 'o');
    const catDog = chooseIcons('🐶', '🐱');
    const iceFire = chooseIcons('🧊', '🔥');

    const selected = (icon) => {
        if (icon === 'xo') return xo;
        if (icon === 'catDog') return catDog;
        if (icon === 'iceFire') return iceFire;
    };

    const iconsBtn = document.querySelectorAll('.icon');
    iconsBtn.forEach((icon) => {
        icon.addEventListener('click', (e) => {
            player1.icon = selected(e.target.dataset.marker).firstPlayerIcon();
            player2.icon = selected(e.target.dataset.marker).secondPlayerIcon();

            gameController.resetGameBoard();
        });
    });
})();

const button2 = document.querySelector('.btn2');

//  rewrite selectedIcon
//  rewrite resetGameBoard
//  rewrite computerOpponent
