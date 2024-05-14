const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Message=require('./messageModel.js');
const mongoose =require('mongoose')
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const cors = require("cors");


const dbConnection=async()=>{

    try {
        await mongoose.connect("mongodb+srv://suryanshverma_1:ansh9580104753@cluster0.4b1qo6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('db connected')
     } catch (error) {
         console.log('error in connection')
     }
}

dbConnection();

app.use(cors());
app.use(express.json());

const socketToUserMap = new Map();
const UserToSocketMap=new Map();

io.on("connection", (socket) => {


    //saving users
  socket.on("userId", (ourId) => {

    socketToUserMap[socket.id] = ourId;
    UserToSocketMap[ourId]=socket.id;
    console.log(socketToUserMap);
  });


  
  socket.on('message',async(messageObj)=>{
     const message=new Message(messageObj);
    

     const recipientSocketId= UserToSocketMap[messageObj.recipient]
     console.log("recipient is ",recipientSocketId)
     io.to(recipientSocketId).emit('message',message);
     await message.save();
     console.log(message);
  })

  socket.on("disconnect", () => {
    console.log("disconnected");
    delete UserToSocketMap[socketToUserMap[socket.id]]
    delete socketToUserMap[socket.id];
    
  });
});

io.listen(8000);
