import { useState } from 'react'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import CreateProject from './components/CreateProject.jsx'
import ProjectList from './components/ProjectList.jsx'
import './App.css'
import ManageMembers from './components/manageMembers.jsx'

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("createProject");

  if (!loggedIn) {
    return (
      <>
      <div className="app">
        <h1>PA3 — Projects</h1>
        <div className="tabs">
          <button
            className={`signup-login-btn ${showSignup ? 'active' : ''}`}
            onClick={() => setShowSignup(!showSignup)}
            aria-pressed={showSignup}
          >
            {showSignup ? 'Go to Login' : 'Go to Singup'}
          </button>
          </div>
        {showSignup ? <Signup /> : <Login onLogin={() => setLoggedIn(true)} />}
        </div>
      </>
    );
  }
  return (
    <>
    <div className="app">
      <h1>Projects</h1>
      <div className="tabs">
        <button onClick={() => setView("createProject")}>Create Project</button>
        <button onClick={() => setView("projectList")}>Projects</button>
        <button onClick={() => setView("membersList")}>Manage Projects</button>
        <button onClick={() => setLoggedIn(false)}>Logout</button>
      </div>
      {view ==="createProject" && <CreateProject />}
      {view ==="projectList" && <ProjectList/>}
      {view ==="membersList" && <ManageMembers/>}
    </div>
    </>
  )
}

export default App;