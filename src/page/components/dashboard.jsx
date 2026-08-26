import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { ClipLoader } from 'react-spinners'
import UseAppContext from '../../context'
import SpendingAreaChart from '../widgets/charts/spendingAreaChart'
import SpendingPieChart from '../widgets/charts/spendingPieChart'
import Sidebar from '../sideBar'

export default function Dashboard() {
  // const [uploads, setUploads] = useState([])
  // const [invoices, setInvoices] = useState([])
  // const [receipts, setReceipts] = useState([]);
  // const [spendings, setSpendings] = useState({});

  const {
    loggedInUser,
    windowWidth,
    allPaymentSlips,
    uploadedSlips,
    isLoading
  } = UseAppContext();
  console.log(allPaymentSlips)

  // DATE/TIME Helper Functions
  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function monthLabel(date) {
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  const paymentData = loggedInUser ? allPaymentSlips ?? [] : [];

  const parsedPayments = useMemo(() => {
    return paymentData
      .map((item) => {
        const rawDate = item.transaction_date || item.date || item.createdAt;
        const parsedDate = new Date(rawDate);
        if (isNaN(parsedDate)) return null;

        const amountValue = parseFloat(item.amount ?? item.total_amount);
        if (isNaN(amountValue)) return null;

        return {
          date: parsedDate,
          amount: amountValue,
          currency: item.currency || "Unknown",
          seriesKey: item.type === "receipt" ? "receipt" : "transaction",
        };
      })
      .filter(Boolean);
  }, [paymentData]);

  const earliestMonth = useMemo(() => {
    if (parsedPayments.length === 0) return startOfMonth(new Date());
    const earliest = parsedPayments.reduce(
      (min, p) => (p.date < min ? p.date : min),
      parsedPayments[0].date
    );
    return startOfMonth(earliest);
  }, [parsedPayments]);

  const currentMonth = startOfMonth(new Date());
  const [viewedMonth, setViewedMonth] = useState(currentMonth);

  const canGoPrev = viewedMonth > earliestMonth;
  const canGoNext = viewedMonth < currentMonth;

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    setViewedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    if (!canGoNext) return;
    setViewedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const chartData = useMemo(() => {
    const daysInMonth = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth() + 1,
      0
    ).getDate();

    const dayBuckets = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), i + 1);
      return {
        day: dayDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        transaction: 0,
        receipt: 0,
        transactionByCurrency: {},
        receiptByCurrency: {},
      };
    });

    parsedPayments.forEach((p) => {
      if (!isSameMonth(p.date, viewedMonth)) return;
      const dayIndex = p.date.getDate() - 1;
      const bucket = dayBuckets[dayIndex];
      if (!bucket) return;

      bucket[p.seriesKey] += p.amount;

      const byCurrencyKey = `${p.seriesKey}ByCurrency`;
      bucket[byCurrencyKey][p.currency] = (bucket[byCurrencyKey][p.currency] || 0) + p.amount;
    });

    return dayBuckets;
  }, [parsedPayments, viewedMonth]);

  // useEffect(() => {
  //   let totalPriceUSD = 0;
  //   let totalPriceTHB = 0;
  //   let paymentSlipList;

  //   loggedInUser
  //     ? paymentSlipList = allPaymentSlips
  //     : paymentSlipList = uploadedSlips

  //   paymentSlipList.forEach((upload) => {
  //     if (upload.currency === "USD") {
  //       const price = upload.amount || upload.total_amount
  //       const newPrice = parseFloat(price)
  //       totalPriceUSD += newPrice
  //     }
  //     else if (upload.currency === "THB") {
  //       const price = upload.amount || upload.total_amount
  //       const newPrice = parseFloat(price)
  //       totalPriceTHB += newPrice
  //     }
  //     else {
  //       console.log("Unrecognized Currency")
  //     }
  //   })
  //   setSpendings({
  //     "USD": totalPriceUSD.toFixed(2),
  //     "THB": totalPriceTHB.toFixed(2)
  //   })

  // }, [loggedInUser, allPaymentSlips, uploadedSlips])

  return (
    <div className="bg-(--bg) w-full rounded-3xl overflow-y-auto py-4 px-6">
      <div className="flex flex-col min-h-0 h-full text-(--text-l) gap-2">
        <div className={`flex items-center justify-between border border-(--border)/40 rounded-lg 
              ${windowWidth > 600 ? "p-2" : "p-1"}`}>
          <button
            onClick={goPrevMonth}
            disabled={!canGoPrev}
            className="text-(--text) disabled:opacity-30 disabled:cursor-not-allowed hover:text-(--text-orange) transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          </button>

          <p className="text-(--text-orange) font-semibold text-sm">
            {monthLabel(viewedMonth)}
          </p>

          <button
            onClick={goNextMonth}
            disabled={!canGoNext}
            className="text-(--text) disabled:opacity-30 disabled:cursor-not-allowed hover:text-(--text-orange) transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z" />
            </svg>
          </button>
        </div>
        <div className={`${windowWidth > 1275 ? "grid grid-cols-2" : "flex flex-wrap"}  gap-4 shrink-0`}>
          <div className={`bg-(--code-bg) border border-(--border) rounded-lg p-3 h-90 w-full`}>
            <SpendingAreaChart chartData={chartData} />
          </div>
          <div className={`bg-(--code-bg) border border-(--border) rounded-lg p-3 h-90 w-full`}>
            <SpendingPieChart chartData={chartData} currentViewedMonth={monthLabel(viewedMonth)} />
          </div>
          {windowWidth <= 750 && (
            <Sidebar />
          )}
        </div>

        <div className="bg-(--code-bg) border border-(--border) rounded-lg p-3 flex-1 min-h-60 flex flex-col overflow-hidden">
          <p className="py-1 px-2 my-2 text-lg w-fit text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0">Payment Preview</p>
          <ul className="p-2 text-xs h-full min-h-0 flex flex-col">
            {(loggedInUser ? paymentData : uploadedSlips).length === 0 ? (
              <p className="text-(--text)/80 w-fit font-semibold bg-(--bg) border border-(--border) rounded-md p-1">Empty Payments List</p>
            ) : windowWidth > 750 ? (
              <li className="grid grid-cols-3 p-2 bg-(--bg) text-[13px] text-(--text-orange)/90 font-bold shrink-0">
                <p className="justify-self-start">Merchant/Biller</p>
                <p className="justify-self-center">{windowWidth > 900 ? "Date of Transaction" : "Date/Time"}</p>
                <p className="justify-self-end">{windowWidth > 900 ? "Transaction Amount" : "Amount"}</p>
              </li>
            ) : windowWidth > 550 && (
              <li className="flex items-center justify-between p-2 bg-(--bg) text-[13px] text-(--text-orange)/90 font-bold shrink-0">
                <p className="justify-self-start">Merchant/Biller</p>
                <p className="justify-self-end">Amount</p>
              </li>
            )}

            {isLoading ?
              (<div className="flex-1 w-full flex justify-center items-center text-(--text-orange)/80">
                <span className="flex gap-2 items-center">
                  <p>Loading...</p>
                  <ClipLoader color="currentColor" size={20} />
                </span>
              </div>
              ) : (
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {(loggedInUser ? paymentData : uploadedSlips).map((data, index) => {
                    const merchantName = data.merchantName || data.paidTo || data.name || "N/A";

                    // Handle date format safely for both object types
                    const rawDate = data.transaction_date || data.date || "";
                    const formattedDate = rawDate.includes("T")
                      ? rawDate.split("T")[0]
                      : rawDate;

                    // Combine date and time if available (fallback to date only)
                    const displayDate = data.time ? `${formattedDate} ${data.time}` : formattedDate;

                    // Safe amount extraction
                    const displayAmount = data.amount ?? data.total_amount ?? "0";

                    return windowWidth > 750 ? (
                      <li key={index} className="grid grid-cols-3 min-w-0 bg-(--bg) mt-1 mb-1 p-2">
                        <p className="justify-self-start">{merchantName}</p>
                        <p className="text-(--text-light-orange) justify-self-center">{displayDate}</p>
                        <p className="text-(--text-green) text-[13px] font-semibold justify-self-end">
                          {displayAmount} {data.currency}
                        </p>
                      </li>
                    ) : (
                      <li key={index} className="w-full flex items-center justify-between min-w-0 bg-(--bg) mt-1 mb-1 p-2">
                        <p className="font-semibold">{merchantName}</p>
                        <div className="flex flex-col items-end">
                          <p className="text-(--text-light-orange) text-[11px]">{displayDate}</p>
                          <p className="text-(--text-green) font-semibold text-[13px]">
                            {displayAmount} {data.currency}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </div>
              )
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
