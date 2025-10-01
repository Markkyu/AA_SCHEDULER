import { useState, useMemo, useEffect } from "react";
import { readableMWFTime, readableTThTime } from "../readableTime";
import Switch from "@mui/material/Switch";

const mwfHead = ["Monday", "Wednesday", "Friday"];
// const mwfTime = Array.from({ length: 14 }, (_, i) => i); // 7AM → 8PM
const mwfTime = Array.from({ length: 21 }, (_, i) => i); // 7AM → 8PM
const tthHead = ["Tuesday", "Thursday"];
const tthTime = Array.from({ length: 9 }, (_, i) => i); // 7AM → 8PM

const initialCourses = [
  {
    id: 1,
    name: "Computer Programming",
    hoursWeek: 5,
    teacher: "Aldwinaka Bottomesa",
  },
  {
    id: 2,
    name: "Artificial Intelligence",
    hoursWeek: 3,
    teacher: "Wishikola Hamburguesa",
  },
  { id: 3, name: "Living in the IT Era", hoursWeek: 3, teacher: "Kaiju No. 9" },
  { id: 4, name: "Arduino", hoursWeek: 3, teacher: "Kayembang Karenderya" },
];

export default function Timetable() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [durationSelection, setDurationSelection] = useState(null); // {day, time, course}
  const [checked, setChecked] = useState(false);

  // Build map of occupied slots
  const timeSlotMap = useMemo(() => {
    const map = new Map();
    schedules.forEach(({ course, startTime, endTime }) => {
      // Fill all half-hour blocks between start and end
      const [day, start] = startTime.split("_");
      const [, end] = endTime.split("_");
      for (let t = parseFloat(start); t < parseFloat(end); t += 0.5) {
        map.set(`${day}_${t}`, course);
      }
    });
    return map;
  }, [schedules]);

  useEffect(() => {
    console.log("Schedules:", schedules);
    console.log("Courses:", courses);
  }, [schedules, courses]);

  function exportScheduleMapToJSON() {
    console.log(timeSlotMap);
    const jsonString = JSON.stringify(schedules, null, 2);
    console.log(jsonString);
    return jsonString;
  }

  const handleCellClick = (slotKey, day) => {
    if (!selectedCourse) return;
    if (timeSlotMap.has(slotKey)) return; // Already filled

    // duration comes from the switch
    const duration = checked ? 1.5 : 1;

    const [dayStr, start] = slotKey.split("_");
    const startFloat = parseFloat(start);
    const endFloat = startFloat + duration;

    if (selectedCourse.hoursWeek < duration) {
      alert("Not enough hours left for this course!");
      return;
    }

    const startTime = `${dayStr}_${startFloat}`;
    const endTime = `${dayStr}_${endFloat}`;

    // Save schedule entry
    setSchedules((prev) => [
      ...prev,
      { course: selectedCourse.name, startTime, endTime },
    ]);

    // Deduct from hours
    setCourses((prev) =>
      prev.map((c) =>
        c.id === selectedCourse.id
          ? { ...c, hoursWeek: +(c.hoursWeek - duration).toFixed(1) }
          : c
      )
    );
    setSelectedCourse((prev) =>
      prev?.id === selectedCourse.id
        ? { ...prev, hoursWeek: +(prev.hoursWeek - duration).toFixed(1) }
        : prev
    );
  };

  const confirmDuration = (duration) => {
    const { slotKey, day, course } = durationSelection;
    const [dayStr, start] = slotKey.split("_");
    const startFloat = parseFloat(start);
    const endFloat = startFloat + duration;
    const startTime = `${dayStr}_${startFloat}`;
    const endTime = `${dayStr}_${endFloat}`;

    if (course.hoursWeek < duration) {
      alert("Not enough hours left for this course!");
      return;
    }

    // Save schedule entry
    setSchedules((prev) => [
      ...prev,
      { course: course.name, startTime, endTime },
    ]);

    // Deduct from hours
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, hoursWeek: +(c.hoursWeek - duration).toFixed(1) }
          : c
      )
    );
    setSelectedCourse((prev) =>
      prev?.id === course.id
        ? { ...prev, hoursWeek: +(prev.hoursWeek - duration).toFixed(1) }
        : prev
    );

    setDurationSelection(null); // close form
  };

  const handleRemoveClick = (scheduleIndex) => {
    const schedule = schedules[scheduleIndex];
    const duration =
      parseFloat(schedule.endTime.split("_")[1]) -
      parseFloat(schedule.startTime.split("_")[1]);

    // Restore hours
    setCourses((prev) =>
      prev.map((c) =>
        c.name === schedule.course
          ? { ...c, hoursWeek: +(c.hoursWeek + duration).toFixed(1) }
          : c
      )
    );
    setSelectedCourse((prev) =>
      prev?.name === schedule.course
        ? { ...prev, hoursWeek: +(prev.hoursWeek + duration).toFixed(1) }
        : prev
    );

    // Remove from schedules
    setSchedules((prev) => prev.filter((_, i) => i !== scheduleIndex));
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
          <>
            <p className="mt-4 text-blue-700 font-medium">
              Selected: {selectedCourse.name} ({selectedCourse.hoursWeek} hrs
              left)
            </p>
            1 Hour
            <Switch
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            1.5 Hours
          </>
        ) : (
          <p className="mt-4 text-gray-500 italic">No course selected</p>
        )}
      </section>

      <div className="flex justify-center mb-6">
        <button
          onClick={exportScheduleMapToJSON}
          className="bg-blue-400 py-2 px-4 rounded-2xl text-white font-bold border border-blue-500"
        >
          Export Schedules
        </button>
      </div>

      {/* Timetables */}
      <main className="flex flex-row justify-center gap-8">
        <ScheduleTable
          headers={mwfHead}
          times={mwfTime}
          getReadableTime={readableMWFTime}
          timeSlotMap={timeSlotMap}
          onCellClick={handleCellClick}
        />
        <ScheduleTable
          headers={tthHead}
          times={tthTime}
          getReadableTime={readableTThTime}
          timeSlotMap={timeSlotMap}
          onCellClick={handleCellClick}
        />
      </main>

      {/* Current Schedules */}
      <section className="max-w-4xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Scheduled Courses</h2>
        {schedules.map((s, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 mb-2 border rounded bg-green-50"
          >
            <span>
              {s.course} ({s.startTime} → {s.endTime})
            </span>
            <button
              onClick={() => handleRemoveClick(i)}
              className="text-red-600 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </section>
    </>
  );
}

const ScheduleTable = ({
  headers,
  times,
  getReadableTime,
  timeSlotMap,
  onCellClick,
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
                {course || ""}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);
