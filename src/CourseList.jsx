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
            <p className=" text-gray-900">
              <b>{course.course_code}</b>
              {" - "}
              <span>{course.course_name}</span>
            </p>
            <p className="text-sm text-gray-600">
              {course.hours_week} hrs/week
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
