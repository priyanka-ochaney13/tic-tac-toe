import { useState } from "react";
import './App.css';
import Player from './components/Player.js';
import GameBoard from './components/GameBoard.js';
import Log from './components/Log.js';
import { WINNING_COMBINATIONS } from "./winning-combinations.js";
import GameOver from "./components/GameOver.js";

const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

function getActivePlayer(gameTurns) {
  let currentPlayer = 'X';
  if(gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function getWinner(gameBoard, players) {
  let winner = null;
  // Check for a winner
  for (const combinations of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combinations[0].row][combinations[0].col];
    const secondSquareSymbol = gameBoard[combinations[1].row][combinations[1].col];
    const thirdSquareSymbol = gameBoard[combinations[2].row][combinations[2].col];

    if (firstSquareSymbol && 
      firstSquareSymbol === secondSquareSymbol && 
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
      break;
    }
  }
  return winner;
}
function App() {
  const [players, setPlayers] = useState({
    'X' : 'Player 1',
    'O' : 'Player 2',
  });

  const [gameTurns, setGameTurns] = useState([]);

  //const [activePlayer, setActivePlayer] = useState('X');
  const activePlayer = getActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for(const turn of gameTurns) {
    const { square, player } = turn; 
    const { row, col } = square;

    if (gameBoard[row][col] === null) {
        gameBoard[row][col] = player;
    }
  }

  const winner = getWinner(gameBoard, players);

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectCell(rowIndex, colIndex) {
    //setActivePlayer((currActivePlayer) => currActivePlayer === 'X' ? 'O' : 'X');
    setGameTurns(prevTurns => {
      const currentPlayer = getActivePlayer(prevTurns);

      const updatedTurns = [
        { square: {row: rowIndex, col: colIndex}, player: currentPlayer }, 
        ...prevTurns
      ];

      return updatedTurns;
    });
  }

  function handleRematch() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    });
  }
  return (
    <main>
      <div id='game-container'>
        <ol id='players' className='highlight-player'>
          <Player 
            name='Player 1' 
            symbol='X' 
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            name='Player 2' 
            symbol='O' 
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        { (winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch}/>}
        <GameBoard 
          onSelectCell={handleSelectCell} 
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns}/>
    </main>
  );
}
export default App;