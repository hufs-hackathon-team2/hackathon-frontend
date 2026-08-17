import client from './client';

export const loginAPI = async (usernameValue, passwordValue) => {
  const response = await client.post('/auth/login/', {
    username: usernameValue,       
    password: passwordValue, 
  });
  return response.data;
};