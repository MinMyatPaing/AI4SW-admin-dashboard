import React, { useState, useEffect } from "react";
import { functions, httpsCallable } from "../firebase.config.js";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [date, setDate] = useState("");
  const [taskType, setTaskType] = useState("DailyMood");
  const [sampleType, setSampleType] = useState("daily");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [heartRateSamples, setHeartRateSamples] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showHeartRateChart, setShowHeartRateChart] = useState(false);

  const [isFetchingHeartRate, setIsFetchingHeartRate] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);

  const COLORS = ["#0088FE", "#FF8042", "#9ACD32"];

  const fetchTaskByEmail = async () => {
    setTasks([]);
    const getTaskIdsByDateRange = httpsCallable(
      functions,
      "getTaskIdsByDateRange"
    );

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid date format");
      return;
    }

    setIsFetchingTasks(true);
    try {
      const result = await getTaskIdsByDateRange({
        email: email,
        taskType: taskType,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      setTasks(result.data);
      console.log("Tasks ===>", result.data);

      setShowTable(true);
      setIsFetchingTasks(false);
    } catch (error) {
      console.error("Error fetching task IDs:", error);
      setIsFetchingTasks(false);
      return null;
    }
  };

  const fetchHourlyHeartRateSamples = async () => {
    const getHourlyHeartRateSamples = httpsCallable(
      functions,
      "getHourlyHeartRateSamples"
    );

    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      console.error("Invalid date format");
      return;
    }

    setIsFetchingHeartRate(true);

    try {
      const result = await getHourlyHeartRateSamples({
        email: email,
        taskType: taskType,
        date: targetDate.toISOString(),
      });

      console.log("Fetched Result ====> ", result.data);

      setHeartRateSamples(result.data);
      setShowHeartRateChart(true);
      setIsFetchingHeartRate(false);
    } catch (error) {
      console.error(error);
      setIsFetchingHeartRate(false);
    }
  };

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

  const formatHourlyHeartRateChartData = () => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourlyAverage = heartRateSamples[hour] || "0.00";
      data.push({ hour: hour, heartRate: parseFloat(hourlyAverage) });
    }
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
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">AI4SW Admin Dashboard</h1>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {sampleType === "daily" && (
            <>
              <div>
                <label htmlFor="startDate" className="block font-medium mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block font-medium mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
          {sampleType === "hourly" && (
            <div>
              <label htmlFor="date" className="block font-medium mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="taskType" className="block font-medium mb-1">
              Task Type
            </label>
            <select
              id="taskType"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option value="DailyMood">Daily Mood</option>
              <option value="WEMWBS">WEMWBS</option>
            </select>
          </div>
          <div>
            <label htmlFor="sampleType" className="block font-medium mb-1">
              Sample Type
            </label>
            <select
              id="sampleType"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={fetchTaskByEmail}
            disabled={isFetchingTasks}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Search
          </button>
          {sampleType === "hourly"  (
            <button
              onClick={fetchHourlyHeartRateSamples}
              disabled={isFetchingHeartRate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Fetch Hourly Heart Rate
            </button>
          )}
        </div>

        {(isFetchingHeartRate || isFetchingTasks) && (
          <div className="flex justify-center items-center">
            <ClipLoader
              color={"#0088FE"}
              loading={isFetchingHeartRate || isFetchingTasks}
              size={100}
              aria-label="Loading Spinner"
            />
          </div>
        )}

        {showTable && (
          <div className="mt-5">
            <table className="min-w-full table-auto mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Task Type</th>
                  {sampleType === "daily" && (
                    <>
                      <th className="px-4 py-2 border-b">Start Date</th>
                      <th className="px-4 py-2 border-b">End Date</th>
                    </>
                  )}
                  {sampleType === "hourly" && (
                    <th className="px-4 py-2 border-b">Date</th>
                  )}
                  <th className="px-4 py-2 border-b">Number of Tasks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">{email}</td>
                  <td className="px-4 py-2 border-b">{taskType}</td>
                  {sampleType === "daily" && (
                    <>
                      <td className="px-4 py-2 border-b">{startDate}</td>
                      <td className="px-4 py-2 border-b">{endDate}</td>
                    </>
                  )}
                  {sampleType === "hourly" && (
                    <td className="px-4 py-2 border-b">{date}</td>
                  )}
                  <td className="px-4 py-2 border-b">{tasks.length}</td>
                </tr>
              </tbody>
            </table>

            {taskType === "DailyMood" && (
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
                      <h3 className="text-lg font-medium mb-2 capitalize">
                        {field}
                      </h3>
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
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showHeartRateChart && !isFetchingHeartRate && (
          <div className="mt-5">
            <h2 className="text-lg font-medium mb-2">Heart Rate Over Time</h2>
            {sampleType === "daily" && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
