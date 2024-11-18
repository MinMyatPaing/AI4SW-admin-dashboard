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

export default function HeartRateChartDateRange({ heartRateSamples, startDate }) {
  const formatHeartRateChartData = () => {
    const data = [];
    heartRateSamples.forEach((sample) => {
      const sampleDate = new Date(sample.startDate);
      const dateString = sampleDate.toLocaleDateString();
      const existingData = data.find((d) => d.date === dateString);

      const chosenStartDate = new Date(startDate);
      if (sampleDate > chosenStartDate) {
        if (existingData) {
          existingData.heartRate = (existingData.heartRate + sample.value) / 2;
        } else {
          data.push({
            date: dateString,
            heartRate: sample.value,
          });
        }
      }
    });
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Sorted Data ====> ", sortedData);

    return sortedData;
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-medium mb-2">Heart Rate Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formatHeartRateChartData()}>
          <XAxis dataKey="date" />
          <YAxis
            type="number"
            domain={[0, (dataMax) => Math.ceil(dataMax / 100) * 100]} // Adjust the y-axis domain
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
