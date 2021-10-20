import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;
const CONNECTION_PORT = 'localhost:3002/';

function App() {
  // Before login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');

  // After login

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit('join_room', room);
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input type="text" placeholder="Name..." onChange={(e) => {setUserName(e.target.value)}}/>
            <input type="text" placeholder="Room..." onChange={(e) => {setRoom(e.target.value)}}/>
          </div>
          <button onClick={connectToRoom}>Enter Game</button>
        </div>
      ): (
        <h1>Game Starts Here</h1>
      )}
    </div>
  );
}

export default App;