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

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
        data.id = socket.id;
        let song = "";
        if(users[0] !== undefined) {
            JSON.stringify(users[0]);
            const songList = songs[users[0].mode];
            if(songList !== undefined) {
                song = songList[Math.floor(Math.random() * songList.length)].url;
            }
        }
        data.url = song;
        users.push(data);
        console.log(`Updated player list: ${users}`);
    });

    socket.on("track_players", (data) => {
        // update users array
        socket.to(data).emit("receive_players", users);
    });

    socket.on("increase_score", (data) => {
        users.map((user) => {
            if(user.name === data) {
                user.score = user.score + 1;
            }
        });
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