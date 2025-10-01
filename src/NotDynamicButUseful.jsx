import { useState, useMemo, useEffect } from "react";
import { readableMWFTime, readableTThTime } from "./readableTime";

const mwfHead = ["Monday", "Wednesday", "Friday"];
const mwfTime = Array.from({ length: 14 }, (_, i) => i);

const tthHead = ["Tuesday", "Thursday"];
const tthTime = Array.from({ length: 9 }, (_, i) => i);

const initialCourses = [
  { id: 1, name: "Math 101", hoursWeek: 3, teacher: "Mr. Smith" },
  { id: 2, name: "English 102", hoursWeek: 3, teacher: "Ms. Johnson" },
  { id: 3, name: "Computer Programming", hoursWeek: 5, teacher: "Dr. Brown" },
  { id: 4, name: "Physics 202", hoursWeek: 3, teacher: "Prof. Davis" },
];

export default function Timetable() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Build timeSlotMap from schedules
  const timeSlotMap = useMemo(() => {
    // Memoize to avoid unnecessary recalculations, this is an expensive operation
    const map = new Map();
    schedules.forEach(({ course, time_slot }) => {
      time_slot.forEach((slot) => {
        map.set(slot, course);
      });
    });
    return map;
  }, [schedules]);

  // sets initial data, from somewhere, needs check of other existing constraints like teacher
  timeSlotMap.set("MONDAY_0", "Chemistry");
  timeSlotMap.set("WEDNESDAY_0", "Chemistry");
  timeSlotMap.set("FRIDAY_0", "Chemistry");

  useEffect(() => {
    console.log("Schedules:", schedules);
    console.log("Courses:", courses);
    console.log("Selected Course:", selectedCourse);
    console.log("Map: ", timeSlotMap);
  }, [courses]);

  function exportScheduleMapToJSON(schedules, courses) {
    const exportData = schedules.map((schedule) => {
      const courseDetails = courses.find(
        (course) => course.name === schedule.course
      );

      return {
        course: courseDetails
          ? {
              id: courseDetails.id,
              name: courseDetails.name,
              teacher: courseDetails.teacher,
              hoursWeek: courseDetails.hoursWeek,
              time_slots: schedule.time_slot,
            }
          : { name: schedule.course }, // fallback if somehow missing
        // time_slots: schedule.time_slot,
      };
    });

    const jsonString = JSON.stringify(exportData, null, 2);
    console.log(jsonString);
    return jsonString;
  }

  const handleCellClick = (slotKey, day) => {
    if (!selectedCourse) return; // No course selected

    const alreadyFilled = timeSlotMap.has(slotKey); // Check if slot is filled
    if (alreadyFilled) return;

    const deduction = day === "Tuesday" || day === "Thursday" ? 1.5 : 1; // Deduct 1.5 hours for TTh, else 1 hour

    if (selectedCourse.hoursWeek < deduction) {
      // Not enough hours
      alert("This course has no remaining hours!");
      return;
    }

    // Add a course into the schedule
    setSchedules((previousSchedules) => {
      const existingSchedule = previousSchedules.find(
        (schedule) => schedule.course === selectedCourse.name
      );

      if (existingSchedule) {
        // If this course already has some slots, add the new one
        return previousSchedules.map((schedule) =>
          schedule.course === selectedCourse.name
            ? { ...schedule, time_slot: [...schedule.time_slot, slotKey] }
            : schedule
        );
      }

      // If it's a new course, create a fresh schedule entry
      return [
        ...previousSchedules,
        { course: selectedCourse.name, time_slot: [slotKey] },
      ];
    });

    // Deduct hours from the course list
    setCourses((previousCourses) =>
      previousCourses.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              hoursWeek: +(course.hoursWeek - deduction).toFixed(1),
            }
          : course
      )
    );

    // Update the selected course’s hours as well
    setSelectedCourse((previousSelectedCourse) =>
      previousSelectedCourse
        ? {
            ...previousSelectedCourse,
            hoursWeek: +(previousSelectedCourse.hoursWeek - deduction).toFixed(
              1
            ),
          }
        : null
    );
  };

  const handleRemoveClick = (slotKey, day, courseName) => {
    const deduction = tthHead.includes(day) ? 1.5 : 1;

    // Remove this slot from the schedules
    setSchedules(
      (previousSchedules) =>
        previousSchedules
          .map((schedule) =>
            schedule.course === courseName
              ? {
                  ...schedule,
                  time_slot: schedule.time_slot.filter(
                    (slot) => slot !== slotKey
                  ),
                }
              : schedule
          )
          .filter((schedule) => schedule.time_slot.length > 0) // remove empty courses
    );

    // Restore hours to the course in the list
    setCourses((previousCourses) =>
      previousCourses.map((course) =>
        course.name === courseName
          ? { ...course, hoursWeek: +(course.hoursWeek + deduction).toFixed(1) }
          : course
      )
    );

    // Update selected course if it matches the one being updated
    setSelectedCourse((previousSelectedCourse) =>
      previousSelectedCourse?.name === courseName
        ? {
            ...previousSelectedCourse,
            hoursWeek: +(previousSelectedCourse.hoursWeek + deduction).toFixed(
              1
            ),
          }
        : previousSelectedCourse
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center my-6">My Scheduler</h1>

      {/* Courses List */}
      <section className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Available Courses
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() =>
                setSelectedCourse((prev) =>
                  prev?.id === course.id ? null : course
                )
              }
              className={`p-4 rounded-lg shadow-sm border cursor-pointer transition ${
                selectedCourse?.id === course.id
                  ? "bg-blue-200 border-blue-500"
                  : "bg-gray-50 hover:shadow-md"
              }`}
            >
              <p className="font-semibold text-gray-900">{course.name}</p>
              <p className="text-sm text-gray-600">
                {course.hoursWeek} hrs/week
              </p>
            </div>
          ))}
        </div>
        {selectedCourse ? (
          <p className="mt-4 text-blue-700 font-medium">
            Selected: {selectedCourse.name} ({selectedCourse.hoursWeek} hrs
            left)
          </p>
        ) : (
          <p className="mt-4 text-gray-500 italic">No course selected</p>
        )}
      </section>

      <div className="flex justify-center">
        <button
          onClick={() => exportScheduleMapToJSON(schedules, courses)}
          className="bg-blue-400 py-2 px-4 rounded-2xl text-white font-bold border border-blue-500"
        >
          Export Schedules
        </button>
      </div>
      {/* Timetables */}
      <main className="flex flex-col lg:flex-row justify-center gap-8">
        <ScheduleTable
          headers={mwfHead}
          times={mwfTime}
          getReadableTime={readableMWFTime}
          timeSlotMap={timeSlotMap}
          onCellClick={handleCellClick}
          onRemoveClick={handleRemoveClick}
        />
        <ScheduleTable
          headers={tthHead}
          times={tthTime}
          getReadableTime={readableTThTime}
          timeSlotMap={timeSlotMap}
          onCellClick={handleCellClick}
          onRemoveClick={handleRemoveClick}
        />
      </main>
    </>
  );
}

const ScheduleTable = ({
  headers,
  times,
  getReadableTime,
  timeSlotMap,
  onCellClick,
  onRemoveClick,
}) => (
  <table className="min-w-2xl mx-auto my-6">
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
      {times.map((time, i) => (
        <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
          <td className="border border-gray-400 px-4 py-2">
            {getReadableTime(time)}
          </td>
          {headers.map((day, j) => {
            const key = `${day.toUpperCase()}_${time}`;
            const course = timeSlotMap.get(key);
            return (
              <td
                key={j}
                className={`border border-gray-400 px-4 py-2 text-center cursor-pointer transition ${
                  course ? "bg-green-200 font-medium" : "hover:bg-yellow-100"
                }`}
                onClick={() => !course && onCellClick(key, day)}
              >
                {course && (
                  <div className="flex justify-between items-center">
                    <span>{course}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering add
                        onRemoveClick(key, day, course);
                      }}
                      className="ml-2 text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);
