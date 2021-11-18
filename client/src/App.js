import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Game from './components/Game';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);

  const joinRoom = () => {
    if(userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowGame(true);
    }
  };

  return (
    <div className="App">
      {!showGame ? (
        <div className="joinGameContainer">
          <h3>Guess The Anime</h3>
          <input 
            type="text" 
            placeholder="Name..." 
            onChange={(event) => {
              setUserName(event.target.value);
            }} 
          />
          <input 
            type="text" 
            placeholder="Room ID..." 
            onChange={(event) => {
              setRoom(event.target.value);
            }} 
          />
          <button onClick={joinRoom}>Join Game</button>
        </div>
      ) : (
        <Game socket={socket} username={userName} room={room} score={score} setScore={setScore} />
      )}
    </div>
  );
}

export default App;