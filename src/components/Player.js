import { useState } from 'react';
export default function Player({name, symbol, isActive}) {
    const [playerName, setPlayerName] = useState(name);
    const handleChange = (event) => {
        setPlayerName(event.target.value);
    }
    const [isEditing, setIsEditing] = useState(false);
    const handleEditClick = () => {
        //setIsEditing(!isEditing); creates a delay in the state update as it is scheduled for future that delay can be by 1-2ms 
        // This is because the state update is asynchronous
        setIsEditing((editing) => !editing);
    }

    let editablePlayerName = <span className='player-name'>{playerName}</span>;
    if(isEditing) {
        editablePlayerName = <input type='text' required value={playerName} onChange={handleChange}/>
    }
    // If the player is editing, show an input field instead of the name
    // If the player is not editing, show the name

    return (
    <li className={isActive ? 'active' : undefined}>
        <span className='player'>
          {editablePlayerName}
          <span className='player-symbol'>{symbol}</span>
        </span>
        <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
    </li>
    );
}