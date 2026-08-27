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

import { useMemo } from "react";


const COLOR_PALETTE = [
  "#3b82f6", // blue
  "#34d399", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#a78bfa", // violet
  "#22d3ee", // cyan
  "#f472b6", // pink
];

function getColorForKey(key, allKeys) {
  const index = allKeys.indexOf(key);
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "8px 10px",
        fontSize: "12px",
        color: "var(--text)",
      }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry) => {
        if (typeof entry.value !== "number") return null;
        return (
          <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        );
      })}
    </div>
  );
}

export default function SpendingAreaChart({ chartData }) {
  const seriesKeys = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    const keySet = new Set();
    chartData.forEach((bucket) => {
      Object.keys(bucket).forEach((key) => {
        if (key === "day") return;
        keySet.add(key);
      });
    });

    return Array.from(keySet).sort();
  }, [chartData]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}