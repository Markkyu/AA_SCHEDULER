import { useState, useMemo, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import CourseList from "./CourseList";
import { Switch, Button } from "@mui/material";

import { Radio, FormControlLabel, FormLabel } from "@mui/material";
import DurationToggle from "./DurationToggle";
import { getCourses } from "./api/getCourses";

// const initialCourses = [
//   {
//     course_id: 1,
//     course_code: CCS101,
//     course_name: "Programming",
//     hours_week: 3,
//     teacher: "Aldwin Ilumin",
//   },
//   {
//     course_id: 2,
//     course_code: CCS102,
//     course_name: "Living in the IT Era",
//     hours_week: 3,
//     teacher: "Wishiel Ilumin",
//   },
//   {
//     course_id: 3,
//     course_code: CCS103,
//     course_name: "Python",
//     hours_week: 3,
//     teacher: "Dean Magalong",
//   },
// ];

const initialCourses = await getCourses();

const times = Array.from({ length: 21 }, (_, i) => i);
const mwfHead = ["Monday", "Wednesday", "Friday"];
const tthHead = ["Tuesday", "Thursday"];

export default function App() {
  // Where you put the courses
  const [courses, setCourses] = useState(initialCourses);
  // State for selected course
  const [selectedCourse, setSelectedCourse] = useState(null);
  // Where you set schedules before mapping
  const [schedules, setSchedules] = useState([]);
  // Where you set duration with a 3-button radio
  const [duration, setDuration] = useState(1);

  // memoize the function to avoid re-calculations
  const timeSlotMap = useMemo(() => {
    const map = new Map();

    schedules.forEach(({ course, startTime, duration }) => {
      const [day, start] = startTime.split("_");

      const floatStartTime = parseFloat(start);
      const floatEndTime = floatStartTime + duration;

      for (let t = floatStartTime; t < floatEndTime; t += 0.5) {
        map.set(`${day}_${t}`, course); // store the whole course object
      }
    });

    return map;
  }, [schedules]);

  timeSlotMap.forEach((courseName, slotKey) => {
    console.log(courseName);
    console.log(slotKey);
  });

  const exportToJSON = () => {
    const result = Array.from(timeSlotMap, ([slotKey, course]) => ({
      // slotkey is the time_code slot AND course - whole course object
      schedule_slot: slotKey,
      course_id: course.course_id,
      course_code: course.course_code,
      course_name: course.course_name,
      assigned_teacher: course.teacher_id, // can just join the teacher table
      course_college: course.course_college, // to prevent the same class group conflict
      course_year: course.course_year, // to send the same class group's year level
      course_semester: course.semester, // to send same the class group's semester
    }));

    // console.log(result);
    console.log(JSON.stringify(result, null, 2));
  };

  const handleCellClick = (startKey, endKey, day, timeSlot) => {
    const [dayName, start] = startKey.split("_");
    const floatStartTime = parseFloat(start);
    const floatEndTime = floatStartTime + duration;

    console.log(`Start time:`, floatStartTime);
    console.log(`End time:`, floatEndTime);

    // Assume last slot is 20 (since you have 21 slots: 0 → 20)
    const maxSlot = times[times.length - 1]; // 20

    // If the end time of subject will exceed the timetable duration
    if (floatEndTime > maxSlot) {
      console.log(`Cannot allocate as it will exceed the timetable's duration`);
      return;
    }

    // Check all slots inside the selected duration
    for (let t = floatStartTime; t < floatEndTime; t += 0.5) {
      if (timeSlotMap.has(`${dayName}_${t}`)) {
        console.log(`Slot ${dayName}_${t} is already occupied`);
        return;
      }
    }

    // If no course is selected
    if (!selectedCourse) {
      console.log(`No course selected! Please select a course first.`);
      return;
    }

    // if there is no selected courses
    if (!selectedCourse) {
      console.log(`No course selected! Please SELECT a COURSE first.`);
      return;
    }

    // if current slot is occupied
    if (timeSlotMap.has(startKey)) {
      console.log(`THIS SLOT is occupied!`);
      return;
    }

    // if 1hr or 1.5hr subject will affect following slots
    if (timeSlotMap.has(endKey) && duration !== 0.5) {
      console.log(`The NEXT SLOT is occupied!`);
      return;
    }

    // if hours will be less than or equal to 0
    if (selectedCourse.hours_week < 0) {
      console.log(`Cannot allocate as hours will be less than or equal to 0!`);
      return;
    }

    // if hours will exceed the remaining hours
    if (selectedCourse.hours_week - duration < 0) {
      console.log(`Hours / week will be below the current duration!`);
      return;
    }

    // decrease the hours - week by the selected duration (1/1.5hr)
    setSelectedCourse((prevCourse) => ({
      ...prevCourse,
      hours_week: prevCourse.hours_week - duration,
    }));

    // modify the initial lists' hours-week so it wont refresh
    setCourses(
      courses.map((course) =>
        course.course_id === selectedCourse.course_id
          ? { ...course, hours_week: course.hours_week - duration }
          : course
      )
    );

    // set the schedules, pass to the memoized function
    setSchedules((prev) => [
      ...prev,
      {
        course: selectedCourse,
        startTime: startKey,
        endTime: endKey,
        duration: duration,
      },
    ]);
  };

  const handleRemoveSchedule = (scheduleId) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.course_id === schedule.course.course_id
          ? { ...c, hours_week: c.hours_week + schedule.duration }
          : c
      )
    );
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center bg-red-200 p-10">
        {/* Course List */}
        <CourseList
          courses={courses}
          setSelectedCourse={setSelectedCourse}
          selectedCourse={selectedCourse}
          handleRemoveSchedule={handleRemoveSchedule}
        />

        {/* 3-button radio for duration */}
        {selectedCourse ? (
          <DurationToggle
            selectedCourse={selectedCourse}
            duration={duration}
            setDuration={setDuration}
          />
        ) : (
          <div className="min-w-md shadow-md bg-white p-8 rounded-xl text-center italic text-gray-600">
            No Course Selected
          </div>
        )}

        <Button
          variant="contained"
          sx={{ borderRadius: "20px", fontWeight: 600, marginTop: "10px" }}
          onClick={exportToJSON}
        >
          Export Course to JSON
        </Button>

        <main className="flex gap-10">
          {/* Schedule Table MWF */}
          <div className="bg-white p-4 rounded-2xl my-4">
            <ScheduleTable
              headers={mwfHead}
              times={times}
              onCellClick={handleCellClick}
              timeSlotMap={timeSlotMap}
            />
          </div>

          <div className="bg-white p-4 rounded-2xl my-4">
            <ScheduleTable
              headers={tthHead}
              times={times}
              onCellClick={handleCellClick}
              timeSlotMap={timeSlotMap}
            />
          </div>
        </main>

        {/* Export Schedule Button */}
        <Button
          variant="contained"
          sx={{ fontWeight: 600, borderRadius: "20px" }}
        >
          Export Schedules
        </Button>
      </main>
    </>
  );
}
