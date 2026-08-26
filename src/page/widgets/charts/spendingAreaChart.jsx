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

const SERIES_CONFIG = {
  transaction: { label: "Transactions", color: "#3b82f6" },
  receipt: { label: "Receipts", color: "#34d399" },
};

const SERIES_KEYS = Object.keys(SERIES_CONFIG);

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
        const byCurrency = entry.payload[`${entry.dataKey}ByCurrency`] || {};
        const currencies = Object.entries(byCurrency).filter(([, amt]) => amt > 0);

        if (currencies.length === 0) return null;

        return (
          <div key={entry.dataKey} className="mb-1 last:mb-0">
            <p style={{ color: entry.color }} className="font-medium">
              {SERIES_CONFIG[entry.dataKey].label}
            </p>
            {currencies.map(([currency, amt]) => (
              <p key={currency} className="pl-2 text-(--text)/80">
                {currency}: {amt.toFixed(2)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function SpendingAreaChart({chartData}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {SERIES_KEYS.map((key) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SERIES_CONFIG[key].color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={SERIES_CONFIG[key].color} stopOpacity={0} />
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
            {SERIES_KEYS.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={SERIES_CONFIG[key].label}
                stroke={SERIES_CONFIG[key].color}
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