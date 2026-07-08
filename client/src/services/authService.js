import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data||error; // Throw the error response data for handling in the component
  }
};

export const register = async (name,email, password) => {
  try {
    const response = await api.post('/auth/register', { name,email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data||error; // Throw the error response data for handling in the component
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