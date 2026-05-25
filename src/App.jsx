import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './index.css'
import Sidebar from './Layout/sideBar'
import Dashboard from './Layout/dashboard'
import Summarybar from './Layout/summarybar'

function App() {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const openLogin = () => {
    setLogin(!login)
  }

  const closeLogin = () => {
    setLogin(false)
  }

  const openSignup = () => {
    setSignup(!signup)
  }

  const closeSignup = () => {
    setSignup(false)
  }

  return (
    <div className="grid grid-cols-[0.35fr_1fr_0.35fr] min-h-screen">
      <Sidebar onLoginClick={openLogin} onSignupClick={openSignup} />
      <Dashboard />
      <Summarybar />
      {login &&
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-140 h-100 bg-(--overlay-bg) rounded-2xl text-center inset-0 bg-black/40 backdrop-blur-sm p-4">
          <div className="flex justify-center items-center">
            <p className="flex-1 text-xl text-(--text-orange) ">Account Login</p>
            <button onClick={closeLogin}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="orange"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4 items-center justify-center">
            <form className="flex flex-col gap-4">
              <input
                placeholder="Email/Username"
                type="text"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
              />
              <input
                placeholder="Password"
                type="password"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
              />
            </form>
            <button className="flex gap-2 justify-center items-center bg-(--bg2) p-2 w-80 rounded-lg text-(--text-d) text-lg mt-8 hover:bg-[var(--text-orange)]">
              Login
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
            </button>
          </div>
        </div>
      }
      {signup &&
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-140 h-100 bg-(--overlay-bg) rounded-2xl text-center inset-0 bg-black/40 backdrop-blur-sm p-4">
          <div className="flex justify-center items-center">
            <p className="flex-1 text-xl text-(--text-orange) ">Account Registeration</p>
            <button onClick={closeSignup}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="orange"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4 items-center justify-center">
            <form className="flex flex-col gap-4">
              <input
                placeholder="Email"
                type="email"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
              />
              <input
                placeholder="Username"
                type="text"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
              />
              <input
                placeholder="Password"
                type="password"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
              />
            </form>
            <button className="flex gap-2 justify-center items-center bg-(--bg2) p-2 w-80 rounded-lg text-(--text-d) text-lg mt-8 hover:bg-[var(--text-orange)]">
              Register
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default App
