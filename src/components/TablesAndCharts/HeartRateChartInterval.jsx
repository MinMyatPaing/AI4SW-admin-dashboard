import React from "react";
import {
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from "recharts";

export default function HeartRateChartInterval({
  formatHeartRateChartDataInterval,
}) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-[#8884d8]">
            Heart Rate: {payload[0].payload.heartRate} BPM
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-medium mb-2">Heart Rate Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: 40,
          }}
        >
          <XAxis
            dataKey="time"
            type="category"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 12 }}
            height={60}
            tickMargin={25}
          />
          <YAxis
            dataKey="heartRate"
            name="Heart Rate"
            unit=" BPM"
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={formatHeartRateChartDataInterval()}
            name="Heart Rate"
            fill="#8884d8"
            shape="cross"
            line={false}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="text-sm text-gray-500 mt-2 text-center">
        Time (15-minute intervals)
      </div>
    </div>
  );
}
