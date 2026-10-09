import { useState } from 'react'
import '../App.css'

function Login({onLogin}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
      event.preventDefault();

        try {
        const response = await fetch("http://localhost:9000/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({username, password})
        });
        const data = await response.json();
        if(response.ok){
          onLogin();
          setMessage("Login successful")
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("Could not connect to the server");
      }
  }

    return (
      <>
      <main className="page-main">
        <form id="login-form" className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <input
              className="field_input"
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
          </div>

          <div className="field">
            <input
              className="field_input"
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
          </div>
          <button className="submit-btn" type="submit"> Login </button>
        </form>
        {message && <p className="message">{message}</p>}
      </main>
      </>
    );
}


export default Login;