import { useState, useMemo, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import CourseList from "./CourseList";
import { Switch, Button } from "@mui/material";

import { Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";

const initialCourses = [
  {
    course_id: 1,
    course_name: "Programming",
    hoursWeek: 3,
    teacher: "Aldwin Ilumin",
  },
  { course_id: 2, course_name: "IT Era", hoursWeek: 3, teacher: "Wish Ilumin" },
  {
    course_id: 3,
    course_name: "Python",
    hoursWeek: 3,
    teacher: "Dean Magalong",
  },
  {
    course_id: 4,
    course_name: "Theory",
    hoursWeek: 3,
    teacher: "Karen Hermosa",
  },
  {
    course_id: 5,
    course_name: "Artificial Intelligence",
    hoursWeek: 3,
    teacher: "Noelyn Sebua",
  },
];

const times = Array.from({ length: 21 }, (_, i) => i);
const mwfHead = ["Monday", "Wednesday", "Friday"];
const tthHead = ["Tuesday", "Thursday"];

export default function App() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [checked, setChecked] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [duration, setDuration] = useState(1);

  // checked if duration is true
  // const duration = checked ? 1.5 : 1;

  // memoize the function to avoid re-calculations
  const timeSlotMap = useMemo(() => {
    const map = new Map();

    schedules.forEach(({ course, startTime, duration }) => {
      const [day, start] = startTime.split("_");

      const floatStartTime = parseFloat(start);
      const floatEndTime = floatStartTime + duration;

      for (let t = floatStartTime; t < floatEndTime; t += 0.5) {
        map.set(`${day}_${t}`, course.course_name);
      }
    });

    return map;
  }, [schedules]);

  const handleCellClick = (startKey, endKey, day, timeSlot) => {
    const [dayName, start] = startKey.split("_");
    const floatStartTime = parseFloat(start);
    const floatEndTime = floatStartTime + duration;

    console.log(`Start time:`, floatStartTime);
    console.log(`End time:`, floatEndTime);

    // Assume last slot is 20 (since you have 21 slots: 0 → 20)
    const maxSlot = times[times.length - 1]; // 20

    console.log(
      `is this slot is occupied?`,
      timeSlotMap.has(startKey),
      `\nhow about the next slot?`,
      timeSlotMap.has(endKey)
    );

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
    if (selectedCourse.hoursWeek < 0) {
      console.log(`Cannot allocate as hours will be less than or equal to 0!`);
      return;
    }

    // if hours will exceed the remaining hours
    if (selectedCourse.hoursWeek - duration < 0) {
      console.log(`Hours / week will be below the current duration!`);
      return;
    }

    // decrease the hours - week by the selected duration (1/1.5hr)
    setSelectedCourse((prevCourse) => ({
      ...prevCourse,
      hoursWeek: prevCourse.hoursWeek - duration,
    }));

    // modify the initial lists' hours-week so it wont refresh
    setCourses(
      courses.map((course) =>
        course.course_id === selectedCourse.course_id
          ? { ...course, hoursWeek: course.hoursWeek - duration }
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

  return (
    <>
      <main className="flex flex-col justify-center items-center bg-red-200 p-10">
        {/* Course List */}
        <CourseList
          courses={courses}
          setSelectedCourse={setSelectedCourse}
          selectedCourse={selectedCourse}
        />

        {/* 3-button radio for duration */}
        {selectedCourse ? (
          <>
            <div className="flex flex-col items-center min-w-md shadow-md bg-white p-8 rounded-xl">
              <p className="text-blue-700 font-medium">
                Selected: {selectedCourse.course_name} (
                {selectedCourse.hoursWeek} hrs left)
              </p>
              <FormLabel component="legend">Duration</FormLabel>
              <RadioGroup
                row
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              >
                <FormControlLabel
                  value={0.5}
                  control={<Radio />}
                  label="0.5 hr"
                />
                <FormControlLabel value={1} control={<Radio />} label="1 hr" />
                <FormControlLabel
                  value={1.5}
                  control={<Radio />}
                  label="1.5 hr"
                />
              </RadioGroup>
            </div>
          </>
        ) : (
          <div className="min-w-md shadow-md bg-white p-8 rounded-xl text-center italic text-gray-600">
            No Course Selected
          </div>
        )}

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
