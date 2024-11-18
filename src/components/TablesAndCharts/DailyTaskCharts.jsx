import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export default function DailyTaskCharts({tasks}) {

  const COLORS = ["#0088FE", "#FF8042", "#9ACD32"];

  const calculateBooleanStats = (field) => {
    const total = tasks.length;
    const trueCount = tasks.filter((task) => task[field] === true).length;
    const falseCount = total - trueCount;

    return [
      { name: "True", value: trueCount },
      { name: "False", value: falseCount },
    ];
  };

  const formatLineChartData = () => {
    const data = [];
    tasks.forEach((task) => {
      const taskDate = new Date(task.date);
      data.push({
        date: taskDate.toLocaleDateString(),
        energyScore: getScoreLabel(task.energyScore),
        healthScore: getHealthScoreLabel(task.healthScore),
        moodScore: getMoodScoreLabel(task.moodScore),
      });
    });
    return data;
  };

  const getScoreLabel = (score) => {
    switch (score) {
      case -1:
        return "Low";
      case 0:
        return "Medium";
      case 1:
        return "High";
      default:
        return "";
    }
  };

  const getHealthScoreLabel = (score) => {
    switch (score) {
      case false:
        return "Poor";
      case true:
        return "Good";
      default:
        return "Fair";
    }
  };

  const getMoodScoreLabel = (score) => {
    switch (score) {
      case -1:
        return "Negative";
      case 0:
        return "Neutral";
      case 1:
        return "Positive";
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <h3 className="text-lg font-medium mb-2">
          Energy, Health, and Mood Scores
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formatLineChartData()}>
            <XAxis dataKey="date" />
            <YAxis type="category" domain={[0, "dataMax"]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="energyScore"
              name="Energy Score"
              stroke="#0088FE"
            />
            <Line
              type="monotone"
              dataKey="healthScore"
              name="Health Score"
              stroke="#FF8042"
            />
            <Line
              type="monotone"
              dataKey="moodScore"
              name="Mood Score"
              stroke="#9ACD32"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {["active", "sleepStatus", "stress"].map((field) => (
          <div key={field} className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-2 capitalize">{field}</h3>
            <PieChart width={200} height={250}>
              <Pie
                data={calculateBooleanStats(field)}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {calculateBooleanStats(field).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </div>
        ))}
      </div>
    </div>
  );
}
