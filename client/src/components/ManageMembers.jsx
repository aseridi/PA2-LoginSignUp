import { useState, useEffect } from "react";
import "../App.css";

function ManageMembers() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [message, setMessage] = useState("");

    // Runs once: load projects and users for the two dropdowns
    useEffect(() => {
        async function loadInitialData() {
            try {
                const projectsRes = await fetch("http://localhost:9000/projects");
                setProjects(await projectsRes.json());

                const usersRes = await fetch("http://localhost:9000/users");
                const usersData = await usersRes.json();
                setUsers(usersData.users);
            } catch (error) {
                setMessage("Could not load projects or users");
            }
        }
        loadInitialData();
    }, []);

    // Lives in the component body so handleAdd and handleRemove can call it too
    async function loadMembers() {
        if (!selectedProjectId) {
            setMembers([]);
            return;
        }
        try {
            const response = await fetch(`http://localhost:9000/projects/${selectedProjectId}/members`);
            const data = await response.json();
            if (response.ok) {
                setMembers(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Could not load members");
        }
    }

    // Runs whenever the selected project changes
    useEffect(() => {
        setMessage("");
        loadMembers();
    }, [selectedProjectId]);

    async function handleAdd(event) {
        event.preventDefault();
        if (!selectedProjectId || !selectedUserId) {
            setMessage("Select a project and a user first");
            return;
        }
        try {
            const response = await fetch(`http://localhost:9000/projects/${selectedProjectId}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: selectedUserId })
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                setSelectedUserId("");
                loadMembers();          // refresh the list
            }
        } catch (error) {
            setMessage("Could not connect to the server");
        }
    }

    async function handleRemove(userId) {
        try {
            const response = await fetch(
                `http://localhost:9000/projects/${selectedProjectId}/members/${userId}`,
                { method: "DELETE" }
            );
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                loadMembers();          // refresh the list
            }
        } catch (error) {
            setMessage("Could not connect to the server");
        }
    }

    // The full project object for the current selection (needed to know the lead)
    const selectedProject = projects.find(p => p._id === selectedProjectId);

    return (
        <main className="page-main">
            <div className="manage-members">
                <select
                    className="field_input"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                    <option value="">Select a project</option>
                    {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>

                {selectedProjectId && (
                    <>
                        <h3>Members</h3>
                        <ul className="member-list">
                            {members.map(member => {
                                const isLead = member._id === selectedProject?.project_lead_id;
                                return (
                                    <li key={member._id}>
                                        {member.f_name} {member.l_name} ({member.username})
                                        {isLead ? (
                                            <span> — Lead</span>
                                        ) : (
                                            <button type="button" onClick={() => handleRemove(member._id)}>
                                                Remove
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        <form className="add-member-form" onSubmit={handleAdd}>
                            <select
                                className="field_input"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="">Select a user to add</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.username}</option>
                                ))}
                            </select>
                            <button className="submit-btn" type="submit">Add Member</button>
                        </form>
                    </>
                )}

                {message && <p className="message">{message}</p>}
            </div>
        </main>
    );
}

export default ManageMembers;