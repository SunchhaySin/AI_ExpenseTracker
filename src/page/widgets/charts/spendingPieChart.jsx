import { useState } from "react";
import {
    Pie,
    PieChart,
    Sector,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

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

const renderActiveShape = ({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
}) => {
    return (
        <g>
            <text x={cx} y={cy} dy={-6} textAnchor="middle" fill={fill} fontSize={16} fontWeight={600}>
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={14} textAnchor="middle" fill="var(--text)" fontSize={13} opacity={0.8}>
                {payload.value.toFixed(2)}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke="none"
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={(outerRadius ?? 0) + 6}
                outerRadius={(outerRadius ?? 0) + 10}
                fill={fill}
                stroke="none"
            />
        </g>
    );
};

export default function SpendingPieChart({ chartData, currentViewedMonth, isAnimationActive = true }) {
    const [activeIndex, setActiveIndex] = useState(null);

    const currencyKeys = Array.from(
    new Set(
      chartData.flatMap((bucket) =>
        Object.entries(bucket)
          .filter(([key, value]) => key !== "day" && typeof value === "number")
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

    if (pieData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-(--text)/60 text-sm">
                No spending data for this period.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                    activeShape={renderActiveShape}
                    activeIndex={activeIndex}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    dataKey="value"
                    isAnimationActive={isAnimationActive}
                    stroke="none"
                />
                {activeIndex === null && (
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="var(--text)"
                        fontSize={16}
                        opacity={0.6}
                    >
                        {currentViewedMonth}
                    </text>
                )}
                <Tooltip content={() => null} />
            </PieChart>
        </ResponsiveContainer>
    );
}