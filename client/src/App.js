import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Game from './components/Game';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [mode, setMode] = useState("");
  const [win, setWin] = useState(0);
  const [showGame, setShowGame] = useState(false);

  const joinRoom = () => {
    if(mode === "" || win === 0) {
      alert("Please fill in all inputs before joining!");
      return;
    }

    if(userName !== "" && room !== "") {
      const playerData = {
        name: userName,
        room: room,
        mode: mode,
        win: win,
        score: 0,
        skip: false,
        url: "",
        eng_answer: "",
        jap_answer: ""
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
            defaultValue={'DEFAULT'}
          >
            <option value="DEFAULT" disabled>Select mode:</option>
            <option value="openings">ALL Openings</option>
            <option value="endings">ALL Endings</option>
            <option value="osts">ALL OSTs</option>
            <option value="easy-openings">Easy Openings</option>
            <option value="medium-openings">Medium Openings</option>
            <option value="hard-openings">Hard Openings</option>
            <option value="easy-endings">Easy Endings</option>
            <option value="medium-endings">Medium Endings</option>
            <option value="hard-endings">Hard Endings</option>
            <option value="easy-osts">Easy OSTs</option>
            <option value="medium-osts">Medium OSTs</option>
            <option value="hard-osts">Hard OSTs</option>
          </select>
          <select 
            id="win" 
            onChange={(event) => {
              setWin(event.target.value);
            }}
            defaultValue={'DEFAULT'}
          >
            <option value="DEFAULT" disabled>Points to win:</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </select>
          <button onClick={joinRoom}>Join Game</button>
        </div>
      ) : (
        <Game socket={socket} username={userName} room={room} />
      )}
    </div>
  );
}

export default App;