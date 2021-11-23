import React, { useEffect, useState } from 'react';
import songs from '../data/songs.json';

function Game({ socket, username, room, score, setScore }) {
    // display states
    const [game, setGame] = useState(true);

    // state for selected mode
    //const [mode, setMode] = useState("");

    // game states
    const [players, setPlayers] = useState([]);

    // get users
    socket.emit("track_players", room);

    useEffect(() => {
        socket.on("receive_players", (data) => {
            setPlayers(data);
        });
    }, [socket]);

    // temporary increase score functionality
    const increaseScore = () => {
        socket.emit("increase_score", username);
    };

    return (
        <div className="gameContainer">
            <div className="playersContainer">
                {players.map((player, index) => {
                    return <div key={index}>
                        <p>{player.name}:</p>
                        <p>{player.score}</p>
                    </div>
                })}
            </div>

            {!game ? (
                <div className="selectionContainer">
                    SHOULD NOT REACH HERE
                </div>
            ) : (
                // GAME STARTS HERE
                <div className="playerContainer">
                    <button onClick={increaseScore}>INCREASE SCORE</button>
                </div>
            )}
        </div>
    );
};

export default Game;