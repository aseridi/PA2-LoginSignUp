import { useState } from 'react'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import './App.css'


function App() {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <>
    <div className="app">
      <h1>PA2 — Login and Signup</h1>
      <div className="tabs">
        <button
          className={`signup-login-btn ${showSignup ? 'active' : ''}`}
          onClick={() => setShowSignup(!showSignup)}
          aria-pressed={showSignup}
        >
          {showSignup ? 'Go to Login' : 'Go to Sign Up'}
        </button>
        </div>
      {showSignup ? <Signup /> : <Login />}
      </div>
    </>
  );
}

export default App;