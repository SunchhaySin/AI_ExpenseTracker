import { useState, useMemo } from "react";
import {
    Pie,
    PieChart,
    Sector,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLOR_PALETTE = [
  "#3b82f6", "#34d399", "#f59e0b", "#ef4444", "#a78bfa", "#22d3ee", "#f472b6",
];

function getColorForKey(key, allKeys) {
  const index = allKeys.indexOf(key);
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

const renderActiveShape = ({
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload,
}) => {
    return (
        <g>
            <text x={cx} y={cy} dy={-6} textAnchor="middle" fill={fill} fontSize={16} fontWeight={600}>
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={14} textAnchor="middle" fill="var(--text)" fontSize={13} opacity={0.8}>
                {payload.value.toFixed(2)}
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="none" />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={(outerRadius ?? 0) + 6} outerRadius={(outerRadius ?? 0) + 10} fill={fill} stroke="none" />
        </g>
    );
};

export default function SpendingPieChart({ chartData, currentViewedMonth, isAnimationActive = true }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    const currencyKeys = Array.from(
      new Set(
        chartData.flatMap((bucket) =>
          Object.entries(bucket)
            .filter(([key, value]) => key !== "day" && key !== "payments" && typeof value === "number")
            .map(([key]) => key)
        )
      )
    ).sort();

    const pieData = currencyKeys.map((currency) => {
        const total = chartData.reduce((sum, day) => sum + (day[currency] || 0), 0);
        return {
          name: currency,
          value: total,
          fill: getColorForKey(currency, currencyKeys),
        };
    }).filter((entry) => entry.value > 0);

    // Merchant-level breakdown for whichever currency slice was clicked
    const merchantBreakdown = useMemo(() => {
        if (!selectedCurrency) return [];
        const totals = {};
        chartData.forEach((bucket) => {
            (bucket.payments || []).forEach((p) => {
                if (p.currency !== selectedCurrency) return;
                totals[p.paidTo] = (totals[p.paidTo] || 0) + p.amount;
            });
        });
        return Object.entries(totals)
            .map(([paidTo, amount]) => ({ paidTo, amount }))
            .sort((a, b) => b.amount - a.amount);
    }, [chartData, selectedCurrency]);

    if (pieData.length === 0) {
        // Grayed-out placeholder ring instead of plain text — keeps the same visual shape as the real chart
        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <Pie
                                data={[{ name: "empty", value: 1 }]}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="80%"
                                dataKey="value"
                                isAnimationActive={false}
                                stroke="none"
                                fill="var(--border)"
                                fillOpacity={0.4}
                            />
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="var(--text)"
                                fontSize={13}
                                opacity={0.6}
                            >
                                No spending data
                            </text>
                            <text
                                x="50%"
                                y="50%"
                                dy={18}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="var(--text)"
                                fontSize={11}
                                opacity={0.4}
                            >
                                for {currentViewedMonth}
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <Pie
                            activeShape={renderActiveShape}
                            activeIndex={activeIndex}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onClick={(entry) =>
                                setSelectedCurrency((prev) => (prev === entry.name ? null : entry.name))
                            }
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            dataKey="value"
                            isAnimationActive={isAnimationActive}
                            stroke="none"
                            style={{ cursor: "pointer" }}
                        />
                        {activeIndex === null && (
                            <text
                                x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                                fill="var(--text)" fontSize={16} opacity={0.6}
                            >
                                {currentViewedMonth}
                            </text>
                        )}
                        <Tooltip content={() => null} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Merchant breakdown for the clicked currency slice */}
            {selectedCurrency && (
                <div className="mt-2 border border-(--border) rounded-lg p-2 max-h-32 overflow-y-auto shrink-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-(--text-orange)">
                            Spent in {selectedCurrency} by merchant
                        </p>
                        <button
                            onClick={() => setSelectedCurrency(null)}
                            className="text-(--text)/60 hover:text-(--text) text-xs"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        {merchantBreakdown.map((m, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-(--text) truncate">{m.paidTo}</span>
                                <span className="text-(--text)/70 shrink-0 ml-2">
                                    {m.amount.toFixed(2)} {selectedCurrency}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}