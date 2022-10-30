const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        orgin: "*",
        Methods: ["GET", "POST"]
    }
});

const rooms = {};


app.use(cors())

io.on("connection", socket => {
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    socket.on("join room", roomID => {
        console.log(`join room ${roomID}`);
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
            console.log(rooms);
        }
        else {
            rooms[roomID] = [socket.id];
            console.log(rooms);
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.on("Send_message", payload => {
        try {
            //check which room the socket id belongs to 
            const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
            console.log(roomID ? true : false, socket.id + " belongs to room " + Object.keys(rooms).find(key => rooms[key]));
            if (roomID) {
                const otherusers = Object.keys(rooms).find(key => rooms[key])
                io.to(otherusers).emit("create message", payload.message);
            } else {
                console.log("Room not found")
            }
        } catch (error) {
            console.log(error)
        }
    })

});

const port = 8000
server.listen(port, () => console.log(`Listening on port ${port}`));