export default function exportToJSON(schedules) {
  // const groupedSchedules = [];

  // // Sort all keys for proper day/time order
  // const sortedKeys = Object.keys(schedules).sort((a, b) => {
  //   const [dayA, timeA] = a.split("_");
  //   const [dayB, timeB] = b.split("_");
  //   if (dayA === dayB) return parseFloat(timeA) - parseFloat(timeB);
  //   return dayA.localeCompare(dayB);
  // });

  // console.log("sorted", sortedKeys);

  // let current = null;

  // for (const key of sortedKeys) {
  //   const slot = schedules[key];
  //   console.log(slot);
  //   if (!slot || !slot.course) continue;

  //   const [day, timeStr] = key.split("_");
  //   const time = parseFloat(timeStr);

  //   if (
  //     current &&
  //     current.course_id === slot.course.id &&
  //     current.day === day &&
  //     time === current.time_end // means it's the next 30-min slot
  //   ) {
  //     // Extend the block
  //     current.time_end += 0.5;
  //     current.duration += 0.5;
  //   } else {
  //     // Push the previous block if one existed
  //     if (current) groupedSchedules.push(current);

  //     // Start a new block
  //     current = {
  //       course_id: slot.course.id,
  //       teacher_id: slot.course.teacher_id,
  //       college_id: slot.course.college_id,
  //       day: day,
  //       time_start: time,
  //       time_end: time + 0.5,
  //       duration: 0.5,
  //     };
  //   }
  // }

  // // Push the last block
  // if (current) groupedSchedules.push(current);

  // // Return the cleaned grouped schedule list
  // return groupedSchedules;

  const result = schedules.map((s) => ({
    time_start: s.startTime,
    time_end: s.endTime,
    course_id: s.course.course_id,
    duration: s.duration,
    teacher_id: s.course.teacher_id, // can just join the teacher's table
    college_id: s.course.course_college, // to prevent same class group conflict
    year_level: s.course.course_year, // to send the same class group yr level
    semester: s.course.semester, // to send the same class group sem
  }));

  // console.log(JSON.stringify(result, null, 2));
  return result;
}
