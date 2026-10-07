const express = require("express");
const { getDb } = require("../db");

const router = express.Router();

//signup route
router.post("/signup", async (req, res) => {
    const users = getDb().collection("users");
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

//login route
router.post("/login", async (req, res) => {
    const users = getDb().collection("users");
    try {
        const username = req.body.username?.trim();
        const password = req.body.password;

        if (!username){
            return res.status(400).json({message: "Please enter your username"});
        }
        if(!password){
            return res.status(400).json({message: "Please enter your password"});
        }

        const existingUser = await users.findOne({username: username});
        if (!existingUser){
            return res.status(401).json({message: "Username does not exist please sign up or use existing username"});
        }
        if (existingUser.password !== password) {
            return res.status(401).json({message: "Wrong password, please try again"});
        }
        return res.status(200).json({message: "Login successful"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/users", async (req, res) => {
    const users = getDb().collection("users");
    try {
        const allUsers = await users.find({}, {projection: {f_name: 1, l_name: 1, username:1}}).toArray();
        res.status(200).json({users: allUsers});    
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});
module.exports = router;