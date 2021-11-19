const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

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
        users.push(data);
        console.log(`Updated player list: ${users}`);
    });

    socket.on("track_players", (data) => {
        socket.to(data).emit("receive_players", users);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});