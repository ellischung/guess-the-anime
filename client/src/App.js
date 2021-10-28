import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  return (
    <div className="App">
      <h3>Guess The Anime</h3>
      <input type="text" placeholder="Name..." onChange={(event) => {setUserName(event.target.value)}} />
      <input type="text" placeholder="Room ID..." onChange={(event) => {setRoom(event.target.value)}} />
      <button onClick={joinRoom}>Join Game</button>
    </div>
  );
}

export default App;