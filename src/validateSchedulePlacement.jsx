import { useEffect } from "react";

export default function validateSchedulePlacement(
  startKey,
  endKey,
  dayName,
  floatStartTime,
  floatEndTime,
  maxSlot,
  timeSlotMap,
  selectedCourse,
  duration,
  activeCourse // 👈 optional param if you track currently active course
) {
  const LUNCH_PERIOD = { start: 12, end: 13 };
  const LUNCH_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

  // Check if class overlaps with lunch period
  const overlapsLunch =
    LUNCH_DAYS.includes(dayName.toUpperCase()) &&
    floatStartTime < LUNCH_PERIOD.end &&
    floatEndTime > LUNCH_PERIOD.start;

  if (overlapsLunch) {
    return "Cannot allocate during lunch time (12:00 PM - 1:00 PM)";
  }

  // Check if exceeds max slot
  if (floatEndTime > maxSlot)
    return "Cannot allocate as it will exceed the timetable's duration";

  // Check if any slot within duration is occupied
  for (let t = floatStartTime; t < floatEndTime; t += 0.5) {
    if (timeSlotMap.has(`${dayName}_${t}`))
      return `Slot ${dayName}_${t} is already occupied`;
  }

  // Check if no course selected
  if (!selectedCourse)
    return "No course selected! Please select a course first.";

  // Check if starting slot is occupied
  if (timeSlotMap.has(startKey)) return "This slot is occupied!";

  // Check if next slot is occupied (for > 0.5 hr duration)
  if (timeSlotMap.has(endKey) && duration !== 0.5)
    return "The next slot is occupied!";

  // Check if no hours left
  if (selectedCourse.hours_week <= 0)
    return "Cannot allocate as hours will be less than or equal to 0!";

  // Check if allocation exceeds remaining hours
  if (selectedCourse.hours_week - duration < 0)
    return "Hours/week will go below zero!";

  // ✅ NEW RULE: Must finish current course (reach exactly 0) before switching
  if (activeCourse && activeCourse.id !== selectedCourse.id) {
    if (activeCourse.hours_week > 0) {
      return `You must finish scheduling "${activeCourse.name}" (remaining ${activeCourse.hours_week} hrs) before selecting another course.`;
    }
  }

  return null;
}
