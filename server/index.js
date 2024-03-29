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
let masterSocket = null;
app.use(cors())

io.on("connection", socket => {
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    socket.on("join room", roomID => {
        if (!masterSocket) masterSocket = socket.id;

        console.log(rooms[roomID] < 1);
        console.log(`join room ${roomID}`);
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
            const toFindDuplicates = rooms[roomID].filter((item, index) => rooms[roomID].indexOf(item) !== index)
            console.log(toFindDuplicates);
            if (toFindDuplicates.length < 0) return;
            rooms[roomID] = rooms[roomID].filter((v, i, a) => a.indexOf(v) === i);
            console.log(rooms);
        } else {
            rooms[roomID] = [socket.id];
            console.log(rooms);
        }

        const otherUser = rooms[roomID].find(id => id !== socket.id);
        //console.log(otherUser)
        if (!otherUser) return;
        socket.emit("other user", otherUser);
        socket.to(otherUser).emit("user joined", socket.id);

        const usersInThisRoom = rooms[roomID].filter(id => id = socket.id);
        if (!usersInThisRoom) return;
        //console.log(usersInThisRoom);
        socket.to(socket.id).emit("InstancesOfUser", usersInThisRoom);
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("leave room", incoming => {
        console.log(`leave room ${incoming}`);

        console.log(rooms)
        if (rooms[incoming].length < 1) {
            delete rooms[incoming];
            console.log(rooms);
        } else {
            rooms[incoming] = rooms[incoming].filter(id => id !== socket.id);
            console.log(rooms[incoming])
            const otherUser = rooms[incoming].find(id => id !== socket.id);
            socket.to(otherUser).emit("user left", socket.id);
        }
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    socket.on("room", payload => {
        const room = Object.keys(rooms).find(key => rooms[key])
        console.log(room + "on room");
        socket.to(payload).emit("payload", room)
    });

    socket.on("Send_message", payload => {
        try {
            const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
            console.log(roomID ? true : false, socket.id + " belongs to room " + Object.keys(rooms).find(key => rooms[key]));
            if (roomID) {
                const otherUser = rooms[roomID].find(id => id !== socket.id);
                console.log(otherUser + " is the other user")
                socket.to(otherUser).emit("receive-message", {
                    recipients: otherUser, sender: payload.sender, text: payload.text
                });
                console.log(`${payload.message} sent to ${otherUser}`);
            } else {
                console.log("Room not found")
            }
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("videoID", payload => {
        console.log(payload)
        const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
        const usersInThisRoom = rooms[roomID]
        console.log(usersInThisRoom)
        socket.to(usersInThisRoom).emit("youtID", payload)
    })

    socket.on("play", () => {
        const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
        console.log(roomID ? true : false, socket.id + " belongs to room " + Object.keys(rooms).find(key => rooms[key]));
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        socket.to(otherUser).emit("play")
        console.log("played")
    })

    socket.on("pause", () => {
        const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
        console.log(roomID ? true : false, socket.id + " belongs to room " + Object.keys(rooms).find(key => rooms[key]));
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        socket.to(otherUser).emit("pause")
        console.log("paused")
    })

    socket.on("seeked", payload => {
        const roomID = Object.keys(rooms).find(key => rooms[key].includes(socket.id));
        console.log(roomID ? true : false, socket.id + " belongs to room " + Object.keys(rooms).find(key => rooms[key]));
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        socket.to(otherUser).emit("seeked", payload)
        console.log("seeked")
    })
});

const port = 8000;
server.listen(port, () => console.log(`Listening on port ${port}`));