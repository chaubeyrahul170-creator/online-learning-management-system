import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  addLecture,
  updateCourseProgress,
  deleteCourse,
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse);
router.post('/:id/lectures', addLecture);
router.put('/:id/progress', updateCourseProgress);
router.delete('/:id', deleteCourse);

export default router;
