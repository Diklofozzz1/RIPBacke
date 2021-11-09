const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {Connect} = require("./models/db_model");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{});

const port = 7931;

io.on("connection", async (socket) => {
    try{
        socket.on("get_all_descriptions", async ()=>{
            Connect.models.Description.findAll().then(res => {
                socket.emit("init_page",res);
                console.log('hello')
            })
        })

        socket.on("patch_description", async (arg)=>{
            try{
                const data = await Connect.models.Description.findOne({
                    where:{
                        id: arg.id
                    }
                })

                await data.update({
                    description: arg.description
                })

                socket.emit('patch_patch_description_answer', data)
            }catch (err){
                io.emit("err",err);
            }
        });

        socket.on("create_description", async (arg)=>{
            try{
                const data = await Connect.models.Description.create({
                    description: arg.description
                })

                socket.emit('create_description_answer', data)
            }catch (err){
                io.emit("err",err);
            }
        })

        socket.on("delete_description", async (arg)=>{
            try{
                const data = await Connect.models.Description.findOne({
                    where:{
                        id: arg.id
                    }
                })
                await data.destroy()
            }catch (err){
                io.emit("err",err);
            }
        })

    }catch (err){
        io.emit("err",err);
    }
});



httpServer.listen(port, ()=>{
    console.log(`SocketIO server on port: ${port}`);
});