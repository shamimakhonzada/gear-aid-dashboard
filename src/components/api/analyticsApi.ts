import axios from "axios";

const API_URL = "http://localhost:5000/api/";

// ================================
// Fetch Monthly Registrations
// ================================

export const fetchMonthlyRegistrations = async () => {
  const response = await axios.get(`${API_URL}registrations/monthly`);
  return response.data; // { users: [], providers: [] }
};

// ================================
// Fetch User Type Ratio
// ================================

export const fetchUserTypeRatio = async () => {
  const response = await axios.get(`${API_URL}type/ratio`);
  return response.data;
};
