import { useState } from 'react'
import '../App.css'

function Signup() {
    const [f_name, setFname] = useState("");
    const [l_name, setLname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
      event.preventDefault();

        try {
        const response = await fetch("http://localhost:9000/signup", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({f_name, l_name, username, password})
        });
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
          setFname("");
          setLname("");
          setUsername("");
          setPassword("");
        } else {
          setMessage(data.message);
        }

        setMessage(data.message);

      } catch (error) {
        setMessage("Could not connect to the server");
      }
  }

    return (
      <>
      <main className="page-main">
        <form id="signup-form" className="signup-form" onSubmit={handleSubmit}>
          <div className="field">
            <input
              className="field_input"
              id="f_name"
              type="text"
              placeholder="first name"
              value={f_name}
              onChange={(e) => setFname(e.target.value)}
              />
          </div>

          <div className="field">
            <input
              className="field_input"
              id="l_name"
              type="text"
              placeholder="last name"
              value={l_name}
              onChange={(e) => setLname(e.target.value)}
              />
          </div>

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
          <button className="submit-btn" type="submit"> Sign Up</button>
        </form>
        {message && <p className="message">{message}</p>}
      </main>
      </>
    );
}


export default Signup;