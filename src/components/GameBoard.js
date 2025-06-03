import { useState } from 'react';
const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

export default function GameBoard({ onSelectCell, activePlayerSymbol }) {
    const [gameBoard, setGameBoard] = useState(initialGameBoard);

    function handleCLick(rowIndex, colIndex) {
        setGameBoard((prevBoard) => {
            const updatedBoard = [...prevBoard.map(innerArray => [...innerArray])];
            updatedBoard[rowIndex][colIndex] = activePlayerSymbol;
            return updatedBoard;
        });

        onSelectCell();
    }

    return (
        <ol id="game-board">
            {gameBoard.map((row, rowIndex) => <li key={rowIndex}>
                <ol>
                    {row.map((playerSymbol, colIndex) => 
                        <li key={colIndex}>
                            <button onClick={() => handleCLick(rowIndex, colIndex)}>{playerSymbol}</button>
                        </li>
                    )}
                </ol>
            </li>)}
        </ol>
    );
}