import React from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";

// Generate Time - 30 minute iteration
function generateTimeSlots(start = 7, end = 21, step = 0.5) {
  const slots = [];
  for (let hour = start; hour < end; hour += step) {
    // Calculate start time
    const startTimeHour = Math.floor(hour);
    const startTimeMinutes = hour % 1 === 0 ? "00" : "30";
    const period = startTimeHour >= 12 ? "PM" : "AM";
    const formattedHour =
      startTimeHour > 12 ? startTimeHour - 12 : startTimeHour;
    const startTime = `${formattedHour}:${startTimeMinutes} ${period}`;

    // Calculate end time
    const endHour = hour + step;
    const endTimeHour = Math.floor(endHour);
    const endTimeMinutes = endHour % 1 === 0 ? "00" : "30";
    const endPeriod = endTimeHour >= 12 ? "PM" : "AM";
    const formattedEndHour = endTimeHour > 12 ? endTimeHour - 12 : endTimeHour;
    const endTime = `${formattedEndHour}:${endTimeMinutes} ${endPeriod}`;

    // slots.push({ hour, startTime, endTime });
    slots.push({ hour, startTime, endTime, disabled: hour >= 12 && hour < 13 });
  }
  return slots;
}

export default function ScheduleTable({
  headers,
  times,
  getReadableTime,
  timeSlotMap,
  onCellClick,
  handleRemoveSchedule,
  onCellRightClick,
}) {
  return (
    <table className="min-w-3xl mx-auto my-6">
      <thead>
        <tr className="bg-gray-200">
          <td className="border border-gray-400 px-4 py-2">Time</td>
          {headers.map((weekday, i) => (
            <td
              key={i}
              className="border border-gray-400 px-4 py-2 font-bold text-center"
            >
              {weekday}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {generateTimeSlots().map((time, i) => {
          // Determine alternating color groups of 2 rows each
          const blockIndex = Math.floor(i / 2);
          const isColoredBlock = blockIndex % 2 === 0;

          return (
            <tr key={i} className={isColoredBlock ? "bg-gray-100" : "bg-white"}>
              <td className="border border-gray-400 px-4 py-2 text-center">
                <b>{time.startTime}</b>
                {/* <b>{time.startTime}</b> - {time.endTime} */}
              </td>
              {headers.map((day, j) => {
                const startKey = `${day.toUpperCase()}_${time.hour}`;
                const endKey = `${day.toUpperCase()}_${time.hour + 0.5}`;

                const course = timeSlotMap.get(startKey);
                const isDisabled = time.disabled;

                return (
                  <td
                    key={j}
                    className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition font-semibold`}
                    onClick={() =>
                      !isDisabled && onCellClick(startKey, endKey, day, time)
                    }
                    onContextMenu={(e) => {
                      e.preventDefault(); // prevent right-click menu
                      if (!isDisabled) onCellRightClick(day, startKey);
                    }}
                  >
                    {isDisabled ? "Lunch" : course?.course_code || ""}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
