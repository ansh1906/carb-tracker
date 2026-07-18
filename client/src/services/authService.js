import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data||error; // Throw the error response data for handling in the component
  }
};

export const register = async (name,email, password,type, targetLow, targetHigh) => {
  try {
    const response = await api.post('/auth/register', { name,email, password,type, targetLow, targetHigh });
    return response.data;
  } catch (error) {
    throw error.response?.data||error; // Throw the error response data for handling in the component
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Throw the error response data for handling in the component
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};