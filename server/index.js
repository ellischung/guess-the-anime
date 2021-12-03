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

const users = [];
let songList = [];

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
        data.id = socket.id;
        let song = "";
        let eng = "";
        let jap = "";
        if(users[0] !== undefined) {
            JSON.stringify(users[0]);
            songList = songs[users[0].mode];
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
        users.push(data);
        console.log(`Updated player list: ${users}`);
    });

    socket.on("track_players", (data) => {
        // update users array
        socket.to(data).emit("receive_players", users);
    });

    socket.on("increase_score", (data) => {
        // increase user's score
        users.map((user) => {
            if(user.name === data) {
                user.score = user.score + 1;
            }
        });

        // get the next URL and send it to the client
        const index = Math.floor(Math.random() * songList.length);
        users[1].url = songList[index].url;
        users[1].eng_answer = songList[index].eng_name;
        users[1].jap_answer = songList[index].jap_name;

        // reset skips for all users
        users[0].skip = false;
        users[1].skip = false;
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

        // send a new URL to the client when both skips are true, then reset skips to false
        if((users[0].skip === true) && (users[1].skip === true)) {
            const index = Math.floor(Math.random() * songList.length);
            users[1].url = songList[index].url;
            users[1].eng_answer = songList[index].eng_name;
            users[1].jap_answer = songList[index].jap_name;
            users[0].skip = false;
            users[1].skip = false;
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