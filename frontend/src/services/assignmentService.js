import API from './api';

export const getAssignments = async () => {
  const response = await API.get('/assignments');
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await API.post('/assignments', data);
  return response.data;
};

export const submitAssignmentSolution = async (assignmentId, data) => {
  const response = await API.post(`/assignments/${assignmentId}/submit`, data);
  return response.data;
};

export const gradeStudentSubmission = async (assignmentId, subId, data) => {
  const response = await API.put(`/assignments/${assignmentId}/grade/${subId}`, data);
  return response.data;
};

