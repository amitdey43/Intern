import {Server} from "socket.io";
import { umChatModel } from "../models/umChatModel.js";

export function setUpSocket(httpServer){
    const io= new Server(httpServer,{
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });
    io.on("connection",(socket)=>{
        console.log("New user connected: ",socket.id);
        socket.on("join_room",async({userid,mentorid})=>{
            const roomid= [userid,mentorid].sort().join("_");
            socket.join(roomid);
            console.log("Room joined",roomid);
            
            let oldMessages = await umChatModel.find({
                $or: [
                    {senderSide:userid,senderRef:"User",receiverSide:mentorid,receiverRef:"Mentor"},
                    {senderSide:mentorid,senderRef:"Mentor",receiverSide:userid,receiverRef:"User"}
                ]
            }).sort({timestamp:1});
            socket.emit("chat:oldMessages", oldMessages);
        })

        socket.on("chat:message", async({senderSide,senderRef,receiverSide,receiverRef,message})=>{
            const roomid= [senderSide,receiverSide].sort().join("_");

            const messagee = await umChatModel.create({
                senderSide,
                senderRef,
                receiverSide,
                receiverRef,
                message
            })

            io.to(roomid).emit("chat:message",messagee)
        })
        
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

}