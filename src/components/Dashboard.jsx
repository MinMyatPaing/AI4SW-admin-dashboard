import React, { useState, useEffect } from "react";
import { functions, httpsCallable } from "../firebase.config.js";

import { ClipLoader } from "react-spinners";
import TaskTable from "./TablesAndCharts/TaskTable.jsx";
import DailyTaskCharts from "./TablesAndCharts/DailyTaskCharts.jsx";
import HeartRateChartDateRange from "./TablesAndCharts/HeartRateChartDateRange.jsx";
import Input from "./CustomUI/Input.jsx";
import SwitchButton from "./CustomUI/SwitchButton.jsx";
import HeartRateChartInterval from "./TablesAndCharts/HeartRateChartInterval.jsx";

const Dashboard = () => {
  // Initial state and form setup
  const [isDateFilter, setIsDateFilter] = useState(true);

  const initialForm = !isDateFilter
    ? {
        email: "",
        date: "",
        startHour: "00:00",
        endHour: "23:59",
        taskType: "DailyMood",
      }
    : {
        email: "",
        startDate: "",
        endDate: "",
        taskType: "DailyMood",
      };

  const [formDetails, setFormDetails] = useState(initialForm);
  const [error, setError] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [heartRateSamplesDateFilter, setHeartRateSamplesDateFilter] = useState(
    []
  );
  const [heartRateSamplesIntervals, setHeartRateSamplesIntervals] = useState(
    {}
  );
  const [showTable, setShowTable] = useState(false);
  const [showHeartRateChart, setShowHeartRateChart] = useState(false);

  const [isFetchingHeartRate, setIsFetchingHeartRate] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);

  // Add useEffect to reset form when switching between date and hourly filters
  useEffect(() => {
    setFormDetails(
      !isDateFilter
        ? {
            email: "",
            date: "",
            startHour: "00:00",
            endHour: "23:59",
            taskType: "DailyMood",
          }
        : {
            email: "",
            startDate: "",
            endDate: "",
            taskType: "DailyMood",
          }
    );
    setShowTable(false);
    setShowHeartRateChart(false);
    setError(null);
  }, [isDateFilter]);

  // Function to fetch tasks based on email and date range
  const fetchTaskByEmail = async () => {
    setTasks([]);
    const getTaskIdsByDateRange = httpsCallable(
      functions,
      "getTaskIdsByDateRange"
    );

    const start = new Date(formDetails.startDate);
    const end = new Date(formDetails.endDate);
    // Check for valid date format
    if (isNaN(start) || isNaN(end)) {
      setError("Invalid date format");
      return;
    }

    setIsFetchingTasks(true);
    try {
      const result = await getTaskIdsByDateRange({
        email: formDetails.email,
        taskType: formDetails.taskType,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      // Check if there's an error in the response
      if (result.data.error) {
        setError(result.data.message);
        setIsFetchingTasks(false);
        return;
      }

      setTasks(result.data);
      setShowTable(true);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching task IDs:", error);
      setError(
        error.message === "not-found"
          ? "Invalid Email"
          : "An unexpected error occurred"
      );
    } finally {
      setIsFetchingTasks(false);
    }
  };

  // Format 15-minute interval data for chart
  const formatIntervalHeartRateChartData = () => {
    const data = [];
    const startHour = parseInt(formDetails.startHour);
    const endHour = parseInt(formDetails.endHour);

    // Generate all possible 15-minute intervals within the time range
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeKey = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const heartRate = heartRateSamplesIntervals[timeKey];

        // Only add intervals that have data
        if (heartRate) {
          const formattedHour = hour % 12 || 12; // Convert to 12-hour format
          const amPm = hour >= 12 ? "PM" : "AM";
          const formattedTime = `${formattedHour}:${minute
            .toString()
            .padStart(2, "0")} ${amPm}`;

          data.push({
            time: formattedTime,
            heartRate: heartRate,
          });
        }
      }
    }
    return data;
  };

  // Fetch heart rate data based on the selected date and hour range
  const fetchHeartRateSamples = async () => {
    const getHeartRateSamples = httpsCallable(
      functions,
      "getHeartRateSamplesEveryFifteenMinutes" // Keep the original function name unless changed in Firebase
    );

    const targetDate = new Date(formDetails.date);

    if (isNaN(targetDate.getTime())) {
      setError(`Invalid date format: ${formDetails.date}`);
      return;
    }

    setShowHeartRateChart(false);

    try {
      setIsFetchingHeartRate(true);

      const result = await getHeartRateSamples({
        email: formDetails.email,
        taskType: formDetails.taskType,
        date: targetDate.toISOString(),
        startHour: parseInt(formDetails.startHour || "0"),
        endHour: parseInt(formDetails.endHour || "23"),
      });

      setHeartRateSamplesIntervals(result.data);
      setShowHeartRateChart(true);
      setIsFetchingHeartRate(false);
    } catch (error) {
      console.error("Full error object:", error);
      setError(error.message || "An unexpected error occurred");
      setIsFetchingHeartRate(false);
    }
  };

  // DATE RANGE HEART RATE ///

  const fetchHeartRateSamplesByDateRange = async () => {
    setShowTable(false);
    const getHeartRateSamplesByDateRange = httpsCallable(
      functions,
      "getHeartRateSamplesByDateRange"
    );

    const start = new Date(formDetails.startDate);
    const end = new Date(formDetails.endDate);

    if (isNaN(start) || isNaN(end)) {
      console.error("Invalid date format");
      return;
    }

    setIsFetchingHeartRate(true);

    try {
      const result = await getHeartRateSamplesByDateRange({
        email: formDetails.email,
        taskType: formDetails.taskType,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      setHeartRateSamplesDateFilter(result.data);
      setShowHeartRateChart(true);
      setIsFetchingHeartRate(false);
    } catch (error) {
      console.error(error);
      setIsFetchingHeartRate(false);
    }
  };

  // Update Form ////

  const updateForm = (field, value) => {
    setFormDetails((prevForm) => {
      return {
        ...prevForm,
        [field]: value,
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">AI4SW Admin Dashboard</h1>
        <div className="flex flex-col mb-4 gap-5">
          <SwitchButton
            isOn={isDateFilter}
            onChange={() => setIsDateFilter((preState) => !preState)}
            firstLabel={"Date Filter"}
            secondLabel={"Minute Interval Filter"}
          />
          <div className="flex gap-3">
            <Input
              field={"email"}
              title={"Email"}
              type={"email"}
              value={formDetails.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
            {isDateFilter ? (
              <>
                <Input
                  field={"startDate"}
                  title={"Start Date"}
                  type={"date"}
                  value={formDetails.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                />
                <Input
                  field={"endDate"}
                  title={"End Date"}
                  type={"date"}
                  value={formDetails.endDate}
                  onChange={(e) => updateForm("endDate", e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="flex gap-3 mb-4">
                  <Input
                    field={"startHour"}
                    title={"Start Hour"}
                    type={"time"}
                    value={formDetails.startHour}
                    onChange={(e) => updateForm("startHour", e.target.value)}
                  />
                  <Input
                    field={"endHour"}
                    title={"End Hour"}
                    type={"time"}
                    value={formDetails.endHour}
                    onChange={(e) => updateForm("endHour", e.target.value)}
                  />
                  <Input
                    field={"date"}
                    title={"Date"}
                    type={"date"}
                    value={formDetails.date}
                    onChange={(e) => updateForm("date", e.target.value)}
                  />
                </div>
              </>
            )}
            <Input
              field={"taskType"}
              value={formDetails.taskType}
              title={"Task Type"}
              type={"text"}
              onChange={(e) => updateForm("taskType", e.target.value)}
            />
          </div>

          <div>
            {isDateFilter && <button
              onClick={fetchTaskByEmail}
              disabled={isFetchingTasks}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 font-medium rounded-md mr-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Search
            </button>}
            <button
              onClick={
                isDateFilter
                  ? fetchHeartRateSamplesByDateRange
                  : fetchHeartRateSamples
              }
              disabled={isFetchingHeartRate}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 font-medium rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isDateFilter
                ? "Show heart rate with date range"
                : "Show heart rate by hour"}
            </button>
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

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {showTable && !error && (
            <div className="mt-5">
              <TaskTable
                email={formDetails.startDate}
                taskType={formDetails.taskType}
                tasks={tasks}
                startDate={formDetails.startDate}
                endDate={formDetails.endDate}
              />

              {/* {formDetails.taskType === "DailyMood" && (
                <DailyTaskCharts tasks={tasks} />
              )} */}
            </div>
          )}

          {showHeartRateChart && !isFetchingHeartRate && isDateFilter && (
            <HeartRateChartDateRange
              heartRateSamples={heartRateSamplesDateFilter}
              startDate={formDetails.startDate}
            />
          )}

          {showHeartRateChart && !isFetchingHeartRate && !isDateFilter && (
            <HeartRateChartInterval
              formatHeartRateChartDataInterval={
                formatIntervalHeartRateChartData
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
