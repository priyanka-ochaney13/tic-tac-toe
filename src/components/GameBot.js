import { WINNING_COMBINATIONS } from "../winning-combinations";

function checkWin(board, player) {
    for (const combinations of WINNING_COMBINATIONS) {
        const [a, b, c] = combinations;
        if (board[a.row][a.col] === player &&
            board[b.row][b.col] === player &&
            board[c.row][c.col] === player) {
            return true; // Player has won
        }
    }
    return false; // No win found
}

export default function GameBot({ board, currentPlayer }) {
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if (board[i][j] == null) {
                const newBoard = board.map(row => [...row]);
                newBoard[i][j] = currentPlayer;
                if (checkWin(newBoard, currentPlayer)) {
                    return { row: i, col: j }; // Winning move found
                }
            }
        }
    }

    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if (board[i][j] == null) {
                const newBoard = board.map(row => [...row]);
                newBoard[i][j] = opponent;
                if (checkWin(newBoard, opponent)) {
                    return { row: i, col: j }; // Block opponent's winning move
                }
            }
        }
    }

    if (board[1][1] == null) {
        return { row: 1, col: 1 }; // Take the center square if available
    }

    // Check corners for a strategic move
    const corners = [
        {row: 0, col: 0},
        {row: 0, col: 2},
        {row: 2, col: 0},
        {row: 2, col: 2},
    ];
    const availableCorners = corners.filter(corner => board[corner.row][corner.col] == null);
    if (availableCorners.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCorners.length);
        return availableCorners[randomIndex]; // Return a random corner square
    }

    // Check edges for a strategic move
    const edges = [
        {row: 0, col: 1},
        {row: 1, col: 0},
        {row: 1, col: 2},
        {row: 2, col: 1},
    ];
    const availableEdges = edges.filter(edge => board[edge.row][edge.col] == null);
    if (availableEdges.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEdges.length);
        return availableEdges[randomIndex]; // Return a random edge square
    }
    return null; // No strategic move found
}