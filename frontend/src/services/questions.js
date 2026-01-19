import api from "../api"; // adjust path if needed

const createQuestion = async (text, imageUrl, token) => {
  const response = await api.post(
    "/api/question",
    { text, imageUrl },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const getOpenQuestions = async (token) => {
  const response = await api.get("/api/question/open", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const acceptQuestion = async (questionId, token) => {
  const response = await api.post(
    `/api/question/${questionId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const getMyQuestions = async (token) => {
  const response = await api.get("/api/question/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default {
  createQuestion,
  getOpenQuestions,
  acceptQuestion,
  getMyQuestions,
};
