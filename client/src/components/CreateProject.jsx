import { useEffect } from 'react'
import { useState } from 'react'
import '../App.css'

function CreateProject() {

    const [name, setPname] = useState("");
    const [description, setDesc] = useState("");
    const [status, setStatus] = useState("");
    const [project_lead_id, setLead] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await fetch("http://localhost:9000/users");
                const data = await response.json();
                setUsers(data.users);
            } catch(error) {
                setMessage("Could not load users");
            }
        }
        loadUsers();
    }, []);
    
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:9000/projects", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, description, status, project_lead_id})
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Could not connect to the server");
        }
    }
    return (
        <>
        <main className="page-main">
            <form id="create-project" className="create-project" onSubmit={handleSubmit}>
                <div className="field">
                    <input 
                    className="field_input"
                    id="name"
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e)=> setPname(e.target.value)}
                    />
                </div>

                <div className="field">
                    <input 
                    className="field_input"
                    id="descreption"
                    type="text"
                    placeholder="Project description"
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    />
                </div>

                <div className="field">
                    <select 
                    className="field_input"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select status</option>
                        <option value="Planning"> Planning</option>
                        <option value="Active"> Active</option>
                        <option value="Completed"> Completed</option>
                    </select>
                </div>

                <div className="field">
                    <select
                    className="field_input"
                    value ={project_lead_id} onChange={(e) => setLead(e.target.value)}>
                        <option value="">Select project lead</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <button className="submit-btn" type="submit">Create Project</button>
                </form>
                {message && <p className="message">{message}</p>}
        </main>
        </>
    )
}

export default CreateProject;