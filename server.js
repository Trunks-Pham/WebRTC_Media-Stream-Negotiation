import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server);
const allusers = {};

const __dirname = dirname(fileURLToPath(import.meta.url));

// Exposing public directory to outside world
app.use(express.static("public"));

// Handle incoming HTTP request
app.get("/", (req, res) => {
    console.log("GET Request /");
    res.sendFile(join(__dirname + "/app/index.html"));
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`Someone connected to socket server and socket id is ${socket.id}`);

    // Handle user joining
    socket.on("join-user", (username) => {
        if (!username || typeof username !== "string" || username.trim() === "") {
            console.error("Invalid username received:", username);
            return;
        }
        console.log(`${username} joined socket connection`);
        allusers[username] = { username, id: socket.id };
        // Inform everyone that someone joined
        io.emit("joined", allusers);
    });

    // Handle offer
    socket.on("offer", ({ from, to, offer }) => {
        console.log({ from, to, offer });
        if (!from || !to || typeof from !== "string" || typeof to !== "string") {
            console.error("Invalid 'from' or 'to' in offer:", { from, to });
            return;
        }
        if (allusers[to] && allusers[to].id) {
            io.to(allusers[to].id).emit("offer", { from, to, offer });
        } else {
            console.error(`User ${to} not found in allusers. Cannot send offer from ${from}`);
        }
    });

    // Handle answer
    socket.on("answer", ({ from, to, answer }) => {
        if (!from || !to || typeof from !== "string" || typeof to !== "string") {
            console.error("Invalid 'from' or 'to' in answer:", { from, to });
            return;
        }
        if (allusers[from] && allusers[from].id) {
            io.to(allusers[from].id).emit("answer", { from, to, answer });
        } else {
            console.error(`User ${from} not found in allusers. Cannot send answer to ${to}`);
        }
    });

    // Handle end-call
    socket.on("end-call", ({ from, to }) => {
        if (!from || !to || typeof from !== "string" || typeof to !== "string") {
            console.error("Invalid 'from' or 'to' in end-call:", { from, to });
            return;
        }
        if (allusers[to] && allusers[to].id) {
            io.to(allusers[to].id).emit("end-call", { from, to });
        } else {
            console.error(`User ${to} not found in allusers. Cannot send end-call from ${from}`);
        }
    });

    // Handle call-ended
    socket.on("call-ended", (caller) => {
        const [from, to] = caller;
        if (!from || !to || typeof from !== "string" || typeof to !== "string") {
            console.error("Invalid 'from' or 'to' in call-ended:", { from, to });
            return;
        }
        if (allusers[from] && allusers[from].id) {
            io.to(allusers[from].id).emit("call-ended", caller);
        } else {
            console.error(`User ${from} not found in allusers. Cannot send call-ended`);
        }
        if (allusers[to] && allusers[to].id) {
            io.to(allusers[to].id).emit("call-ended", caller);
        } else {
            console.error(`User ${to} not found in allusers. Cannot send call-ended`);
        }
    });

    // Handle ICE candidate
    socket.on("icecandidate", (candidate) => {
        console.log({ candidate });
        // Broadcast to other peers
        socket.broadcast.emit("icecandidate", candidate);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User with socket id ${socket.id} disconnected`);
        for (let username in allusers) {
            if (allusers[username].id === socket.id) {
                delete allusers[username];
                // Inform everyone that someone left
                io.emit("joined", allusers);
                break;
            }
        }
    });
});

server.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});