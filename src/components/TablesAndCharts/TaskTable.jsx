import React from "react";

export default function TaskTable({
  email,
  taskType,
  startDate,
  endDate,
  tasks,
}) {
  return (
    <table className="min-w-full table-auto mb-8">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border-b">Email</th>
          <th className="px-4 py-2 border-b">Task Type</th>
          <th className="px-4 py-2 border-b">Start Date</th>
          <th className="px-4 py-2 border-b">End Date</th>
          <th className="px-4 py-2 border-b">Number of Tasks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2 border-b">{email}</td>
          <td className="px-4 py-2 border-b">{taskType}</td>
          <td className="px-4 py-2 border-b">{startDate}</td>
          <td className="px-4 py-2 border-b">{endDate}</td>
          <td className="px-4 py-2 border-b">{tasks.length}</td>
        </tr>
      </tbody>
    </table>
  );
}
