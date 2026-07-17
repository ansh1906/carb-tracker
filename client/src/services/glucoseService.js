import api from './api';

export const createReading = async (readingData) => {
  try {
    const response = await api.post('/readings', readingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Throw the error response data for handling in the component
  }
};

export const getGlucoseReadings = async () => {
  try {
    const response = await api.get('/readings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Throw the error response data for handling in the component
  }
};

export const getGlucoseReadingsByRange = async (start, end) => {
  try {
    const response = await api.get(`/readings/range?start=${start}&end=${end}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Throw the error response data for handling in the component
  }
};

export const getTimeInRange = async (start, end) => {
  try {
    const response = await api.get(`/readings/time-in-range?start=${start}&end=${end}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Throw the error response data for handling in the component
  }
};