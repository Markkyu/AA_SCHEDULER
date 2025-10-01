import React from "react";

// Generate Time - 30 minute iteration
function generateTimeSlots(start = 7, end = 20, step = 0.5) {
  const slots = [];
  for (let hour = start; hour < end; hour += step) {
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

    slots.push({ hour, startTime, endTime });
  }
  return slots;
}

const ScheduleTable = ({
  headers,
  times,
  getReadableTime,
  timeSlotMap,
  onCellClick,
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
      {generateTimeSlots().map((time, i) => (
        <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <td className="border border-gray-400 px-4 py-2 text-center">
            <b>{time.startTime}</b> - {time.endTime}
          </td>
          {headers.map((day, j) => {
            const startKey = `${day.toUpperCase()}_${time.hour}`;
            const endKey = `${day.toUpperCase()}_${time.hour + 0.5}`;

            const course = timeSlotMap.get(startKey);
            return (
              <td
                key={j}
                className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition`}
                onClick={() => onCellClick(startKey, endKey, day, time)}
              >
                {course || ""}
              </td>
            );
          })}
        </tr>
      ))}
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

//     // Calculate end time
//     const endHour = hour + step;
//     const endTimeHour = Math.floor(endHour);
//     const endTimeMinutes = endHour % 1 === 0 ? "00" : "30";
//     const endPeriod = endTimeHour >= 12 ? "PM" : "AM";
//     const formattedEndHour = endTimeHour > 12 ? endTimeHour - 12 : endTimeHour;
//     const endTime = `${formattedEndHour}:${endTimeMinutes} ${endPeriod}`;

//     slots.push({ hour, startTime, endTime });
//   }
//   return slots;
// }

// // Group time slots by hour
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
//   times,
//   getReadableTime,
//   timeSlotMap,
//   onCellClick,
// }) => {
//   const [expandedHours, setExpandedHours] = useState(new Set());

//   const toggleExpand = (hourBlock) => {
//     setExpandedHours((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(hourBlock)) {
//         newSet.delete(hourBlock);
//       } else {
//         newSet.add(hourBlock);
//       }
//       return newSet;
//     });
//   };

//   const allSlots = generateTimeSlots();
//   const groupedSlots = groupTimeSlotsByHour(allSlots);

//   return (
//     <table className="min-w-2xl mx-auto my-6">
//       <thead>
//         <tr className="bg-gray-200">
//           <td className="border border-gray-400 px-4 py-2 font-semibold w-48">
//             Time
//           </td>
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
//               {/* Main hour row */}
//               <tr className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
//                 <td
//                   className="border border-gray-400 px-4 py-2 cursor-pointer hover:bg-blue-50"
//                   onClick={() => toggleExpand(group.hourBlock)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>{group.displayTime}</span>
//                     <span className="text-xs ml-2">
//                       {isExpanded ? "▼" : "▶"}
//                     </span>
//                   </div>
//                 </td>
//                 {!isExpanded &&
//                   headers.map((day, j) => {
//                     const key = `${day.toUpperCase()}_${group.hourBlock - 7}`; // set as map key, will also be the reference to scheduler tim
//                     return (
//                       <td
//                         key={j}
//                         className="border border-gray-400 px-4 py-2 text-center cursor-pointer transition hover:bg-blue-50"
//                         // onClick={() => onCellClick && onCellClick(key, day)}
//                         // onClick={() => console.log(key, day)}
//                       >
//                         {/* Content for the entire hour block */}
//                       </td>
//                     );
//                   })}
//               </tr>

//               {/* Expanded 30-minute rows */}
//               {isExpanded &&
//                 group.slots.map((slot, slotIdx) => (
//                   <tr
//                     key={`${i}-${slotIdx}`}
//                     className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
//                   >
//                     {slotIdx === 0 && (
//                       <td
//                         className="border border-gray-400 px-4 py-2 cursor-pointer hover:bg-blue-50"
//                         rowSpan={group.slots.length}
//                         onClick={() => toggleExpand(group.hourBlock)}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span>{group.displayTime}</span>
//                           <span className="text-xs ml-2">▼</span>
//                         </div>
//                       </td>
//                     )}
//                     {headers.map((day, j) => {
//                       const key = `${day.toUpperCase()}_${slot.hour - 7}`;
//                       return (
//                         <td
//                           key={j}
//                           className="border border-gray-400 px-4 py-2 text-center cursor-pointer transition hover:bg-blue-50"
//                           //   onClick={() => onCellClick && onCellClick(key, day)}
//                           //   onClick={() => onCellClick && console.log(key, day)}
//                         >
//                           <div
//                             className="text-xs text-gray-500"
//                             onClick={() => console.log(key, day)}
//                           >
//                             {slot.startTime} - {slot.endTime}
//                           </div>
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
