import { useState } from "react";
import './App.css';
import Player from './components/Player.js';
import GameBoard from './components/GameBoard.js';

function App() {
  const [activePlayer, setActivePlayer] = useState('X');

  function handleSelectCell() {
    setActivePlayer((currActivePlayer) => currActivePlayer === 'X' ? 'O' : 'X');
  }
  return (
    <main>
      <div id='game-container'>
        <ol id='players' className='highlight-player'>
          <Player name='Player 1' symbol='X' isActive={activePlayer === 'X'}/>
          <Player name='Player 2' symbol='O' isActive={activePlayer === 'O'}/>
        </ol>
        <GameBoard onSelectCell={handleSelectCell} activePlayerSymbol={activePlayer}/>
      </div>
    </main>
  );
}

export default App;
