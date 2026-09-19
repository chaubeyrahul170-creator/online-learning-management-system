import express from 'express';
import {
  getAssignments,
  createAssignment,
  submitSolution,
  gradeSubmission,
} from '../controllers/assignmentController.js';

const router = express.Router();

router.get('/', getAssignments);
router.post('/', createAssignment);
router.post('/:id/submit', submitSolution);
router.put('/:id/grade/:subId', gradeSubmission);

export default router;

