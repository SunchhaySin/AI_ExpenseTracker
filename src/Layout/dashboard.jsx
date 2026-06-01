import React from 'react'
import { useState, useEffect } from 'react'

export default function Dashboard({ loggedInUser, onUserUpload, exportPayments}) {
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [daily, setDaily] = useState(true);
  const [dropdown, setDropdown] = useState(false);

  const [uploads, setUploads] = useState([])
  const [invoices, setInvoices] = useState([])
  const [receipts, setReceipts] = useState([]);
  const [spendings, setSpendings] = useState({})
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

  // console.log("Result from app.js", uploads)

  useEffect(() => {
    if (!loggedInUser.userID) return;

    Promise.all([
      fetch(`https://expensetrackerserver-agte.onrender.com/fetch/invoice/${loggedInUser.userID}`, { credentials: 'include' }),
      fetch(`https://expensetrackerserver-agte.onrender.com/fetch/receipt/${loggedInUser.userID}`, { credentials: 'include' })
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

  useEffect(() => {
    if(invoices.length > 0 || receipts.length > 0) {
      setUploads([...invoices, ...receipts])
    }
  },[invoices, receipts])

  useEffect(() => {
    let totalPriceUSD = 0;
    let totalPriceTHB = 0;
    uploads.forEach((upload) => {
      if(upload.currency === "USD") {
        const price = upload.amount || upload.total_amount
        const newPrice = parseFloat(price)
        totalPriceUSD += newPrice
      }
      else if (upload.currency === "THB") {
        const price = upload.amount || upload.total_amount
        const newPrice = parseFloat(price)
        totalPriceTHB += newPrice
      }
      else {
        console.log("Unrecognized Currency")
      }
    })
    setSpendings({
      "USD" : totalPriceUSD.toFixed(2),
      "THB" : totalPriceTHB.toFixed(2)
    })

    exportPayments(uploads)
  }, [uploads])

  // console.log({
  //   "receipts": receipts,
  //   "invoice": invoices,
  //   "uploads" : uploads,
  // })

  return (
    <div className="bg-(--bg) place-items-center">
      <header className="flex items-center justify-center bg-(--bg2) w-11/12 m-3 p-1 rounded-full">
        <div className="text-2xl text-(--text-l) font-bold">AI-Powered Expense Tracker</div>
      </header>
      <div className="grid grid-cols-[1fr_1fr] gap-6 text-(--text-l) w-9/11 h-1/3 mt-8">
        <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3">
          <p className="p-2 text-lg w-fit text-(--text-orange) bg-(--bg) rounded-lg">Upload Details</p>
          <ul className="p-2 text-xs max-h-[200px] overflow-y-auto">
            {uploads.map((upload, index) => (
              <li key={index} className="grid grid-cols-[1fr_1fr_1fr] bg-(--bg) mt-1 mb-1 p-2">
                <p>{upload.type}</p>
                <p>{upload.merchantName || upload.biller}</p>
                <div>
                  <p className="text-(--text-green) justify-self-end">{upload.amount || upload.total_amount} {upload.currency}</p>
                  {/* <p>{upload.date}</p> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3">
          <p className="p-2 text-lg w-fit text-(--text-orange) bg-(--bg) rounded-lg">Total Spendings</p>
          <div className="justify-self-center items-center flex gap-10 mt-5">
              <p className="bg-(--bg) text-(--text-green)">{spendings.USD} USD</p>
              <p className="bg-(--bg) text-(--text-green)">{spendings.THB} THB</p>
          </div>
        </div>
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
