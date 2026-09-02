import React, { useState, useEffect } from "react";
import UseAppContext from "../../context";

const currencies = [
    { code: "THB", name: "Thai Baht" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "KRW", name: "South Korean Won" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "INR", name: "Indian Rupee" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "NZD", name: "New Zealand Dollar" },
  ];

const conversionAmounts = [
  1,
  5,
  10,
  50,
  100,
  500,
  1000,
  5000,
  10000,
  50000,
  100000,
  500000,
  1000000,
];

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function CurrencyConversion() {
  const { theme, windowWidth } = UseAppContext();
  const isMobile = windowWidth <= 750;

  const [convertFrom, setCovertFrom] = useState("");
  const [convertTo, setConvertTo] = useState("");
  const [showIndicator, setShowIndicator] = useState(false);
  const [showConvertButton, setShowConvertButton] = useState(false);

  const [showConversion, setShowConversion] = useState(false);
  const [conversionRate, setConversionRate] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getToday());
  

  const [error, setError] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value || getToday());
  };

  useEffect(() => {
    if(convertFrom.length !== 0 || convertTo.length !== 0) {
        setShowIndicator(true);
        setShowConvertButton(true);
    } else {
        setShowIndicator(false);
        setShowConvertButton(false);
    }
  }, [convertFrom, convertTo])

  async function GetCoversionRate() {
    if(!convertFrom || !convertTo) {
        setError("Choose both currencies for conversion");
        return;
    }

    setError("");

    if (convertFrom === convertTo) {
        setConversionRate(1);
        setError("");
        return;
    }

    try {
        const res = await fetch(`https://api.frankfurter.dev/v2/rate/${convertFrom}/${convertTo}?date=${selectedDate}`);

        if(!res.ok) {
            const error = await res.json();
            setError(error.message || "Failed to get conversion rate.");
            setConversionRate(0);

            setCovertFrom("");
            setConvertTo("");
            return;
        }
        const data = await res.json();
        console.log("Rate", data.rate)
        setConversionRate(data.rate);
        setError("");
        setShowConversion(true);

        setShowConvertButton(false);
        setShowIndicator(false);


    } catch(err) {
        console.error(err.message);
        setError("Unable to connect to the currency exchange service.");
        setConversionRate(0);
        setShowConversion(false);

        setCovertFrom("");
        setConvertTo("");
    }
  }

  const getCurrencyName = (code) => {
    return currencies.find((currency) => currency.code === code)?.name || "";
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 bg-(--bg) rounded-3xl p-4">
      <div className={`w-full flex items-center justify-between text-(--text-orange) border border-(--border) rounded-lg font-semibold p-1.5
          ${windowWidth > 1670 ? "px-4" : windowWidth > 1600 ? "px-2" : windowWidth > 1275 ? "text-[14px] px-1": "text-md justify-around px-3" } `}>
        <p>Currency Converter</p>
         <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ colorScheme: theme === "dark" ? "dark" : "light" }}
            className={`bg-(--bg) border border-(--bg2) rounded-lg px-2 py-2 text-(--text) text-xs outline-none cursor-pointer 
                      ${windowWidth > 1500 ? "w-26" : windowWidth > 1300 ? "w-24 text-[11px]" : isMobile ? "w-26 text-md" : "w-22 text-[10px]"}`}
        />
      </div>
      <div className="w-full flex items-center justify-center gap-4 py-1 text-(--text-orange) overflow-x-hidden">
        {/* Covert From */}

        <select
          value={convertFrom}
          onChange={(e) => setCovertFrom(e.target.value)}
          className="w-32 min-w-0 bg-(--bg) border border-(--bg2) rounded-lg px-2 py-2 text-(--text) text-xs outline-none cursor-pointer"
        >
          <option value="">Select currency</option>

          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>

        <span className="shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z" />
          </svg>
        </span>

        {/* Convert To */}
        <select
          value={convertTo}
          onChange={(e) => setConvertTo(e.target.value)}
          className="w-32 min-w-0 bg-(--bg) border border-(--bg2) rounded-lg px-2 py-2 text-(--text) text-xs outline-none cursor-pointer"
        >
          <option value="">Select currency</option>

          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>
      {showIndicator && (
        <div className="grid grid-cols-[1fr_25px_1fr] items-center gap-4 px-4 py-1 text-(--text-orange)">
          <span className="text-(--text-green) font-semibold text-xs">
            {convertFrom ? `${convertFrom} - ${getCurrencyName(convertFrom)}` : ""}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </svg>
          <span className="text-(--text-green) font-semibold text-xs">
            {convertTo ? `${convertTo} - ${getCurrencyName(convertTo)}` : ""}
          </span>
        </div>
      )}
      {showConvertButton && (
        <button 
            onClick={GetCoversionRate}
            className="self-center bg-(--bg-green) w-fit px-10 py-1 rounded-lg text-(--text) font-semibold">
            View Conversion
        </button>
      )}
      {error && (
        <p className="text-red-500 text-sm self-center">{error}</p>
      )}
      {conversionRate !== 0 && (
        <p className="text-sm text-(--text-green) font-semibold self-center">Conversion Rate: {conversionRate}</p>
      )}
      {showConversion && (
        <div className="w-full flex flex-col gap-2 rounded-xl my-2">
            {conversionAmounts.map((amount) => (
            <div
                key={amount}
                className="flex justify-between items-center text-xs bg-(--code-bg) px-4 py-2 rounded-xl border border-(--border)/80"
            >
                <span className="text-(--text-green)">
                {amount.toLocaleString()} {convertFrom}
                </span>

                <span className="text-(--text-orange) font-semibold">
                {(amount * conversionRate).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}{" "}
                {convertTo}
                </span>
            </div>
            ))}
        </div>
        )}
    </div>
  );
}
