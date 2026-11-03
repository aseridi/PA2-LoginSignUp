import { useState, useEffect } from "react";
import "../App.css";

function Backlog() {
    const [projects, setProjects] = useState([]);
    const [stories, setStories] = useState([]);
    const [members, setMembers] = useState([]);

    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedStory, setSelectedStory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    const [message, setMessage] = useState("");

    const [title, setTitle] = useState("");
    const [description ,setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");


    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editAssignedUser , setEditAssignedUser] = useState("");

    useEffect(() => {
        async function loadInitialData() {
            try {
                const projectsRes = await fetch ("http://localhost:9000/projects");
                setProjects(await projectsRes.json());
                
            } catch (error) {
                setMessage("Could not load projects");
            }
        }
        loadInitialData();
    }, []);

    async function loadStoriesAndUsers() {
        if(!selectedProjectId) {
            setMembers([]);
            setStories([]);
            return;
        }
        try {
            const storiesRes = await fetch(`http://localhost:9000/projects/${selectedProjectId}/stories`)
            const storiesData = await storiesRes.json();
            if (storiesRes.ok) {
                setStories(storiesData);
            } else {
                setMessage(storiesData.message);
            }

            const usersRes = await fetch(`http://localhost:9000/projects/${selectedProjectId}/members`)
            const userData = await usersRes.json();
            if (usersRes.ok) {
                setMembers(userData);
            } else {
                setMessage(userData.message);
            }
        } catch (error) {
            setMessage("Could not load stories and users");
        }
    };

    useEffect (() => {
        setMessage("");
        setSelectedStory(null);
        setIsEditing(false);
        loadStoriesAndUsers();
    }, [selectedProjectId]);


    async function handleAddStory(event) { 
        event.preventDefault();
        if(!selectedProjectId) {
            setMessage("Select a project first");
            return;
        }

        try {
            const response = await fetch(`http://localhost:9000/projects/${selectedProjectId}/stories`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({title, description, priority, assigned_user_id: assignedUserId || null })
            });
            const data = await response.json();
            setMessage(data.message);
            if(response.ok){
                setTitle("");
                setDescription("");
                setPriority("");
                setAssignedUserId("");
                loadStoriesAndUsers();
            }
        } catch (error) {
            setMessage("Could not connect to server");
        }
    }

    function getMemberName(userId){ 
        if(!userId) return "Unassigned";
        const member = members.find(m=> m._id ===userId);
        return member ? member.username: "Unknown";
    }

    async function handleDeleteStory(storyId) {
        if(!window.confirm("Delete this story?")) return;
        try {
            const response = await fetch(`http://localhost:9000/projects/${selectedProjectId}/stories/${storyId}`, {
                method: "DELETE"
            });
            const data = await response.json();
            setMessage(data.message);
            if(response.ok) {
                loadStoriesAndUsers();
            }
        } catch (error) {
            setMessage("could not connect to server");
        }
    }

    function startEdit(story) {
        setSelectedStory(story._id);
        setIsEditing(true);
        setEditTitle(story.title);
        setEditDescription(story.description);
        setEditPriority(story.priority);
        setEditStatus(story.status);
        setEditAssignedUser(story.assigned_user_id || "");
    }

    function cancelEdit() {
        setIsEditing(false);
    }


    async function handleSaveEdit(event) {
        event.preventDefault();
            try {
                const response = await fetch(`http://localhost:9000/projects/${selectedProjectId}/stories/${selectedStory}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({title: editTitle, description: editDescription, priority: editPriority, status: editStatus, assigned_user_id: editAssignedUser || null })
                })
                const data = await response.json();
                setMessage(data.message);
                if(response.ok){
                    setIsEditing(false);
                    loadStoriesAndUsers();
                }
            } catch (error) {
                setMessage("Could not connect to server");
            }
        
    }

    return (
    <>
        <main className="page-main">
            <div className="backlog-container">
                <select 
                className="field_input"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                    <option value="">Select a Project</option>
                    {projects.map(p=> (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
            {selectedProjectId && (
                <>
                <form id="create-project" className="create-story" onSubmit={handleAddStory}>
                    <div className="field">
                        <input 
                        className="field_input"
                        id="title"
                        type="text"
                        placeholder="Story Title"
                        value={title}
                        onChange={(e)=> setTitle(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <textarea 
                        className="field_input"
                        id="descreption"
                        type="text"
                        placeholder="Story description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <select 
                        className="field_input"
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}>
                            <option value="">Select priority</option>
                            <option value="High"> High</option>
                            <option value="Medium"> Medium</option>
                            <option value="Low"> Low</option>
                        </select>
                    </div>

                    <div className="field">
                        <select
                        className="field_input"
                        value ={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)}>
                            <option value="">Unassigned</option>
                            {members.map(user => (
                                <option key={user._id} value={user._id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <button className="submit-btn" type="submit">Create Story</button>
                </form>

                <h3>Backlog</h3>
                {stories.length === 0 ? (
                <p>No stories yet.</p>
                ) : (
                    <ul>
                        {stories.map(s => (
                            <li key = {s._id}>
                                <strong> {s.title}</strong> | {s.priority} | {s.status} | {getMemberName(s.assigned_user_id)}
                                <button type ="button" onClick={() => setSelectedStory(s._id)}>Details</button>
                                <button type ="button" onClick={() => handleDeleteStory(s._id)}>Delete</button>
                                <button type="button" onClick={() => startEdit(s)}>Edit</button>
                                {selectedStory === s._id && isEditing && (
                                    <form onSubmit={handleSaveEdit}>
                                        <div className="field">
                                            <input 
                                            className="field_input"
                                            id="edit-title"
                                            type="text"
                                            placeholder="Story Title"
                                            value={editTitle}
                                            onChange={(e)=> setEditTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="field">
                                            <textarea 
                                            className="field_input"
                                            id="edit-descreption"
                                            type="text"
                                            placeholder="Story description"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            />
                                        </div>

                                        <div className="field">
                                            <select 
                                            className="field_input"
                                            id="edit-priority"
                                            value={editPriority}
                                            onChange={(e) => setEditPriority(e.target.value)}>
                                                <option value="">Select priority</option>
                                                <option value="High"> High</option>
                                                <option value="Medium"> Medium</option>
                                                <option value="Low"> Low</option>
                                            </select>
                                        </div>

                                        <div className="field">
                                            <select
                                            className="field_input"
                                            value ={editAssignedUser} onChange={(e) => setEditAssignedUser(e.target.value)}>
                                                <option value="">Unassigned</option>
                                                {members.map(user => (
                                                    <option key={user._id} value={user._id}>{user.username}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <select className="field_input" value ={editStatus} onChange ={(e) => setEditStatus(e.target.value)}>
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>

                                        <button type="submit">Save</button>
                                        <button type="button" onClick={cancelEdit}>Cancel</button>
                                    </form>
                                )}
                                {selectedStory === s._id && <p>{s.description}</p>}
                            </li>
                        ))}
                    </ul>
                )
                }
                </>
            )}
            {message && <p className="message">{message}</p>}
            </div>
        </main>
    </>
    )}

export default Backlog;