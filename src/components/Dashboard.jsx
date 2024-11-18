import React, { useState } from "react";
import { functions, httpsCallable } from "../firebase.config.js";

import { ClipLoader } from "react-spinners";
import TaskTable from "./TablesAndCharts/TaskTable.jsx";
import DailyTaskCharts from "./TablesAndCharts/DailyTaskCharts.jsx";
import HeartRateChartDateRange from "./TablesAndCharts/HeartRateChartDateRange.jsx";
import Input from "./CustomUI/Input.jsx";
import SwitchButton from "./CustomUI/SwitchButton.jsx";
import HeartRateChartByHour from "./TablesAndCharts/HeartRateChartByHour.jsx";

const Dashboard = () => {
  const [isDateFilter, setIsDateFilter] = useState(true);

  const initialForm = !isDateFilter
    ? {
        email: "",
        date: "",
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
  const [heartRateSamplesHourlyFilter, setHeartRateSamplesHourlyFilter] =
    useState({});
  const [showTable, setShowTable] = useState(false);
  const [showHeartRateChart, setShowHeartRateChart] = useState(false);

  const [isFetchingHeartRate, setIsFetchingHeartRate] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);

  // Task Fetch

  const fetchTaskByEmail = async () => {
    setTasks([]);
    const getTaskIdsByDateRange = httpsCallable(
      functions,
      "getTaskIdsByDateRange"
    );

    const start = new Date(formDetails.startDate);
    const end = new Date(formDetails.endDate);

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
      setError(error.message === 'not-found' ? 'Invalid Email' : "An unexpected error occurred");
    } finally {
      setIsFetchingTasks(false);
    }
  };

  // HOURLY HEART RATE ////
  const formatHourlyHeartRateChartData = () => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourlyAverage = heartRateSamplesHourlyFilter[hour] || "0.00";
      data.push({
        hour: `${hour} ${Number(hour) >= 12 ? " PM" : " AM"}`,
        heartRate: parseFloat(hourlyAverage),
      });
    }
    return data;
  };

  const fetchHourlyHeartRateSamples = async () => {
    const getHourlyHeartRateSamples = httpsCallable(
      functions,
      "getHourlyHeartRateSamples"
    );

    const targetDate = new Date(formDetails.date);

    if (isNaN(targetDate.getTime())) {
      console.error("Invalid date format");
      return;
    }

    setIsFetchingHeartRate(true);

    try {
      const result = await getHourlyHeartRateSamples({
        email: formDetails.email,
        taskType: formDetails.taskType,
        date: targetDate.toISOString(),
      });

      console.log("Fetched Result ====> ", result.data);

      setHeartRateSamplesHourlyFilter(result.data);
      setShowHeartRateChart(true);
      setIsFetchingHeartRate(false);
    } catch (error) {
      console.error(error);
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

      console.log("Fetched Result ====> ", result.data);

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
            secondLabel={"Hourly Filter"}
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
              <Input
                field={"date"}
                title={"Date"}
                type={"date"}
                value={formDetails.date}
                onChange={(e) => updateForm("date", e.target.value)}
              />
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
            <button
              onClick={fetchTaskByEmail}
              disabled={isFetchingTasks}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 font-medium rounded-md mr-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Search
            </button>
            <button
              onClick={
                isDateFilter
                  ? fetchHeartRateSamplesByDateRange
                  : fetchHourlyHeartRateSamples
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

              {formDetails.taskType === "DailyMood" && (
                <DailyTaskCharts tasks={tasks} />
              )}
            </div>
          )}

          {showHeartRateChart && !isFetchingHeartRate && isDateFilter && (
            <HeartRateChartDateRange
              heartRateSamples={heartRateSamplesDateFilter}
              startDate={formDetails.startDate}
            />
          )}

          {showHeartRateChart && !isFetchingHeartRate && !isDateFilter && (
            <HeartRateChartByHour
              formatHourlyHeartRateChartData={formatHourlyHeartRateChartData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
