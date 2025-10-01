import { useState } from "react";
import Switch from "@mui/material/Switch";

export default function CourseList({
  courses,
  selectedCourse,
  setSelectedCourse,
}) {
  const [checked, setChecked] = useState(false);

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Available Courses
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {courses?.map((course) => (
          <div
            key={course.course_id}
            onClick={() =>
              setSelectedCourse((prev) =>
                prev?.course_id === course.course_id ? null : course
              )
            }
            className={`p-4 rounded-lg shadow-sm border cursor-pointer transition 
                ${
                  selectedCourse?.course_id === course.course_id && // selected course and course in the map func
                  `border-blue-500 bg-blue-100`
                }
            `}
          >
            <p className="font-semibold text-gray-900">{course.course_name}</p>
            <p className="text-sm text-gray-600">{course.hoursWeek} hrs/week</p>
          </div>
        ))}
      </div>
    </section>
  );
}
