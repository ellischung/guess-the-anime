import React, { useState } from 'react';
import songs from '../data/songs.json';

function Game({ socket, username, room }) {
    // display states
    const [selectType, setSelectType] = useState(true);
    const [selectDifficulty, setSelectDifficulty] = useState(false);
    const [game, setGame] = useState(false);

    // state for mode selection
    const [selected, setSelected] = useState("");

    return (
        <div className="gameContainer">
            <div className="playersContainer">

            </div>
            
            {(selectType && !selectDifficulty && !game) ? (
                <div>test</div>
            ) : (selectType && selectDifficulty && !game) ? (
                <div>test2</div>
            ) : (
                <div>test3</div>
            )}
        </div>
    );
};

export default Game;