require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const PORT= process.env.PORT || 4000;
const app=express();
const { createServer } = require("node:http");
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);
const session = require('express-session');
const Chat = require('./models/chat');

mongoose.connect(process.env.DB_URI);
db=mongoose.connection;
db.on('error',(err)=>console.log(err));
db.once('open',()=>console.log("Connected to database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'finD#74N$*ce8bB#*9HeizrjapUGSG83?><w@',
    resave: false,
    saveUninitialized: false,
      cookie: { secure: false, maxAge: 600000 },
    })
  );

  io.on('connection', (socket) => {
  console.log("A user connected");

  socket.on('joinRoom', ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join('-');
    socket.join(roomId);
    socket.roomId = roomId;
  });

  socket.on('chatMessage', async ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join('-');
    const chat = new Chat({ sender_id: senderId, receiver_id: receiverId, message });
    await chat.save();
    io.to(roomId).emit('message', { senderId, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use('/',require("./routes/routes"));
app.set('view engine', 'ejs');

server.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});

app.use(express.static('css'));
app.use(express.static('scripts'));