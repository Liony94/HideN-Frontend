export const API_URL = __DEV__
  ? "http://192.168.0.109:3005"
  : "https://votre-api-production.com";

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  USERS: "/users",
  PRODUCTS: "/products",
  MATCHING: {
    DAILY_MATCH: "/api/matching/daily-match",
    DAILY_CRITERIA: "/api/matching/daily-criteria",
  },
};

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, messageData);
    return response;
  } catch (error) {
    throw error;
  }
};
