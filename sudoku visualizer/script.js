document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const solveButton = document.getElementById('solve-button');
    const resetButton = document.getElementById('reset-button');
    const speedControl = document.getElementById('speed');

    let speed = parseInt(speedControl.value);

    // Create the Sudoku grid
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.contentEditable = true;
        cell.className = 'cell';
        cell.addEventListener('input', validateInput);
        sudokuGrid.appendChild(cell);
    }

    // Add subgrid borders
    const addSubgridBorders = () => {
        for (let i = 0; i < 81; i++) {
            const cell = sudokuGrid.children[i];
            if ((i % 9 === 2 || i % 9 === 5) && i % 27 !== 26) {
                cell.classList.add('subgrid-border-right');
            }
            if (i >= 18 && i < 27 || i >= 45 && i < 54) {
                cell.classList.add('subgrid-border-bottom');
            }
        }
    };

    addSubgridBorders();

    solveButton.addEventListener('click', () => {
        const grid = getGridValues();
        solveSudoku(grid);
    });

    resetButton.addEventListener('click', resetGrid);

    speedControl.addEventListener('input', () => {
        speed = parseInt(speedControl.value);
    });

    function validateInput(event) {
        const value = event.target.textContent;
        if (!/^[1-9]$/.test(value)) {
            event.target.textContent = '';
        }
    }

    function getGridValues() {
        const cells = sudokuGrid.querySelectorAll('div');
        const grid = [];
        cells.forEach(cell => {
            const value = cell.textContent.trim();
            grid.push(value === '' ? 0 : parseInt(value));
        });
        return arrayToGrid(grid);
    }

    function displayGrid(grid) {
        const cells = sudokuGrid.querySelectorAll('div');
        const flatGrid = grid.flat();
        cells.forEach((cell, index) => {
            cell.textContent = flatGrid[index] !== 0 ? flatGrid[index] : '';
        });
    }

    function arrayToGrid(array) {
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(array.slice(i * 9, i * 9 + 9));
        }
        return grid;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function solveSudoku(grid) {
        const findEmpty = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        return [row, col];
                    }
                }
            }
            return null;
        };

        const isSafe = (row, col, num) => {
            for (let x = 0; x < 9; x++) {
                if (grid[row][x] === num || grid[x][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
                    return false;
                }
            }
            return true;
        };

        const solve = async () => {
            const emptyPos = findEmpty();
            if (!emptyPos) {
                return true;
            }
            const [row, col] = emptyPos;
            for (let num = 1; num <= 9; num++) {
                if (isSafe(row, col, num)) {
                    grid[row][col] = num;
                    displayGrid(grid);
                    await sleep(speed);
                    if (await solve()) {
                        return true;
                    }
                    grid[row][col] = 0;
                    displayGrid(grid);
                    await sleep(speed);
                }
            }
            return false;
        };

        await solve();
    }

    function resetGrid() {
        const cells = sudokuGrid.querySelectorAll('div');
        cells.forEach(cell => {
            cell.textContent = '';
        });
    }
});
