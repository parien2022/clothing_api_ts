import dotenv from 'dotenv';

dotenv.config();

const MongoClient = require('mongodb').MongoClient;
let database: any;

const startDb = (callback: any) => {
    if(database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }

    MongoClient.connect(process.env.MONGO_URL)
    .then((client: any) => {
        database = client;
        callback(null, database)
    })
    .catch((err: any) => {
        callback(err);
    })
}

const getDataBase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database
}

module.exports = { startDb, getDataBase };