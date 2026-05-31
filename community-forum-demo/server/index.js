const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // send previous messages to new user
  socket.emit("chat-history", messages);

  socket.on("send-message", (data) => {
    messages.push(data);
    io.emit("receive-message", data); // REAL-TIME BROADCAST
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});