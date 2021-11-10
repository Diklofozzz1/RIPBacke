const ampq = require('amqplib/callback_api');
const {Sequelize, DataTypes} = require("sequelize");

const Connect = new Sequelize(
    'host',
    'host',
    'gqallxxx79311',
    {
        dialect: 'postgres',
        host: 'ripbacke_db_1',
        port: 5432,
        logging: false
    }
);

const User = Connect.define(
    'User',
    {
        firstName:{
            type: DataTypes.STRING
        },
        lastName:{
            type: DataTypes.STRING
        },
        password:{
            type: DataTypes.STRING
        }
    }
);

async function deleteFromBD(id){
    try{
        const data = await Connect.models.User.findOne({
            where: {
                id: id
            }
        })

        await data.destroy()
    }catch (err) {
        console.log(`что то пошло совсем не так: ${err}`);
    }
}


ampq.connect('amqp://rabbitmq:5672', (err, connection)=> {
    if(err){
        throw err;
    }
    connection.createChannel((err, channel)=>{
        if(err){
            throw err;
        }

        let queueName = "DeleteRequests";

        channel.assertQueue(queueName, {
            durable: false
        });

        channel.consume(queueName, async (msg)=>{
            console.log(`Message received: ${msg.content.toString()}`)
            await deleteFromBD(parseInt(msg.content))
            channel.ack(msg)
        })

    })
})