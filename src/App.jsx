import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './page/sideBar'
import Dashboard from './page/components/dashboard'
import Summarybar from './page/summarybar'
import Profile from './page/components/profile'
import { ClipLoader } from 'react-spinners'

function App() {
  const [uploadResult, setUploadResult] = useState(null);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [allPayments, setAllPayments] = useState([])

  useEffect(() => {
    fetch('https://expensetrackerserver-agte.onrender.com/auth/me', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(user => setUser(user))
      .catch(() => setUser({}));
  }, []);




  const [sideBar, setSideBar] = useState(false)
  const [sumBar, setSumBar] = useState(false)
  return (
    <div className="layout grid grid-cols-[0.35fr_1fr_0.35fr] h-screen">
      <div className={sideBar ? "sideBarOpen" : "sideBar"}>
        <Sidebar
          loggedInUser={user}
          onLoginClick={openLogin}
          onSignupClick={openSignup}
          onLogoutClick={logout}
          onUploadResult={setUploadResult}
          getAllPayments={allPayments}
          onClose={() => setSideBar(false)}
        />
      </div>
      <Routes>
        <Route path="/"
          element={<Dashboard
            loggedInUser={user}
            onUserUpload={uploadResult}
            exportPayments={setAllPayments}
            openSideBar={() => setSideBar(true)}
            openSumBar={() => setSumBar(true)}
          />} />
        <Route path="/profile" element={<Profile loggedInUser={user} />} />
      </Routes>

      <div className={sumBar ? "summaryBarOpen" : "summaryBar"}>
        <Summarybar onClose={() => setSumBar(false)}/>
      </div>
    </div>
  )
}

export default App
