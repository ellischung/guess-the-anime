import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
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
    if(userName !== "" && room !== "" && mode !== "" && win !== 0) {
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
          <TextField 
            label="Name..." 
            variant="outlined" 
            style={{marginBottom: '20px'}}
            onChange={(event) => {
              setUserName(event.target.value);
            }} 
          />
          <TextField 
            label="Room ID..." 
            variant="outlined" 
            style={{marginBottom: '20px'}}
            onChange={(event) => {
              setRoom(event.target.value);
            }} 
          />
          <FormControl fullWidth>
            <InputLabel>Mode</InputLabel>
            <Select
              style={{marginBottom: '20px'}}
              onChange={(event) => {
                setMode(event.target.value);
              }}
            >
              <MenuItem value="openings">ALL Openings</MenuItem>
              <MenuItem value="endings">ALL Endings</MenuItem>
              <MenuItem value="osts">ALL OSTs</MenuItem>
              <MenuItem value="easy-openings">Easy Openings</MenuItem>
              <MenuItem value="medium-openings">Medium Openings</MenuItem>
              <MenuItem value="hard-openings">Hard Openings</MenuItem>
              <MenuItem value="easy-endings">Easy Endings</MenuItem>
              <MenuItem value="medium-endings">Medium Endings</MenuItem>
              <MenuItem value="hard-endings">Hard Endings</MenuItem>
              <MenuItem value="easy-osts">Easy OSTs</MenuItem>
              <MenuItem value="medium-osts">Medium OSTs</MenuItem>
              <MenuItem value="hard-osts">Hard OSTs</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Points to win</InputLabel>
            <Select
              style={{marginBottom: '20px'}}
              onChange={(event) => {
                setWin(event.target.value);
              }}
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="15">15</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="25">25</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined"
            style={{
              borderRadius: 15,
              backgroundColor: '#73787C',
              color: '#b9f2ff',
              marginTop: '30px', 
              width: '110px', 
              height: '40px',
              textTransform: 'none'
            }} 
            onClick={joinRoom}
          >
            Join Game
          </Button>
        </div>
      ) : (
        <Game socket={socket} username={userName} room={room} />
      )}
    </div>
  );
}

export default App;