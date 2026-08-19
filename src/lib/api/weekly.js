import client from './client'; 

export const getWeeklyData = async () => {
  const response = await client.get('/api/v1/weekly'); 
  return response.data;
};