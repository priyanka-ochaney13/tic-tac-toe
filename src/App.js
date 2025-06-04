import { useState, useEffect, useMemo } from "react";
import './App.css';
import Player from './components/Player.js';
import GameBoard from './components/GameBoard.js';
import Log from './components/Log.js';
import { WINNING_COMBINATIONS } from "./winning-combinations.js";
import GameOver from "./components/GameOver.js";
import GameBot from "./components/GameBot.js";

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

  const [playWithBot, setPlayWithBot] = useState(false);

  const [players, setPlayers] = useState({
    'X' : 'Player 1',
    'O' : playWithBot ? 'Bot' : 'Player 2',
  });

  const [gameTurns, setGameTurns] = useState([]);

  //const [activePlayer, setActivePlayer] = useState('X');
  const activePlayer = getActivePlayer(gameTurns);

  useEffect(() => {
    setPlayers(prevPlayers => ({
      ...prevPlayers,
      'O': playWithBot ? 'Bot' : 'Player 2'
    }));
  }, [playWithBot]);

  const gameBoard = useMemo(() => {
    const board = initialGameBoard.map(array => [...array]);
    for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
      if (board[row][col] === null) {
        board[row][col] = player;
      }
    }
    return board;
  }, [gameTurns]);

  const winner = getWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    if (playWithBot && activePlayer === 'O' && !winner && !hasDraw) {
      const timer = setTimeout(() => {
        const move = GameBot({ board: gameBoard, currentPlayer: 'O' });
        if (move) {
          handleSelectCell(move.row, move.col);
        }
      }, 500); // Delay for bot's move
      return () => clearTimeout(timer);
    }
  }, [activePlayer, gameBoard, playWithBot, winner, hasDraw]);

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
    if (playWithBot && symbol === 'O') return; // Prevent changing bot's name

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
            name={players['X']}
            symbol='X' 
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            name={players['O']}
            symbol='O' 
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
            isBot={playWithBot}
          />
          <div className="game-options">
            <label>
              <input 
                type="checkbox" 
                checked={playWithBot} 
                onChange={() => setPlayWithBot(!playWithBot)} 
                disabled={gameTurns.length > 0} //disable if game has started
              />
              Play with Bot
            </label>
        </div>
        </ol>
        { (winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch}/>}
        <GameBoard 
          onSelectCell={handleSelectCell} 
          board={gameBoard}
          disabled={playWithBot && activePlayer === 'O'} // Disable board during bot's turn
        />
      </div>
      <Log turns={gameTurns}/>
    </main>
  );
}
export default App;