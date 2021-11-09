// import Connect from "./models/db_model.js";
const {Connect} = require ('./models/db_model.js');

const express = require("express");
const cors = require("cors");

const http = require("http");
const bodyParser = require("body-parser");

const server = express();
const port = 3070;

server.use(bodyParser.urlencoded({
    extended:true
}));

server.use(bodyParser.json());
server.use(express.json());
server.use(cors());

const app = http.Server(server);


const ampq = require('amqplib/callback_api');

function ampqSender(id){
    ampq.connect('amqp://rabbitmq:5672', (err, connection)=> {
        if(err){
            throw err;
        }
        connection.createChannel((err, channel)=>{
            if(err){
                throw err;
            }
            let queueName = "DeleteRequests";
            let message = id;

            channel.assertQueue(queueName, {
                durable: false
            });

            channel.sendToQueue(queueName, Buffer.from(message));
            console.log(`Message sended. Context: ${message.toString()}`)
        })
    })
}

server.get('/init_db', (req,res)=>{
    Connect.sync().then()
});

server.post('/create_user', async (req,res)=>{
    try{
        res.status(200).json(
                await Connect.models.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password
            })
        )
    }catch (err){
        res.status(500).json(err)
    }
})

server.get('/get_all_users', async (_,res)=>{
    try{
        res.status(200).json(
            await Connect.models.User.findAll()
        )
    }catch (err){
        res.status(500).json(err)
    }
})

server.get('/get_user_by_name', async (req, res)=>{
    try{
        res.status(200).json(
            await Connect.models.User.findAll({
                where: {
                    firstName: req.query.firstName
                }
            })
        )
    }catch (err){
        res.status(500).json(err)
    }
})

server.patch('/update_user_data/:id', async (req,res)=>{
    try{
        const data = await Connect.models.User.findOne({
            where: {
                id: req.params.id
            }
        })

        res.status(200).json(
            await data.update({
               ...data,
                ...req.body
            })
        )
    }catch (err){
        res.status(500).json(err)
    }
})

server.delete('/delete_user_data/:id', async (req, res)=>{
    try{
        // const data = await Connect.models.User.findOne({
        //     where: {
        //         id: req.params.id
        //     }
        // })
        //
        // res.status(200).json(
        //     await data.destroy()
        // )
        ampqSender(req.params.id)

        res.status(200).json({
            queue: `send message to delete user by id: ${req.params.id}`
        })
    }catch (err){
        res.status(500).json(err)
    }
})

server.listen(port, ()=>{
    console.log(`Server listening on the port: ${port}`);
});