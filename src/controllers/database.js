const {MongoClient} = require('mongodb');
const {mongodb}  = require('../config');

let dbConnection;

module.exports={
    connectToDb: (cb) => {
        MongoClient.connect(mongodb)
        .then((client) => {
            dbConnection = client.db();
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err);
        })
    },
    getDb: () => {
        return dbConnection
    }
}