import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

const register = async (name, email, password, role = 'member') => {
  const response = await api.post('/auth/register', { name, email, password, role });
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

const authService = {
  login,
  register,
  getProfile,
};

export default authService;
