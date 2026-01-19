import api from "../api"; // adjust path if needed

export const getAIResponse = async (prompt) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/api/ai",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.response;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw error;
  }
};
