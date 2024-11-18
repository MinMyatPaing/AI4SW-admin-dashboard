import React from "react";

export default function Input({ title, field, value, type, onChange }) {
  return (
    <div className="flex-1">
      <label htmlFor={field} className="block font-medium mb-1">
        {title}
      </label>
      {field === "taskType" ? (
        <select
          id="taskType"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          value={value}
          onChange={onChange}
        >
          <option value="DailyMood">Daily Mood</option>
          <option value="WEMWBS">WEMWBS</option>
        </select>
      ) : (
        <input
          id={field}
          type={type}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
