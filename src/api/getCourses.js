import axios from "axios";

export const getCourses = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/courses/1/year/1/sem/1"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};
