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

// game variables
let users = {};
let userIDs = {};
let selectedSongs = {};
let songList = [];
let index = 0;

const newURL = (room) => {
    // remove song from list
    selectedSongs[room].splice(index, 1);

    // if selectedSongs is empty, we return
    if(selectedSongs[room].length === 0) return;

    // get a new song URL to send to client
    index = Math.floor(Math.random() * selectedSongs[room].length);
    users[room][1].url = selectedSongs[room][index].url;
    users[room][1].eng_answer = selectedSongs[room][index].eng_name;
    users[room][1].jap_answer = selectedSongs[room][index].jap_name;

    // reset skips for all users
    users[room][0].skip = false;
    users[room][1].skip = false;
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        // connect the client to the room 
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);

        // set the user data prop with the new socket id and also add it to userIDs
        data.id = socket.id;
        userIDs[socket.id] = data.room;

        // if room exists, set all game data before passing to array. if it doesn't exist, we create it and add to users
        if(users[data.room]) {
            // if songs for a given room is undefined, we create a new one and populate it with songs from selected mode
            if(selectedSongs[data.room] === undefined) {
                // get songs for selected mode
                JSON.stringify(users[data.room][0]);
                if((users[data.room][0].mode === "openings") || 
                (users[data.room][0].mode === "endings") || 
                (users[data.room][0].mode === "osts")) {
                    Object.keys(songs).map((mode) => {
                        if(mode.includes(users[data.room][0].mode)) songList = songList.concat(songs[mode]);
                    });
                } else {
                    songList = songs[users[data.room][0].mode];
                }
                // set user data with song url and answers
                if(songList !== undefined) {
                    index = Math.floor(Math.random() * songList.length);
                    data.url = songList[index].url;
                    data.eng_answer = songList[index].eng_name;
                    data.jap_answer = songList[index].jap_name;
                }
                // add everything to selectedSongs at given room
                selectedSongs[data.room] = songList;
                // reset songList after selectedSongs is set
                songList = [];
            } 
            users[data.room].push(data);
        } else {
            users[data.room] = [data];
        }
    });

    socket.on("track_players", (data) => {
        // update users array
        socket.to(data).emit("receive_players", users[data]);
    });

    socket.on("increase_score", (data) => {
        // increase user's score and then reset URL
        users[data.room].map((user) => {
            if(user.name === data.name) user.score = user.score + 1;
        });
        newURL(data.room);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("end_game", (data) => {
        socket.to(data.room).emit("set_game", data.name);
    });

    socket.on("skip_song", (data) => {
        // set skip to true for the user who requested it
        users[data.room].map((user) => {
            if(user.name === data.user) user.skip = true;
        });

        // when both skips are true, skip song and send message to all users
        if((users[data.room][0].skip === true) && (users[data.room][1].skip === true)) {
            io.in(data.room).emit("receive_message", data);
            newURL(data.room);
        }
    });

    socket.on("disconnect", () => {
        // remove from users and selectedSongs array
        Object.keys(users).map((room) => {
            if(room === userIDs[socket.id]) {
                delete users[room];
                delete selectedSongs[room];
            }
        });      
        console.log("User disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});