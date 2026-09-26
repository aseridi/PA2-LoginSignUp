import { useState } from 'react'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import './App.css'


function App() {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <>
      <h1>PA2 — Login and Signup</h1>
        <button
          className={`signup-login-btn ${showSignup ? 'active' : ''}`}
          onClick={() => setShowSignup(!showSignup)}
          aria-pressed={showSignup}
        >
          {showSignup ? 'Go to Login' : 'Go to Sign Up'}
        </button>
      {showSignup ? <Signup /> : <Login />}
    </>
  );
}

export default App;