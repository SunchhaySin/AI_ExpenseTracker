import React from 'react'
import { useState, useEffect } from 'react'

export default function Summarybar({onClose}) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)

  }, [])

  const [closeBtn, setCloseBtn] = useState(false)
    useEffect(() => {
        const handleCloseBtn = () => {
            if (window.innerWidth <= 1020) {
                setCloseBtn(true)
            }
            else {
                setCloseBtn(false)
            }
        }
        handleCloseBtn()
        window.addEventListener("resize", handleCloseBtn);

        return () => {
            window.removeEventListener("resize", handleCloseBtn);
        };
    }, [])

  return (
    <div className="bg-(--code-bg) p-4 h-full">
      <div className="flex items-center gap-1">
        <span className={closeBtn?"sumBarbtn" : "closeSumbarBtn"} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#E3E3E3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
        </span>
        <div className="clock flex justify-between p-3 border border-(--border) w-full h-fit rounded-full bg-(--bg)">
          <p className="text text-(--text-orange)">{time.toLocaleTimeString()}</p>
          <p className="text text-(--text-orange)">{time.toDateString()}</p>
        </div>
      </div>
    </div>
  )
}
