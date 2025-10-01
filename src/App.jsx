import { useState, useMemo, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import CourseList from "./CourseList";
import { Switch, Button } from "@mui/material";

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

export default function App() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [checked, setChecked] = useState(false);
  const [schedules, setSchedules] = useState([]);

  // checked if duration is true
  const duration = checked ? 1.5 : 1;

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

  console.log("timeslotmap", timeSlotMap);
  console.log("schedules", schedules);
  console.log(`Course state =`, courses);

  const handleCellClick = (startKey, endKey, day, timeSlot) => {
    console.log(
      `this slot is occupied?`,
      timeSlotMap.has(startKey),
      `\nhow about the next slot?`,
      timeSlotMap.has(endKey)
    );

    // if there is no selected courses
    if (!selectedCourse) {
      console.log(`No course selected! Please select a course first.`);
      return;
    }

    // if current slot or the next slot is occupied
    if (timeSlotMap.has(startKey) || timeSlotMap.has(endKey)) {
      timeSlotMap.has(startKey) && console.log(`This slot is occupied`);
      timeSlotMap.has(endKey) && console.log(`The following slot is occupied`);
      return;
    }

    // if hours will be less than or equal to 0
    if (selectedCourse.hoursWeek < 0) {
      console.log(`Cannot allocate as hours will be less than or equal to 0`);
      return;
    }

    if (selectedCourse.hoursWeek - duration < 0) {
      console.log(`Reducing hours / week will exceed the remaining hours`);
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

        {/* Course Selected with Switch Button */}
        {selectedCourse ? (
          <div className="flex flex-col items-center min-w-md shadow-md bg-white p-8 rounded-xl">
            <p className="text-blue-700 font-medium">
              Selected: {selectedCourse.course_name} ({selectedCourse.hoursWeek}{" "}
              hrs left)
            </p>
            <div>
              <span>1 Hour</span>
              <Switch
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span>1.5 Hours</span>
            </div>
          </div>
        ) : (
          <div className="min-w-md shadow-md bg-white p-8 rounded-xl text-center italic text-gray-600">
            No Course Selected
          </div>
        )}

        {/* Schedule Table MWF */}
        <ScheduleTable
          headers={mwfHead}
          times={times}
          onCellClick={handleCellClick}
          timeSlotMap={timeSlotMap}
        />

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
