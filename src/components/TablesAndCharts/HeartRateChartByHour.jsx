import React from "react";
import {
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function HeartRateChartByHour({
  formatHourlyHeartRateChartData,
}) {
  return (
    <div className="mt-5">
      <h2 className="text-lg font-medium mb-2">Heart Rate Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formatHourlyHeartRateChartData()}>
          <XAxis dataKey="hour" />
          <YAxis
            type="number"
            domain={[0, (dataMax) => Math.ceil(dataMax / 100) * 100]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="heartRate"
            name="Heart Rate"
            stroke="#0088FE"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
