import axios from "axios";

export default async function postSchedule(schedules) {
  const dataToInsert = schedules;

  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/schedules",
      dataToInsert
    );

    console.log(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
