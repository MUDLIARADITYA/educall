import api from "../api"; // adjust path if needed

const submitFeedback = async (questionId, rating, feedbackText, token) => {
  const response = await api.post(
    "/api/feedback",
    { questionId, rating, feedbackText },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default {
  submitFeedback,
};
