import { useState } from "react";
import {
    Pie,
    PieChart,
    Sector,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const SERIES_CONFIG = {
    transaction: { label: "Transactions", color: "#3b82f6" },
    receipt: { label: "Receipts", color: "#34d399" },
};

const SERIES_KEYS = Object.keys(SERIES_CONFIG);

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
    const currencyEntries = Object.entries(payload.byCurrency || {}).filter(
        ([, amt]) => amt > 0
    );

    return (
        <g>
            <text x={cx} y={cy} dy={-6 - (currencyEntries.length - 1) * 7} textAnchor="middle" fill={fill} fontSize={16} fontWeight={600}>
                {payload.name}
            </text>
            {currencyEntries.map(([currency, amt], i) => (
                <text
                    key={currency}
                    x={cx}
                    y={cy}
                    dy={12 + i * 14}
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize={13}
                    opacity={0.8}
                >
                    {currency}: {amt.toFixed(2)}
                </text>
            ))}
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

    const pieData = SERIES_KEYS.map((key) => {
        const byCurrency = {};
        let total = 0;

        chartData.forEach((day) => {
            total += day[key] || 0;
            const dayByCurrency = day[`${key}ByCurrency`] || {};
            Object.entries(dayByCurrency).forEach(([currency, amt]) => {
                byCurrency[currency] = (byCurrency[currency] || 0) + amt;
            });
        });

        return {
            name: SERIES_CONFIG[key].label,
            value: total,
            byCurrency,
            fill: SERIES_CONFIG[key].color,
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