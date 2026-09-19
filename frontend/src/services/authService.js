import API from './api';

// User Login
export const login = async (email, password, role) => {
  const response = await API.post('/auth/login', { email, password, role });
  if (response.data.token) {
    localStorage.setItem('edulearn_token', response.data.token);
    const userInfo = response.data.user || response.data;
    localStorage.setItem('edulearn_user', JSON.stringify({ ...userInfo, token: response.data.token }));
    localStorage.setItem('edulearn_role', userInfo.role || 'student');
  }
  return response.data;
};

// User Register (Instant auto-login for students)
export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('edulearn_token', response.data.token);
    const userInfo = response.data.user || response.data;
    localStorage.setItem('edulearn_user', JSON.stringify({ ...userInfo, token: response.data.token }));
    localStorage.setItem('edulearn_role', userInfo.role || 'student');
  }
  return response.data;
};

// Get Logged In User Profile
export const getProfile = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

// Logout (Poora session data clear karega)
export const logout = () => {
  localStorage.removeItem('edulearn_token');
  localStorage.removeItem('edulearn_user');
  localStorage.removeItem('edulearn_role');
};
