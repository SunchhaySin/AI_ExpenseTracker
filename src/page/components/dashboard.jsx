import React from "react";
import { useState, useEffect, useMemo } from "react";
import { ClipLoader } from "react-spinners";
import UseAppContext from "../../context";
import SpendingAreaChart from "../widgets/charts/spendingAreaChart";
import SpendingPieChart from "../widgets/charts/spendingPieChart";
import UseFileUpload from "../../../hooks/useFileUpload";
import UploadsTable from "../widgets/UploadsTable";

export default function Dashboard() {
  const {
    loggedInUser,
    windowWidth,
    allPaymentSlips,
    uploadedSlips,
    isLoading,
  } = UseAppContext();

  const {
    fileInputRef,
    handleFileUpload,
    isLoading: isUploadLoading, // alliasing isLoading from the UseFileUpload Hook
  } = UseFileUpload();

  const [viewedImage, setViewedImage] = useState(null);

  const handleViewImage = (item) => {
    setViewedImage(item);
  };

  const closeImageView = () => {
    setViewedImage(null);
  };

  // DATE/TIME Helper Functions
  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function monthLabel(date) {
    return date.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }

  const paymentData = loggedInUser ? (allPaymentSlips ?? []) : [];

  const parsedPayments = useMemo(() => {
    return (loggedInUser ? paymentData : uploadedSlips)
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
        };
      })
      .filter(Boolean);
  }, [paymentData, uploadedSlips, loggedInUser]);

  const earliestMonth = useMemo(() => {
    if (parsedPayments.length === 0) return startOfMonth(new Date());
    const earliest = parsedPayments.reduce(
      (min, p) => (p.date < min ? p.date : min),
      parsedPayments[0].date,
    );
    return startOfMonth(earliest);
  }, [parsedPayments]);

  const currentMonth = startOfMonth(new Date());
  const [viewedMonth, setViewedMonth] = useState(currentMonth);

  const canGoPrev = viewedMonth > earliestMonth;
  const canGoNext = viewedMonth < currentMonth;

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    setViewedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    if (!canGoNext) return;
    setViewedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const chartData = useMemo(() => {
    const daysInMonth = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth() + 1,
      0,
    ).getDate();

    const currenciesThisMonth = new Set();
      parsedPayments.forEach((p) => {
        if (isSameMonth(p.date, viewedMonth)) currenciesThisMonth.add(p.currency);
    });

    const dayBuckets = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(
        viewedMonth.getFullYear(),
        viewedMonth.getMonth(),
        i + 1,
      );
       const bucket = {
        day: dayDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      };
      currenciesThisMonth.forEach((currency) => {
        bucket[currency] = 0;
      });
      return bucket
    });

    parsedPayments.forEach((p) => {
      if (!isSameMonth(p.date, viewedMonth)) return;
      const dayIndex = p.date.getDate() - 1;
      const bucket = dayBuckets[dayIndex];
      if (!bucket) return;

      bucket[p.currency] = (bucket[p.currency] || 0) + p.amount;
    });

    return dayBuckets;
  }, [parsedPayments, viewedMonth]);

  function DownloadImageFromUrl(dataUrl, filename = "upload.jpg") {
    const [header, base64Data] = dataUrl.split(",");
    const mimeMatch = header.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    const byteString = atob(base64Data);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-(--bg) w-full rounded-3xl overflow-y-auto py-4 px-6">
      <div className="flex flex-col min-h-0 h-full text-(--text-l) gap-2">
        {windowWidth <= 1275 && (
          <UploadsTable
            windowWidth={windowWidth}
            loggedInUser={loggedInUser}
            paymentData={paymentData}
            uploadedSlips={uploadedSlips}
            isLoading={isLoading}
            isUploadLoading={isUploadLoading}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            onViewImage={handleViewImage}
          />
        )}

        <div
          className={`flex items-center justify-between border border-(--border)/40 rounded-lg 
              ${windowWidth > 600 ? "p-2" : "p-1"}`}
        >
          <button
            onClick={goPrevMonth}
            disabled={!canGoPrev}
            className="text-(--text) disabled:opacity-30 disabled:cursor-not-allowed hover:text-(--text-orange) transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="currentColor"
            >
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="currentColor"
            >
              <path d="m376-240-56-56 184-184-184-184 56-56 240 240-240 240Z" />
            </svg>
          </button>
        </div>
        <div
          className={`${windowWidth > 1275 ? "grid grid-cols-2" : "flex flex-wrap"}  gap-4 shrink-0`}
        >
          <div
            className={`bg-(--code-bg) border border-(--border) rounded-lg p-3 h-90 w-full`}
          >
            <SpendingAreaChart chartData={chartData} />
          </div>
          <div
            className={`bg-(--code-bg) border border-(--border) rounded-lg p-3 h-90 w-full`}
          >
            <SpendingPieChart
              chartData={chartData}
              currentViewedMonth={monthLabel(viewedMonth)}
            />
          </div>
        </div>

        {windowWidth > 1275 && (
          <UploadsTable
            windowWidth={windowWidth}
            loggedInUser={loggedInUser}
            paymentData={paymentData}
            uploadedSlips={uploadedSlips}
            isLoading={isLoading}
            isUploadLoading={isUploadLoading}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            onViewImage={handleViewImage}
          />
        )}
      </div>
      {viewedImage && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 h-full w-full ${windowWidth < 500 && "px-4"}`}
          onClick={closeImageView}
        >
          <div
            className="bg-(--bg) rounded-xl p-4 max-w-lg w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col items-start">
                <p className="text-(--text-orange) font-semibold">
                  {viewedImage.merchantName ||
                    viewedImage.paidTo ||
                    viewedImage.name ||
                    "Upload"}
                </p>
                <p className="text-(--text-orange)/80 text-sm">
                  {viewedImage.transaction_date.split("T")[0]}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => {
                    const today = new Date().toISOString().split("T")[0];
                    DownloadImageFromUrl(viewedImage?.image?.image, `receipt-${viewedImage.id}-${today}.jpg`)
                  }}
                  className={`flex items-center gap-2 border border-(--bg2)/60 rounded-lg ${windowWidth > 750 ? "text-sm" : "text-xs"} bg-(--bg2) text-black px-1 py-0.5`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={windowWidth > 750 ? "22px" : "18px"}
                    viewBox="0 -960 960 960"
                    width={windowWidth > 750 ? "22px" : "18px"}
                    fill="currentColor"
                  >
                    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                  </svg>
                  <p>Download Image</p>
                </button>
                <button onClick={closeImageView} className="text-(--text)">
                  ✕
                </button>
              </div>
            </div>
            {viewedImage.image?.image ? (
              <img
                src={viewedImage.image.image}
                alt="Upload"
                className={`${windowWidth > 1275 ? "max-h-180" : windowWidth > 1000 ? "max-h-160" : windowWidth > 750 ? "max-h-140" : "max-h-120"} w-full object-contain rounded-lg`}
              />
            ) : (
              <p className="text-(--text)/70 text-sm">
                No image available for this upload.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
