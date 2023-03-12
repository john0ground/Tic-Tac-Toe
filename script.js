const gameBoard = (() => {
    const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
)();

const Player = (name, icon) => {
    const markedSquares = [9, 8, 7];

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
            console.log(icon);
            return true;
        }
    });

    return { matchedSquares };
};

const chooseIcons = (x, o) => {
    const icon = 'xo';
    const firstPlayerIcon = () => x;
    const secondPlayerIcon = () => o;

    return { firstPlayerIcon, secondPlayerIcon, icon };
};

const selectedIcon = (() => {
    const icons = chooseIcons().icon;
    const xo = chooseIcons('x', 'o');

    const selected = () => {
        if (icons === 'xo') return xo;
    };

    return { selected };
})();

console.log(selectedIcon.selected().firstPlayerIcon());

// const john = Player('john', catDog.firstPlayerIcon());
// john.matchedSquares();

// const gameController = ()();
