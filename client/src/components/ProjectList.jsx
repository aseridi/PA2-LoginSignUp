import { useState } from 'react';
import { useEffect } from 'react';
import "../App.css"

function ProjectList() {

    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState("");
    useEffect(() => {
        async function loadProjects() {
            try {
                const response = await fetch("http://localhost:9000/projects");
                const data = await response.json();
                setProjects(data);
            } catch(error) {
                setMessage("Could not load users");
            }
        }
        loadProjects();
    }, []);

    return (
        <>
        <main className="page-main">
            <div className="project-list">
                {projects.map(project => (
                    <div className="project" key={project._id}>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <p>Status: {project.status}</p>
                        <p>Lead: {project.project_lead}</p>
                    </div>
                ))}
            </div>
            {message && <p className="message">{message}</p>}
        </main>
        </>
    )

}

export default ProjectList;