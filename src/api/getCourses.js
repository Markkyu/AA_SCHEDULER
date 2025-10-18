import axios from "axios";

export const getCourses = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:3000/api/courses/1?year=1&sem=1"
    );
    return data;
    // console.log(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
