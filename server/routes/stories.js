const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../db");

const router = express.Router();
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["To Do", "In Progress", "Done"];

router.post("/:projectId/stories", async (req, res) => {
    const projectId = req.params.projectId;
    if(!ObjectId.isValid(projectId)) {
        return res.status(400).json({message: "Invalid Project Id"});
    }
    const projectObjectId = new ObjectId(projectId);
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
    const priority = req.body.priority;

    if (!title) {
        return res.status(400).json({message: "Title is required"})
    }

    if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({message: " Priority must be High, Medium, or Low"});
    }

    const rawAssignee = req.body.assigned_user_id ?? null;
    if (rawAssignee !== null && (typeof rawAssignee !== "string" || !ObjectId.isValid(rawAssignee))) {
        return res.status(400).json({message: "Invalid assigned user Id"});
    }

    try {
        const db = getDb();
        const project= await db.collection("projects").findOne({_id: projectObjectId});
        if (!project) {
            return res.status(404).json({message: "Project not found"});
        }

        let assignedObjectId = null;
        if (rawAssignee !== null) {
            assignedObjectId = new ObjectId(rawAssignee);
            const user = await db.collection("users").findOne({_id: assignedObjectId});
            if (!user) {
                return res.status(404).json({message: "Assigned user not found"});
            }
            const membership = await db.collection("memberships").findOne({project_id: projectObjectId, user_id: assignedObjectId});
            if (!membership){
                return res.status(400).json({message: "assigned user is not a member of this project"});
            }
        }
        

        const newStory = { project_id: projectObjectId, title, description, priority, status: "To Do", assigned_user_id: assignedObjectId};
        const result = await db.collection("UserStories").insertOne(newStory);
        return res.status(201).json({message: "story added to project", story: {_id: result.insertedId, ...newStory}});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "server error"});
    }
});

router.put("/:projectId/stories/:storyId", async (req, res) => {

    const projectId = req.params.projectId;
    if(!ObjectId.isValid(projectId)) {
        return res.status(400).json({message: "Invalid Project Id"});
    }
    const storyId = req.params.storyId;
    if(!ObjectId.isValid(storyId)) {
        return res.status(400).json({message: "Invalid story Id"});
    }
    const projectObjectId = new ObjectId(projectId);
    const storyObjectId = new ObjectId(storyId);
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
    const priority = req.body.priority;
    const status = req.body.status;

    if (!title) {
        return res.status(400).json({message: "Title is required"})
    }

    if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({message: " Priority must be High, Medium, or Low"});
    }

    if(!STATUSES.includes(status)){
        return res.status(400).json({message: "Status must be: To Do, In Progress, or Done"});
    }

    const rawAssignee = req.body.assigned_user_id ?? null;
    if (rawAssignee !== null && (typeof rawAssignee !== "string" || !ObjectId.isValid(rawAssignee))) {
        return res.status(400).json({message: "Invalid assigned user Id"});
    }

    try {
        const db = getDb();
        const project= await db.collection("projects").findOne({_id: projectObjectId});
        if (!project) {
            return res.status(404).json({message: "Project not found"});
        }

        let assignedObjectId = null;
        if (rawAssignee !== null) {
            assignedObjectId = new ObjectId(rawAssignee);
            const user = await db.collection("users").findOne({_id: assignedObjectId});
            if (!user) {
                return res.status(404).json({message: "Assigned user not found"});
            }
            const membership = await db.collection("memberships").findOne({project_id: projectObjectId, user_id: assignedObjectId});
            if (!membership){
                return res.status(400).json({message: "assigned user is not a member of this project"});
            }
        }
        
        const result = await db.collection("UserStories").updateOne(
            {_id: storyObjectId, project_id: projectObjectId},
            {$set: { title, description, priority, status, assigned_user_id: assignedObjectId}}
        );
        if (result.matchedCount ===0) {
            return res.status(404).json({message: "Story not found"});
        }

        return res.status(200).json({message: "story updated"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "server error"});
    }
});


router.get("/:projectId/stories", async (req, res) => {
    const projectId = req.params.projectId
    if(!ObjectId.isValid(projectId)) {
        return res.status(400).json({message: "Invalid project Id"});
    }
    const projectObjectId = new ObjectId(projectId);
    const db = getDb();
    try {
        const project = await db.collection("projects").findOne({_id: projectObjectId}); 
        if(!project) {
            return res.status(404).json({message: "Project not found"});
        }
        const stories = await db.collection("UserStories").find({project_id: projectObjectId}).toArray();
        return res.status(200).json(stories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
});



module.exports = router;