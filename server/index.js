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

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});


// app.use(express.json());

// const server = app.listen("3002", () => {
//     console.log("Server running on Port 3002...");
// });

// io = socket(server);

// io.on("connection", (socket) => {
//     console.log(socket.id);

//     socket.on("join_room", (data) => {
//         socket.join(data);
//         console.log("USER JOINED ROOM: " + data);
//     });

//     socket.on("disconnect", () => {
//         console.log("USER DISCONNECTED");
//     });
// });