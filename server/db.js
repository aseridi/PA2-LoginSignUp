// db.js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDatabase() {
    try {
        await client.connect();
        db = client.db("pa2");
        console.log("connected to mongoDB");
    } catch (error) {
        console.error("coule not connect to MongoDB");
        console.error(error);
    }
}


function getDb() {
  return db;
}

module.exports = { connectDatabase, getDb };