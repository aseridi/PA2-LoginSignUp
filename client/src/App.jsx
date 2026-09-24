import { useState } from 'react'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'

function App() {
  const [view, setView] = useState("signup");

  return (
    <>
      <h1>PA2 — Login and Signup</h1>
      <button onClick={() => setView("signup")}>Sign Up</button>
      <button onClick={() => setView("login")}>Log In</button>

      {view === "signup" ? <Signup /> : <Login />}
    </>
  );
}

export default App;