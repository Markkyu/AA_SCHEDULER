import { useState } from "react";

export default function DurationToggle({
  duration,
  setDuration,
  selectedCourse,
}) {
  return (
    <div className="flex flex-col items-center min-w-md shadow-md bg-white p-8 rounded-xl">
      <p className="text-blue-700 font-medium">
        Selected: {selectedCourse.course_name} ({selectedCourse.hoursWeek} hrs
        left)
      </p>
      <label className="text-gray-700 font-semibold mt-4 mb-2">Duration</label>

      <div className="flex w-full justify-center">
        {[
          { label: "0.5 hr", value: 0.5 },
          { label: "1 hr", value: 1 },
          { label: "1.5 hr", value: 1.5 },
        ].map((opt, i) => (
          <label
            key={opt.value}
            className={`flex flex-col items-center px-4 py-2 cursor-pointer border
              ${i === 0 ? "rounded-l-lg" : ""}
              ${i === 2 ? "rounded-r-lg" : ""}
              ${
                duration === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }
              border-gray-300 transition`}
          >
            <span className="text-sm mb-1">{opt.label}</span>
            <input
              type="radio"
              value={opt.value}
              checked={duration === opt.value}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="hidden"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
