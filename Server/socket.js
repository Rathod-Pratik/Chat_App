import { Server as SockerIOServer } from "socket.io";
const SetupSocket=(server)=>{
    const io=new SockerIOServer(server,{
        cors:{

       origin:process.env.ORIGIN,
        methods:["GET","POST"],
        credentials:true
    }
    })
    const userSocketMap=new Map();

    const disconnect=(socket)=>{
        console.log(`client Disconnected : ${socket.id} `)
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId===socket.Id){
                userSocketMap.delete(userId);
                break
            }
        }
    }
    io.on("connection",(socket)=>{
        const userId=socket.handshake.query.userId;
        if(userId){
            userSocketMap.set(userId,socket.id)
            console.log(`User Connected :${userId} with socket ID : ${socket.id}`)
        }else{
            console.log("User id not provided during connection")
        }
        socket.on("disconnect",()=>disconnect(socket))
    })
}
export default SetupSocket;