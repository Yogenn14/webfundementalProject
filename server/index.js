/*
setup server side steps - yogen
-import donation db in mysql
-install node js kat https://nodejs.org/en
- cd \project_web\server (pegi kat directory server dalam vs)
- npm install
- node . atau node index.js (try dua2 command)

*/

const express = require("express");
const cors = require("cors");
const path = require('path');
const http = require('http'); 
const socketIO = require('socket.io');

const userRoutes = require("./routes/user");
const donationRoutes = require("./routes/donation");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '..')));

app.use("/users", userRoutes);
app.use("/donations", donationRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
});

app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
