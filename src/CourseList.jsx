import LockIcon from "@mui/icons-material/Lock";
import CoPresentIcon from "@mui/icons-material/CoPresent";

export default function CourseList({
  courses,
  selectedCourse,
  setSelectedCourse,
}) {
  const handleSelect = (course) => {
    setSelectedCourse((prev) =>
      prev?.course_id === course.course_id ? null : course
    );
  };

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Available Courses
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {courses?.map((course) => {
          const isSelected = selectedCourse?.course_id === course.course_id;
          const isPlotted = course.is_plotted;

          return isPlotted ? (
            <LockCourseCard key={course.course_id} course={course} />
          ) : (
            <CourseCard
              key={course.course_id}
              course={course}
              isSelected={isSelected}
              onClick={() => handleSelect(course)}
            />
          );
        })}
      </div>
    </section>
  );
}

const LockCourseCard = ({ course }) => {
  const teacherFullName = course.first_name
    ? `${course.first_name} ${course.last_name}`
    : null;

  return (
    <div
      className={`p-4 rounded-lg shadow-sm border cursor-not-allowed bg-gray-200 relative`}
    >
      <p className="text-gray-900">
        <b>{course.course_code}</b> - <span>{course.course_name}</span>
      </p>
      <p className="text-sm text-gray-600">{course.hours_week} hrs/week</p>
      <p className="text-sm text-gray-600">{teacherFullName || "No teacher"}</p>
      <LockIcon className="absolute right-2 top-2" color="warning" />
    </div>
  );
};

const CourseCard = ({ course, isSelected, onClick }) => {
  const teacherFullName = course.first_name
    ? `${course.first_name} ${course.last_name}`
    : null;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg shadow-sm border cursor-pointer transition
        ${isSelected ? "border-blue-500 bg-blue-100" : ""}
      `}
    >
      <p className="text-gray-900">
        <b>{course.course_code}</b> - <span>{course.course_name}</span>
      </p>
      <p className="text-sm text-gray-600">{course.hours_week} hrs/week</p>
      <p className="text-sm text-gray-600">{teacherFullName || "No teacher"}</p>
    </div>
  );
};
