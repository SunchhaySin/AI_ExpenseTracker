import React from 'react'
import { useState, useEffect } from 'react'

export default function Summarybar() {
  const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
        
    }, [])

  return (
    <div className="bg-(--code-bg) p-4">
      <div className="flex justify-between p-3 border border-(--border) w-full h-fit rounded-full bg-(--bg)">
        <p className="text-(--text-orange)">{time.toLocaleTimeString()}</p>
        <p className="text-(--text-orange)">{time.toDateString()}</p>
      </div>
    </div>
  )
}
