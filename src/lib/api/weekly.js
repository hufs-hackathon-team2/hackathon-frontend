import api from './client'; 

export const getWeeklyData = async () => {
  const response = await client.get('/weekly-card'); 
  return response.data
};