import { Server as SocketIOServer } from "socket.io"; // Fixed typo
import Message from "./models/MessagesModel.js";
import Channel from './models/ChannelModel.js'

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
    console.log(`client Disconnected : ${socket.id} `);
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

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;
  
    // Create a new message
    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });
  
    // Populate sender data
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();
      
      // Update channel with the new message
      await Channel.findByIdAndUpdate(
        channelId,
        { $push: { messages: createMessage._id } }
      );

    // Fetch channel data and populate members and admin
    const channel = await Channel.findById(channelId)
      .populate("members"); // Make sure admin is populated
  
  
    // Prepare final data
    const finalData = { ...messageData._doc, channelId: channel._id };
    // Emit message to all members
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });
  
      // Emit message to the admin
      const adminSocketId = userSocketMap.get(channel.admin.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
    }
  };
  

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.log("User id not provided during connection"); // Validation added
      return socket.disconnect();
    }

    
  io.on('videoCall',(data)=>{
    const {userId}=data;
    console.log("User id want to call",userId);
    UserToSocketMapping.set(userId,socket.id);

    socket.join(userId);
    socket.broadcast.to(userId).emit("videoCall")
  })

    userSocketMap.set(userId, socket.id);
    console.log(`User Connected :${userId} with socket ID : ${socket.id}`);

    socket.on("sendMessage", async (message) => await sendMessage(message)); // Awaiting async function
    socket.on("send-channel-message",sendChannelMessage)
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default SetupSocket;
