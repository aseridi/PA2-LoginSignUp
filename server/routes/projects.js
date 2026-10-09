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
        const description = req.body.description.trim();
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

        const result = await projects.insertOne({ name, description, status, project_lead_id: leadId });
        await memberships.insertOne({ project_id: result.insertedId, user_id: leadId });
        res.status(201).json({message: "Project created successfully"});


    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
});
// [{_id, name, description, status, project_lead}]
router.get("/", async (req, res) => {
    const projects = getDb().collection("projects");
    const users = getDb().collection("users");
    try {
        const allProjects = await projects.find().toArray();
        const allUsers = await users.find().toArray();
        const userMap = new Map(allUsers.map(u => [u._id.toString(), u]));
        const result = allProjects.map(project => ({
            _id: project._id,
            name: project.name,
            description: project.description,
            status: project.status,
            project_lead: userMap.get(project.project_lead_id.toString())?.username ?? "Unknown"
        }));
        res.status(200).json(result);  
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
});

router.get("/:projectId/members", async (req, res) => {
    const projectId = req.params.projectId;
    const memberships = getDb().collection("memberships");
    if (!ObjectId.isValid(projectId)) {
        return res.status(400).json({message: "Invalid project ID"});
    }

    try {
        const project = await getDb().collection("projects").findOne({_id: new ObjectId(projectId)});
        if (!project) {
            return res.status(404).json({message: "Project not found"});
        }
        const projectMembership = await memberships.find({project_id: new ObjectId(projectId)}).toArray();
        const userIds = projectMembership.map(m => m.user_id);
        const users = getDb().collection("users");
        const projectMembers = await users.find({_id: {$in: userIds}}, {projection: {password: 0}}).toArray();
        res.status(200).json(projectMembers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }

});

router.post("/:projectId/members", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.body.user_id;
    const memberships = getDb().collection("memberships");
    if (!ObjectId.isValid(projectId) || !ObjectId.isValid(userId)) {
        return res.status(400).json({message: "Invalid project ID or user ID"});
    }
    const projectObjectId = new ObjectId(projectId);
    const userObjectId = new ObjectId(userId);
    try {
        const project = await getDb().collection("projects").findOne({_id: projectObjectId});
        if (!project) {
            return res.status(404).json({message: "Project not found"});
        }
        const user = await getDb().collection("users").findOne({_id: userObjectId});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const existingMember = await memberships.findOne({project_id: projectObjectId, user_id: userObjectId});
        if (existingMember) {
            return res.status(409).json({message: "User is already a member of this project"});
        }
        await memberships.insertOne({project_id: projectObjectId, user_id: userObjectId});
        res.status(201).json({message: "User added to project successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
});

router.delete("/:projectId/members/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const memberships = getDb().collection("memberships");
    if (!ObjectId.isValid(projectId) || !ObjectId.isValid(userId)) {
        return res.status(400).json({message: "Invalid project ID or user ID"});
    }
    const projectObjectId = new ObjectId(projectId);
    const userObjectId = new ObjectId(userId);

    try {
        const project = await getDb().collection("projects").findOne({_id: projectObjectId});
        if (!project) {
            return res.status(404).json({message: "project not found"});
        }
        const user = await getDb().collection("users").findOne({_id: userObjectId});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const isMember = await getDb().collection("memberships").findOne({project_id: projectObjectId, user_id: userObjectId});
        if(!isMember){
            return res.status(404).json({message: "user is not a member of this project"});
        }
        const isLead = await project.project_lead_id.equals(userObjectId);
        if (isLead) {
            return res.status(403).json({message: "Cannot delete project lead"});
        }
        await memberships.deleteOne({project_id: projectObjectId, user_id: userObjectId});
        return res.status(200).json({message: "member deleted"});

    } catch (error){
        console.error(error);
        return res.status(500).json({message: "Server error"})
    }
});

module.exports = router;