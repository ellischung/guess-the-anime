import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

function Game({ socket, username, room, score, setScore }) {
    // display states
    const [game, setGame] = useState(true);

    // game states
    const [players, setPlayers] = useState([]);
    const [answer, setAnswer] = useState("");

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
                <div>Winner is displayed here</div>
            ) : (
                // GAME STARTS HERE
                <>
                    <div className="songsContainer">
                        <ReactPlayer 
                            width='0px'
                            height='0px'
                            playing='true'
                            url='https://www.youtube.com/watch?v=G8CFuZ9MseQ'
                        />
                    </div>
                    <div className="answerContainer">
                        <input
                            type="text"
                            value={answer}
                            placeholder="Guess the anime..."
                            onChange={(event) => {
                                setAnswer(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                event.key === "Enter" && increaseScore();
                            }}
                        />
                        <button onClick={increaseScore}>&#9658;</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Game;