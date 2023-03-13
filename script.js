const gameBoard = (() => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
)();

const Player = (name, icon) => {
    const markedSquares = [9, 8, 7];
    const addToMarkedSquares = (squareNum) => markedSquares.push(squareNum);

    const getName = () => name;
    const getIcon = () => icon;

    // be able to match winningSquares
    const markedSquaresSorted = () => markedSquares.sort().toString();

    const winningSquares = [
        '1,2,3',
        '4,5,6',
        '7,8,9',
        '1,4,7',
        '2,5,8',
        '3,6,9',
        '1,5,9',
        '3,5,7',
    ];

    const endGame = () => {
        console.log(`${name} wins!`);
    };

    const matchedSquares = () => winningSquares.some((array) => {
        if (array === markedSquaresSorted()) {
            endGame();
            return true;
        }
    });

    return { matchedSquares, endGame, addToMarkedSquares };
};

const chooseIcons = (x, o) => {
    const firstPlayerIcon = () => x;
    const secondPlayerIcon = () => o;

    return { firstPlayerIcon, secondPlayerIcon };
};

const selectedIcon = (() => {
    const icon = 'iceFire';

    const xo = chooseIcons('x', 'o');
    const catDog = chooseIcons('🐶', '🐱');
    const iceFire = chooseIcons('🧊', '🔥');

    const selected = () => {
        if (icon === 'xo') return xo;
        if (icon === 'catDog') return catDog;
        if (icon === 'iceFire') return iceFire;
    };

    let player1Icon = selected().firstPlayerIcon();
    let player2Icon = selected().secondPlayerIcon();

    const btn = document.querySelector('button');
    btn.addEventListener('click', () => {
        icon.selected = 'catDog';
        player1Icon = selected().firstPlayerIcon();
        player2Icon = selected().secondPlayerIcon();
    });

    return { player1Icon, player2Icon, icon };
})();

console.log(selectedIcon.player1Icon);

// changeI();

// const john = Player('john', catDog.firstPlayerIcon());
