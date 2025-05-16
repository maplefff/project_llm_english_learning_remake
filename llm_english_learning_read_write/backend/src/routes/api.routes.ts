import { Router } from 'express';
import apiController from '../controllers/api.controller';

const router = Router();

// 根據 devBackendPhase5.md Phase 5.3
router.get('/question-types', apiController.getQuestionTypes);
router.post('/start-test', apiController.startTest);
router.post('/submit-answer', apiController.submitAnswer);
router.get('/history', apiController.getHistory);

export default router; 