import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import app from "./app.js";
import mongoDBConnect from "./config/db.js";
import { createServer } from "http";
import { setUpSocket } from "./utilis/socket.js";



process.on("uncaughtException",(err)=>{
    console.log(`Error ${err.message}`);
    console.log("Server is shutting down, due to uncaught exception errors");
    process.exit(1);
    
})
mongoDBConnect()
let port = process.env.PORT || 8000;

let httpServer= createServer(app);
setUpSocket(httpServer);
let server= httpServer.listen(port,()=>{
    console.log(`app is running on ${port} port`);      
})


process.on("unhandledRejection",(err)=>{
    console.log("Error",err.message);
    console.log("Server is shutting down, due to unhandle promise rejection");
    server.close(()=>{
        process.exit(1);
    })
    
})


