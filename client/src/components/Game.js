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
        const newAnswer = answer.replace(/:|-|\s+/g, "").toLowerCase();
        const engAnswer = players[1].eng_answer.replace(/:|-|\s+/g, "");
        const japAnswer = players[1].jap_answer.replace(/:|-|\s+/g, "");
        if((newAnswer === engAnswer) || (newAnswer === japAnswer)) {
            socket.emit("increase_score", username);
        } else {
            alert("wrong answer!");
        }
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
                            playing={true}
                            url={players[1] !== undefined ? players[1].url : ""}
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
                    <div>{players[1] !== undefined ? "Game ready" : "Waiting for Player 2..."}</div>
                </>
            )}
        </div>
    );
};

export default Game;