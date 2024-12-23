export const API_URL = __DEV__
  ? "http://192.168.0.109:3005" // Remplacer XX par votre IP locale
  : "https://votre-api-production.com/api";

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  USERS: "/users",
  PRODUCTS: "/products",
};

export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, messageData);
    return response;
  } catch (error) {
    throw error;
  }
};
