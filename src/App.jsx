import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './index.css'
import Sidebar from './Layout/sideBar'
import Dashboard from './Layout/dashboard'
import Summarybar from './Layout/summarybar'

function App() {
  // const [count, setCount] = useState(0)
  // const handleCounter = () => {
  //   setCount(prevCount => prevCount + 1)
  // }

  return (
    <div className="grid grid-cols-[0.35fr_1fr_0.35fr] min-h-screen">
      {/* <header class="text-(--text) text-2xl font-bold ">AI-Delivered Expense Tracker</header>
      <button onClick={handleCounter}>Counter: {count}</button>
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1> */}
      <Sidebar/>
      <Dashboard/>
      <Summarybar/>
    </div>
  )
}

export default App
