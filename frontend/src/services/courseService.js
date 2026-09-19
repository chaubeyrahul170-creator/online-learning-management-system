import API from './api';

// Backend se saare courses lana
export const getAllCourses = async () => {
  const response = await API.get('/courses');
  return response.data;
};

// Single course details fetch karna
export const getCourseDetails = async (id) => {
  const response = await API.get(`/courses/${id}`);
  return response.data;
};

// Faculty: Naya course create karna
export const createNewCourse = async (courseData) => {
  const response = await API.post('/courses', courseData);
  return response.data;
};

// Faculty: Course me lecture add karna
export const addLectureToCourse = async (courseId, lectureData) => {
  const response = await API.post(`/courses/${courseId}/lectures`, lectureData);
  return response.data;
};

// Video lecture complete hone par progress update karna
export const updateCourseProgress = async (courseId, progressData) => {
  const response = await API.put(`/courses/${courseId}/progress`, progressData);
  return response.data;
};

// Delete course (Admin)
export const deleteCourseById = async (id) => {
  const response = await API.delete(`/courses/${id}`);
  return response.data;
};
