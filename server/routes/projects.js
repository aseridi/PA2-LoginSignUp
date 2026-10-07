const { getDb } = require("../db");
const {ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const projects = getDb().collection("projects");
    const users = getDb().collection("users");
    const memberships = getDb().collection("memberships");
    try {
        const name = req.body.name?.trim();
        const description = req.body.description;
        if (!name || !description) {
            return res.status(400).json({message: "Project name and description are required"});
        }
        const status = req.body.status;
        if (status !== "Planning" && status !== "Active" && status !== "Completed") {
            return res.status(400).json({message: "Invalid status. Please choose from 'Planning', 'Active', or 'Completed'."});
        }
        const project_lead_id= req.body.project_lead_id;
        if (!project_lead_id || !ObjectId.isValid(project_lead_id)) {
            return res.status(400).json({message: "Invalid project lead ID"});
        }

        const leadId = new ObjectId(project_lead_id);
        const existingUser = await users.findOne({_id: leadId});
        if (!existingUser) {
            return res.status(400).json({message: "Project lead does not exist"});
        }

        await projects.insertOne({name, description, status, project_lead_id: leadId});
        const result = await projects.findOne({ name, description, status, project_lead_id: leadId });
        await memberships.insertOne({project_id: result.insertedId, user_id: leadId});
        res.status(201).json({message: "Project created successfully"});


    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
})

module.exports = router;