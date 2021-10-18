import React, { useState } from "react";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input type="text" placeholder="Name..." />
            <input type="text" placeholder="Room..." />
          </div>
          <button>Enter Game</button>
        </div>
      ): (
        <h1>Game Starts Here</h1>
      )}
    </div>
  );
}

export default App;