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
        matchedSquares, addToMarkedSquares, icon,
    };
};

const player1 = player('Player1');
const player2 = player('Player2');

const chooseIcons = (x, o) => {
    const firstPlayerIcon = () => x;
    const secondPlayerIcon = () => o;

    return { firstPlayerIcon, secondPlayerIcon };
};

const selectedIcon = (() => {
    const xo = chooseIcons('x', 'o');
    const catDog = chooseIcons('🐶', '🐱');
    const iceFire = chooseIcons('🧊', '🔥');

    const selected = (icon) => {
        if (icon === 'xo') return xo;
        if (icon === 'catDog') return catDog;
        if (icon === 'iceFire') return iceFire;
    };

    const btn = document.querySelector('button');
    btn.addEventListener('click', () => {
        player1.icon = selected('catDog').firstPlayerIcon();
        player2.icon = selected('catDog').secondPlayerIcon();
    });
})();

const gameController = (() => {
    let activePlayer = player1;

    function placeMark() {
        if (this.textContent === '') {
            this.textContent = activePlayer.icon;

            activePlayer.addToMarkedSquares(parseInt(this.id, 10));
            activePlayer.matchedSquares();

            activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
        }
    }

    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
        square.addEventListener('click', placeMark);
    });
})();

const button2 = document.querySelector('.btn2');
button2.addEventListener('click', () => {
    console.log(player2.icon);
});
