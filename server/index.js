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
    socket.on("room", payload => {
        const room = Object.keys(rooms).find(key => rooms[key])
        socket.to(payload).emit("payload", room)
        console.log("sent to user", payload)
    });

    socket.on("Send_message", payload => {
        try {
            const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
            console.log(roomID ? true : false, socket.id + " belongs to room " + Object.keys(rooms).find(key => rooms[key]));
            if (roomID) {
                const otherUser = rooms[roomID].find(id => id !== socket.id);
                console.log(otherUser + " is the other user")
                socket.to(otherUser).emit("receive-message", {
                    recipients: socket.id, sender: payload.sender, text: payload.text
                });
                console.log(`${payload.message} sent to ${otherUser}`);
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