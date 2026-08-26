import React, { useState } from 'react'

export default function CurrencyConversion() {
    const [convertFrom, setCovertFrom] = useState("");
    const [convertTo, setConvertTo] = useState("");
    return (
        <div className="w-full h-full flex flex-col bg-(--bg) rounded-3xl p-4">
            <div className="w-full flex items-center justify-around text-(--text-orange) border border-(--border)/60 rounded-xl font-semibold p-1">
                <p>Currency Conversion</p>
                <div className="px-4 py-2 border border-(--bg2) text-(--text) rounded-2xl flex gap-2 ">
                    <p>{convertFrom.length === 0 ? "___" : convertFrom}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>
                    {convertTo.length !== 0 ? (
                        <p>{convertTo}</p>
                    ) : (
                        <select>
       
                        </select>
                    )}
                </div>
            </div>
        </div>
    )
}
