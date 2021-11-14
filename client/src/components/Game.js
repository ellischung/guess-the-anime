import React, { useEffect, useState } from 'react';
import songs from '../data/songs.json';

function Game({ socket, username, room }) {
    // display states
    const [selectType, setSelectType] = useState(true);
    const [selectDifficulty, setSelectDifficulty] = useState(false);
    const [game, setGame] = useState(false);

    // state for mode selection
    const [selected, setSelected] = useState("");

    // game states
    const [players, setPlayers] = useState([]);

    const refreshPlayers = async () => {
        const playerData = {
            name: username,
            room: room
        };
        await socket.emit("refresh_players", playerData);
        setPlayers((list) => [...list, playerData.name]);
    };

    useEffect(() => {
        refreshPlayers();

        socket.on("receive_players", (data) => {
            setPlayers((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className="gameContainer">
            <div className="playersContainer">
                {players.map((name) => {
                    return <h1>{name}</h1>;
                })}
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