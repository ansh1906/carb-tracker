import api from './api';

export const getDiabetesNews = async () => {
  const response = await api.get('/news');
  return response.data;
};

export const getNutritionTip = async () => {
  const response = await api.get('/news/nutrition-tip');
  return response.data;
};