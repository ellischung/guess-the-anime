import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, Button } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ReactPlayer from 'react-player';
import ScrollToBottom from 'react-scroll-to-bottom';

function Game({ socket, username, room }) {
    // display states
    const [game, setGame] = useState(true);

    // game states
    const [players, setPlayers] = useState([]);
    const [answer, setAnswer] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [winner, setWinner] = useState("");

    // get users
    socket.emit("track_players", room);

    // refresh user data for every change
    useEffect(() => {
        // update user data through server socket
        socket.on("receive_players", (data) => {
            setPlayers(data);
        });

        // update message list through server socket
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        // end the game through server socket
        socket.on("set_game", (data) => {
            setWinner(data);
            setGame(false);
        });
    }, [socket]);

    // increase user's score upon correct answer
    const increaseScore = () => {
        // set up message data to send to server
        const messageData = {
            room: room,
            name: username,
            message: answer,
            time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
        };

        // compare input to both answers from songs json
        const newAnswer = answer.replace(/\/|:|-|\s+/g, "").toLowerCase();
        const engAnswer = players[1].eng_answer.replace(/\/|:|-|\s+/g, "");
        const japAnswer = players[1].jap_answer.replace(/\/|:|-|\s+/g, "");

        // increase score if equal
        if((newAnswer === engAnswer) || (newAnswer === japAnswer)) {
            socket.emit("increase_score", username);
        }

        // send the message
        socket.emit("send_message", messageData);

        // update the message list and clear user input
        setMessageList((list) => [...list, messageData]);
        setAnswer("");
    };

    // check for winner
    const checkScore = (name, score) => {
        if(score === parseInt(players[0].win)) {
            socket.emit("end_game", { room: room, name: name });
        }
    };

    // skip currently playing song
    const skipSong = () => {
        socket.emit("skip_song", username);
    };
    
    return (
        <div>
            <Grid container spacing={4} style={{marginBottom: '20px'}}>
                {players.map((player) => {
                    checkScore(player.name, player.score);
                    return (
                        <Grid 
                            item 
                            style={{
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center'
                            }}
                        >
                            <PersonIcon />
                            <Typography>{player.name}</Typography>
                            <Typography>{player.score}</Typography>
                        </Grid>
                    )
                })}
            </Grid>
            {!game ? (
                <Typography>{winner} wins!</Typography>
            ) : (
                // game starts here
                <div>
                    <ReactPlayer 
                        width='0px'
                        height='0px'
                        playing={true}
                        url={players[1] !== undefined ? players[1].url : ""}
                    />
                    {/* {console.log(players[1].url)} */}
                    <div className="chat-window">
                        {players[1] !== undefined ?
                            <>
                                <div className="chat-body">
                                    <ScrollToBottom className="message-container">
                                        {messageList.map((messageContent) => {
                                            return (
                                                <div
                                                    className="message"
                                                    id={username === messageContent.name ? "you" : "other"}
                                                >
                                                    <div>
                                                        <div className="message-content">
                                                            <p>{messageContent.message}</p>
                                                        </div>
                                                        <div className="message-meta">
                                                            <p id="time">{messageContent.time}</p>
                                                            <p id="name">{messageContent.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ScrollToBottom>
                                </div>
                                <TextField 
                                    variant="standard" 
                                    value={answer}
                                    placeholder="Guess the anime..."
                                    style={{marginBottom: '20px'}}
                                    onChange={(event) => {
                                        setAnswer(event.target.value);
                                    }} 
                                    onKeyPress={(event) => {
                                        event.key === "Enter" && increaseScore();
                                    }}
                                />
                                <Button onClick={increaseScore}><SendIcon /></Button>
                            </>
                        :
                            <Typography>Waiting for Player 2...</Typography>
                        }
                    </div>
                    {players[1] !== undefined &&
                        <Button 
                            variant="contained" 
                            style={{
                                width: '70px',
                                height: '30px',
                                marginTop: '20px',
                                backgroundColor: '#73787C',
                                color: '#b9f2ff',
                                textTransform: 'none'
                            }} 
                            onClick={skipSong}
                        >
                            Skip <SkipNextIcon />
                        </Button> 
                    } 
                </div>
            )}
        </div>
    );
};

export default Game;