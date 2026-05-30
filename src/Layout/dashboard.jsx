import React from 'react'
import { useState, useEffect } from 'react'

export default function Dashboard({ loggedInUser, onUserUpload }) {
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [daily, setDaily] = useState(true);
  const [dropdown, setDropdown] = useState(false);

  const [uploads, setUploads] = useState([])
  const [invoice, setInvoices] = useState([])
  const [receipts, setReceipts] = useState([]);
  const [spendings, setSpendings] = useState("")
  const handleSelect = () => {
    setDropdown(!dropdown);
    console.log("Dropdown Clicked")
  }

  const selectDaily = () => {
    setDaily(true);
    setWeekly(false);
    setMonthly(false);
    setDropdown(false);
  }

  const selectWeekly = () => {
    setDaily(false);
    setWeekly(true);
    setMonthly(false);
    setDropdown(false);
  }
  const selectMonthly = () => {
    setDaily(false);
    setWeekly(false);
    setMonthly(true);
    setDropdown(false);
  }

  useEffect(() => {
    if (onUserUpload) {
      setUploads(prev => [...prev, onUserUpload])
    }
  }, [onUserUpload])

  console.log("Result from app.js", uploads)

  useEffect(() => {
    if (!loggedInUser.userID) return;

    Promise.all([
      fetch(`http://localhost:3000/fetch/invoice/${loggedInUser.userID}`, { credentials: 'include' }),
      fetch(`http://localhost:3000/fetch/receipt/${loggedInUser.userID}`, { credentials: 'include' })
    ])
      .then(([invoiceRes, receiptRes]) => {
        if (!invoiceRes.ok) throw new Error("Failed to fetch invoices");
        if (!receiptRes.ok) throw new Error("Failed to fetch receipts");
        return Promise.all([invoiceRes.json(), receiptRes.json()]);
      })
      .then(([invoiceData, receiptData]) => {
        setInvoices(invoiceData.data);
        setReceipts(receiptData.data);
      })
      .catch(err => console.error(err));
  }, [loggedInUser.userID])

  // console.log({
  //   "receipts": receipts,
  //   "invoice": invoice
  // })

  return (
    <div className="bg-(--bg) place-items-center">
      <header className="flex items-center justify-between bg-(--bg2) w-11/12 m-3 p-1 rounded-full">
        <div className="">placeholder</div>
        <div className="text-2xl text-(--text-l) font-bold">AI-Powered Expense Tracker</div>
        <button className="bg-white text-(--text-d) rounded-full p-2">Login</button>
      </header>
      <div className="grid grid-cols-[1fr_1fr] gap-6 text-(--text-l) w-9/11 h-1/3 mt-8">
        <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3">Upload Details
          <ul>
            {uploads.map((upload, index) => (
              <li key={index}>
                <p>{upload.amount} {upload.currency}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3">Total Spendings</div>
      </div>
      <div className="flex justify-between w-9/11 h-1/2 bg-(--code-bg) mt-6 rounded-xl border border-(--border) px-6 py-3">
        <p className="text-(--text-orange) text-xl w-fit h-fit p-2.5 bg-(--bg) rounded-full">Expense Analysis</p>
        <div className="flex flex-col h-fit">
          <div onClick={handleSelect}
            className="flex justify-between text-(--text-orange) text-center py-2.5 px-3.5 w-30 h-fit bg-(--bg) border border-(--border) rounded-lg">
            {daily && <p>Daily</p>}
            {weekly && <p>Weekly</p>}
            {monthly && <p>Monthly</p>}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-360 280-560h400L480-360Z" /></svg>
          </div>
          {dropdown &&
            <ul className="text-(--text-orange) text-center w-30 h-fit bg-(--bg) border border-(--border) rounded-lg">
              <li className="hover:bg-(--code-bg) rounded-lg py-2" onClick={selectDaily}>Daily</li>
              <li className="hover:bg-(--code-bg) rounded-lg py-2" onClick={selectWeekly}>Weekly</li>
              <li className="hover:bg-(--code-bg) rounded-lg py-2" onClick={selectMonthly}>Monthly</li>
            </ul>
          }
        </div>
      </div>
    </div>
  )
}
