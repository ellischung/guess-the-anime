const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const songs = require("../client/src/data/songs.json");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

console.log("Easy Openings: " + songs['easy-openings'].length);
console.log("Medium Openings: " + songs['medium-openings'].length);
console.log("Hard Openings: " + songs['hard-openings'].length + "\n");
console.log("Easy Endings: " + songs['easy-endings'].length);
console.log("Medium Endings: " + songs['medium-endings'].length);
console.log("Hard Endings: " + songs['hard-endings'].length + "\n");
console.log("Easy OSTs: " + songs['easy-osts'].length);
console.log("Medium OSTs: " + songs['medium-osts'].length);
console.log("Hard OSTs: " + songs['hard-osts'].length + "\n");

const users = [];
let songList = [];
let easyList = [];
let mediumList = [];
let hardList = [];

const newURL = () => {
    // get a new song URL to send to client
    const index = Math.floor(Math.random() * songList.length);
    users[1].url = songList[index].url;
    users[1].eng_answer = songList[index].eng_name;
    users[1].jap_answer = songList[index].jap_name;

    // reset skips for all users
    users[0].skip = false;
    users[1].skip = false;
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        // connect the client to the room 
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
        data.id = socket.id;

        // set song and answer variables and pass them to the player data
        let song = "";
        let eng = "";
        let jap = "";
        if(users[0] !== undefined) {
            JSON.stringify(users[0]);
            if((users[0].mode === "openings") || (users[0].mode === "endings") || (users[0].mode === "osts")) {
                Object.keys(songs).map((mode) => {
                    if(mode.includes(users[0].mode) && mode.includes("easy")) easyList = songs[mode];
                    if(mode.includes(users[0].mode) && mode.includes("medium")) mediumList = songs[mode];
                    if(mode.includes(users[0].mode) && mode.includes("hard")) hardList = songs[mode];
                });
                songList = easyList.concat(mediumList, hardList);
            } else {
                songList = songs[users[0].mode];
            }
            if(songList !== undefined) {
                const index = Math.floor(Math.random() * songList.length);
                song = songList[index].url;
                eng = songList[index].eng_name;
                jap = songList[index].jap_name;
            }
        }
        data.url = song;
        data.eng_answer = eng;
        data.jap_answer = jap;

        // add player data to users array
        users.push(data);
    });

    socket.on("track_players", (data) => {
        // update users array
        socket.to(data).emit("receive_players", users);
    });

    socket.on("increase_score", (data) => {
        // increase user's score and then reset URL
        users.map((user) => {
            if(user.name === data) {
                user.score = user.score + 1;
            }
        });
        newURL();
    });

    socket.on("end_game", (data) => {
        socket.to(data.room).emit("set_game", data.name);
    });

    socket.on("skip_song", (data) => {
        // set skip to true for the user who requested it
        users.map((user) => {
            if(user.name === data) {
                user.skip = true;
            }
        });

        // when both skips are true, reset URL and skips
        if((users[0].skip === true) && (users[1].skip === true)) {
            newURL();
        }
    });

    socket.on("disconnect", () => {
        // remove the user from the array
        users.map((user, index) => {
            if(user.id === socket.id) {
                users.splice(index, 1);
            }
        });
        console.log("User disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});