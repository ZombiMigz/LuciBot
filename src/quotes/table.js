const { Sequelize } = require('sequelize/types');
const database = require('../../database');
const {DataTypes} = require('sequelize')

const Table = database.define('quotes', {
    id: {
        type: DataTypes.BIGINT,
    },
    content: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.BIGINT
    }
})