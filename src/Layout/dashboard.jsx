import React from 'react'
import { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'

export default function Dashboard({ loggedInUser, onUserUpload, exportPayments, openSideBar, openSumBar}) {
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [daily, setDaily] = useState(true);
  const [dropdown, setDropdown] = useState(false);

  const [uploads, setUploads] = useState([])
  const [invoices, setInvoices] = useState([])
  const [receipts, setReceipts] = useState([]);
  const [spendings, setSpendings] = useState({})
  const [isLoading, setIsLoading] = useState(false);
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

  const formatItems = (items) => items.map(item => ({
    ...item,
    date: new Date(item.date).toDateString()
  }));

  useEffect(() => {
    if (!loggedInUser.userID) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [invoiceRes, receiptRes] = await Promise.all([
          fetch(`https://expensetrackerserver-agte.onrender.com/fetch/invoice/${loggedInUser.userID}`, { credentials: 'include' }),
          fetch(`https://expensetrackerserver-agte.onrender.com/fetch/receipt/${loggedInUser.userID}`, { credentials: 'include' })
        ]);

        if (!invoiceRes.ok) throw new Error("Failed to fetch invoices");
        if (!receiptRes.ok) throw new Error("Failed to fetch receipts");

        const [invoiceData, receiptData] = await Promise.all([
          invoiceRes.json(),
          receiptRes.json()
        ]);

        setInvoices(formatItems(invoiceData.data));
        setReceipts(formatItems(receiptData.data));
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser.userID]);

  useEffect(() => {
    if (invoices.length > 0 || receipts.length > 0) {
      setUploads([...invoices, ...receipts])
    }
  }, [invoices, receipts])

  useEffect(() => {
    let totalPriceUSD = 0;
    let totalPriceTHB = 0;
    uploads.forEach((upload) => {
      if (upload.currency === "USD") {
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
      "USD": totalPriceUSD.toFixed(2),
      "THB": totalPriceTHB.toFixed(2)
    })

    exportPayments(uploads)
  }, [uploads])

  // console.log({
  //   "receipts": receipts,
  //   "invoice": invoices,
  //   "uploads" : uploads,
  // })

  const [onSideBar, setOnSideBar] = useState(false)
  const [onSumBar, setOnSumBar] = useState(false)

  useEffect(() => { 
    const handleResize = () => {
      if (window.innerWidth <= 1020) {
        setOnSideBar(true);
        setOnSumBar(true);
      } else {
        setOnSideBar(false);
        setOnSumBar(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [])
  
  return (
    <div className="bg-(--bg) flex flex-col h-screen min-h-0">
      <div className="flex justify-between items-center px-2">
        <span className={onSideBar ? "sideBarActive" : "sideBarOff"} onClick={openSideBar}>
          <svg className="m-0 p-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#E3E3E3"><path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z"/></svg>
        </span>
        <header className="flex items-center justify-center bg-(--bg2) w-11/12 m-3 p-1 rounded-full">
          <div className="textTitle text-2xl text-(--text-l) font-bold">AI-Powered Expense Tracker</div>
        </header>
        <span className={onSumBar ? "summaryBarActive" : "summaryBarOff"} onClick={openSumBar}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#E3E3E3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center">
        <div className="topTwoContainer grid grid-cols-1 lg:grid-cols-2 text-(--text-l) gap-6 w-9/11 mt-8">
          <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3">
            <p className="p-2 text-lg w-fit text-(--text-orange) bg-(--bg) rounded-lg">Upload Details</p>
            <ul className="p-2 text-xs max-h-50 overflow-y-auto">
              {isLoading &&
                <div className="justify-self-center content-center ">
                  <ClipLoader color="orange" size={20} />
                </div>
              }
              {uploads.map((upload, index) => (
                <li key={index} className="uploads_grid grid grid-cols-[1fr_auto] min-w-0 bg-(--bg) mt-1 mb-1 p-2">
                  <p className="min-w-0 break-words">{upload.merchantName || upload.biller}</p>
                  <p className="date_mid text-(--text-light-orange) justify-self-end">{upload.date}</p>
                  <div>
                    <p className="text-(--text-green) text-[13.5px] justify-self-end">{upload.amount || upload.total_amount} {upload.currency}</p>
                    <p className="date_end text-(--text-light-orange) justify-self-end">{upload.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3">
            <p className="p-2 text-lg w-fit text-(--text-orange) bg-(--bg) rounded-lg">Total Spendings</p>
            <div className="flex flex-wrap items-center text-center gap-2 px-5 mt-5">
              <div className="flex-1 min-w-[150px] bg-(--bg) p-3 rounded-lg">
                <p className="spending_text text-[20px] font-bold">
                  <span className="text-(--text-light-orange) mr-2"> $</span>
                  <span className="text-(--text-green)">{spendings.USD}</span>
                </p>
              </div>
              <div className="flex-1 min-w-[150px] bg-(--bg) p-3 rounded-lg">
                <p className="spending_text text-[20px] font-bold">
                  <span className="text-(--text-light-orange) mr-2"> ฿</span>
                  <span className="text-(--text-green)">{spendings.THB} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bottomContainer  w-9/11 bg-(--code-bg) mt-6 rounded-xl border border-(--border) px-6 py-3">
          <div className="flex justify-between">
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
          <div className="text-center text-(--text-l) h-[150px]">Analytics Not yet Implemented</div>
        </div>
      </div>
    </div>
  )
}
