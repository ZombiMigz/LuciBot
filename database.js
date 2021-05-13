const Sequelize = require('sequelize');

let database;

module.exports = {
    init: () => database = new Sequelize(os.environ.get('DATABASE_URL')),
    getDatabase: () => {return database}
}

