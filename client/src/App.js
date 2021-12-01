import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Game from './components/Game';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [mode, setMode] = useState("");
  const [score, setScore] = useState(0);
  const [showGame, setShowGame] = useState(false);

  const joinRoom = () => {
    if(userName !== "" && room !== "") {
      const playerData = {
        name: userName,
        room: room,
        mode: mode,
        score: score,
        url: ""
      }
      socket.emit("join_room", playerData);
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
          <select 
            id="mode" 
            onChange={(event) => {
              setMode(event.target.value);
            }} 
          >
            <option value="easy-openings" selected="selected">Easy Openings</option>
            <option value="medium-openings">Medium Openings</option>
            <option value="hard-openings">Hard Openings</option>
            <option value="easy-endings">Easy Endings</option>
            <option value="medium-endings">Medium Endings</option>
            <option value="hard-endings">Hard Endings</option>
            <option value="easy-osts">Easy OSTs</option>
            <option value="medium-osts">Medium OSTs</option>
            <option value="hard-osts">Hard OSTs</option>
          </select>
          <button onClick={joinRoom}>Join Game</button>
        </div>
      ) : (
        <Game socket={socket} username={userName} room={room} score={score} setScore={setScore} />
      )}
    </div>
  );
}

export default App;