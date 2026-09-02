import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useMemo, useState } from "react";

const COLOR_PALETTE = [
  "#3b82f6", "#34d399", "#f59e0b", "#ef4444", "#a78bfa", "#22d3ee", "#f472b6",
];

function getColorForKey(key, allKeys) {
  const index = allKeys.indexOf(key);
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  // payload[0].payload is the full bucket object (day, currency totals, payments[])
  const bucket = payload[0].payload;
  const payments = bucket?.payments || [];

  return (
    <div
      style={{
        backgroundColor: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "8px 10px",
        fontSize: "12px",
        color: "var(--text)",
        maxWidth: "220px",
      }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry) => {
        if (typeof entry.value !== "number" || entry.value === 0) return null;
        return (
          <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        );
      })}
      {payments.length > 0 && (
        <div className="mt-2 pt-2 border-t border-(--border)/50">
          <p className="opacity-70 mb-1">{payments.length} payment{payments.length > 1 ? "s" : ""}:</p>
          {payments.slice(0, 3).map((p, i) => (
            <p key={i} className="opacity-90 truncate">
              {p.paidTo} — {p.amount.toFixed(2)} {p.currency}
            </p>
          ))}
          {payments.length > 3 && (
            <p className="opacity-50">+{payments.length - 3} more (click bar for full list)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpendingAreaChart({ chartData }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const seriesKeys = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const keySet = new Set();
    chartData.forEach((bucket) => {
      Object.keys(bucket).forEach((key) => {
        if (key === "day" || key === "payments") return;
        keySet.add(key);
      });
    });
    return Array.from(keySet).sort();
  }, [chartData]);

  const handleChartClick = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const bucket = state.activePayload[0].payload;
      // Toggle off if clicking the same day again
      setSelectedDay((prev) => (prev && prev.day === bucket.day ? null : bucket));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onClick={handleChartClick}
          >
            <defs>
              {seriesKeys.map((key) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColorForKey(key, seriesKeys)} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={getColorForKey(key, seriesKeys)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis
              dataKey="day"
              tick={{ fill: "var(--text)", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fill: "var(--text)", fontSize: 11 }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {seriesKeys.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={getColorForKey(key, seriesKeys)}
                fill={`url(#gradient-${key})`}
                strokeWidth={2}
                style={{ cursor: "pointer" }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* "Toolbar" breakdown panel — appears when a day is clicked */}
      {selectedDay && selectedDay.payments?.length > 0 && (
        <div className="mt-2 border border-(--border) rounded-lg p-2 max-h-32 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-(--text-orange)">
              {selectedDay.day} — {selectedDay.payments.length} payment
              {selectedDay.payments.length > 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-(--text)/60 hover:text-(--text) text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {selectedDay.payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-(--text) truncate">{p.paidTo}</span>
                <span className="text-(--text)/70 shrink-0 ml-2">
                  {p.amount.toFixed(2)} {p.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}