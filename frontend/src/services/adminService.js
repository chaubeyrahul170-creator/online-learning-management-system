import API from './api';

export const getPlatformStats = async () => {
  const response = await API.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const getPendingUsers = async () => {
  const response = await API.get('/admin/pending-users');
  return response.data;
};

export const approveUser = async (id) => {
  const response = await API.put(`/admin/users/${id}/approve`);
  return response.data;
};

// Suspend Instructor for days with reason
export const suspendUser = async (id, days, reason) => {
  const response = await API.put(`/admin/users/${id}/suspend`, { days, reason });
  return response.data;
};

// Reinstate / Restore Instructor
export const reinstateUser = async (id) => {
  const response = await API.put(`/admin/users/${id}/reinstate`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};
