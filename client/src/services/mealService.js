import api from './api';

export const createMeal = async (description) => {
  try {
    const response = await api.post('/meals',{description});
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


