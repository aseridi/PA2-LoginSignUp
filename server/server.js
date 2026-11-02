require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.json({ message: "Server is running" }));

app.use("/", require("./routes/users"));
app.use("/projects", require("./routes/projects"));
app.use("/projects", require("./routes/stories"));

connectDatabase();
app.listen(9000, () => console.log("Server running on port 9000"));