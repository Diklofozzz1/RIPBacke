// import {Sequelize} from "sequelize";
// import {DataTypes} from "sequelize";

const {Sequelize, DataTypes} = require('sequelize');


const Connect = new Sequelize(
    'RIPdb',
    'postgres',
    'gqallxxx79311',
    {
        dialect: 'postgres',
        host: 'localhost',
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

module.exports = {Connect}