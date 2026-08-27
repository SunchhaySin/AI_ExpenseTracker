import React from 'react'
import { ClipLoader } from 'react-spinners'

export default function UploadsTable({
  windowWidth,
  loggedInUser,
  paymentData,
  uploadedSlips,
  isLoading,
  isUploadLoading = false,
  fileInputRef,
  handleFileUpload,
  onViewImage,
}) {
  const compact = windowWidth <= 750;
  const large = windowWidth > 1275;
  const showUpload = compact; // only the mobile panel exposes the upload trigger

  const data = loggedInUser ? paymentData : uploadedSlips;

  const titleClass = compact
    ? "py-1 px-2 w-fit text-sm text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0"
    : large
      ? "py-1 px-2 my-2 text-lg w-fit text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0"
      : "py-1 px-2 w-fit text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0";

  return (
    <div
      className={`bg-(--code-bg) border border-(--border) rounded-lg flex-1 flex flex-col overflow-hidden ${
        compact ? "p-2 min-h-40" : "p-3 min-h-60"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className={titleClass}>Payment Preview</p>

        {showUpload && (
          <div className="flex gap-1 bg-(--bg2) text-black items-center border border-(--bg2)/60 rounded-lg px-1 py-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={windowWidth > 600 ? "26px" : "22px"}
              viewBox="0 -960 960 960"
              width={windowWidth > 600 ? "26px" : "22px"}
              fill="currentColor"
            >
              <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept=".jpg,.png,.pdf"
              multiple
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className={windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}
            >
              Upload File
            </button>
          </div>
        )}
      </div>

      <ul className="relative p-2 text-xs h-full min-h-0 flex flex-col">
        {isUploadLoading && (
          <div className="flex items-center gap-2 text-(--text-orange)/80 text-sm p-1 mb-1">
            <p>Scanning upload...</p>
            <ClipLoader color="currentColor" size={14} />
          </div>
        )}

        {data.length === 0 && !isUploadLoading ? (
          <p
            className={
              compact
                ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-(--text)/80 w-fit font-semibold bg-(--bg)"
                : "text-(--text)/80 w-fit font-semibold bg-(--bg) border border-(--border) rounded-md p-1"
            }
          >
            Empty Payments List
          </p>
        ) : compact ? (
          windowWidth > 550 && (
            <li className="flex items-center justify-between p-2 bg-(--bg) text-[13px] text-(--text-orange)/90 font-bold shrink-0">
              <p className="justify-self-start">Merchant/Biller</p>
              <p className="justify-self-end">Amount</p>
            </li>
          )
        ) : (
          <li className="grid grid-cols-3 p-2 bg-(--bg) text-[13px] text-(--text-orange)/90 font-bold shrink-0">
            <p className="justify-self-start">Merchant/Biller</p>
            <p className="justify-self-center">{windowWidth > 900 ? "Date of Transaction" : "Date/Time"}</p>
            <p className="justify-self-end">{windowWidth > 900 ? "Transaction Amount" : "Amount"}</p>
          </li>
        )}

        {isLoading ? (
          <div className="flex-1 w-full flex justify-center items-center text-(--text-orange)/80">
            <span className="flex gap-2 items-center">
              <p>Loading...</p>
              <ClipLoader color="currentColor" size={20} />
            </span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            {data.map((item, index) => {
              const merchantName = item.merchantName || item.paidTo || item.name || "N/A";

              const rawDate = item.transaction_date || item.date || "";
              const formattedDate = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;
              const displayDate = item.time ? `${formattedDate} ${item.time}` : formattedDate;

              const displayAmount = item.amount ?? item.total_amount ?? "0";

              return compact ? (
                <li 
                    key={index} 
                    onClick={() => onViewImage?.(item)}
                    className="w-full flex items-center justify-between min-w-0 bg-(--bg) mt-1 mb-1 p-2">
                  <p className="font-semibold">{merchantName}</p>
                  <div className="flex flex-col items-end">
                    <p className="text-(--text-light-orange) text-[11px]">{displayDate}</p>
                    <p className="text-(--text-green) font-semibold text-[13px]">
                      {displayAmount} {item.currency}
                    </p>
                  </div>
                </li>
              ) : (
                <li 
                    key={index} 
                    onClick={() => onViewImage?.(item)}
                    className="grid grid-cols-3 min-w-0 bg-(--bg) mt-1 mb-1 p-2">
                  <p className="justify-self-start">{merchantName}</p>
                  <p className="text-(--text-light-orange) justify-self-center">{displayDate}</p>
                  <p className="text-(--text-green) text-[13px] font-semibold justify-self-end">
                    {displayAmount} {item.currency}
                  </p>
                </li>
              );
            })}
          </div>
        )}
      </ul>
    </div>
  );
}