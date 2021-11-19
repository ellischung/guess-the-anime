import React, { useEffect, useState } from 'react';
import songs from '../data/songs.json';

function Game({ socket, username, room, score, setScore }) {
    // display states
    const [selectType, setSelectType] = useState(true);
    const [selectDifficulty, setSelectDifficulty] = useState(false);
    const [game, setGame] = useState(false);

    // state for mode selection
    const [selected, setSelected] = useState("");

    // game states
    const [players, setPlayers] = useState([]);

    // get users
    socket.emit("track_players", room);

    useEffect(() => {
        socket.on("receive_players", (data) => {
            setPlayers(data);
        });
    }, [socket]);

    return (
        <div className="gameContainer">
            <div className="playersContainer">
                {players.map((player, index) => {
                    return <div key={index}>
                        <p>{player.name}:</p>
                        <p>{player.score}</p>
                    </div>
                })}
                {console.log(players)}
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