import { useState } from 'react'
import heroImg from '../src/assets/hero.png'
import reactLogo from '../src/assets/react.svg'
import viteLogo from '../src/assets/vite.svg'
import '../src/App.css'


function Signup() {
    const [count, setCount] = useState(0);
    return (
        <>
          <section id="center">
            <div className="hero">
                <h2> Sign Up </h2>
            </div>
          </section>

          <section class="signup-main">
            <form id="signup-form" class="signup-form">
                <div class="field">
                    <label class="field_label" for="f_name">First Name</label>
                    <input class="field_input" id="f_name" type="text" placeholder="first name"></input>
                </div>
                <div class="field">
                    <label class ="field_label" for="l_name">Last Name</label>
                    <input class="field_input" id="l_name" type="text"></input>
                </div>
            </form>
          </section>
          <div className="ticks"></div>
    
          <section id="next-steps">
            <div id="docs">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#documentation-icon"></use>
              </svg>
              <h2>Documentation</h2>
              <p>Your questions, answered</p>
              <ul>
                <li>
                  <a href="https://vite.dev/" target="_blank">
                    <img className="logo" src={viteLogo} alt="" />
                    Explore Vite
                  </a>
                </li>
                <li>
                  <a href="https://react.dev/" target="_blank">
                    <img className="button-icon" src={reactLogo} alt="" />
                    Learn more
                  </a>
                </li>
              </ul>
            </div>
            <div id="social">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#social-icon"></use>
              </svg>
              <h2>Connect with us</h2>
              <p>Join the Vite community</p>
              <ul>
                <li>
                  <a href="https://github.com/vitejs/vite" target="_blank">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#github-icon"></use>
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://chat.vite.dev/" target="_blank">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#discord-icon"></use>
                    </svg>
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://x.com/vite_js" target="_blank">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#x-icon"></use>
                    </svg>
                    X.com
                  </a>
                </li>
                <li>
                  <a href="https://bsky.app/profile/vite.dev" target="_blank">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#bluesky-icon"></use>
                    </svg>
                    Bluesky
                  </a>
                </li>
              </ul>
            </div>
          </section>
    
          <div className="ticks"></div>
          <section id="spacer"></section>
        </>
        )
        }


export default Signup;