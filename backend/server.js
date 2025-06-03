const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const {notFound, errorHandler} = require("./middleware/errorMiddleware");
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res) =>{
res.send("문제x 굿굿굿");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console.log(`성공! - ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000",
    }
}
)

io.on("connection", (socket) => {
  console.log("소켓 연결됨");

  socket.on("setup",(userData) =>{
    socket.join(userData._id);
    socket.emit("connected");
  })
  socket.on("join chat", (room) => {
   socket.join(room);
    console.log("유저가 채팅방에 들어옴: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) =>{
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat,users not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    })

socket.off("setup", () => {
    console.log("소켓 연결 해제됨");
    socket.leave(userData._id);
  });

});

