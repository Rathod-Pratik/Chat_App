import { Server as SocketIOServer } from "socket.io"; // Fixed typo
import Message from "./models/MessagesModel.js";

const SetupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN, // Added fallback
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`client Disconnected : ${socket.id} `); // Fixed typo in socket.Id
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.log("User id not provided during connection"); // Validation added
      return socket.disconnect();
    }

    userSocketMap.set(userId, socket.id);
    console.log(`User Connected :${userId} with socket ID : ${socket.id}`);

    socket.on("sendMessage", async (message) => await sendMessage(message)); // Awaiting async function
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default SetupSocket;
