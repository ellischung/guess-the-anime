import React, { useEffect, useState } from 'react';
import songs from '../data/songs.json';

function Game({ socket, username, room, score, setScore }) {
    // display states
    const [game, setGame] = useState(false);

    // state for selected mode
    const [mode, setMode] = useState("");

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
                    <button onClick={() => {setMode("easy-openings"); setGame(true);}}>Easy</button>
                    <button onClick={() => {setMode("medium-openings"); setGame(true);}}>Medium</button>
                    <button onClick={() => {setMode("hard-openings"); setGame(true);}}>Hard</button>

                    <button onClick={() => {setMode("easy-endings"); setGame(true);}}>Easy</button>
                    <button onClick={() => {setMode("medium-endings"); setGame(true);}}>Medium</button>
                    <button onClick={() => {setMode("hard-openings"); setGame(true);}}>Hard</button>

                    <button onClick={() => {setMode("easy-osts"); setGame(true);}}>Easy</button>
                    <button onClick={() => {setMode("medium-osts"); setGame(true);}}>Medium</button>
                    <button onClick={() => {setMode("hard-osts"); setGame(true);}}>Hard</button>
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