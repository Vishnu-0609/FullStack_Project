import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";
import { createServer } from "http";

import dotenv from "dotenv";
import connectDB from "./src/db/index.js";

import { Documentmodel } from "./src/models/Documents.model.js";
import { User } from "./src/models/user.model.js";
import { Backup } from "./src/models/Backup.model.js";

dotenv.config({
    path:"./.env"
})

const app=express();

app.use(cors({
    origin:process.env.FRONTENED_HOST,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:process.env.FRONTENED_HOST,
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }
});  

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Hello World");
})

import { router } from "./src/routes/route.js";

app.use("/api/v1/user",router);


// circuit

const defaultValue = "";

io.on("connection",(socket)=>{

    socket.on("get-document",async({documentId,documentName})=>{
    
        const document = await findOrCreateDocument(documentId);

        const updateDocument = await Documentmodel.findByIdAndUpdate({_id:document._id},{$set:{name:documentName}});

        socket.join(documentId);
        socket.emit("load-document",document.data);
        socket.on("send-changes",delta=>{
            // console.log(delta);
            socket.broadcast.to(documentId).emit("receive-changes",delta);
        })

        socket.on("save-document",async data =>{
            await Documentmodel.findByIdAndUpdate(documentId,{data})
        })
    })

    socket.on("disconnect",async()=>
    {
        const user = await User.find({socketId:socket.id});
        if(user.length>0)
        {
            // console.log(user);
            const email = user[0]?.email
            // console.log(email);
            await Backup.create({email});
        }
        // console.log(`${socket.id} left room`);
        await User.updateOne({"socketId":socket.id},{$set:{socketId:""}});
    }); 

    socket.on("message",({value,avatar,email,DocumentId})=>{
        
        io.to(DocumentId).emit("receive-message",{value,avatar,email});
        // io.emit("receive-message",data);
        // socket.to(data.room).emit("receive-message",data);
    })

    socket.on("mousemovedata",(data)=>
    {
        socket.broadcast.emit("mousemove",data);
    })

    socket.on("join-room",(room)=>{
        socket.join(room);
    });
    // socket.emit("welcome",`Welcome to server ${socket.id}`);
    // io.emit("welcome","Hii Lalu");
    // socket.broadcast.emit("welcome",`${socket.id} joined server`);
})

connectDB()
.then(()=>{
    server.listen(process.env.PORT,()=>
    {
        console.log(`Server is running on ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log(err);
})

const findOrCreateDocument = async (id) =>
{
    if(id==null) return;
    const document = await Documentmodel.findById(id);

    if(document)
    {
        return document;
    }
    else
    {
        return await Documentmodel.create({_id:id,data:defaultValue});
    }
}
