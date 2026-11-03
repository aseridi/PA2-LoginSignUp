import { useState } from 'react'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import CreateProject from './components/CreateProject.jsx'
import ProjectList from './components/ProjectList.jsx'
import './App.css'
import ManageMembers from './components/ManageMembers.jsx'
import Backlog from './components/Backlog.jsx'

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("createProject");

  if (!loggedIn) {
    return (
      <>
      <div className="app app-auth">
        <h1>PA3 — Projects</h1>
        <div className="tabs">
          <button
            className={`signup-login-btn ${showSignup ? 'active' : ''}`}
            onClick={() => setShowSignup(!showSignup)}
            aria-pressed={showSignup}
          >
            {showSignup ? 'Go to Login' : 'Go to Signup'}
          </button>
          </div>
        {showSignup ? <Signup /> : <Login onLogin={() => setLoggedIn(true)} />}
        </div>
      </>
    );
  }
  return (
    <>
    <div className="app app-main">
      <header className="app-header">
        <h1>Projects</h1>
        <nav className="tabs">
          <button className={view === "createProject" ? "active" : ""} onClick={() => setView("createProject")}>Create Project</button>
          <button className={view === "projectList" ? "active" : ""} onClick={() => setView("projectList")}>Projects</button>
          <button className={view === "membersList" ? "active" : ""} onClick={() => setView("membersList")}>Manage Projects</button>
          <button className={view === "backlog" ? "active" : ""} onClick={() => setView("backlog")}>Backlog</button>
          <button className="logout-btn" onClick={() => setLoggedIn(false)}>Logout</button>
        </nav>
      </header>
      {view ==="createProject" && <CreateProject />}
      {view ==="projectList" && <ProjectList/>}
      {view ==="membersList" && <ManageMembers/>}
      {view ==="backlog" && <Backlog />}
    </div>
    </>
  )
}

export default App;