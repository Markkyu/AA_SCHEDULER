import axios from "axios";

export default async function getSchedules() {
  try {
    const { data } = await axios.get("http://localhost:3000/api/schedules");
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
}
