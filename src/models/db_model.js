// import {Sequelize} from "sequelize";
// import {DataTypes} from "sequelize";

const {Sequelize, DataTypes} = require('sequelize');


const Connect = new Sequelize(
    'host',
    'host',
    'gqallxxx79311',
    {
        dialect: 'postgres',
        host: 'ripbacke-db-1',
        // host: '0.0.0.0',
        // port: 5000,
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

const Description = Connect.define(
    'Description',
    {
        description:{
            type: DataTypes.STRING
        }
    }
);


module.exports = {Connect}