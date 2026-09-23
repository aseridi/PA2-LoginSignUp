require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {MongoClient } = require("mongodb");

const app = express();
const client = new MongoClient(process.env.MONGO_URI);

app.use(express.json());
app.use(cors());


let users;
async function connectDatabase() {
    try {
        await client.connect();
        const db = client.db("pa2");
        users = db.collection("users");
        console.log("connected to mongoDB");
    } catch (error) {
        console.error("coule not connect to MongoDB");
        console.error(error);
    }
}


app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


//signup route
app.post("/signup", async (req, res) => {
    try {
        const f_name = req.body.f_name?.trim();
        const l_name = req.body.l_name?.trim();
        const username = req.body.username?.trim();
        const password = req.body.password;

        if (!f_name || !l_name || !username || !password) {
            return res.status(400).json({message: "please make sure to fill all the fields!"})
        }
        const existingUser = await users.findOne({username: username});
        if (existingUser) {
            return res.status(409).json({message: "username taken, choose a different username."});
        }
        await users.insertOne({ f_name, l_name, username, password});
        res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});


connectDatabase();
app.listen(9000, () => {
  console.log("Server running on port 9000");
});