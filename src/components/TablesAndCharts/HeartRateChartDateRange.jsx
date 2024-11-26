import React from "react";
import {
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from "recharts";

export default function HeartRateChartDateRange({
  heartRateSamples,
  startDate,
}) {
  // Function to format the heart rate data for charting
  const formatHeartRateChartData = () => {
    const data = [];

    // Iterate through each sample and process its data
    heartRateSamples.forEach((sample) => {
      const sampleDate = new Date(sample.startDate); // Convert the sample date to Date object
      const dateString = sampleDate.toLocaleDateString(); // Format the date as string

      // Check if data already exists for the same date
      const existingData = data.find((d) => d.date === dateString);

      // Compare sample date with the chosen start date and only process if it's later
      const chosenStartDate = new Date(startDate);
      if (sampleDate > chosenStartDate) {
        if (existingData) {
          // If data for the date exists, average the heart rate values
          existingData.heartRate = (existingData.heartRate + sample.value) / 2;
        } else {
          // Otherwise, add a new entry for the date
          data.push({
            date: dateString,
            heartRate: sample.value,
          });
        }
      }
    });

    // Sort the data by date in ascending order
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedData; // Return the formatted and sorted data
  };

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
            dataKey="date"
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
            data={formatHeartRateChartData()}
            name="Heart Rate"
            fill="#8884d8"
            shape="cross"
            line={false}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
