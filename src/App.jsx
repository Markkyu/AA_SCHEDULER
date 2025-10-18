import { useState, useMemo, useEffect } from "react";
import ScheduleTable from "./ScheduleTable";
import CourseList from "./CourseList";
import { Switch, Button, Snackbar, Alert } from "@mui/material";

import { Radio, FormControlLabel, FormLabel } from "@mui/material";
import DurationToggle from "./DurationToggle";
import { getCourses } from "./api/getCourses";
import validateSchedulePlacement from "./validateSchedulePlacement";
import exportToJSON from "./utils/exportToJSON";
import getSchedules from "./api/getSchedules";
import postSchedule from "./api/postSchedules";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const initialCourses = await getCourses();
const fetchSchedules = await getSchedules();

const times = Array.from({ length: 22 }, (_, i) => i);
const mwfHead = ["Monday", "Wednesday", "Friday"];
const tthHead = ["Tuesday", "Thursday", "Saturday"];

export default function App() {
  // Where you put the courses
  const [courses, setCourses] = useState(initialCourses);
  // State for selected course
  const [selectedCourse, setSelectedCourse] = useState(null);
  // Where you set schedules before mapping
  const [schedules, setSchedules] = useState([]);
  // Where you set duration with a 3-button radio
  const [duration, setDuration] = useState(1);
  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // State for the currently active course being scheduled
  const [activeCourse, setActiveCourse] = useState(null);

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

  fetchSchedules.map(({ time_start, ...sched }, index) => {
    timeSlotMap.set(time_start, { course_code: sched.course_code });
  });

  console.log(timeSlotMap);

  const handleExport = () => {
    // function mapToJson(map) {
    //   const obj = {};
    //   for (const [key, value] of map) {
    //     obj[key] = value instanceof Map ? mapToJson(value) : value;
    //   }
    //   return JSON.stringify(obj, null, 2);
    // }

    // console.log(Object.fromEntries(timeSlotMap));

    const myMap = [];

    for (const [key, value] of timeSlotMap) {
      myMap.push({
        time_start: key,
        course_id: value.course_id,
        teacher_id: value.teacher_id,
        college_id: value.course_college,
        year_level: value.course_year,
        semester: value.semester,
      });
    }

    console.log(myMap);
    // postSchedule(myMap);
  };

  const disableButtonCheck = selectedCourse?.hours_week !== 0;

  const handleCellClick = (startKey, endKey, day, timeSlot) => {
    const [dayName, start] = startKey.split("_");
    const floatStartTime = parseFloat(start);
    const floatEndTime = floatStartTime + duration;
    // Assume last slot is 20
    const maxSlot = times[times.length - 1]; // 20

    // validate the placement
    const error = validateSchedulePlacement(
      startKey,
      endKey,
      dayName,
      floatStartTime,
      floatEndTime,
      maxSlot,
      timeSlotMap,
      selectedCourse,
      duration,
      activeCourse // 👈 pass it here
    );

    if (error) {
      setErrorMessage(error);
      setOpenSnackbar(true);

      return;
    }

    // ✅ Set the activeCourse if none yet
    if (!activeCourse) {
      setActiveCourse(selectedCourse);
    }

    // ✅ Check if user is switching to another course while previous still has hours
    if (
      activeCourse &&
      activeCourse.course_id !== selectedCourse.course_id &&
      activeCourse.hours_week > 0
    ) {
      setErrorMessage(
        `Finish scheduling "${activeCourse.course_code}" (remaining ${activeCourse.hours_week} hrs) before switching to another course.`
      );
      setOpenSnackbar(true);
      return;
    }

    // If no error proceed to set schedule

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

    // ✅ If this course just reached 0 hours, clear activeCourse
    const updatedCourse = courses.find(
      (c) => c.course_id === selectedCourse.course_id
    );
    if (updatedCourse && updatedCourse.hours_week - duration === 0) {
      setActiveCourse(null);
    }
  };

  const handleRemoveSchedule = (day, timeKey) => {
    const course = timeSlotMap.get(timeKey);
    if (!course) return;

    // Find the schedule to remove
    const scheduleToRemove = schedules.find(
      (s) =>
        s.course.course_id === course.course_id &&
        s.startTime.startsWith(day.toUpperCase())
    );

    if (!scheduleToRemove) return;

    // Restore the hours back to the course
    setCourses((prevCourses) =>
      prevCourses.map((c) =>
        c.course_id === course.course_id
          ? { ...c, hours_week: c.hours_week + scheduleToRemove.duration }
          : c
      )
    );

    // Remove the schedule
    setSchedules((prev) => prev.filter((s) => s !== scheduleToRemove));
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center bg-gray-300 p-10">
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
        <div className="flex gap-2">
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", fontWeight: 600, marginTop: "10px" }}
            onClick={handleExport}
            endIcon={<AutoAwesomeIcon />}
          >
            Generate Schedule
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", fontWeight: 600, marginTop: "10px" }}
            onClick={handleExport}
            disabled={disableButtonCheck}
            endIcon={<FileUploadIcon />}
          >
            Export Course to JSON
          </Button>
        </div>
        <main className="flex gap-10">
          {/* Schedule Table MWF */}
          <div className="bg-white p-4 rounded-2xl my-4">
            <ScheduleTable
              headers={mwfHead}
              times={times}
              onCellClick={handleCellClick}
              timeSlotMap={timeSlotMap}
              onCellRightClick={handleRemoveSchedule}
            />
          </div>

          {/* Schedule Table for TThS */}
          <div className="bg-white p-4 rounded-2xl my-4">
            <ScheduleTable
              headers={tthHead}
              times={times}
              onCellClick={handleCellClick}
              timeSlotMap={timeSlotMap}
              onCellRightClick={handleRemoveSchedule}
            />
          </div>
        </main>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            variant="filled"
            sx={{
              width: "100%",
              backgroundColor: "#d32f2f",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </main>
    </>
  );
}
