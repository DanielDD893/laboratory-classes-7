const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');

let database;

const mongoConnect = async (callback) => {
    try {
        const client = await MongoClient.connect(
            `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.dwmv4yl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );
        console.log('Connection to the database has been established.');
        database = client.db('shop');
        callback();
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
};

const getDatabase = () => {
    if (!database) {
        throw new Error('No database found.');
    }
    return database;
};

module.exports = {
    mongoConnect,
    getDatabase
}; 