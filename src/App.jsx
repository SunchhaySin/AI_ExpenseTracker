import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Layout/sideBar'
import Dashboard from './Layout/dashboard'
import Summarybar from './Layout/summarybar'
import Profile from './Layout/profile'

function App() {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [user, setUser] = useState(() => {
    const username = sessionStorage.getItem("username")
    const email = sessionStorage.getItem("email")
    return {
      username: username || "",
      email: email || ""
    }
  });

  const openLogin = () => {
    setLogin(!login)
    setSignup(false);
  }

  const closeLogin = () => {
    setLoginForm({
      email: "",
      password: "",
    })

    setLogin(false)
  }

  const openSignup = () => {
    setSignup(!signup)
    setLogin(false);
  }

  const closeSignup = () => {
    setSignupForm({
      email: "",
      username: "",
      password: "",
    })

    setSignup(false)
  }


  const [signupForm, setSignupForm] = useState({
    email: "",
    username: "",
    password: ""
  })

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const onSignupChange = (e) => setSignupForm({ ...signupForm, [e.target.name]: e.target.value })
  const onLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })

  async function register(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/reg', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error)
      console.log(data)
      alert("Registration Successful")
      setSignupForm({
        email: "",
        username: "",
        password: "",
      })
      closeSignup()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  async function userLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      console.log(data)

      sessionStorage.setItem("email", data.email)
      sessionStorage.setItem("username", data.username);

      setUser({
        username: data.username,
        email: data.email,
      })

      alert("User Login Sucessful")

      setLoginForm({
        email: "",
        password: "",
      })
      closeLogin()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  function logout() {
    sessionStorage.removeItem("username")
    sessionStorage.removeItem("email")
    setUser({ username: "", email: "" })
  }

  return (
    <div className="grid grid-cols-[0.35fr_1fr_0.35fr] min-h-screen">
      <Sidebar 
        loggedInUser={user}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onLogoutClick={logout}
      />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile loggedInUser={user} />} />
      </Routes>
      
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
            <form className="flex flex-col gap-4" onSubmit={userLogin} id="loginForm">
              <input
                name="email"
                placeholder="Email"
                type="text"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                value={loginForm.email}
                onChange={onLoginChange}
              />
              <input
                name="password"
                placeholder="Password"
                type="password"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                value={loginForm.password}
                onChange={onLoginChange}
              />
            </form>
            <button className="flex gap-2 justify-center items-center bg-(--bg2) p-2 w-80 rounded-lg text-(--text-d) text-lg mt-8 hover:bg-[var(--text-orange)]"
              type="submit"
              form="loginForm">
              Login
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
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
            <form className="flex flex-col gap-4" onSubmit={register} id="registerForm">
              <input
                name="email"
                placeholder="Email"
                type="email"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                value={signupForm.email}
                onChange={onSignupChange}
              />
              <input
                name="username"
                placeholder="Username"
                type="text"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                value={signupForm.username}
                onChange={onSignupChange}
              />
              <input
                name="password"
                placeholder="Password"
                type="password"
                className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                value={signupForm.password}
                onChange={onSignupChange}
              />
            </form>
            <button className="flex gap-2 justify-center items-center bg-(--bg2) p-2 w-80 rounded-lg text-(--text-d) text-lg mt-8 hover:bg-[var(--text-orange)]"
              type="submit"
              form="registerForm">
              Register
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default App
