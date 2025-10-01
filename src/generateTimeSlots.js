export default function generateTimeSlots(start = 7, end = 10, step = 1) {
  const slots = [];
  for (let hour = start; hour < end; hour += step) {
    const startTimeHour = Math.floor(hour); // Whole number the hour value
    const startTimeMinutes = hour % 1 === 0 ? "00" : "30"; // Minutes part
    const period = startTimeHour >= 12 ? "PM" : "AM"; // AM/PM designation
    // Convert to 12-hour format
    const formattedHour =
      startTimeHour > 12 ? startTimeHour - 12 : startTimeHour;
    const startTime = `${formattedHour}:${startTimeMinutes} ${period}`; //Formatted hour
    slots.push(startTime);
  }
  return slots;
}
