import React from "react";

// Generate Time - 30 minute iteration
function generateTimeSlots(start = 7, end = 20, step = 0.5) {
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

const ScheduleTable = ({
  headers,
  times,
  getReadableTime,
  timeSlotMap,
  onCellClick,
  handleRemoveSchedule,
}) => (
  <table className="min-w-3xl mx-auto my-6">
    <thead>
      <tr className="bg-gray-200">
        <td className="border border-gray-400 px-4 py-2 font-semibold">Time</td>
        {headers.map((weekday, i) => (
          <td
            key={i}
            className="border border-gray-400 px-4 py-2 font-semibold text-center"
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
                  className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition`}
                  onClick={() => onCellClick(startKey, endKey, day, time)}
                >
                  {isDisabled ? "Lunch Break" : course?.course_code || ""}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default ScheduleTable;

// import React, { useState } from "react";

// // Generate Time - 30 minute iteration
// function generateTimeSlots(start = 7, end = 20, step = 0.5) {
//   const slots = [];
//   for (let hour = start; hour < end; hour += step) {
//     const startTimeHour = Math.floor(hour);
//     const startTimeMinutes = hour % 1 === 0 ? "00" : "30";
//     const period = startTimeHour >= 12 ? "PM" : "AM";
//     const formattedHour =
//       startTimeHour > 12 ? startTimeHour - 12 : startTimeHour;
//     const startTime = `${formattedHour}:${startTimeMinutes} ${period}`;

//     const endHour = hour + step;
//     const endTimeHour = Math.floor(endHour);
//     const endTimeMinutes = endHour % 1 === 0 ? "00" : "30";
//     const endPeriod = endTimeHour >= 12 ? "PM" : "AM";
//     const formattedEndHour = endTimeHour > 12 ? endTimeHour - 12 : endTimeHour;
//     const endTime = `${formattedEndHour}:${endTimeMinutes} ${endPeriod}`;

//     slots.push({ hour, startTime, endTime, disabled: hour >= 12 && hour < 13 });
//   }
//   return slots;
// }

// // Group 30-min slots into 1-hour blocks
// function groupTimeSlotsByHour(slots) {
//   const grouped = [];
//   for (let i = 0; i < slots.length; i += 2) {
//     const firstSlot = slots[i];
//     const secondSlot = slots[i + 1];
//     grouped.push({
//       hourBlock: Math.floor(firstSlot.hour),
//       slots: secondSlot ? [firstSlot, secondSlot] : [firstSlot],
//       displayTime: `${firstSlot.startTime} - ${
//         secondSlot ? secondSlot.endTime : firstSlot.endTime
//       }`,
//     });
//   }
//   return grouped;
// }

// const ScheduleTable = ({
//   headers,
//   timeSlotMap,
//   onCellClick,
//   handleRemoveSchedule,
// }) => {
//   const [expandedHours, setExpandedHours] = useState(new Set());
//   const allSlots = generateTimeSlots();
//   const groupedSlots = groupTimeSlotsByHour(allSlots);

//   // Expand/Collapse a specific hour
//   const toggleExpand = (hourBlock) => {
//     setExpandedHours((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(hourBlock)) newSet.delete(hourBlock);
//       else newSet.add(hourBlock);
//       return newSet;
//     });
//   };

//   return (
//     <table className="min-w-3xl mx-auto my-6 border-collapse border border-gray-400">
//       <thead>
//         <tr className="bg-gray-200">
//           <td className="border border-gray-400 px-4 py-2 font-semibold">Time</td>
//           {headers.map((weekday, i) => (
//             <td
//               key={i}
//               className="border border-gray-400 px-4 py-2 font-semibold text-center"
//             >
//               {weekday}
//             </td>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {groupedSlots.map((group, i) => {
//           const isExpanded = expandedHours.has(group.hourBlock);

//           return (
//             <React.Fragment key={i}>
//               {/* Collapsed Hour Row */}
//               <tr
//                 className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}
//               >
//                 <td
//                   className="border border-gray-400 px-4 py-2 cursor-pointer hover:bg-blue-50"
//                   onClick={() => toggleExpand(group.hourBlock)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span>{group.displayTime}</span>
//                     <span className="text-xs ml-2">
//                       {isExpanded ? "▼" : "▶"}
//                     </span>
//                   </div>
//                 </td>

//                 {!isExpanded &&
//                   headers.map((day, j) => {
//                     const firstHalfKey = `${day.toUpperCase()}_${group.hourBlock}`;
//                     const secondHalfKey = `${day.toUpperCase()}_${
//                       group.hourBlock + 0.5
//                     }`;

//                     const course =
//                       timeSlotMap.get(firstHalfKey) ||
//                       timeSlotMap.get(secondHalfKey);

//                     const isLunch = group.slots.some((slot) => slot.disabled);

//                     return (
//                       <td
//                         key={j}
//                         className={`border border-gray-400 px-4 py-3 text-center cursor-pointer hover:bg-blue-50 transition ${
//                           isLunch ? "bg-gray-200 text-gray-500" : ""
//                         }`}
//                         onClick={() =>
//                           onCellClick(firstHalfKey, secondHalfKey, day, group)
//                         }
//                       >
//                         {isLunch ? "Lunch Break" : course || ""}
//                       </td>
//                     );
//                   })}
//               </tr>

//               {/* Expanded 30-Minute Rows */}
//               {isExpanded &&
//                 group.slots.map((slot, idx) => (
//                   <tr
//                     key={`${group.hourBlock}-${idx}`}
//                     className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
//                   >
//                     {idx === 0 && (
//                       <td
//                         className="border border-gray-400 px-4 py-2 cursor-pointer hover:bg-blue-50"
//                         rowSpan={group.slots.length}
//                         onClick={() => toggleExpand(group.hourBlock)}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span>{group.displayTime}</span>
//                           <span className="text-xs ml-2">▼</span>
//                         </div>
//                       </td>
//                     )}

//                     {headers.map((day, j) => {
//                       const startKey = `${day.toUpperCase()}_${slot.hour}`;
//                       const endKey = `${day.toUpperCase()}_${slot.hour + 0.5}`;
//                       const course = timeSlotMap.get(startKey);
//                       const isLunch = slot.disabled;

//                       return (
//                         <td
//                           key={j}
//                           className={`border border-gray-400 px-4 py-2 text-center cursor-pointer hover:bg-blue-50 transition ${
//                             isLunch ? "bg-gray-200 text-gray-500" : ""
//                           }`}
//                           onClick={() =>
//                             onCellClick(startKey, endKey, day, slot)
//                           }
//                         >
//                           {isLunch ? "Lunch Break" : course || ""}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//             </React.Fragment>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// export default ScheduleTable;
